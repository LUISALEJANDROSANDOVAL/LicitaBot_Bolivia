"use client"

import { useState } from "react"
import { Building2, Tags, KeyRound, Send, Smartphone, CheckCircle2, Settings, X } from "lucide-react"
import { SECTORS } from "@/lib/licitabot-data"

export function AgentConfig() {
  const [company, setCompany] = useState("Constructora e Ingeniería del Sur")
  const [keywords, setKeywords] = useState<string[]>(["cemento", "asfalto", "infraestructura"])
  const [keywordInput, setKeywordInput] = useState("")
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["Obras civiles"])
  const [telegramOn, setTelegramOn] = useState(true)
  const [smsOn, setSmsOn] = useState(false)
  const [telegramId, setTelegramId] = useState("@constructora_sur")
  const [phone, setPhone] = useState("+591 70012345")
  const [saved, setSaved] = useState(false)

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    )
  }

  const addKeyword = () => {
    const value = keywordInput.trim().toLowerCase()
    if (value && !keywords.includes(value)) {
      setKeywords((prev) => [...prev, value])
    }
    setKeywordInput("")
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="rounded-2xl border border-[#27272a] bg-[#121216]">
      <div className="flex items-center gap-2.5 border-b border-[#27272a] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272a] bg-[#09090b]">
          <Settings className="h-4 w-4 text-zinc-300" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Perfil del Agente</h2>
          <p className="text-xs text-zinc-500">Configura las preferencias de tu PyME</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <Field icon={Building2} label="Nombre de la Empresa / PyME">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ej. Constructora e Ingeniería del Sur"
            className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500"
          />
        </Field>

        <Field icon={Tags} label="Sector / Rubro">
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => {
              const active = selectedSectors.includes(sector)
              return (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-zinc-500 bg-zinc-100 text-zinc-900"
                      : "border-[#27272a] bg-[#09090b] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {sector}
                </button>
              )
            })}
          </div>
        </Field>

        <Field icon={KeyRound} label="Palabras Clave">
          <div className="flex flex-wrap gap-2 rounded-lg border border-[#27272a] bg-[#09090b] p-2">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-md border border-[#27272a] bg-[#121216] px-2 py-1 text-xs font-medium text-zinc-300"
              >
                {kw}
                <button
                  onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))}
                  className="text-zinc-500 transition-colors hover:text-zinc-200"
                  aria-label={`Quitar ${kw}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  addKeyword()
                }
              }}
              placeholder="Agregar palabra..."
              className="min-w-24 flex-1 bg-transparent px-1 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
            />
          </div>
        </Field>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-zinc-400">Canales de notificación Zavu</span>

          <ChannelToggle
            icon={Send}
            title="Telegram"
            active={telegramOn}
            onToggle={() => setTelegramOn((v) => !v)}
          >
            <input
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              disabled={!telegramOn}
              placeholder="@usuario o chat ID"
              className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500 disabled:opacity-50"
            />
          </ChannelToggle>

          <ChannelToggle
            icon={Smartphone}
            title="SMS"
            active={smsOn}
            onToggle={() => setSmsOn((v) => !v)}
          >
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!smsOn}
              placeholder="+591 7XXXXXXX"
              className="w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-500 disabled:opacity-50"
            />
          </ChannelToggle>
        </div>

        <button
          onClick={handleSave}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            saved
              ? "border border-[#27272a] bg-[#09090b] text-zinc-300"
              : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Agente activado correctamente
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Guardar y Activar Agente
            </>
          )}
        </button>
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

function ChannelToggle({
  icon: Icon,
  title,
  active,
  onToggle,
  children,
}: {
  icon: React.ElementType
  title: string
  active: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-xl border p-3 transition-colors ${
        active ? "border-zinc-600 bg-[#09090b]" : "border-[#27272a] bg-[#09090b]/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${active ? "text-zinc-200" : "text-zinc-500"}`} />
          <span className={`text-sm font-medium ${active ? "text-zinc-100" : "text-zinc-400"}`}>{title}</span>
        </div>
        <button
          role="switch"
          aria-checked={active}
          aria-label={`Activar ${title}`}
          onClick={onToggle}
          className={`relative h-5 w-9 rounded-full transition-colors ${active ? "bg-zinc-100" : "bg-[#27272a]"}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full transition-transform ${
              active ? "translate-x-4 bg-zinc-900" : "translate-x-0.5 bg-zinc-500"
            }`}
          />
        </button>
      </div>
      {children}
    </div>
  )
}
