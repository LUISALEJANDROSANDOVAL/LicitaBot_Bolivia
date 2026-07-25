"use client"

import { Bell, Send, X, CheckCircle2 } from "lucide-react"
import type { Tender } from "@/lib/licitabot-data"

interface ZavuToastProps {
  tender: Tender
  onClose: () => void
}

export function ZavuToast({ tender, onClose }: ZavuToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-top-4 fade-in duration-300 sm:right-6 sm:top-6">
      <div className="overflow-hidden rounded-2xl border border-[#27272a] bg-[#121216] shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between gap-2 border-b border-[#27272a] bg-[#09090b] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Send className="h-3.5 w-3.5 text-zinc-300" />
            <span className="text-xs font-semibold text-zinc-200">Zavu · Telegram</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 transition-colors hover:text-zinc-200"
            aria-label="Cerrar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b]">
            <Bell className="h-5 w-5 text-zinc-300" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-zinc-300" />
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
