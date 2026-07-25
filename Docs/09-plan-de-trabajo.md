# 📋 Plan de Trabajo y Asignación de Tareas (Team de 4)

*Documento de gestión de proyecto redactado bajo metodologías ágiles (Scrum/Kanban) adaptado para un entorno de Hackathon de alta velocidad.*

Para asegurar el éxito de **LicitaBot (SICOES-Agent)** durante el hackathon, el trabajo debe paralelizarse desde la hora cero. Para un equipo de 4 personas, la estructura más eficiente como ingenieros de software es dividir por **dominios de responsabilidad** (Micro-equipos) en lugar de dividir por tareas aisladas.

---

## 👥 Definición de Roles

### 🧑‍💻 Persona 1: Ingeniero de Inteligencia Artificial (AI Engineer)
*   **Responsabilidad Core:** Dotar de "cerebro" al sistema.
*   **Tareas Específicas:**
    *   Diseñar los *System Prompts* para evaluar las licitaciones según perfiles.
    *   Implementar la lógica de *Function Calling* (para que el LLM sepa cuándo invocar a Zavu).
    *   Elegir y conectar la API del modelo (OpenAI, Claude o Gemini).
    *   Optimizar el tiempo de respuesta y los tokens consumidos.
*   **Entregable:** Módulo `agent.py` completamente funcional.

### 🕷️ Persona 2: Ingeniero de Datos (Data & Scraping Engineer)
*   **Responsabilidad Core:** Conseguir la materia prima (Datos del SICOES).
*   **Tareas Específicas:**
    *   Investigar el DOM del portal del SICOES o buscar si existe algún endpoint público/oculto.
    *   Crear scripts (BeautifulSoup, Firecrawl, Playwright) para extraer título, presupuesto, fechas y enlaces de postulación.
    *   Limpiar la "basura" del HTML y formatear los datos en un JSON estandarizado.
*   **Entregable:** Módulo `sicoes_scraper.py` que devuelva una lista limpia de diccionarios/JSON.

### ⚙️ Persona 3: Backend & Integraciones (Backend Engineer)
*   **Responsabilidad Core:** El pegamento que une todo y orquesta la comunicación.
*   **Tareas Específicas:**
    *   Levantar el servidor **FastAPI**.
    *   Diseñar la base de datos (SQLite) para guardar los perfiles de los usuarios (Rubro, Palabras clave, Celular/Telegram).
    *   Integrar la **API de Zavu** (`zavu_client.py`) para enviar los SMS/Telegram.
    *   Crear los *endpoints* que conectarán el frontend con la IA.
*   **Entregable:** `main.py`, `database.py` y `zavu_client.py`.

### 🎨 Persona 4: Frontend & DevOps (Fullstack & Pitch Lead)
*   **Responsabilidad Core:** La cara visible del proyecto y asegurar que no "explote" en la demo.
*   **Tareas Específicas:**
    *   Crear una interfaz web minimalista (HTML/JS puro o React/Next.js simple) para que un usuario registre su perfil.
    *   Crear el botón mágico de "Simular Licitación" para la demo en vivo.
    *   Encargarse del **Deploy** (Subir el backend a Render/Railway y el frontend a Vercel/Netlify).
    *   Preparar el flujo narrativo del Pitch (Guiarse del archivo `03-flujo-demo.md`).
*   **Entregable:** Carpeta `frontend/`, URL pública funcionando 24/7 y la presentación final.

---

## 🚀 Fases del Sprint (Cronograma de Hackathon)

### Fase 1: Setup y Arquitectura (Horas 1 - 3)
- **Todos:** Crear el repositorio en GitHub e invitar al equipo.
- **P2 y P3:** Definir exactamente la estructura del JSON (contrato de datos) que el Scraper le pasará al Backend.
- **P1 y P3:** Definir exactamente la estructura que el LLM necesita recibir para tomar decisiones.
- **P4:** Levantar repositorios base y dejar los "Hola Mundo" deployados.

### Fase 2: Desarrollo Paralelo (Horas 4 - 15)
- **P1 (IA):** Prueba *prompts* en un Jupyter Notebook con datos falsos hasta que el LLM responda perfecto.
- **P2 (Scraper):** Pelea con el HTML del SICOES hasta lograr extraer 5 licitaciones reales limpias.
- **P3 (Backend):** Conecta la Base de datos y logra enviar un mensaje de prueba de "Hola" usando Zavu.
- **P4 (Frontend):** Termina la UI y la deja lista para consumir los endpoints.

### Fase 3: Integración General "El Pegamento" (Horas 16 - 20)
- **P3 (Backend)** une el código de **P2 (Scraper)** y se lo pasa a **P1 (IA)**.
- Cuando **P1 (IA)** dice "Es un Match", **P3** dispara el código de Zavu.
- **P4** conecta la interfaz web para desencadenar todo este flujo con un solo clic.

### Fase 4: Pruebas, Refactorización y Pitch (Últimas Horas)
- **P4** asume el liderazgo del Pitch. Ensayan el guion.
- **P1, P2 y P3:** Limpian el código (quitan `print`s de consola), verifican que las variables de entorno funcionen en Render y se aseguran de que no haya "bugs" durante la demo. 

---

## 🎯 Regla de Oro del Equipo
*"Si tu módulo (Scraper, IA, Frontend) está fallando y te bloqueas por más de 30 minutos, pide ayuda o simula los datos (Mock/Hardcode) para no retrasar al resto del equipo."*
