# 🔍 Auditoría de Completitud del Frontend (Nivel Profesional)

Este documento detalla el estado actual del frontend de **LicitaBot Bolivia** y enumera los elementos que faltan implementar para llevarlo de una "Demo Funcional" a un **Frontend Profesional y listo para Producción (Production-Ready)**.

---

## ✅ 1. Lo que ya está completo y profesional (Puntos Fuertes)

El proyecto actual cuenta con una base excelente en la capa de presentación:

- **UI/UX Premium:** Uso de `Next.js 16` con `TailwindCSS 4`, `shadcn/ui` y `lucide-react`. La estética (Dark Mode, tipografía Geist) transmite mucha profesionalidad.
- **Micro-interacciones:** Animaciones fluidas, *hover states* y *toast notifications* (ej. `zavu-toast.tsx`) mejoran significativamente la experiencia del usuario.
- **Componentización:** Código limpio y modular (componentes separados como `tender-card`, `agent-config`, `live-simulator`).
- **Simulador de Flujo:** Excelente para demostraciones en vivo sin depender de un backend (Hackathon Mode).

---

## ❌ 2. Brechas para un Frontend de Nivel Producción (Lo que falta)

Para que este frontend pueda ser desplegado para usuarios reales y cobrado como un SaaS (Software as a Service), se deben implementar las siguientes características técnicas:

### 2.1. Integración de API (Data Fetching)
- **Problema Actual:** Todos los datos (licitaciones, perfil, simulador) están *hardcodeados* en `lib/licitabot-data.ts`.
- **Implementación Faltante:**
  - Configurar clientes HTTP (como `axios` o el nativo `fetch` usando Server Components/Actions de Next.js).
  - Usar herramientas como `React Query` o `SWR` para manejar el caché, reintentos (retries) y revalidación de datos del backend (FastAPI).

### 2.2. Autenticación y Autorización reales
- **Problema Actual:** El componente `auth-screen.tsx` solo cambia la vista a "dashboard" mediante `e.preventDefault()`, sin validar credenciales.
- **Implementación Faltante:**
  - Integrar un proveedor de Auth (ej. `NextAuth.js`, `Supabase Auth`, o JWT nativo con el backend FastAPI).
  - Proteger rutas: Actualmente no existe un middleware para redirigir a `/auth` si el usuario no está logueado. (Falta `middleware.ts`).

### 2.3. Gestión de Estado Global y Persistencia
- **Problema Actual:** El estado del perfil (empresa, palabras clave, toggles de Zavu) vive en variables locales `useState` dentro de `agent-config.tsx`. Si el usuario recarga la página, pierde todo.
- **Implementación Faltante:**
  - Sincronizar el estado del usuario con la base de datos (Backend).
  - Guardar preferencias localmente (`localStorage` o estado global como `Zustand` / `Context API`) para mantener la sesión fluida.

### 2.4. Manejo de Errores y Estados de Carga (Loading States)
- **Problema Actual:** Los botones cambian a un estado de carga simulado por `setTimeout`, pero la aplicación no maneja errores de red.
- **Implementación Faltante:**
  - **Loading:** Agregar `loading.tsx` o `Suspense` boundaries de Next.js. Implementar *Skeleton Loaders* reales mientras se espera la respuesta de la API.
  - **Errores:** Crear `error.tsx` o usar *Error Boundaries* para capturar fallos de la API y mostrar un mensaje amigable al usuario (con Toasts de error), en lugar de romper la UI.

### 2.5. Enlaces (Links) y Accesibilidad (a11y)
- **Problema Actual:**
  - Enlaces "muertos": En el Footer (`landing-page.tsx`) y botones como "Ver en SICOES" usan `href="#"` o no tienen acción real asignada.
  - El componente `button.tsx` tiene reglas de accesibilidad (`aria-expanded`, `aria-invalid`), pero falta asegurar soporte de teclado en modales y menús.
- **Implementación Faltante:**
  - Reemplazar las anclas muertas con el componente `<Link>` de Next.js.
  - Conectar los enlaces de licitaciones a sus URLs reales en el SICOES.

### 2.6. Zavu API (El Core del Track)
- **Problema Actual:** El toast dice "Enviado a Zavu", pero no hay ninguna llamada de red (Fetch) real hacia la API de Zavu.
- **Implementación Faltante:**
  - Crear un *Server Action* o *API Route* en Next.js que reciba el payload y haga el POST a la API de Zavu usando la `NEXT_PUBLIC_ZAVU_API_KEY`, o idealmente delegar esto completamente al Backend FastAPI, mientras el frontend solo escucha vía WebSockets o Polling el estado de la notificación.

---

## 🎯 3. Plan de Acción (Siguientes Pasos)

Si el objetivo inmediato es **ganar el hackathon**, concéntrate solo en:
1. Conectar la autenticación básica.
2. Hacer una llamada real al backend FastAPI (para que el Agente y Zavu trabajen en vivo).

Si el objetivo es **lanzar la startup post-hackathon**, el orden de trabajo sugerido es:
1. **Día 1:** Configurar `NextAuth.js` (o Supabase) + `middleware.ts` para proteger el Dashboard.
2. **Día 2:** Reemplazar `licitabot-data.ts` con consultas reales a la API usando `TanStack Query`.
3. **Día 3:** Implementar gestión de estado con `Zustand` para el perfil del agente.
4. **Día 4:** Refinar estados de carga (Skeletons) y manejo global de errores (Toasts).
