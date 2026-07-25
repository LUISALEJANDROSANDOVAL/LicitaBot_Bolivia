# 🚀 Flujo de Funcionamiento para la Demo en Vivo

Para la presentación ante el jurado del hackathon, el objetivo es demostrar valor real de la forma más rápida posible. Hemos estructurado el flujo de la demo en 4 pasos claros que resaltan la autonomía del agente y la velocidad de entrega de Zavu.

## Paso 1: Configuración del Perfil (El Contexto)
- **Acción:** Mostramos la interfaz de configuración (un panel de control web o un bot inicial en Telegram) donde una empresa define su perfil.
- **Ejemplo Práctico:** Una constructora ficticia llamada "ConstruBol" configura sus intereses ingresando palabras clave como: *"Construcción", "Mantenimiento", "Santa Cruz", "Pavimentación"*.
- **Impacto para el Jurado:** Demuestra personalización extrema. El agente no busca a ciegas; busca exactamente lo que le importa a este usuario específico, resolviendo el problema de la "sobrecarga de información".

## Paso 2: Monitoreo Autónomo (El Trabajo Pesado)
- **Acción:** Simulamos la publicación de nuevas licitaciones en el SICOES (ya sea consumiendo un portal en vivo, o inyectando datos de prueba controlados para la demo).
- **Impacto para el Jurado:** Visualizan que el sistema trabaja en segundo plano (Background Task). El usuario de la PyME no necesita estar refrescando la página web del gobierno, recuperando así horas de productividad.

## Paso 3: Decisión Cognitiva (La Inteligencia del Agente)
- **Acción:** Mostramos los *logs* del backend donde el Agente cobra vida. El agente recibe una lista de licitaciones brutas extraídas por el scraper.
- **El WOW moment:** El LLM evalúa los pliegos y requisitos contra el perfil de "ConstruBol". 
  - *Descarta* una licitación de "Desarrollo de Software" al instante.
  - *Analiza a fondo* una licitación de "Mantenimiento de Escuelas". El agente razona: *"Esta licitación es en Santa Cruz, es sobre mantenimiento de infraestructura, y el presupuesto es coherente. Hace match."* -> **Procede a notificar.**

## Paso 4: Alerta Proactiva (La Acción Final con Zavu)
- **Acción:** En tiempo real, suena el teléfono de quien hace la presentación. A través de la **API de Zavu**, el agente dispara instantáneamente un SMS o un mensaje de Telegram.
- **Contenido del mensaje:** Un resumen ejecutivo ultraconciso generado por el LLM que incluye:
  - 📋 Título y Objeto de la contratación.
  - 💰 Presupuesto estimado.
  - ⏰ Plazos críticos (Fecha de presentación).
  - 🔗 **Un enlace directo** al documento de postulación.
- **Impacto para el Jurado:** Se resuelve el ciclo completo. No solo encontramos la licitación inteligentemente (Track Agents), sino que usamos a Zavu (Track Zavu) para alertar al cliente por su canal preferido sin que tenga que abrir ninguna app extra.
