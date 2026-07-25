"use client"

import {
  Terminal,
  ArrowRight,
  PlayCircle,
  ScanSearch,
  Bot,
  BellRing,
  ShieldCheck,
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
  },
  {
    icon: Bot,
    title: "Agentes Autónomos",
    body: "Filtrado de IA adaptado al rubro exacto de tu PyME. El agente entiende tus palabras clave y prioriza lo relevante.",
  },
  {
    icon: BellRing,
    title: "Alertas Zavu en Tiempo Real",
    body: "Notificaciones instantáneas directo a Telegram o SMS. Nunca más pierdas una convocatoria por revisar tarde.",
  },
]

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] bg-[#121216]">
              <Terminal className="h-4 w-4 text-zinc-200" strokeWidth={2.25} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-100">LicitaBot Bolivia</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Comenzar
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#27272a]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#27272a] bg-[#121216] px-3 py-1 text-xs font-medium text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-300" />
            </span>
            Agente monitoreando el SICOES en vivo
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl">
            Inteligencia artificial para dominar las licitaciones públicas de Bolivia.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
            Nuestro agente rastrea el SICOES 24/7, analiza cada convocatoria según el rubro de tu empresa y te avisa
            al instante por Zavu en Telegram o SMS.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 sm:w-auto"
            >
              Comenzar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#27272a] bg-[#121216] px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-zinc-50 sm:w-auto"
            >
              <PlayCircle className="h-4 w-4" />
              Ver demo en vivo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Todo el flujo de contrataciones estatales, automatizado.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-zinc-400">
            Del rastreo a la alerta, sin planillas ni revisiones manuales.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#27272a] bg-[#27272a] sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-4 bg-[#121216] p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272a] bg-[#09090b]">
                <Icon className="h-5 w-5 text-zinc-300" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#27272a] bg-[#121216] p-8 text-center sm:flex-row sm:text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b]">
              <ShieldCheck className="h-5 w-5 text-zinc-300" />
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
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#27272a]">
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
        <div className="border-t border-[#27272a] px-4 py-4 text-center text-xs text-zinc-600 sm:px-6">
          Hecho en Bolivia · Contrataciones estatales más transparentes para las PyMEs.
        </div>
      </footer>
    </div>
  )
}
