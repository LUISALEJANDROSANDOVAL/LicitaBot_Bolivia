import os
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Inicialización diferida o directa
supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Conexión con Supabase establecida exitosamente.")
    except Exception as e:
        print(f"Error al conectar con Supabase: {str(e)}")
else:
    print("Advertencia: SUPABASE_URL o SUPABASE_KEY no configurados. Se usará almacenamiento temporal mock en memoria.")

# --- ALMACENAMIENTO MOCK EN MEMORIA (FALLBACK) ---
# En caso de que no existan variables de entorno configuradas aún para la demo local.
_mock_db = {
    "perfiles": {},
    "perfil_sectores": {},
    "perfil_palabras_clave": {},
    "licitaciones": {},
    "evaluaciones": {},
    "logs_notificaciones": {}
}

# --- FUNCIONES DE ACCESO A DATOS ---

def obtener_primer_perfil() -> Optional[Dict[str, Any]]:
    """Devuelve el primer perfil registrado en el sistema. Utilizado para la demo simplificada."""
    if supabase is not None:
        try:
            res = supabase.table("perfiles").select("*").limit(1).execute()
            if res.data and len(res.data) > 0:
                perfil = res.data[0]
                perfil_id = perfil["id"]
                
                # Cargar sectores
                sec_res = supabase.table("perfil_sectores").select("sector").eq("perfil_id", perfil_id).execute()
                perfil["sectores"] = [s["sector"] for s in sec_res.data]
                
                # Cargar palabras clave
                pc_res = supabase.table("perfil_palabras_clave").select("palabra_clave").eq("perfil_id", perfil_id).execute()
                perfil["palabras_clave"] = [p["palabra_clave"] for p in pc_res.data]
                
                return perfil
        except Exception as e:
            print(f"Error en obtener_primer_perfil (Supabase): {str(e)}")
            
    # Fallback a Mock en memoria
    if _mock_db["perfiles"]:
        perfil_id = list(_mock_db["perfiles"].keys())[0]
        perfil = dict(_mock_db["perfiles"][perfil_id])
        perfil["sectores"] = _mock_db["perfil_sectores"].get(perfil_id, [])
        perfil["palabras_clave"] = _mock_db["perfil_palabras_clave"].get(perfil_id, [])
        return perfil
        
    # Perfil por defecto de prueba para la demo en caso de base vacía
    default_id = "00000000-0000-0000-0000-000000000000"
    perfil = {
        "id": default_id,
        "nombre_empresa": "Constructora e Ingeniería del Sur",
        "telefono_sms": "+591 70012345",
        "telegram_id": "@constructora_sur",
        "telegram_activo": True,
        "sms_activo": False,
        "sectores": ["Obras civiles"],
        "palabras_clave": ["cemento", "asfalto", "infraestructura"]
    }
    # Guardar en memoria
    _mock_db["perfiles"][default_id] = perfil
    _mock_db["perfil_sectores"][default_id] = perfil["sectores"]
    _mock_db["perfil_palabras_clave"][default_id] = perfil["palabras_clave"]
    return perfil


