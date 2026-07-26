import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `Eres LicitaBot, un agente de inteligencia artificial especializado en licitaciones públicas de Bolivia (SICOES).

Tu rol:
- Analizar licitaciones y determinar si son relevantes para el perfil de la empresa del usuario.
- Generar resúmenes ejecutivos claros y concisos de cada convocatoria.
- Responder preguntas sobre contrataciones estatales bolivianas (D.S. 0181, NB-SABS).
- Ayudar a redactar borradores de propuestas y cartas de presentación.

Reglas:
- Responde siempre en español boliviano.
- Sé conciso pero completo. Usa viñetas cuando sea apropiado.
- Cuando analices una licitación, incluye: título, entidad, presupuesto, plazo, y tu evaluación de match.
- Si no tienes información suficiente, dilo honestamente.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing messages array' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API Key is not configured' }, { status: 500 })
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'LicitaBot Bolivia',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('OpenRouter error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'OpenRouter API error' },
        { status: res.status }
      )
    }

    const reply = data.choices?.[0]?.message?.content || 'Sin respuesta del modelo.'

    return NextResponse.json({
      reply,
      model: data.model,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Chat API route error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
