"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/licitabot/site-header"
import { AgentConfig } from "@/components/licitabot/agent-config"
import { ChatPanel } from "@/components/licitabot/chat-panel"
import { TendersFeed } from "@/components/licitabot/tenders-feed"
import { LiveSimulator } from "@/components/licitabot/live-simulator"
import { ZavuToast } from "@/components/licitabot/zavu-toast"
import { INITIAL_TENDERS, SIMULATED_TENDER, type Tender } from "@/lib/licitabot-data"

import { useAgentStore } from "@/lib/store"

export function Dashboard() {
  const { telegramOn, telegramId, smsOn, phone, company, keywords, selectedSectors } = useAgentStore()
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS)
  const [isSimulating, setIsSimulating] = useState(false)
  const [toast, setToast] = useState<Tender | null>(null)

  const handleSimulate = async () => {
    if (isSimulating) return
    setIsSimulating(true)

    const fresh: Tender = {
      ...SIMULATED_TENDER,
      id: `SICOES-2026-${Math.floor(1000 + Math.random() * 8999)}`,
    }

    try {
      // 1. Enviar Alertas por Zavu (usando el backend BFF)
      const text = `🚨 *Match detectado — LicitaBot*\n\n📋 *${fresh.title} — ${fresh.location}*\n💰 Presupuesto: Bs. ${fresh.amount.toLocaleString()}\n⏰ Cierre: ${fresh.deadline}\n\n🔗 Ver pliego: https://sicoes.gob.bo/`
      
      const sendPromises = []

      // Canal Telegram
      if (telegramOn && telegramId && telegramId.trim() !== "" && !telegramId.startsWith("@")) {
        sendPromises.push(
          fetch('/api/zavu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: telegramId, text, channel: "telegram" })
          }).catch(console.error)
        )
      }

      // Canal SMS
      if (smsOn && phone && phone.trim() !== "") {
        // Zavu SMS text should be shorter usually, but we use the same for the demo
        sendPromises.push(
          fetch('/api/zavu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: phone, text, channel: "sms" })
          }).catch(console.error)
        )
      }

      // Ejecutar ambos envíos en paralelo si existen
      if (sendPromises.length > 0) {
        await Promise.all(sendPromises)
      } else {
        console.warn("No hay canales configurados correctamente (ID de Telegram numérico o Teléfono válido).")
      }

      // 2. Actualizar UI
      setTenders((prev) => [fresh, ...prev])
      setToast(fresh)
      setTimeout(() => setToast(null), 6000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <SiteHeader onSimulate={handleSimulate} isSimulating={isSimulating} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6">
          <LiveSimulator onSimulate={handleSimulate} isSimulating={isSimulating} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 flex flex-col gap-6">
              <AgentConfig />
              <ChatPanel tenders={tenders} userProfile={{ company, keywords, selectedSectors }} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">Licitaciones Detectadas</h2>
              <span className="text-xs text-zinc-500">Fuente: SICOES · actualizado en vivo</span>
            </div>
            <TendersFeed tenders={tenders} isLoading={isSimulating} />
          </div>
        </div>
      </main>

      {toast && <ZavuToast tender={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
