"use client"

import { Terminal, Zap, LogOut } from "lucide-react"

interface SiteHeaderProps {
  onSimulate: () => void
  isSimulating: boolean
  onLogout: () => void
}

export function SiteHeader({ onSimulate, isSimulating, onLogout }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#27272a] bg-[#121216]">
            <Terminal className="h-5 w-5 text-zinc-200" strokeWidth={2.25} />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold leading-none tracking-tight text-zinc-100">LicitaBot Bolivia</h1>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#27272a] bg-[#121216] px-2 py-1 text-[11px] font-medium text-zinc-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-300" />
              </span>
              Sistema Activo
            </span>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <button
            onClick={onSimulate}
            disabled={isSimulating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Zap className="h-4 w-4" strokeWidth={2.25} />
            {isSimulating ? "Enviando alerta..." : "Simular Alerta Zavu"}
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#27272a] bg-[#121216] px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
