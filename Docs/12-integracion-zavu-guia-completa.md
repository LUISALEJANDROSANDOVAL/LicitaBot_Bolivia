# 📲 Guía Completa de Integración Zavu para LicitaBot

> Documento de referencia para desarrollar la integración multicanal (Telegram + SMS) sin fricción.  
> **Fuente oficial:** [docs.zavu.dev](https://docs.zavu.dev) · **Dashboard:** [dashboard.zavu.dev](https://dashboard.zavu.dev)

---

## 📋 Tabla de Contenidos

1. [¿Qué es Zavu?](#1-qué-es-zavu)
2. [Rol de Zavu en LicitaBot](#2-rol-de-zavu-en-licitabot)
3. [Obtener tu API Key (paso a paso)](#3-obtener-tu-api-key-paso-a-paso)
4. [Configurar variables de entorno](#4-configurar-variables-de-entorno)
5. [Configurar el Dashboard (Senders y Canales)](#5-configurar-el-dashboard-senders-y-canales)
6. [Autenticación y seguridad](#6-autenticación-y-seguridad)
7. [API REST: enviar mensajes](#7-api-rest-enviar-mensajes)
8. [SDKs oficiales](#8-sdks-oficiales)
9. [Implementación en LicitaBot](#9-implementación-en-licitabot)
10. [Telegram vs SMS (decisiones clave)](#10-telegram-vs-sms-decisiones-clave)
11. [Webhooks y estado de entrega](#11-webhooks-y-estado-de-entrega)
12. [Flujo de demo en vivo](#12-flujo-de-demo-en-vivo)
13. [Errores comunes y troubleshooting](#13-errores-comunes-y-troubleshooting)
14. [Checklist rápido para empezar hoy](#14-checklist-rápido-para-empezar-hoy)
15. [Enlaces oficiales de referencia](#15-enlaces-oficiales-de-referencia)

---

## 1. ¿Qué es Zavu?

**Zavu** es una API unificada de mensajería multicanal. Con una sola integración puedes enviar:

| Canal | Ideal para |
|-------|------------|
| **SMS** | Alertas urgentes, alcance universal, sin internet |
| **WhatsApp** | Mensajes ricos, alto engagement |
| **Telegram** | Resúmenes largos con formato, bots, audiencia tech |
| **Email** | Contenido extenso, adjuntos |
| **Voice** | Alertas críticas por llamada |

### Cómo funciona (4 pasos)

```
Tu backend → POST /v1/messages → Zavu elige canal → Entrega al usuario → Webhook de confirmación
```

- **Smart routing:** Zavu puede elegir automáticamente el canal más barato/confiable (SMS ↔ WhatsApp).
- **Fallback:** Si WhatsApp falla, puede reintentar por SMS.
- **Base URL de la API:** `https://api.zavu.dev`

---

## 2. Rol de Zavu en LicitaBot

En LicitaBot, Zavu es la **última milla**: el agente de IA analiza licitaciones del SICOES y, cuando hay un *match*, dispara una alerta al bolsillo del usuario.

```
SICOES → Scraper → Agente IA (match?) → zavu_client → Telegram/SMS → Usuario PyME
```

### Canales que usamos

| Canal | Uso en LicitaBot | Destinatario (`to`) |
|-------|------------------|---------------------|
| **Telegram** | Resumen ejecutivo completo (título, presupuesto, plazos, enlace) | Chat ID numérico (ej. `123456789`) |
| **SMS** | Alerta corta de máxima prioridad | Teléfono E.164 (ej. `+59171234567`) |

### Requisitos del proyecto que cubre Zavu

| ID | Requisito |
|----|-----------|
| RF-02 | Usuario configura canal preferido (Telegram ID o teléfono SMS) |
| RF-08 | Agente invoca `zavu_client` vía Function Calling |
| RF-09 | Despacho multicanal según preferencia del usuario |
| RF-10 | Notificación incluye enlace CTA al pliego SICOES |
| RF-11 | Botón "Simular Alerta Zavu" dispara el flujo completo en demo |

---

## 3. Obtener tu API Key (paso a paso)

Esta es la parte que desbloquea todo el desarrollo.

### Paso 1 — Crear cuenta

1. Ve a [dashboard.zavu.dev](https://dashboard.zavu.dev)
2. Regístrate o inicia sesión (cuenta del hackathon / equipo)

### Paso 2 — Crear la API Key

1. En el dashboard: **Settings → API Keys**
2. Clic en **Create API Key**
3. Ponle un nombre descriptivo, por ejemplo:
   - `LicitaBot Dev` (desarrollo)
   - `LicitaBot Demo` (presentación en vivo)
4. **Copia la key inmediatamente** — solo se muestra una vez

### Tipos de keys

| Prefijo | Entorno | Comportamiento |
|---------|---------|----------------|
| `zv_test_` | Sandbox | Simula envíos, **no entrega mensajes reales**. Ideal para desarrollo. |
| `zv_live_` | Producción | Envía mensajes reales. Tiene costo. Usar en la demo final. |

> **Recomendación para el hackathon:** Desarrolla con `zv_test_`. Cambia a `zv_live_` el día de la demo para que suene el teléfono de verdad.

### Paso 3 — Verificar que la key funciona

```bash
curl https://api.zavu.dev/v1/account/me \
  -H "Authorization: Bearer TU_API_KEY_AQUI"
```

Respuesta esperada: metadata del proyecto, team y permisos de la key.

### Paso 4 — Primer mensaje de prueba

Con key de **test**:

```bash
curl -X POST https://api.zavu.dev/v1/messages \
  -H "Authorization: Bearer zv_test_XXXXXXXX" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+59171234567",
    "text": "Hola desde LicitaBot — prueba Zavu",
    "channel": "sms"
  }'
```

Respuesta esperada: `202 Accepted` con un `message.id` (ej. `msg_abc123`).

Con key de **live** y Telegram configurado:

```bash
curl -X POST https://api.zavu.dev/v1/messages \
  -H "Authorization: Bearer zv_live_XXXXXXXX" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "123456789",
    "channel": "telegram",
    "text": "🚨 LicitaBot: Match detectado en SICOES"
  }'
```

---

## 4. Configurar variables de entorno

### ⚠️ Regla de oro

**Nunca expongas la API key en el frontend.** No uses `NEXT_PUBLIC_ZAVU_API_KEY`.  
La key va **solo en el servidor** (FastAPI o API Route de Next.js).

### Backend FastAPI (recomendado para LicitaBot)

Crea `backend/.env`:

```env
# Zavu — usar ZAVUDEV_API_KEY (nombre que lee el SDK oficial)
ZAVUDEV_API_KEY=zv_test_xxxxxxxxxxxxxxxxxxxxxxxx

# Opcional: sender específico si tienes varios
ZAVU_SENDER_ID=snd_abc123

# Datos de demo
DEMO_TELEGRAM_CHAT_ID=123456789
DEMO_SMS_PHONE=+59171234567
```

### Next.js (si haces proxy desde el frontend)

Crea `.env.local` en la raíz del proyecto:

```env
# Solo server-side — NO usar prefijo NEXT_PUBLIC_
ZAVUDEV_API_KEY=zv_test_xxxxxxxxxxxxxxxxxxxxxxxx
ZAVU_SENDER_ID=snd_abc123
```

Agrega a `.gitignore`:

```gitignore
.env
.env.local
.env*.local
backend/.env
```

### Deploy (Render / Railway / Vercel)

Configura las mismas variables en el panel de **Environment Variables** del servicio.  
En Vercel: Project → Settings → Environment Variables.

---

## 5. Configurar el Dashboard (Senders y Canales)

Un **Sender** en Zavu es el perfil de envío: agrupa número de teléfono, bot de Telegram, webhooks, etc.

### 5.1 Crear un Sender

1. Dashboard → **Senders** → **Create Sender**
2. Nombre sugerido: `LicitaBot Alertas`
3. Marca **Set as default** si es tu único sender

### 5.2 Canal SMS

**Requisito:** Número con capacidad SMS.

1. Dashboard → **Phone Numbers** → **Purchase** (el primer número US es gratis por team)
2. Asigna el número al sender
3. SMS se activa automáticamente al asignar un número compatible

Para Bolivia (`+591`), verifica disponibilidad en el dashboard. Si no hay números locales, puedes:
- Enviar SMS internacionales desde un número comprado en Zavu
- Usar Telegram como canal principal en la demo (gratis)

### 5.3 Canal Telegram

1. En Telegram, busca [@BotFather](https://t.me/BotFather)
2. Envía `/newbot` y sigue las instrucciones
3. Copia el **bot token** (ej. `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Dashboard → **Senders** → tu sender → pestaña **Channels** → **Add Telegram**
5. Pega el token → **Verify** → **Save**

Zavu registra el webhook automáticamente. No necesitas configurar nada manual en Telegram.

### 5.4 Obtener el Chat ID de Telegram (obligatorio)

Telegram **no usa números de teléfono**. El usuario debe escribirle primero a tu bot.

**Flujo para la demo:**

1. Abre tu bot en Telegram (busca el `@username` que creaste)
2. Envía `/start` o cualquier mensaje
3. Ve al **Inbox** de Zavu o revisa el webhook `message.inbound`
4. Copia el `from` / `chat.id` (número, ej. `987654321`)
5. Guárdalo en el perfil del usuario en LicitaBot

> En `agent-config.tsx` el placeholder dice `@usuario o chat ID`, pero la API de Zavu **solo acepta el chat ID numérico**, no el `@username`.

---

## 6. Autenticación y seguridad

### Header obligatorio

```http
Authorization: Bearer zv_live_xxxxxxxxxxxxxxxx
Content-Type: application/json
```

### Headers opcionales

| Header | Para qué |
|--------|----------|
| `Zavu-Sender` | Usar un sender distinto al default (`snd_abc123`) |
| `Idempotency-Key` | Evitar duplicados si hay reintentos de red |

### Permisos de la key

| Permiso | Descripción |
|---------|-------------|
| `*` | Acceso total |
| `messages:send` | Enviar mensajes |
| `messages:read` | Leer estado e historial |
| `contacts:read/write` | Gestionar contactos |

Para LicitaBot basta con `messages:send` (o `*` en desarrollo).

### Patrón BFF (Backend-for-Frontend)

```
[Browser] → POST /api/notify → [Tu servidor con ZAVUDEV_API_KEY] → [api.zavu.dev]
```

**Nunca:**

```typescript
// ❌ MAL — expone la key en el bundle del cliente
const res = await fetch('https://api.zavu.dev/v1/messages', {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ZAVU_API_KEY}` }
})
```

### Errores de autenticación

| HTTP | Código | Causa |
|------|--------|-------|
| 401 | `unauthorized` | Key ausente o inválida |
| 403 | `forbidden` | Key sin permisos suficientes |
| 429 | `rate_limit_exceeded` | Demasiadas requests — espera y reintenta |

---

## 7. API REST: enviar mensajes

### Endpoint principal

```http
POST https://api.zavu.dev/v1/messages
```

### Campos del body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `to` | string | ✅ | Teléfono E.164, email, o chat ID de Telegram |
| `text` | string | ✅* | Cuerpo del mensaje |
| `channel` | string | ❌ | `sms`, `telegram`, `whatsapp`, `email`, `auto` |
| `messageType` | string | ❌ | `text` (default), `template`, `image`, etc. |
| `idempotencyKey` | string | ❌ | Clave única para evitar duplicados |
| `content` | object | ❌ | Para templates y media |

### Ejemplos para LicitaBot

#### Alerta SMS (corta)

```json
{
  "to": "+59171234567",
  "channel": "sms",
  "text": "URGENTE LicitaBot: Licitación SICOES $2M en Santa Cruz. Revisa Telegram para detalles.",
  "idempotencyKey": "licitacion-2026-001-sms"
}
```

#### Alerta Telegram (resumen completo)

```json
{
  "to": "987654321",
  "channel": "telegram",
  "text": "🚨 *Match detectado — LicitaBot*\n\n📋 *Mantenimiento de Escuelas — Santa Cruz*\n💰 Presupuesto: Bs. 2.400.000\n⏰ Cierre: 15/08/2026\n\n🔗 Ver pliego: https://sicoes.gob.bo/...",
  "idempotencyKey": "licitacion-2026-001-telegram"
}
```

#### Consultar estado de un mensaje

```http
GET https://api.zavu.dev/v1/messages/msg_abc123
Authorization: Bearer zv_live_xxx
```

| Status | Significado |
|--------|-------------|
| `queued` | Aceptado, pendiente |
| `sent` | Enviado al carrier/canal |
| `delivered` | Entregado |
| `failed` | Falló |

### Límites diarios

| Cuenta | Límite |
|--------|--------|
| Sin KYC | 200 mensajes/canal/día |
| Con KYC verificado | 10.000 mensajes/canal/día |

Suficiente para el hackathon. Completa KYC si necesitas más volumen.

---

## 8. SDKs oficiales

### Python (backend FastAPI — recomendado)

```bash
pip install zavudev
```

```python
import os
from zavudev import Zavudev

zavu = Zavudev(api_key=os.environ["ZAVUDEV_API_KEY"])

result = zavu.messages.send(
    to="+59171234567",
    text="Alerta LicitaBot: nueva licitación detectada",
    channel="sms",
    idempotency_key="lic-001-sms",
)

print(result.message.id)      # msg_xxx
print(result.message.status)  # queued
```

### TypeScript (API Route Next.js)

```bash
pnpm add @zavudev/sdk
```

```typescript
import Zavudev from '@zavudev/sdk'

const zavu = new Zavudev() // lee ZAVUDEV_API_KEY del entorno

const result = await zavu.messages.send({
  to: '987654321',
  channel: 'telegram',
  text: 'Alerta LicitaBot...',
})
```

### cURL (pruebas rápidas)

Siempre útil para validar la key antes de escribir código:

```bash
curl -X POST https://api.zavu.dev/v1/messages \
  -H "Authorization: Bearer $ZAVUDEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"987654321","channel":"telegram","text":"Test LicitaBot"}'
```

---

## 9. Implementación en LicitaBot

### 9.1 Arquitectura objetivo

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Next.js UI     │────▶│  FastAPI Backend │────▶│  api.zavu.dev│
│  (dashboard)    │     │  zavu_client.py  │     │  Telegram/SMS│
└─────────────────┘     └──────────────────┘     └─────────────┘
         │                       │
         │                       ▼
         │               ┌──────────────────┐
         └──────────────▶│  Agente IA       │
                         │  (function call) │
                         └──────────────────┘
```

### 9.2 Módulo `zavu_client.py` (FastAPI)

Crea en `backend/zavu_client.py`:

```python
import os
import logging
from typing import Literal

from zavudev import Zavudev

logger = logging.getLogger(__name__)

Channel = Literal["telegram", "sms"]

class ZavuClient:
    def __init__(self) -> None:
        api_key = os.environ.get("ZAVUDEV_API_KEY")
        if not api_key:
            raise RuntimeError("ZAVUDEV_API_KEY no configurada")
        self._client = Zavudev(api_key=api_key)
        self._sender = os.environ.get("ZAVU_SENDER_ID")

    def enviar_alerta(
        self,
        *,
        to: str,
        text: str,
        channel: Channel,
        idempotency_key: str | None = None,
    ) -> dict:
        kwargs: dict = {
            "to": to,
            "text": text,
            "channel": channel,
        }
        if idempotency_key:
            kwargs["idempotency_key"] = idempotency_key
        if self._sender:
            kwargs["zavu_sender"] = self._sender

        try:
            result = self._client.messages.send(**kwargs)
            return {
                "ok": True,
                "message_id": result.message.id,
                "status": result.message.status,
                "channel": channel,
            }
        except Exception as exc:
            logger.exception("Error enviando alerta Zavu")
            return {"ok": False, "error": str(exc), "channel": channel}


def formatear_alerta_telegram(
    titulo: str,
    presupuesto: str,
    fecha_limite: str,
    enlace: str,
    resumen: str,
) -> str:
    return (
        f"🚨 *Match detectado — LicitaBot*\n\n"
        f"📋 *{titulo}*\n"
        f"💰 Presupuesto: {presupuesto}\n"
        f"⏰ Cierre: {fecha_limite}\n\n"
        f"{resumen}\n\n"
        f"🔗 Ver pliego: {enlace}"
    )


def formatear_alerta_sms(titulo: str, monto: str, ciudad: str) -> str:
    # SMS: máx ~160 chars para 1 segmento
    return f"URGENTE LicitaBot: {titulo[:40]} — {monto} en {ciudad}. Revisa Telegram."
```

### 9.3 Function Calling del agente

Herramienta que el LLM invoca cuando hay match:

```python
# En agent.py — definición de herramienta para el LLM
tools = [
    {
        "type": "function",
        "function": {
            "name": "enviar_alerta_zavu",
            "description": "Envía alerta al usuario cuando una licitación es un match de alto valor",
            "parameters": {
                "type": "object",
                "properties": {
                    "canal": {"type": "string", "enum": ["telegram", "sms"]},
                    "destinatario": {"type": "string", "description": "Chat ID o teléfono E.164"},
                    "mensaje": {"type": "string", "description": "Texto de la alerta"},
                    "licitacion_id": {"type": "string"},
                },
                "required": ["canal", "destinatario", "mensaje", "licitacion_id"],
            },
        },
    }
]
```

Handler:

```python
def handle_enviar_alerta_zavu(args: dict) -> dict:
    client = ZavuClient()
    return client.enviar_alerta(
        to=args["destinatario"],
        text=args["mensaje"],
        channel=args["canal"],
        idempotency_key=f"lic-{args['licitacion_id']}-{args['canal']}",
    )
```

### 9.4 API Route en Next.js (alternativa / proxy)

Si aún no tienes FastAPI conectado, crea `app/api/zavu/notify/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import Zavudev from '@zavudev/sdk'

const zavu = new Zavudev()

export async function POST(request: Request) {
  const { to, text, channel, idempotencyKey } = await request.json()

  if (!to || !text || !channel) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const result = await zavu.messages.send({
    to,
    text,
    channel,
    idempotencyKey,
  })

  return NextResponse.json({
    ok: true,
    messageId: result.message.id,
    status: result.message.status,
  })
}
```

Llamada desde el simulador del dashboard:

```typescript
async function enviarAlertaZavu(payload: {
  to: string
  text: string
  channel: 'telegram' | 'sms'
}) {
  const res = await fetch('/api/zavu/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
```

### 9.5 Estado actual del frontend

| Componente | Estado | Acción pendiente |
|------------|--------|------------------|
| `agent-config.tsx` | UI lista (Telegram ID + teléfono) | Persistir en BD, validar E.164 y chat ID |
| `zavu-toast.tsx` | Simula envío | Conectar a API real y mostrar `message_id` |
| `live-simulator.tsx` | Botón demo | Llamar backend → Zavu con datos de prueba |
| `tender-card.tsx` | Badge "Enviado a Zavu" | Actualizar según respuesta real de la API |

---

## 10. Telegram vs SMS (decisiones clave)

### Comparativa

| Aspecto | Telegram | SMS |
|---------|----------|-----|
| Destinatario | Chat ID numérico | Teléfono E.164 (`+591...`) |
| Costo | Gratis* | Por mensaje |
| Longitud | Sin límite práctico | 160 chars (GSM-7) por segmento |
| Primer contacto | Usuario debe escribir al bot primero | Puedes enviar directo (con consentimiento) |
| Formato | Markdown, emojis, links | Texto plano |
| Demo hackathon | ⭐ Ideal (mensaje rico, gratis) | ⭐ Ideal para "urgente" en el pitch |

*Cuenta contra el límite mensual del plan, pero sin costo por mensaje de Telegram.

### Estrategia recomendada para LicitaBot

1. **Telegram** → resumen ejecutivo completo con enlace al pliego
2. **SMS** → ping corto: *"URGENTE: licitación detectada. Revisa Telegram."*
3. En la demo en vivo, dispara **Telegram primero** (más impacto visual en pantalla del teléfono)

### Formato E.164 para Bolivia

```
+591 7XX XXX XXX  →  +5917XXXXXXX  (sin espacios)
```

---

## 11. Webhooks y estado de entrega

Opcional para v1, útil para marcar licitaciones como "notificadas" en la BD.

### Configurar webhook

1. Dashboard → **Senders** → tu sender → **Webhooks**
2. URL: `https://tu-backend.com/webhooks/zavu`
3. Eventos relevantes:
   - `message.delivered` — mensaje entregado
   - `message.failed` — falló el envío
   - `message.inbound` — usuario respondió (útil para capturar chat ID)

### Verificar firma (seguridad)

Zavu firma los webhooks. Verifica el header de firma antes de procesar.  
Docs: [guides/receiving-messages/security](https://docs.zavu.dev/guides/receiving-messages/security)

### Handler mínimo (FastAPI)

```python
@app.post("/webhooks/zavu")
async def zavu_webhook(request: Request):
    payload = await request.json()
    event_type = payload.get("type")

    if event_type == "message.delivered":
        message_id = payload["data"]["message"]["id"]
        # actualizar BD: licitacion.zavu_status = "delivered"
        pass

    return {"ok": True}
```

---

## 12. Flujo de demo en vivo

Secuencia para el pitch (ver también `Docs/03-flujo-demo.md`):

```
1. Configurar perfil "ConstruBol" (palabras clave + Telegram chat ID)
2. Clic en "Simular Alerta Zavu" en el dashboard
3. Backend: scraper inyecta licitación → agente evalúa → MATCH
4. Agente invoca enviar_alerta_zavu → POST api.zavu.dev
5. 📱 Suena el teléfono con mensaje real de Telegram
6. Jurado ve el resumen + enlace al pliego SICOES
```

### Payload de prueba hardcodeado (fallback)

Si el scraper o el LLM fallan a mitad de demo, ten un endpoint `/demo/alerta-zavu` que envíe directo:

```python
@app.post("/demo/alerta-zavu")
def demo_alerta():
    client = ZavuClient()
    chat_id = os.environ["DEMO_TELEGRAM_CHAT_ID"]
    return client.enviar_alerta(
        to=chat_id,
        channel="telegram",
        text=formatear_alerta_telegram(
            titulo="Mantenimiento de Escuelas — Santa Cruz",
            presupuesto="Bs. 2.400.000",
            fecha_limite="15/08/2026",
            enlace="https://sicoes.gob.bo/...",
            resumen="Obra de mantenimiento que coincide con tu perfil de construcción.",
        ),
        idempotency_key="demo-pitch-001",
    )
```

---

## 13. Errores comunes y troubleshooting

### API Key

| Problema | Solución |
|----------|----------|
| `401 unauthorized` | Key mal copiada, expirada o revocada. Crea una nueva en el dashboard. |
| Key no funciona en producción | Verifica que uses `zv_live_` y no `zv_test_` para envíos reales. |
| Variable de entorno no leída | Reinicia el servidor después de cambiar `.env`. Verifica el nombre: `ZAVUDEV_API_KEY`. |

### Telegram

| Problema | Solución |
|----------|----------|
| `Can't message user` | El usuario no ha escrito al bot. Pídele que envíe `/start`. |
| Chat ID incorrecto | Usa el ID numérico del webhook/inbox, no el `@username`. |
| Bot token inválido | Regenera con `/token` en BotFather y actualiza en Zavu. |

### SMS

| Código | Descripción | Solución |
|--------|-------------|----------|
| `30003` | Destino inalcanzable | Teléfono apagado o inválido |
| `30005` | Destino desconocido | Número no existe — verifica E.164 |
| `30006` | Es teléfono fijo | SMS solo a móviles |
| `30007` | Rechazado por carrier | Revisa contenido del mensaje |

### LicitaBot específico

| Problema | Solución |
|----------|----------|
| Toast dice "Enviado" pero no llega nada | Hoy es mock — conectar API real (ver sección 9) |
| `NEXT_PUBLIC_ZAVU_API_KEY` en docs viejos | **No usar.** Migrar a server-side only. |
| Demo falla sin internet | Endpoint `/demo/alerta-zavu` como fallback local |

---

## 14. Checklist rápido para empezar hoy

### Fase A — Cuenta y key (15 min)

- [ ] Crear cuenta en [dashboard.zavu.dev](https://dashboard.zavu.dev)
- [ ] Crear API key `zv_test_...` para desarrollo
- [ ] Verificar con `curl /v1/account/me`
- [ ] Guardar key en `backend/.env` como `ZAVUDEV_API_KEY`
- [ ] Confirmar que `.env` está en `.gitignore`

### Fase B — Canales (20 min)

- [ ] Crear Sender "LicitaBot Alertas" y marcarlo default
- [ ] Crear bot en @BotFather y conectar Telegram al sender
- [ ] Enviar `/start` al bot y anotar tu chat ID
- [ ] (Opcional) Comprar número SMS y asignarlo al sender

### Fase C — Código (30 min)

- [ ] `pip install zavudev` en el backend
- [ ] Implementar `zavu_client.py` (sección 9.2)
- [ ] Probar envío manual con curl o script Python
- [ ] Conectar botón "Simular Alerta Zavu" al backend
- [ ] Cambiar a `zv_live_` y probar en teléfono real antes del pitch

### Fase D — Demo (10 min)

- [ ] Ensayar flujo completo: simular → agente → Telegram suena
- [ ] Tener endpoint `/demo/alerta-zavu` como plan B
- [ ] Verificar chat ID del presentador en el perfil de demo

---

## 15. Enlaces oficiales de referencia

### Esenciales

| Recurso | URL |
|---------|-----|
| Documentación | https://docs.zavu.dev |
| Índice completo (para LLMs) | https://docs.zavu.dev/llms.txt |
| Dashboard | https://dashboard.zavu.dev |
| OpenAPI Spec | https://docs.zavu.dev/openapi.json |
| Status | https://status.zavu.dev |

### Guías clave

| Tema | URL |
|------|-----|
| Introducción | https://docs.zavu.dev/introduction |
| Quickstart | https://docs.zavu.dev/quickstart |
| **Autenticación / API Keys** | https://docs.zavu.dev/authentication |
| Enviar mensaje (API) | https://docs.zavu.dev/api-reference/send-a-message |
| SMS | https://docs.zavu.dev/guides/sending-messages/sms |
| Telegram Setup | https://docs.zavu.dev/guides/telegram/setup |
| Telegram Overview | https://docs.zavu.dev/guides/telegram/overview |
| Agregar canales | https://docs.zavu.dev/guides/senders/adding-channels |
| Webhooks | https://docs.zavu.dev/guides/receiving-messages/webhooks |
| Python SDK | https://docs.zavu.dev/sdks/python/messages |
| TypeScript SDK | https://docs.zavu.dev/sdks/typescript/messages |

### Docs internas de LicitaBot relacionadas

| Doc | Contenido |
|-----|-----------|
| `Docs/01-arquitectura.md` | `zavu_client.py` en la estructura del repo |
| `Docs/03-flujo-demo.md` | Flujo de demo en vivo con Zavu |
| `Docs/05-requisitos-funcionales.md` | RF-08 a RF-11 (notificaciones) |
| `Docs/07-casos-de-uso.md` | CU-03 Notificación de Oportunidad |
| `Docs/09-plan-de-trabajo.md` | Tarea P3: integrar Zavu |
| `Docs/10-auditoria-frontend-profesional.md` | Pendiente: llamada real a Zavu |
| `Docs/11-vision-empresarial-y-tracks.md` | Estrategia del Desafío Zavu |

---

## Resumen ejecutivo

1. **Crea tu API key** en [dashboard.zavu.dev](https://dashboard.zavu.dev) → Settings → API Keys.
2. **Guárdala en el servidor** como `ZAVUDEV_API_KEY` — nunca en el frontend.
3. **Configura Telegram** (bot + chat ID) — es el canal más fácil para la demo.
4. **Implementa `zavu_client.py`** y conéctalo al agente vía Function Calling.
5. **Prueba con `zv_test_`**, cambia a `zv_live_` el día del pitch.

Con la key configurada y un `curl` exitoso a `/v1/messages`, ya puedes avanzar con el resto del proyecto sin bloqueos.
