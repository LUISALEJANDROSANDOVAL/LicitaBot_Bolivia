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

const matchStyles: Record<Tender["matchLevel"], { badge: string; glow: string }> = {
  Alto: {
    badge: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
    glow: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_-4px_rgba(52,211,153,0.12)]",
  },
  Medio: {
    badge: "border-amber-500/40 bg-amber-950/30 text-amber-300",
    glow: "hover:border-amber-500/20 hover:shadow-[0_0_20px_-4px_rgba(251,191,36,0.08)]",
  },
  Bajo: {
    badge: "border-[#27272a] bg-[#09090b] text-zinc-500",
    glow: "hover:border-zinc-700 hover:shadow-[0_0_20px_-4px_rgba(161,161,170,0.06)]",
  },
}

export function TenderCard({ tender, index = 0 }: { tender: Tender; index?: number }) {
  const [showSummary, setShowSummary] = useState(false)
  const styles = matchStyles[tender.matchLevel]

  return (
    <article
      className={`group rounded-2xl border border-[#27272a] bg-[#121216]/80 backdrop-blur-sm p-5 transition-all duration-300 card-glow animate-fade-slide-up ${styles.glow}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-[#27272a] bg-[#09090b] px-2 py-0.5 font-mono text-[11px] text-zinc-500">
            {tender.id}
          </span>
          {tender.isNew && (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
              Nuevo
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${styles.badge}`}
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
        <div className="mt-4 flex gap-2.5 rounded-xl border border-[#27272a] bg-[#09090b] p-3.5 animate-fade-slide-up">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p className="text-sm leading-relaxed text-zinc-300">{tender.aiSummary}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#27272a] pt-4">
        <button
          onClick={() => setShowSummary((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-900 transition-all duration-200 hover:bg-white hover:shadow-[0_0_12px_2px_rgba(250,250,250,0.06)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ver Resumen de IA
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showSummary ? "rotate-180" : ""}`} />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:text-zinc-50 hover:bg-zinc-900">
          <PenLine className="h-3.5 w-3.5" />
          Generar Borrador de Postulación
        </button>
        <a 
          href="https://sicoes.gob.bo/portal/contrataciones/busqueda/convocatorias.php"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:text-zinc-50 hover:bg-zinc-900"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver en SICOES
        </a>
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
    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
      <Icon className="h-3 w-3" />
      Enviado a {tender.zavuStatus} {tender.zavuTime}
    </span>
  )
}
