"use client"

import { useState } from "react"
import { Terminal, Mail, Lock, Building2, ArrowLeft, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"

type Mode = "login" | "register"

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Usamos el login oficial de Google por NextAuth
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <Link
        href="/"
        className="relative mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="relative w-full max-w-md rounded-xl border border-[#27272a] bg-[#121216] p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b]">
            <Terminal className="h-5 w-5 text-zinc-200" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">LicitaBot Bolivia</h1>
            <p className="mt-1 text-sm text-zinc-400">Accede al panel de tu agente de licitaciones</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-7 grid grid-cols-2 gap-1 rounded-lg border border-[#27272a] bg-[#09090b] p-1">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-[#27272a] text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <Field icon={Building2} label="Nombre de la empresa o PyME">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Constructora e Ingeniería del Sur"
                required
                className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500"
              />
            </Field>
          )}

          <Field icon={Mail} label="Correo electrónico">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.bo"
              required
              className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500"
            />
          </Field>

          <Field icon={Lock} label="Contraseña">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500"
            />
          </Field>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Continuar con Google
              <ArrowRight className="h-4 w-4" />
            </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Al continuar aceptas los términos de servicio y la política de privacidad de LicitaBot.
        </p>
      </div>
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
        {label}
      </label>
      {children}
    </div>
  )
}
