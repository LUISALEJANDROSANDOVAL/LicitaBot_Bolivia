# 🛠️ Stack Tecnológico

La elección de tecnologías para **LicitaBot** no es casualidad; cada herramienta fue seleccionada para maximizar la velocidad de desarrollo durante el hackathon, manteniendo la robustez necesaria para escalar a un producto comercial B2B.

| Componente | Tecnología | Justificación Técnica y de Negocio |
| :--- | :--- | :--- |
| **Asistente de Desarrollo** | **Cursor** | Vital en un entorno de hackathon. Nos permite escribir, refactorizar y conectar módulos a una velocidad inigualable gracias a su profunda integración de IA con el contexto del código. |
| **Backend Framework** | **Python + FastAPI** | Python es el ecosistema indiscutible para Inteligencia Artificial. FastAPI nos proporciona velocidad, validación de datos estricta (Pydantic) y documentación autogenerada (`/docs`), ideal para pruebas rápidas y consumo desde el frontend. |
| **Cerebro del Agente (LLM)** | **OpenAI / Claude / Gemini** | Utilizamos modelos de lenguaje de última generación con capacidades de *Function Calling* (uso de herramientas). Esto permite al agente decidir de forma autónoma *cuándo* y *cómo* notificar al usuario, sin requerir scripts rígidos. |
| **Extracción de Datos** | **Firecrawl / Exa + BeautifulSoup** | Herramientas especializadas para transformar el caos de las páginas gubernamentales (cuyo DOM suele ser inconsistente) en datos limpios que el LLM pueda interpretar sin sufrir de "alucinaciones". |
| **Canal de Notificación** | **API de Zavu** | *(Core del Sponsor Track)*. Fundamental para el producto final. Nos permite sacar la plataforma de la pantalla del ordenador y llevar las alertas críticas directamente al bolsillo del usuario vía **Telegram o SMS**, logrando un tiempo de respuesta inmediato. |
| **Persistencia de Datos** | **SQLite (Hackathon) / PostgreSQL** | SQLite es perfecto para iterar rápido sin configuraciones externas. La arquitectura está diseñada para que la transición a PostgreSQL en producción sea trivial usando un ORM como SQLAlchemy. |
| **Despliegue** | **Render / Railway** | Plataformas PaaS que nos garantizan que la demostración esté viva y accesible 24/7 en una URL pública para que el jurado la evalúe, sin preocuparnos por un setup DevOps complejo. |
