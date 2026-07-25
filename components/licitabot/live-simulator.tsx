"use client"

import { Zap, Loader2, Radio } from "lucide-react"

interface LiveSimulatorProps {
  onSimulate: () => void
  isSimulating: boolean
}

export function LiveSimulator({ onSimulate, isSimulating }: LiveSimulatorProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-[#121216] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b]">
            <Radio className="h-5 w-5 text-zinc-300" />
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSimulating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando y enviando...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" strokeWidth={2.25} />
              Disparar licitación de prueba ahora mismo
            </>
          )}
        </button>
      </div>
    </div>
  )
}
