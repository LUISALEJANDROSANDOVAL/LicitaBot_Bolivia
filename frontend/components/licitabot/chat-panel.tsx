"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Tender } from "@/lib/licitabot-data"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

interface UserProfile {
  company: string
  keywords: string[]
  selectedSectors: string[]
}

export function ChatPanel({ tenders, userProfile }: { tenders: Tender[], userProfile: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hola. Soy el Agente IA de LicitaBot. Puedo ayudarte a resumir licitaciones o responder dudas sobre contrataciones del estado (DS 0181). ¿En qué te ayudo hoy?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMessage },
    ])
    setIsLoading(true)

    try {
      // Creamos un contexto oculto con las licitaciones actuales en pantalla y el perfil del usuario
      const contextString = `CONTEXTO DEL SISTEMA (Oculto al usuario):
Tú eres el Consultor IA experto de la plataforma B2B "LicitaBot Bolivia". 

Perfil de la empresa con la que estás hablando:
- Nombre: ${userProfile.company}
- Sectores de interés: ${userProfile.selectedSectors.join(", ")}
- Palabras clave (Keywords): ${userProfile.keywords.join(", ")}

Licitaciones del SICOES actualmente visibles en su pantalla:
${tenders.slice(0, 10).map(t => `- ID: ${t.id} | Título: ${t.title} | Entidad: ${t.entity} | Presupuesto: Bs. ${t.amount} | Modalidad: ${t.type} | Match: ${t.matchScore}%`).join("\n")}

INSTRUCCIONES DE COMPORTAMIENTO:
1. Responde SIEMPRE de forma directa, ejecutiva y concisa (al grano). El usuario es un empresario ocupado.
2. NUNCA digas "no tengo acceso al portal", "no sería responsable", o des excusas. Si el usuario te pregunta por una licitación que está en la lista de arriba, asume que es real y usa esos datos para responderle con seguridad.
3. Si la licitación tiene bajo match (ej. Raciones alimentarias vs Obras Civiles), dile directamente en 1 o 2 oraciones por qué no le conviene perder tiempo en ella.
4. No uses formatos excesivamente largos. Párrafos cortos y balas rápidas.`

      const apiMessages = messages.slice(-4).map(m => ({
        role: m.role,
        content: m.content
      }))
      
      // Inyectamos el contexto de forma transparente
      apiMessages.push({ role: "system", content: contextString })
      apiMessages.push({ role: "user", content: userMessage })

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", content: data.reply },
        ])
      } else {
        throw new Error(data.error || "Error en la IA")
      }
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Hubo un error de conexión con mi servidor. Por favor, intenta de nuevo.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[450px] flex-col rounded-2xl border border-[#27272a] bg-[#121216] mt-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272a] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-950/20">
            <Bot className="h-4 w-4 text-emerald-400" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              Consultor IA <Sparkles className="h-3 w-3 text-emerald-400" />
            </h2>
            <p className="text-xs text-zinc-500">Impulsado por OpenRouter</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-slide-up`}
          >
            <div
              className={`flex max-w-[85%] items-start gap-2.5 rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-zinc-100 text-zinc-900 rounded-tr-sm"
                  : "bg-white/[0.03] border border-white/[0.06] text-zinc-300 rounded-tl-sm"
              }`}
            >
              {m.role === "assistant" && <Bot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              {m.role === "user" && <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-slide-up">
            <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-sm text-zinc-400">
              <Bot className="h-4 w-4 shrink-0 text-emerald-400" />
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="animate-pulse">Analizando SICOES...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-[#27272a] p-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre licitaciones..."
            className="w-full rounded-xl border border-[#27272a] bg-[#09090b] pl-4 pr-12 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500 focus:bg-[#121216]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 transition-all hover:bg-white active:scale-95 disabled:opacity-50 disabled:hover:bg-zinc-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
