"use client"

import { Zap, Loader2, Radio } from "lucide-react"

interface LiveSimulatorProps {
  onSimulate: () => void
  isSimulating: boolean
}

export function LiveSimulator({ onSimulate, isSimulating }: LiveSimulatorProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#121216]/80 backdrop-blur-sm p-5 transition-all duration-300 hover:border-zinc-700">
      {/* Subtle gradient accent along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b]">
            <Radio className={`h-5 w-5 transition-colors ${isSimulating ? "text-zinc-100 animate-pulse" : "text-zinc-300"}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Simulador de Alerta Zavu</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
              Prueba el flujo completo: detección en SICOES, análisis del Agente IA y notificación multicanal.
            </p>
          </div>
        </div>

        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className={`relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
            isSimulating
              ? "bg-zinc-800 text-zinc-400 border border-[#27272a]"
              : "bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-[0_0_20px_4px_rgba(250,250,250,0.08)] animate-pulse-glow"
          }`}
        >
          {isSimulating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando y enviando...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" strokeWidth={2.25} />
              Disparar licitación de prueba
            </>
          )}
        </button>
      </div>
    </div>
  )
}