def guardar_perfil(perfil_data: Dict[str, Any]) -> Dict[str, Any]:
    """Guarda o actualiza un perfil PyME junto a sus sectores e intereses."""
    perfil_id = perfil_data.get("id")
    nombre_empresa = perfil_data["nombre_empresa"]
    telefono_sms = perfil_data.get("telefono_sms")
    telegram_id = perfil_data.get("telegram_id")
    telegram_activo = perfil_data.get("telegram_activo", False)
    sms_activo = perfil_data.get("sms_activo", False)
    sectores = perfil_data.get("sectores", [])
    palabras_clave = perfil_data.get("palabras_clave", [])

    # Preparar payload para la tabla perfiles
    payload = {
        "nombre_empresa": nombre_empresa,
        "telefono_sms": telefono_sms,
        "telegram_id": telegram_id,
        "telegram_activo": telegram_activo,
        "sms_activo": sms_activo,
    }

    if supabase is not None:
        try:
            if perfil_id:
                # Actualizar perfil existente
                res = supabase.table("perfiles").update(payload).eq("id", perfil_id).execute()
            else:
                # Crear nuevo perfil
                res = supabase.table("perfiles").insert(payload).execute()
                perfil_id = res.data[0]["id"]
            
            # Re-sincronizar sectores
            supabase.table("perfil_sectores").delete().eq("perfil_id", perfil_id).execute()
            if sectores:
                sectores_payload = [{"perfil_id": perfil_id, "sector": sec} for sec in sectores]
                supabase.table("perfil_sectores").insert(sectores_payload).execute()

            # Re-sincronizar palabras clave
            supabase.table("perfil_palabras_clave").delete().eq("perfil_id", perfil_id).execute()
            if palabras_clave:
                palabras_payload = [{"perfil_id": perfil_id, "palabra_clave": pc.lower().strip()} for pc in palabras_clave]
                supabase.table("perfil_palabras_clave").insert(palabras_payload).execute()

            # Cargar perfil finalizado
            perfil_data["id"] = perfil_id
            return perfil_data
        except Exception as e:
            print(f"Error al guardar perfil en Supabase: {str(e)}. Usando fallback en memoria.")

    # Fallback Mock en memoria
    if not perfil_id:
        import uuid
        perfil_id = str(uuid.uuid4())
    
    perfil_final = {
        "id": perfil_id,
        "nombre_empresa": nombre_empresa,
        "telefono_sms": telefono_sms,
        "telegram_id": telegram_id,
        "telegram_activo": telegram_activo,
        "sms_activo": sms_activo,
        "sectores": sectores,
        "palabras_clave": [pc.lower().strip() for pc in palabras_clave]
    }
    _mock_db["perfiles"][perfil_id] = perfil_final
    _mock_db["perfil_sectores"][perfil_id] = sectores
    _mock_db["perfil_palabras_clave"][perfil_id] = palabras_clave
    return perfil_final


def registrar_licitacion(licitacion: Dict[str, Any]) -> Dict[str, Any]:
    """Guarda una licitación scrapeada del SICOES."""
    id_sicoes = licitacion["id_sicoes"]
    
    payload = {
        "id_sicoes": id_sicoes,
        "titulo": licitacion["titulo"],
        "entidad": licitacion["entidad"],
        "presupuesto": licitacion["presupuesto"],
        "moneda": licitacion.get("moneda", "Bs."),
        "modalidad": licitacion.get("modalidad"),
        "plazo_presentacion": licitacion.get("plazo_presentacion"),
        "enlace_pliego": licitacion.get("enlace_pliego")
    }

    if supabase is not None:
        try:
            supabase.table("licitaciones").upsert(payload).execute()
            return licitacion
        except Exception as e:
            print(f"Error al registrar licitación en Supabase: {str(e)}")

    # Fallback Mock
    _mock_db["licitaciones"][id_sicoes] = licitacion
    return licitacion


def registrar_evaluacion(evaluacion: Dict[str, Any]) -> Dict[str, Any]:
    """Guarda la evaluación realizada por el Agente de IA."""
    payload = {
        "perfil_id": evaluacion["perfil_id"],
        "id_sicoes": evaluacion["id_sicoes"],
        "match_score": evaluacion["match_score"],
        "match_level": evaluacion["match_level"],
        "resumen_ia": evaluacion["resumen_ia"],
        "estado_evaluacion": evaluacion["estado_evaluacion"]
    }

    if supabase is not None:
        try:
            res = supabase.table("evaluaciones").insert(payload).execute()
            evaluacion["id"] = res.data[0]["id"]
            return evaluacion
        except Exception as e:
            print(f"Error al registrar evaluación en Supabase: {str(e)}")

    # Fallback Mock
    import uuid
    eval_id = str(uuid.uuid4())
    evaluacion["id"] = eval_id
    _mock_db["evaluaciones"][eval_id] = evaluacion
    return evaluacion


def registrar_log_notificacion(log: Dict[str, Any]) -> Dict[str, Any]:
    """Guarda el log de una alerta despachada por Zavu."""
    payload = {
        "evaluacion_id": log["evaluacion_id"],
        "canal": log["canal"],
        "estado_zavu": log["estado_zavu"],
        "mensaje_error": log.get("mensaje_error")
    }

    if supabase is not None:
        try:
            res = supabase.table("logs_notificaciones").insert(payload).execute()
            log["id"] = res.data[0]["id"]
            return log
        except Exception as e:
            print(f"Error al registrar log de notificación en Supabase: {str(e)}")

    # Fallback Mock
    import uuid
    log_id = str(uuid.uuid4())
    log["id"] = log_id
    _mock_db["logs_notificaciones"][log_id] = log
    return log


