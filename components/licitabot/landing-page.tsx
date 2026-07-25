"use client"

import {
  Terminal,
  ArrowRight,
  PlayCircle,
  ScanSearch,
  Bot,
  BellRing,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import type { View } from "@/app/page"

interface LandingPageProps {
  onNavigate: (view: View) => void
}

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Monitoreo Automático SICOES",
    body: "Extracción y análisis inteligente de contratos estatales publicados en el Sistema de Contrataciones Estatales, las 24 horas.",
    accent: "emerald",
  },
  {
    icon: Bot,
    title: "Agentes Autónomos",
    body: "Filtrado de IA adaptado al rubro exacto de tu PyME. El agente entiende tus palabras clave y prioriza lo relevante.",
    accent: "violet",
  },
  {
    icon: BellRing,
    title: "Alertas Zavu en Tiempo Real",
    body: "Notificaciones instantáneas directo a Telegram o SMS. Nunca más pierdas una convocatoria por revisar tarde.",
    accent: "amber",
  },
]

const ACCENT_STYLES: Record<string, { icon: string; border: string; glow: string }> = {
  emerald: {
    icon: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(52,211,153,0.15)]",
  },
  violet: {
    icon: "text-violet-400",
    border: "border-violet-500/20",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(139,92,246,0.15)]",
  },
  amber: {
    icon: "text-amber-400",
    border: "border-amber-500/20",
    glow: "hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.15)]",
  },
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b]">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] glass">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent"
        />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Terminal className="h-4 w-4 text-zinc-200" strokeWidth={2.25} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-100">LicitaBot Bolivia</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/auth"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:text-zinc-100 hover:bg-white/[0.04] sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-white hover:shadow-[0_0_16px_2px_rgba(250,250,250,0.08)] active:scale-[0.97]"
            >
              Comenzar
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        {/* Grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]"
        />
        {/* Radial glow orb */}
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-gradient-to-br from-zinc-500/10 via-transparent to-transparent blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-36">
          {/* Live badge */}
          <span className="animate-float inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Agente monitoreando el SICOES en vivo
          </span>

          <h1 className="animate-fade-slide-up mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl">
            Inteligencia artificial para{" "}
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              dominar las licitaciones
            </span>{" "}
            públicas de Bolivia.
          </h1>

          <p className="animate-fade-slide-up mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg" style={{ animationDelay: '100ms' }}>
            Nuestro agente rastrea el SICOES 24/7, analiza cada convocatoria según el rubro de tu empresa y te avisa
            al instante por Zavu en Telegram o SMS.
          </p>

          <div className="animate-fade-slide-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '200ms' }}>
            <Link
              href="/auth"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-100 px-7 py-4 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-white hover:shadow-[0_0_24px_4px_rgba(250,250,250,0.08)] active:scale-[0.97] sm:w-auto sm:py-3.5"
            >
              Comenzar ahora — Es gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-zinc-500/40 hover:bg-white/[0.06] hover:text-zinc-50 active:scale-[0.97] sm:w-auto sm:py-3.5"
            >
              <PlayCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
              Ver demo en vivo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
            <Sparkles className="h-5 w-5 text-zinc-300" />
          </div>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Todo el flujo de contrataciones estatales, automatizado.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-zinc-400">
            Del rastreo a la alerta, sin planillas ni revisiones manuales.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent }, i) => {
            const s = ACCENT_STYLES[accent]
            return (
              <div
                key={title}
                className={`animate-fade-slide-up group flex flex-col gap-4 rounded-2xl border ${s.border} bg-[#121216]/80 backdrop-blur-sm p-7 transition-all duration-300 ${s.glow} hover:border-opacity-40`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors group-hover:bg-white/[0.06]`}>
                  <Icon className={`h-5 w-5 ${s.icon} transition-transform group-hover:scale-110`} strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
              </div>
            )
          })}
        </div>

        {/* Trust banner */}
        <div className="animate-fade-slide-up mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.06] bg-[#121216]/80 backdrop-blur-sm p-8 text-center sm:flex-row sm:text-left" style={{ animationDelay: '400ms' }}>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Datos oficiales, cobertura nacional.</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                Conectado a las publicaciones del SICOES en toda Bolivia: ANPE, Licitación Pública Nacional y más.
              </p>
            </div>
          </div>
          <Link
            href="/auth"
            className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-white hover:shadow-[0_0_16px_2px_rgba(250,250,250,0.08)] active:scale-[0.97] sm:w-auto"
          >
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mt-auto border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Terminal className="h-4 w-4" />
            LicitaBot Bolivia · SICOES + Zavu
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 sm:justify-end">
            <a href="https://sicoes.gob.bo/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
              SICOES Oficial
            </a>
            <a href="https://zavu.dev" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
              Zavu API
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
              GitHub
            </a>
            <Link href="/auth" className="transition-colors hover:text-zinc-300">
              Acceder
            </Link>
          </div>
        </div>
        <div className="border-t border-white/[0.04] px-4 py-4 text-center text-xs text-zinc-600 sm:px-6">
          Hecho en Bolivia · Contrataciones estatales más transparentes para las PyMEs.
        </div>
      </footer>
    </div>
  )
}
