# 📊 Estrategia de Evaluación: Cumplimiento de la Rúbrica

Para asegurar que **LicitaBot (SICOES-Agent)** cumpla al máximo con la rúbrica de evaluación del hackathon y obtenga el puntaje más alto en cada categoría, hemos diseñado el proyecto en torno a estos cinco pilares fundamentales:

## 1. Claridad del Problema y Caso de Uso (20%)

- **¿Qué resuelve?** Elimina la fricción y el tiempo perdido en la búsqueda manual de contrataciones estatales. Automatiza el monitoreo de licitaciones públicas para que las pequeñas y medianas empresas (PyMEs) no pierdan oportunidades de negocio por falta de tiempo o herramientas de vigilancia comercial.
- **¿Para quién en Bolivia/LatAm?** Para PyMEs, cooperativas y emprendedores en Bolivia que dependen de las compras estatales (SICOES) pero carecen de equipos legales o analistas dedicados a revisar portales web gubernamentales a diario.
- **¿Por qué no existía o no funcionaba bien?** El portal actual del SICOES es lento, carece de alertas proactivas personalizadas por nicho o industria, y los buscadores tradicionales no entregan resúmenes inteligentes ni se comunican a través de canales de mensajería directa como Telegram o SMS.

## 2. Nivel de Ejecución Técnica (25%)

- **¿El agente funciona?** ¡Sí! Se apoya en un backend robusto en Python (FastAPI) conectado a un motor de IA que procesa y filtra los datos estructurados obtenidos mediante scraping o llamadas a APIs públicas.
- **¿La arquitectura es sólida?** Cuenta con una separación clara de responsabilidades:
  - *Capa de Ingesta/Datos:* Módulo encargado de consultar fuentes o catálogos del SICOES.
  - *Capa de Razonamiento (Agente):* LLM configurado con herramientas (*Function Calling*) para evaluar coincidencias según el perfil de la empresa.
  - *Capa de Notificación:* Integración directa con la API multicanal de **Zavu**.
  - *Deploy:* Todo corriendo en producción en servidores accesibles (como Render) sin depender de entornos locales.
- **¿Escala más allá del demo?** Completamente. La arquitectura permite añadir múltiples perfiles de usuarios en bases de datos ligeras (como PostgreSQL o SQLite) y programar tareas en segundo plano (con Celery o cron jobs) para monitorear licitaciones 24/7 para cientos de empresas simultáneamente.

## 3. Uso Significativo de IA y Agentes (20%)

- **¿Toma decisiones reales?** Sí. El agente no se limita a responder un *prompt* estático; analiza el contenido de cada nueva licitación, compara los requisitos con el perfil del usuario y **decide de forma autónoma** si la oportunidad es lo suficientemente relevante como para disparar una alerta urgente.
- **¿Usa herramientas?** Sí, utiliza herramientas programadas (*Function Calling*) para buscar datos actualizados, filtrar por palabras clave geolocalizadas o sectoriales, y formatear resúmenes ejecutivos.
- **¿El output es accionable?** Totalmente. El resultado no es un texto largo y genérico, sino un reporte directo con el título de la licitación, el presupuesto, el enlace oficial y un botón o comando para postular o pedir más detalles.

## 4. Calidad de la Demo y UX (15%)

- **¿Se puede usar sin explicación?** Sí. La interfaz o el canal de interacción (ya sea un chat web minimalista o directamente la interacción por Telegram vía Zavu) es tan natural que cualquier usuario entiende de inmediato cómo registrar su sector y recibir alertas.
- **¿La demo corre en vivo sin fricciones?** Para evitar fallos de internet o bloqueos en vivo, la demo se apoya en un botón de *"Simular nueva licitación de alto impacto"* dentro del panel o chat. Al presionarlo, el agente procesa el caso en segundos y **hace sonar el teléfono del usuario en tiempo real** con una alerta de Zavu (Telegram/SMS). No dependemos de videos pregrabados.

## 5. Potencial Real y Originalidad (20%)

- **¿Tiene vida más allá del hackathon?** Sí, el mercado de software B2B para PyMEs en Bolivia está desatendido. Este proyecto puede convertirse fácilmente en un SaaS (Software as a Service) de suscripción mensual para consultoras y empresas proveedoras del Estado.
- **¿Hay mercado real?** En Bolivia hay miles de empresas registradas en Fundempresa (SEPREC) que participan o desean participar en contrataciones públicas y que pagarían gustosamente por un sistema automatizado que les ahorre horas de búsqueda manual.
- **¿Es diferente a lo existente?** Absolutamente. A diferencia de los chatbots genéricos que solo resumen documentos PDF o responden preguntas frecuentes, este es un **Agente Proactivo y Multicanal** enfocado puramente en inteligencia de negocios y compras públicas locales.