def obtener_evaluaciones_completas(perfil_id: str) -> List[Dict[str, Any]]:
    """
    Retorna la lista de licitaciones evaluadas con sus datos SICOES e historial de notificaciones.
    Equivalente a un JOIN relacional.
    """
    resultados = []

    if supabase is not None:
        try:
            # Query con JOINs nativos de Supabase Postgrest
            # Trae la evaluación, anidando los datos de la licitación y los logs de notificaciones
            query = (
                supabase.table("evaluaciones")
                .select("*, licitaciones(*), logs_notificaciones(*)")
                .eq("perfil_id", perfil_id)
                .order("creado_en", desc=True)
            )
            res = query.execute()
            
            for item in res.data:
                lic = item.get("licitaciones", {})
                logs = item.get("logs_notificaciones", [])
                
                # Determinar canal notificado y tiempo para compatibilidad con la estructura frontend
                zavu_status = "Pendiente"
                zavu_time = None
                
                if logs:
                    # Buscar el último envío exitoso
                    exitosos = [l for l in logs if l["estado_zavu"] == "Enviado"]
                    log_ref = exitosos[-1] if exitosos else logs[-1]
                    zavu_status = log_ref["canal"]
                    # Dar un formato simple legible al tiempo (p. ej. "hace X min" o hora)
                    zavu_time = "Enviado"
                
                tender_formatted = {
                    "id": lic.get("id_sicoes", item["id_sicoes"]),
                    "title": lic.get("titulo", "Licitación sin título"),
                    "entity": lic.get("entidad", "Entidad Desconocida"),
                    "budget": f"Bs. {lic.get('presupuesto', 0):,.0f}" if lic.get("presupuesto") else "Bs. 0",
                    "modality": lic.get("modalidad", "ANPE"),
                    "deadline": lic.get("plazo_presentacion", "No especificado"),
                    "matchScore": item["match_score"],
                    "matchLevel": item["match_level"],
                    "keywords": [], # Opcional: Se puede cargar de la licitación si se requiere
                    "isNew": False, # Puede manejarse en frontend o por fecha
                    "zavuStatus": zavu_status,
                    "zavuTime": zavu_time,
                    "aiSummary": item["resumen_ia"]
                }
                resultados.append(tender_formatted)
            return resultados
        except Exception as e:
            print(f"Error al obtener evaluaciones (Supabase): {str(e)}")

    # Fallback Mock
    for eval_id, ev in _mock_db["evaluaciones"].items():
        if ev["perfil_id"] == perfil_id:
            id_sicoes = ev["id_sicoes"]
            lic = _mock_db["licitaciones"].get(id_sicoes, {
                "id_sicoes": id_sicoes,
                "titulo": "Licitación Simulada",
                "entidad": "Alcaldía Municipal",
                "presupuesto": 100000,
                "modalidad": "ANPE",
                "plazo_presentacion": "5 días restantes"
            })
            
            # Buscar si tiene logs
            zavu_status = "Pendiente"
            zavu_time = None
            for log_id, l in _mock_db["logs_notificaciones"].items():
                if l["evaluacion_id"] == eval_id:
                    if l["estado_zavu"] == "Enviado":
                        zavu_status = l["canal"]
                        zavu_time = "hace 1 min"
            
            tender_formatted = {
                "id": id_sicoes,
                "title": lic["titulo"],
                "entity": lic["entidad"],
                "budget": f"Bs. {lic['presupuesto']:,.0f}" if isinstance(lic['presupuesto'], (int, float)) else str(lic['presupuesto']),
                "modality": lic.get("modalidad", "ANPE"),
                "deadline": lic.get("plazo_presentacion", "No especificado"),
                "matchScore": ev["match_score"],
                "matchLevel": ev["match_level"],
                "keywords": _mock_db["perfil_palabras_clave"].get(perfil_id, []),
                "isNew": False,
                "zavuStatus": zavu_status,
                "zavuTime": zavu_time,
                "aiSummary": ev["resumen_ia"]
            }
            resultados.append(tender_formatted)
            
    # Si no hay evaluaciones simuladas en memoria, devolvemos una lista vacía
    return resultados
