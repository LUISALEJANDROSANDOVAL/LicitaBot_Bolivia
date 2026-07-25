from typing import List, Dict, Any
import random

# Base de datos local de licitaciones simuladas para el Scraper
LICITACIONES_SICOES_CRUDAS = [
    {
        "id_sicoes": "SICOES-2026-0451",
        "titulo": "Adquisición de material de construcción (cemento y áridos) para red vial urbana",
        "entidad": "Gobierno Autónomo Municipal de Santa Cruz de la Sierra",
        "presupuesto": 350000.0,
        "moneda": "Bs.",
        "modalidad": "ANPE - Apoyo Nacional a la Producción y Empleo",
        "plazo_presentacion": "5 días restantes",
        "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0451"
    },
    {
        "id_sicoes": "SICOES-2026-0448",
        "titulo": "Contratación de servicios de pavimentación flexible Av. Cañoto",
        "entidad": "Administradora Boliviana de Carreteras (ABC)",
        "presupuesto": 1240000.0,
        "moneda": "Bs.",
        "modalidad": "Licitación Pública Nacional",
        "plazo_presentacion": "12 días restantes",
        "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0448"
    },
    {
        "id_sicoes": "SICOES-2026-0439",
        "titulo": "Suministro de equipos de cómputo y servidores para hospitales de tercer nivel",
        "entidad": "Servicio Departamental de Salud (SEDES) - Cochabamba",
        "presupuesto": 620000.0,
        "moneda": "Bs.",
        "modalidad": "ANPE",
        "plazo_presentacion": "8 días restantes",
        "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0439"
    },
    {
        "id_sicoes": "SICOES-2026-0431",
        "titulo": "Construcción de muro de contención de hormigón armado y drenaje pluvial Zona Norte",
        "entidad": "Gobierno Autónomo Municipal de La Paz",
        "presupuesto": 890000.0,
        "moneda": "Bs.",
        "modalidad": "Licitación Pública Nacional",
        "plazo_presentacion": "15 días restantes",
        "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0431"
    },
    {
        "id_sicoes": "SICOES-2026-0425",
        "titulo": "Provisión de raciones alimentarias y desayuno escolar para unidades educativas",
        "entidad": "Gobierno Autónomo Municipal de El Alto",
        "presupuesto": 210000.0,
        "moneda": "Bs.",
        "modalidad": "ANPE",
        "plazo_presentacion": "6 días restantes",
        "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0425"
    }
]

SIMULADA_ALTO_IMPACTO = {
    "id_sicoes": "SICOES-2026-0460",
    "titulo": "Rehabilitación estructural de puente vehicular sobre el río Piraí con asfalto y cemento portland",
    "entidad": "Gobierno Autónomo Departamental de Santa Cruz",
    "presupuesto": 2100000.0,
    "moneda": "Bs.",
    "modalidad": "Licitación Pública Nacional",
    "plazo_presentacion": "20 días restantes",
    "enlace_pliego": "https://www.sicoes.gob.bo/portal/convocatorias/descargar.php?id=2026-0460"
}

def obtener_nuevas_licitaciones() -> List[Dict[str, Any]]:
    """
    Simula la extracción de las últimas licitaciones publicadas en el SICOES.
    Retorna una lista de diccionarios con datos estructurados y normalizados.
    """
    # Devolvemos la base de datos predefinida
    return LICITACIONES_SICOES_CRUDAS

def obtener_licitacion_simulada() -> Dict[str, Any]:
    """
    Simula la inyección de una nueva licitación para la demo en vivo.
    Asigna un ID semi-aleatorio para poder probar el flujo varias veces en la demo.
    """
    copia = dict(SIMULADA_ALTO_IMPACTO)
    rand_id = random.randint(1000, 9999)
    copia["id_sicoes"] = f"SICOES-2026-{rand_id}"
    return copia
