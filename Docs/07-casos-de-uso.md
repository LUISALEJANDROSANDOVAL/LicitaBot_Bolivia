# 🧑‍💼 Casos de Uso del Sistema

*Documento de especificación de Casos de Uso para LicitaBot (SICOES-Agent).*

Este documento describe las interacciones principales entre los actores (usuarios y sistemas externos) y nuestra plataforma, definiendo el flujo de los eventos para alcanzar un objetivo específico.

## 🎭 Actores del Sistema
1. **Usuario (PyME/Consultor):** La persona o empresa interesada en recibir alertas sobre licitaciones.
2. **Agente de IA (Sistema):** El "Cerebro" central de LicitaBot que evalúa y toma decisiones.
3. **Portal SICOES (Sistema Externo):** La fuente de verdad de las contrataciones gubernamentales.
4. **Zavu (Sistema Externo):** El proveedor de la API multicanal para envío de notificaciones (Telegram/SMS).

---

## 📌 CU-01: Configuración de Perfil Comercial
**Actor Principal:** Usuario (PyME)
**Descripción:** El usuario ingresa a la plataforma para configurar qué tipo de licitaciones le interesan.

* **Precondiciones:** El usuario tiene acceso a la interfaz web o al bot inicial.
* **Flujo Principal (Camino Feliz):**
  1. El usuario accede a la sección "Mi Perfil".
  2. El sistema solicita información clave: Rubro, palabras clave (ej. "Hardware, Servidores, La Paz") y canal de notificación (Número para SMS o @usuario para Telegram).
  3. El usuario guarda los datos.
  4. El sistema almacena el perfil en la base de datos (SQLite/PostgreSQL) y confirma la configuración exitosa.

---

## 📌 CU-02: Búsqueda y Evaluación Cognitiva (Automático)
**Actor Principal:** Agente de IA (Sistema)
**Descripción:** El sistema extrae datos del SICOES y el LLM evalúa si son relevantes para los perfiles registrados.

* **Precondiciones:** Existen perfiles configurados (CU-01) y hay nuevas publicaciones en SICOES.
* **Flujo Principal:**
  1. El *Scraper* del sistema extrae la lista de licitaciones publicadas hoy en SICOES.
  2. El sistema envía las licitaciones en formato JSON al Agente de IA.
  3. El Agente de IA cruza los requisitos de la licitación con el perfil de un usuario específico.
  4. El Agente "razona" y determina que **HAY MATCH** (coincidencia alta).
  5. El Agente formatea un resumen ejecutivo de la licitación y desencadena el CU-03.
* **Flujo Alternativo (No hay Match):**
  - Si el Agente determina en el paso 3 que la licitación no es relevante (ej. el presupuesto es muy bajo o no es el rubro), la descarta silenciosamente y no interrumpe al usuario.

---

## 📌 CU-03: Notificación de Oportunidad
**Actor Principal:** Agente de IA (Sistema) / Zavu (Sistema Externo)
**Descripción:** El sistema alerta proactivamente al usuario sobre una oportunidad de negocio detectada.

* **Precondiciones:** El Agente de IA detectó un "Match" (CU-02).
* **Flujo Principal:**
  1. El Agente invoca la herramienta programada (*Function Calling*) llamada `enviar_alerta_zavu`.
  2. El backend envía el *payload* (texto del resumen y contacto del usuario) a la API de Zavu.
  3. Zavu enruta el mensaje y lo entrega instantáneamente vía Telegram o SMS al dispositivo móvil del usuario.
  4. El sistema registra en la base de datos que la alerta fue entregada exitosamente.

---

## 📌 CU-04: Revisión y Postulación (Usuario)
**Actor Principal:** Usuario (PyME)
**Descripción:** El usuario interactúa con la alerta recibida para ver los detalles y postularse.

* **Precondiciones:** El usuario recibió exitosamente el mensaje de Zavu (CU-03).
* **Flujo Principal:**
  1. El usuario lee el resumen ejecutivo de la licitación en su teléfono (Telegram/SMS).
  2. El usuario hace clic en el enlace directo proporcionado en el mensaje.
  3. El enlace redirige al usuario directamente al Cuaderno de Especificaciones Técnicas (DBC) oficial de la licitación.
  4. El usuario obtiene toda la información necesaria para preparar su propuesta y postular con el Estado, ahorrando horas de búsqueda manual.
