import os
import logging
from typing import Dict, Any, Tuple
import httpx
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ZavuClient")

ZAVU_API_KEY = os.getenv("ZAVU_API_KEY")
ZAVU_API_URL = os.getenv("ZAVU_API_URL", "https://api.zavu.co/v1/messages")

class ZavuClient:
    def __init__(self, api_key: str = None, api_url: str = None):
        self.api_key = api_key or ZAVU_API_KEY
        self.api_url = api_url or ZAVU_API_URL
        
        # Validar si el cliente está operando en modo Mock
        self.is_mock = not self.api_key or self.api_key == "tu-zavu-api-key"
        if self.is_mock:
            logger.warning(
                "API Key de Zavu no configurada o configurada por defecto. "
                "ZavuClient se ejecutará en MODO MOCK (simulación de consola)."
            )

    def enviar_mensaje(self, canal: str, destinatario: str, texto: str) -> Tuple[bool, str]:
        """
        Envía un mensaje por el canal especificado (Telegram o SMS) usando la API de Zavu.
        
        Parámetros:
            canal (str): Puede ser 'Telegram' o 'SMS'.
            destinatario (str): Alias de Telegram (ej. '@usuario') o teléfono para SMS (ej. '+59170012345').
            texto (str): Cuerpo del mensaje.
            
        Retorna:
            Tuple[bool, str]: (estado_exito, mensaje_detalle_o_error)
        """
        canal_normalizado = canal.lower()
        if canal_normalizado not in ["telegram", "sms"]:
            return False, f"Canal no soportado: {canal}"

        if not destinatario:
            return False, "El destinatario no puede estar vacío."

        # Cuerpo del payload
        payload = {
            "channel": canal_normalizado,
            "to": destinatario,
            "message": texto
        }

        # Modo Mock (para pruebas locales y hackathon sin llaves válidas)
        if self.is_mock:
            logger.info("=== SIMULACIÓN NOTIFICACIÓN ZAVU ===")
            logger.info(f"Canal: {canal.upper()}")
            logger.info(f"Destinatario: {destinatario}")
            logger.info(f"Mensaje enviado:\n{texto}")
            logger.info("====================================")
            return True, "Simulación exitosa en consola (Modo Mock)"

        # Llamada HTTP Real a la API de Zavu
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            # Implementamos el patrón de tolerancia a fallos RNF-10
            # Establecemos un timeout razonable (5 segundos) para no bloquear el hilo de ejecución
            with httpx.Client(timeout=5.0) as client:
                logger.info(f"Enviando alerta a Zavu API ({canal.upper()}) a {destinatario}...")
                response = client.post(
                    self.api_url,
                    json=payload,
                    headers=headers
                )
                
                # Lanzar excepción si hay un código HTTP de error (4xx, 5xx)
                response.raise_for_status()
                
                res_data = response.json()
                logger.info(f"Respuesta de Zavu recibida: {res_data}")
                return True, "Alerta enviada correctamente"

        except httpx.HTTPStatusError as exc:
            error_msg = f"Error HTTP {exc.response.status_code} de Zavu: {exc.response.text}"
            logger.error(error_msg)
            return False, error_msg
        except httpx.RequestError as exc:
            error_msg = f"Error de red al conectar con Zavu: {str(exc)}"
            logger.error(error_msg)
            return False, error_msg
        except Exception as e:
            error_msg = f"Error inesperado al enviar alerta Zavu: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
