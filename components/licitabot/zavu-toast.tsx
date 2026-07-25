"use client"

import { Bell, Send, X, CheckCircle2 } from "lucide-react"
import type { Tender } from "@/lib/licitabot-data"

interface ZavuToastProps {
  tender: Tender
  onClose: () => void
}

export function ZavuToast({ tender, onClose }: ZavuToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:right-6 sm:top-6 animate-toast-in">
      <div className="animate-success-ring overflow-hidden rounded-2xl border border-emerald-500/40 bg-[#121216]/90 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
        {/* Header bar with green accent */}
        <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 bg-emerald-950/30 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <Send className="h-3.5 w-3.5 text-emerald-300" />
            <span className="text-xs font-semibold text-emerald-200">Zavu · Telegram</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Cerrar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/30">
            <Bell className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Alerta enviada exitosamente
            </p>
            <p className="text-xs leading-relaxed text-zinc-400">
              Nueva licitación encontrada y analizada por el Agente. Notificada vía Zavu a Telegram.
            </p>
            <div className="mt-1.5 rounded-lg border border-[#27272a] bg-[#09090b] p-2.5">
              <p className="text-xs font-medium leading-snug text-zinc-200">{tender.title}</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                {tender.budget} · Match: {tender.matchScore}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
