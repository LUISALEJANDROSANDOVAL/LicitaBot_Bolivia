# ⚙️ Arquitectura y Estructura del Proyecto

Para garantizar que **LicitaBot Bolivia** sea escalable, mantenible y esté listo para producción, hemos optado por una arquitectura modular que separa claramente las responsabilidades del scraping, la lógica del agente de IA, la API web y las integraciones de terceros.

## 📂 Estructura del Repositorio

```text
licita-bot/
├── backend/
│   ├── main.py              # Punto de entrada de la API (FastAPI). Orquesta las rutas.
│   ├── agent.py             # Cerebro del sistema: Lógica del LLM y uso de herramientas (Function Calling).
│   ├── sicoes_scraper.py    # Módulo dedicado a la extracción, limpieza y normalización de datos del SICOES.
│   ├── zavu_client.py       # Wrapper para la integración con la API multicanal de Zavu (Telegram/SMS).
│   ├── database.py          # Gestión de estado, perfiles de usuario y preferencias (SQLite/SQLAlchemy).
│   └── requirements.txt     # Dependencias del proyecto.
├── frontend/                # (Versión Minimalista para la Demo)
│   ├── index.html           # Panel de control simple para registrar la PyME y simular la llegada de alertas.
│   └── script.js            # Lógica de conexión con el backend.
├── README.md                # Documentación principal.
└── Dockerfile               # Contenedorización para un despliegue rápido y reproducible.
```

## 🧠 Explicación de los Componentes Clave

- **Agente de IA (`agent.py`):** No es un simple script de reglas. Es un agente cognitivo. Recibe la información del scraper, la compara con el perfil de la empresa (extraído de `database.py`) y utiliza razonamiento para decidir si la licitación es un "Match". Si lo es, invoca autónomamente la herramienta de notificación.
- **Módulo de Scraping (`sicoes_scraper.py`):** Aísla la complejidad de lidiar con HTML/estructuras antiguas gubernamentales. Su único trabajo es entregar datos limpios y estructurados en formato JSON al Agente.
- **Integración Zavu (`zavu_client.py`):** Encapsula toda la comunicación saliente hacia el usuario final, permitiendo cambiar o escalar los canales (ej. añadir WhatsApp mañana) sin tocar la lógica central del agente.
