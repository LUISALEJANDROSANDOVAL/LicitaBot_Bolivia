# ⚙️ Requisitos Funcionales (RF)

*Documento de análisis de requisitos redactado desde la perspectiva de la Ingeniería de Software.*

Los **Requisitos Funcionales** definen lo que el sistema **LicitaBot (SICOES-Agent)** debe hacer. Describen los comportamientos, procesos y servicios que la plataforma proveerá al usuario (PyMEs) y cómo interactuará con los sistemas externos (SICOES, LLMs y Zavu).

## Módulo de Gestión de Usuarios
- **RF-01: Configuración de Perfil Comercial:** El sistema debe permitir a las empresas usuarias registrar y actualizar su perfil de intereses, especificando palabras clave (ej. "Construcción", "Software"), ubicación geográfica (ej. "Santa Cruz") y preferencias de industria.
- **RF-02: Configuración de Canal de Contacto:** El sistema debe permitir al usuario configurar su canal preferido para recibir notificaciones (Número de teléfono para SMS o ID de usuario para Telegram).

## Módulo de Extracción de Datos (Scraping)
- **RF-03: Monitoreo Periódico:** El sistema debe consultar de forma autónoma y programada (Background Task) las nuevas publicaciones del portal del SICOES.
- **RF-04: Normalización de Datos:** El módulo de scraping debe extraer los datos crudos del SICOES (HTML u otros formatos) y transformarlos a una estructura de datos estándar (JSON) legible para el Agente.

## Módulo de Inteligencia Artificial (El Agente)
- **RF-05: Evaluación Cognitiva:** El Agente de IA debe recibir los datos estructurados de cada licitación y compararlos algorítmicamente contra los perfiles comerciales (RF-01) registrados en la base de datos.
- **RF-06: Toma de Decisiones Autónoma:** El LLM debe tener la capacidad de descartar licitaciones irrelevantes y aprobar (hacer "Match") aquellas que cumplan los criterios del usuario, sin intervención humana.
- **RF-07: Resumen Ejecutivo:** Para cada "Match", el Agente debe generar un resumen ejecutivo que contenga obligatoriamente: Título, Objeto de Contratación, Presupuesto Estimado, Plazos (fecha límite) y el enlace oficial.
- **RF-08: Invocación de Herramientas (Function Calling):** El Agente debe ser capaz de invocar de forma autónoma la herramienta de notificación (`zavu_client`) una vez que determine que una licitación es de alto valor para el usuario.

## Módulo de Notificaciones (Integración Zavu)
- **RF-09: Despacho Multicanal:** El sistema debe enviar la alerta generada por el Agente (RF-07) directamente al dispositivo del usuario a través de la API de Zavu (Telegram o SMS), según la preferencia del usuario (RF-02).
- **RF-10: Acción Directa:** La notificación debe incluir un enlace o *Call to Action* (CTA) funcional que dirija al usuario al documento de postulación o al pliego de la licitación.

## Módulo de Demostración (Hackathon Specific)
- **RF-11: Simulación de Eventos:** La interfaz web debe proveer un mecanismo (botón) para inyectar una "nueva licitación simulada" y forzar la ejecución inmediata del flujo completo (Evaluación -> Decisión -> Notificación Zavu) para facilitar demostraciones en vivo.
