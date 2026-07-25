"use client"

import { useState } from "react"
import {
  Building2,
  Wallet,
  Clock,
  FileText,
  Send,
  Smartphone,
  ExternalLink,
  Sparkles,
  PenLine,
  ChevronDown,
} from "lucide-react"
import type { Tender } from "@/lib/licitabot-data"

const matchStyles: Record<Tender["matchLevel"], string> = {
  Alto: "border-zinc-500 bg-zinc-100 text-zinc-900",
  Medio: "border-[#27272a] bg-[#27272a] text-zinc-200",
  Bajo: "border-[#27272a] bg-[#09090b] text-zinc-500",
}

export function TenderCard({ tender }: { tender: Tender }) {
  const [showSummary, setShowSummary] = useState(false)

  return (
    <article className="group rounded-2xl border border-[#27272a] bg-[#121216] p-5 transition-colors hover:border-zinc-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-[#27272a] bg-[#09090b] px-2 py-0.5 font-mono text-[11px] text-zinc-500">
            {tender.id}
          </span>
          {tender.isNew && (
            <span className="rounded-md border border-zinc-600 bg-[#09090b] px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
              Nuevo
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${matchStyles[tender.matchLevel]}`}
        >
          <Sparkles className="h-3 w-3" />
          Match: {tender.matchScore}%
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug text-zinc-100 text-pretty">{tender.title}</h3>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Meta icon={Building2} text={tender.entity} />
        <Meta icon={Wallet} text={tender.budget} accent />
        <Meta icon={FileText} text={tender.modality} />
        <Meta icon={Clock} text={tender.deadline} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ZavuBadge tender={tender} />
        {tender.keywords.map((kw) => (
          <span key={kw} className="rounded-md border border-[#27272a] bg-[#09090b] px-2 py-0.5 text-[11px] text-zinc-500">
            #{kw}
          </span>
        ))}
      </div>

      {showSummary && (
        <div className="mt-4 flex gap-2.5 rounded-xl border border-[#27272a] bg-[#09090b] p-3.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p className="text-sm leading-relaxed text-zinc-300">{tender.aiSummary}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#27272a] pt-4">
        <button
          onClick={() => setShowSummary((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ver Resumen de IA
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showSummary ? "rotate-180" : ""}`} />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-50">
          <PenLine className="h-3.5 w-3.5" />
          Generar Borrador de Postulación
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-50">
          <ExternalLink className="h-3.5 w-3.5" />
          Ver en SICOES
        </button>
      </div>
    </article>
  )
}

function Meta({ icon: Icon, text, accent }: { icon: React.ElementType; text: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-zinc-600" />
      <span className={accent ? "font-semibold text-zinc-100" : "text-zinc-400"}>{text}</span>
    </div>
  )
}

function ZavuBadge({ tender }: { tender: Tender }) {
  if (tender.zavuStatus === "Pendiente") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#27272a] bg-[#09090b] px-2.5 py-1 text-[11px] font-medium text-zinc-500">
        <Clock className="h-3 w-3" />
        Pendiente de envío
      </span>
    )
  }

  const Icon = tender.zavuStatus === "Telegram" ? Send : Smartphone
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 bg-[#09090b] px-2.5 py-1 text-[11px] font-medium text-zinc-200">
      <Icon className="h-3 w-3" />
      Enviado a {tender.zavuStatus} {tender.zavuTime}
    </span>
  )
}
