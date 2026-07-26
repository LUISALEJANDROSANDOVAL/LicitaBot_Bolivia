import os
import logging
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importar módulos locales
from backend.database import (
    obtener_primer_perfil,
    guardar_perfil,
    registrar_licitacion,
    registrar_evaluacion,
    registrar_log_notificacion,
    obtener_evaluaciones_completas
)
from backend.agent import evaluar_licitacion
from backend.sicoes_scraper import obtener_nuevas_licitaciones, obtener_licitacion_simulada
from backend.zavu_client import ZavuClient

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FastAPIServer")

app = FastAPI(
    title="LicitaBot Bolivia API",
    description="Backend orquestador para el monitoreo cognitivo de licitaciones de SICOES y notificaciones multicanal.",
    version="1.0.0"
)

# Configurar CORS para conectar con el Frontend (Next.js / React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir al dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cliente de Zavu
zavu_client = ZavuClient()

# --- MODELOS DE ENTRADA / SALIDA (PYDANTIC) ---

class PerfilBase(BaseModel):
    nombre_empresa: str
    telefono_sms: Optional[str] = None
    telegram_id: Optional[str] = None
    telegram_activo: bool = False
    sms_activo: bool = False
    sectores: List[str] = []
    palabras_clave: List[str] = []

class PerfilResponse(PerfilBase):
    id: str

class TenderResponse(BaseModel):
    id: str
    title: str
    entity: str
    budget: str
    modality: str
    deadline: str
    matchScore: int
    matchLevel: str
    keywords: List[str]
    isNew: bool
    zavuStatus: str
    zavuTime: Optional[str]
    aiSummary: str

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "LicitaBot Bolivia Backend ejecutándose correctamente.",
        "docs": "/docs"
    }

@app.get("/api/perfil", response_model=PerfilResponse)
def get_perfil():
    """Obtiene el perfil configurado actual. Si no existe, devuelve uno por defecto."""
    try:
        perfil = obtener_primer_perfil()
        if not perfil:
            raise HTTPException(status_code=404, detail="Perfil no encontrado")
        return perfil
    except Exception as e:
        logger.error(f"Error al obtener perfil: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/perfil", response_model=PerfilResponse)
def update_perfil(perfil: PerfilBase):
    """Crea o actualiza la información del perfil del usuario, sectores e intereses."""
    try:
        # Cargar perfil actual para ver si ya tiene ID y actualizar sobre él
        perfil_existente = obtener_primer_perfil()
        perfil_dict = perfil.model_dump()
        
        if perfil_existente:
            perfil_dict["id"] = perfil_existente["id"]
            
        perfil_guardado = guardar_perfil(perfil_dict)
        return perfil_guardado
    except Exception as e:
        logger.error(f"Error al guardar perfil: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/licitaciones", response_model=List[TenderResponse])
