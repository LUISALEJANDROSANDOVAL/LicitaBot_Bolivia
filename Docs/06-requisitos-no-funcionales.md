# 🛡️ Requisitos No Funcionales (RNF)

*Documento de análisis de requisitos redactado desde la perspectiva de la Ingeniería de Software.*

Los **Requisitos No Funcionales** definen los atributos de calidad, restricciones de diseño y estándares técnicos bajo los cuales operará **LicitaBot (SICOES-Agent)**. Responden a la pregunta: *¿Cómo debe comportarse el sistema?*

## 1. Arquitectura y Mantenibilidad
- **RNF-01: Modularidad (Separation of Concerns):** La base de código debe estar dividida estrictamente en componentes independientes: extracción (Scraping), razonamiento (IA) y comunicaciones (Zavu). Una modificación en la lógica de scraping no debe requerir cambios en el código de notificación.
- **RNF-02: Framework Backend:** El servicio principal debe estar construido sobre Python utilizando **FastAPI** para garantizar validación de tipos estrictos (vía Pydantic) y autogeneración de documentación OpenAPI (`/docs`).

## 2. Rendimiento y Escalabilidad (Performance & Scalability)
- **RNF-03: Tiempo de Respuesta de la API:** Las peticiones al servidor (exceptuando las llamadas a LLMs externos) deben resolverse en menos de 500 milisegundos.
- **RNF-04: Asincronía y Tareas en Segundo Plano:** El proceso de *scraping* y las inferencias del modelo de lenguaje deben ejecutarse de forma asíncrona (Background Tasks o workers como Celery) para no bloquear el hilo principal de la aplicación.
- **RNF-05: Escalabilidad Horizontal:** El backend debe ser *stateless* (sin estado), permitiendo instanciar múltiples servidores o contenedores en Render de forma simultánea para atender a cientos de usuarios a medida que crezca el producto comercial (SaaS).

## 3. Disponibilidad y Despliegue (Reliability & Deployment)
- **RNF-06: Alta Disponibilidad (Uptime):** El sistema debe estar desplegado en un entorno PaaS de grado productivo (como Render o Railway) garantizando que los endpoints y los *cron jobs* de monitoreo operen 24/7 sin depender de la máquina de un desarrollador.
- **RNF-07: Resiliencia del Scraper:** Dado que el DOM del SICOES puede ser inestable o lento, el módulo de scraping debe implementar patrones de resiliencia como *Timeouts* y *Retries* (reintentos) para evitar caídas en cascada de la aplicación principal.
- **RNF-08: Contenedorización:** El proyecto completo debe incluir un `Dockerfile` para asegurar reproducibilidad inmediata en cualquier entorno y facilitar el despliegue continuo.

## 4. Integraciones y Terceros (Interoperability)
- **RNF-09: Agnosticismo del LLM:** La capa de Inteligencia Artificial debe estar diseñada de manera abstracta para permitir el intercambio de modelos subyacentes (ej. cambiar de OpenAI GPT-4o a Claude 3.5 Sonnet o Gemini 1.5 Pro) sin requerir reescritura masiva de código.
- **RNF-10: Tolerancia a Fallos en APIs Externas:** Las llamadas a la API de Zavu y a las APIs de los LLMs deben manejar excepciones y errores de red de manera elegante (Graceful Degradation), registrando el fallo en los *logs* y reintentando el envío posteriormente sin perder la alerta.

## 5. Experiencia de Usuario (UX) - Demo Hackathon
- **RNF-11: Fricción Cero en la Demo:** Para propósitos del hackathon, la interfaz gráfica de configuración no debe exigir inicio de sesión complejo ni instalaciones locales. Debe ser puramente web y permitir a los jueces entender el flujo en menos de 60 segundos.
