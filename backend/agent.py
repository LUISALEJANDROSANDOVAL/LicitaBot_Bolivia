import json
import os
from openai import OpenAI
from dotenv import load_dotenv
import sicoes_scraper

# Cargar variables de entorno (como OPENAI_API_KEY)
load_dotenv()

# --- 1. DATOS FALSOS (MOCKS) ---
# Aquí simulamos lo que la Persona 2 (Scraper) nos entregará en el futuro.
licitaciones_mock = [
    {
        "id": "LIC-001",
        "titulo": "Adquisición de Servidores de Alto Rendimiento",
        "objeto": "Compra de 50 servidores blade para el Data Center gubernamental.",
        "presupuesto_estimado_bs": 1500000,
        "ubicacion": "La Paz",
        "fecha_limite": "2024-05-15",
        "link_documento": "http://sicoes.gob.bo/licitacion/1"
    },
    {
        "id": "LIC-002",
        "titulo": "Mantenimiento de Áreas Verdes",
        "objeto": "Servicio de poda y cuidado de plazas centrales.",
        "presupuesto_estimado_bs": 30000,
        "ubicacion": "Cochabamba",
        "fecha_limite": "2024-04-20",
        "link_documento": "http://sicoes.gob.bo/licitacion/2"
    },
    {
        "id": "LIC-003",
        "titulo": "Construcción de Puente Vehicular Norte",
        "objeto": "Obra gruesa y fina para el nuevo puente de conexión vial.",
        "presupuesto_estimado_bs": 5000000,
        "ubicacion": "Santa Cruz",
        "fecha_limite": "2024-08-10",
        "link_documento": "http://sicoes.gob.bo/licitacion/3"
    }
]

perfil_usuario_mock = {
    "empresa": "TechBolivia S.R.L.",
    "rubro_principal": "Tecnología, Informática, Hardware",
    "palabras_clave_interes": ["servidores", "computadoras", "software", "redes"],
    "ubicacion_preferida": "Cualquiera",
    "presupuesto_minimo_bs": 100000
}


# --- 2. DEFINICIÓN DE HERRAMIENTAS (FUNCTION CALLING) ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "enviar_alerta_zavu",
            "description": "Llama a la API de Zavu para enviar un SMS/Telegram al usuario cuando encuentras una licitación que hace MATCH perfecto con su perfil.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id_licitacion": {
                        "type": "string",
                        "description": "El ID de la licitación encontrada."
                    },
                    "resumen_ejecutivo": {
                        "type": "string",
                        "description": "Un mensaje persuasivo corto (máximo 3 líneas) explicando por qué esta licitación es ideal para la empresa."
                    }
                },
                "required": ["id_licitacion", "resumen_ejecutivo"]
            }
        }
    }
]


# --- 3. LOGICA PRINCIPAL (EL CEREBRO) ---
def evaluar_licitaciones(licitaciones: list, perfil: dict):
    print(f"[INFO] Evaluando {len(licitaciones)} licitaciones para el perfil: {perfil['empresa']}")
    
    # Llamada al LLM
    try:
        # Configuración para OpenRouter
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        
        system_prompt = f"""
        Eres un Analista Experto en Licitaciones del Estado Boliviano (SICOES). 
        Tu trabajo es evaluar nuevas contrataciones públicas y decidir si son una oportunidad de oro para tu cliente.
        
        PERFIL DE TU CLIENTE:
        - Nombre: {perfil['empresa']}
        - Rubro: {perfil['rubro_principal']}
        - Palabras Clave: {", ".join(perfil['palabras_clave_interes'])}
        - Presupuesto Mínimo Deseado: {perfil['presupuesto_minimo_bs']} Bs
        
        REGLAS:
        1. Lee atentamente la lista de licitaciones proporcionadas.
        2. Si encuentras una o más licitaciones que hacen "MATCH" con las palabras clave o el rubro del cliente, DEBES invocar la herramienta 'enviar_alerta_zavu'.
        3. Si la licitación NO tiene NADA que ver con el rubro del cliente, IGNÓRALA silenciosamente.
        """

        response = client.chat.completions.create( # type: ignore
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Aquí están las nuevas licitaciones del día en formato JSON:\n{json.dumps(licitaciones, indent=2)}"}
            ],
            tools=tools,
            tool_choice="auto", # Permite al modelo decidir si llama o no a la función
            temperature=0.1
        )
        
        mensaje = response.choices[0].message
        
        # --- 4. MANEJO DE LA DECISIÓN DEL AGENTE ---
        if mensaje.tool_calls:
            for tool_call in mensaje.tool_calls:
                if tool_call.function.name == "enviar_alerta_zavu":
                    # El agente decidió que hay un Match
                    argumentos = json.loads(tool_call.function.arguments)
                    print("\n[ALERTA] ¡MATCH ENCONTRADO! El Agente decidió notificar:")
                    print(f"   => ID Licitación: {argumentos.get('id_licitacion')}")
                    print(f"   => Resumen Generado: {argumentos.get('resumen_ejecutivo')}")
                    
                    # AQUÍ: En el futuro conectaremos con el código real de zavu_client.py
        else:
            # El agente decidió que no hay nada interesante
            print("\n[INFO] Ninguna de las licitaciones evaluadas hace match con el perfil de este usuario.")
            
    except Exception as e:
        print(f"[ERROR] Error al conectar con OpenRouter: {e}")
        print("[AYUDA] Recuerda: Necesitas configurar la variable de entorno OPENROUTER_API_KEY para ejecutar esto.")

# Ejecución principal con datos reales
if __name__ == "__main__":
    print("[SISTEMA] Iniciando LicitaBot - Agente de Inteligencia Artificial\n")
    
    print("[INFO] Obteniendo datos reales del SICOES...")
    URL_SICOES = "https://www.sicoesmonitor.com/licitaciones"
    licitaciones_reales = sicoes_scraper.extraer_licitaciones(URL_SICOES)
    
    if licitaciones_reales:
        evaluar_licitaciones(licitaciones_reales, perfil_usuario_mock)
    else:
        print("[AVISO] No se encontraron licitaciones nuevas o falló el scraper. Usando datos falsos de respaldo...")
        evaluar_licitaciones(licitaciones_mock, perfil_usuario_mock)
        
    print("\n[OK] Proceso completado.")
