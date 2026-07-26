# 🚀 Tareas Pendientes para la Conexión Final (MVP Hackathon)

Este documento detalla exactamente qué falta para conectar el Frontend (Next.js) con el Backend (FastAPI Python) y tener un producto 100% funcional.

---

## 1. Integración de APIs (Frontend ↔ Backend)
Actualmente el Frontend muestra datos simulados (hardcodeados). Debe conectarse a los endpoints que ya existen en `backend2/main.py`.

### A. Obtener Licitaciones Reales
- **Endpoint:** `GET http://localhost:8000/api/licitaciones`
- **Tarea Frontend:** 
  - En `tenders-feed.tsx`, reemplazar la carga de `MOCK_TENDERS` por un `fetch()` a este endpoint.
  - Implementar manejo de estado de carga real con los *Skeletons* ya construidos.

### B. Guardar Configuración del Agente
- **Endpoint:** `POST http://localhost:8000/api/perfil`
- **Tarea Frontend:**
  - En `agent-config.tsx`, al presionar "Guardar y Activar Agente", hacer un POST enviando los datos del estado de Zustand (keywords, sectores, telegram_id, etc.) a la base de datos del backend.

### C. Botón "Simular Match" (Para la Demo)
- **Endpoint:** `POST http://localhost:8000/api/demo/simular`
- **Tarea Frontend:**
  - En `live-simulator.tsx`, conectar el botón central para disparar este endpoint. El backend inyectará una licitación y enviará la alerta por Zavu (Telegram) en vivo para maravillar a los jueces.

---

## 2. Desarrollo del Panel de Chat de IA (Frontend)
El servidor ya está configurado para hablar con **Gemini 2.0 Flash (OpenRouter)** en el endpoint local `/api/chat`.

- **Tarea Frontend:**
  - Crear un nuevo componente visual `chat-panel.tsx` en el Dashboard.
  - Diseñarlo con el mismo estilo Premium (Glassmorphism, Dark Mode).
  - Hacer un `POST /api/chat` cuando el usuario escriba una pregunta (ej. "¿Cuáles son los requisitos de las boletas de garantía según el DS 0181?").
  - Mostrar la respuesta en la UI con un efecto de máquina de escribir (typing).

---

## 3. Despliegue (Deploy) - Opcional pero recomendado
Para que los jueces puedan entrar desde sus propios teléfonos:

- **Frontend:** Desplegar en **Vercel** (gratuito y directo desde GitHub).
- **Backend:** Desplegar el `backend2/main.py` en **Render** o **Railway** (gratuitos y fáciles para FastAPI).
- **Variables de Entorno:** 
  - Configurar en Vercel el `NEXT_PUBLIC_API_URL` apuntando al dominio de Render.
  - Configurar las llaves de Zavu y OpenRouter en ambos servicios según corresponda.