def get_licitaciones():
    """Devuelve el feed de licitaciones procesadas para el usuario activo."""
    try:
        perfil = obtener_primer_perfil()
        if not perfil:
            return []
        
        evaluaciones = obtener_evaluaciones_completas(perfil["id"])
        return evaluaciones
    except Exception as e:
        logger.error(f"Error al obtener licitaciones: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def _procesar_licitacion_y_notificar(lic: Dict[str, Any], perfil: Dict[str, Any]) -> Dict[str, Any]:
    """
    Función interna auxiliar para orquestar:
    Scrape -> Registrar Licitación -> Evaluar IA -> Guardar Evaluación -> Disparar Zavu -> Guardar Log.
    """
    # 1. Registrar licitación en DB (si ya existe, hace upsert)
    registrar_licitacion(lic)
    
    # 2. Evaluar mediante el Agente de IA
    eval_res = evaluar_licitacion(lic, perfil)
    
    # 3. Guardar el resultado del razonamiento
    eval_guardada = registrar_evaluacion(eval_res)
    
    # 4. Despachar notificaciones si hay coincidencia ('Aprobado')
    zavu_status = "Pendiente"
    zavu_time = None
    
    if eval_res["estado_evaluacion"] == "Aprobado":
        # Formatear el mensaje ejecutivo
        mensaje = (
            f"📋 *NUEVA LICITACIÓN DETECTADA ({eval_res['match_level'].upper()})*\n\n"
            f"*Objeto:* {lic['titulo']}\n"
            f"*Entidad:* {lic['entidad']}\n"
            f"*Presupuesto:* Bs. {lic['presupuesto']:,.2f}\n"
            f"*Modalidad:* {lic.get('modalidad', 'N/A')}\n"
            f"*Plazo Límite:* {lic.get('plazo_presentacion', 'N/A')}\n\n"
            f"🤖 *Resumen del Agente IA:*\n{eval_res['resumen_ia']}\n\n"
            f"🔗 *Pliego de especificaciones:* {lic.get('enlace_pliego', '#')}"
        )
        
        # Enviar vía Telegram si está activo
        if perfil.get("telegram_activo") and perfil.get("telegram_id"):
            success, msg_info = zavu_client.enviar_mensaje("Telegram", perfil["telegram_id"], mensaje)
            registrar_log_notificacion({
                "evaluacion_id": eval_guardada["id"],
                "canal": "Telegram",
                "estado_zavu": "Enviado" if success else "Fallido",
                "mensaje_error": None if success else msg_info
            })
            if success:
                zavu_status = "Telegram"
                zavu_time = "ahora mismo"
                
        # Enviar vía SMS si está activo y Telegram no se envió exitosamente (o ambos si se desea)
        if perfil.get("sms_activo") and perfil.get("telefono_sms") and zavu_status == "Pendiente":
            # Para SMS usamos un resumen corto debido al límite de caracteres
            sms_mensaje = (
                f"LicitaBot ({eval_res['match_level']}): {lic['titulo'][:50]}... "
                f"Presupuesto: Bs.{lic['presupuesto']:,.0f}. "
                f"Ver: {lic.get('enlace_pliego', 'SICOES')}"
            )
            success, msg_info = zavu_client.enviar_mensaje("SMS", perfil["telefono_sms"], sms_mensaje)
            registrar_log_notificacion({
                "evaluacion_id": eval_guardada["id"],
                "canal": "SMS",
                "estado_zavu": "Enviado" if success else "Fallido",
                "mensaje_error": None if success else msg_info
            })
            if success:
                zavu_status = "SMS"
                zavu_time = "ahora mismo"

    # Formatear retorno compatible con el tipo de datos de la interfaz (Tender)
    return {
        "id": lic["id_sicoes"],
        "title": lic["titulo"],
        "entity": lic["entidad"],
        "budget": f"Bs. {lic['presupuesto']:,.0f}",
        "modality": lic.get("modalidad", "ANPE"),
        "deadline": lic.get("plazo_presentacion", "No especificado"),
        "matchScore": eval_res["match_score"],
        "matchLevel": eval_res["match_level"],
        "keywords": perfil.get("palabras_clave", []),
        "isNew": True,
        "zavuStatus": zavu_status,
        "zavuTime": zavu_time,
        "aiSummary": eval_res["resumen_ia"]
    }

@app.post("/api/demo/simular", response_model=TenderResponse)
def simular_licitacion():
    """
    Endpoint del botón mágico de la demo en vivo.
    Inyecta una licitación sintética/simulada, ejecuta el pipeline completo en tiempo real,
    envía la notificación a Zavu si corresponde, y devuelve la licitación evaluada.
    """
    try:
        perfil = obtener_primer_perfil()
        if not perfil:
            raise HTTPException(status_code=400, detail="Debes configurar tu perfil antes de simular.")
        
        # Generar una licitación simulada de alto impacto
        licitacion_sim = obtener_licitacion_simulada()
        
        # Procesar y enviar de inmediato
        tender_res = _procesar_licitacion_y_notificar(licitacion_sim, perfil)
        return tender_res
        
    except Exception as e:
        logger.error(f"Error durante la simulación: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/licitaciones/sincronizar", response_model=List[TenderResponse])
def sincronizar_licitaciones(background_tasks: BackgroundTasks):
    """
    Simula la tarea periódica (Background Task) de monitoreo.
    Descarga licitaciones del scraper y las procesa en lotes.
    """
    try:
        perfil = obtener_primer_perfil()
        if not perfil:
            raise HTTPException(status_code=400, detail="Debe configurar un perfil primero.")
            
        nuevas = obtener_nuevas_licitaciones()
        resultados = []
        
        # Procesar cada licitación
        for lic in nuevas:
            res = _procesar_licitacion_y_notificar(lic, perfil)
            resultados.append(res)
            
        return resultados
    except Exception as e:
        logger.error(f"Error en la sincronización: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
