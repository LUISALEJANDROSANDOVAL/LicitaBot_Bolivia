"use client"

import { Terminal, Zap, LogOut, Loader2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

interface SiteHeaderProps {
  onSimulate: () => void
  isSimulating: boolean
}

export function SiteHeader({ onSimulate, isSimulating }: SiteHeaderProps) {
  const { data: session } = useSession()
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] glass">
      {/* Top highlight line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
            <Terminal className="h-5 w-5 text-zinc-200" strokeWidth={2.25} />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold leading-none tracking-tight text-zinc-100">LicitaBot Bolivia</h1>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-950/20 px-2 py-1 text-[11px] font-medium text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Sistema Activo
            </span>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <button
            onClick={onSimulate}
            disabled={isSimulating}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
              isSimulating
                ? "bg-zinc-800 text-zinc-400 border border-[#27272a]"
                : "bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-[0_0_16px_2px_rgba(250,250,250,0.08)]"
            }`}
          >
            {isSimulating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando alerta...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" strokeWidth={2.25} />
                Simular Alerta Zavu
              </>
            )}
          </button>

          {session?.user && (
            <div className="flex items-center gap-3 border-l border-white/[0.06] pl-3 ml-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-zinc-200">{session.user.name}</span>
                <span className="text-xs text-zinc-500">{session.user.email}</span>
              </div>
              {session.user.image ? (
                <img src={session.user.image} alt="Perfil" className="h-8 w-8 rounded-full border border-white/[0.08] ring-1 ring-white/[0.04]" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/[0.08]" />
              )}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-white/[0.06] hover:text-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
