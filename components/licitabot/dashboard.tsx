"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/licitabot/site-header"
import { AgentConfig } from "@/components/licitabot/agent-config"
import { TendersFeed } from "@/components/licitabot/tenders-feed"
import { LiveSimulator } from "@/components/licitabot/live-simulator"
import { ZavuToast } from "@/components/licitabot/zavu-toast"
import { INITIAL_TENDERS, SIMULATED_TENDER, type Tender } from "@/lib/licitabot-data"
import type { View } from "@/app/page"

interface DashboardProps {
  onNavigate: (view: View) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS)
  const [isSimulating, setIsSimulating] = useState(false)
  const [toast, setToast] = useState<Tender | null>(null)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)

    setTimeout(() => {
      const fresh: Tender = {
        ...SIMULATED_TENDER,
        id: `SICOES-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      }
      setTenders((prev) => [fresh, ...prev])
      setToast(fresh)
      setIsSimulating(false)
      setTimeout(() => setToast(null), 6000)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <SiteHeader onSimulate={handleSimulate} isSimulating={isSimulating} onLogout={() => onNavigate("landing")} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6">
          <LiveSimulator onSimulate={handleSimulate} isSimulating={isSimulating} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <AgentConfig />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">Licitaciones Detectadas</h2>
              <span className="text-xs text-zinc-500">Fuente: SICOES · actualizado en vivo</span>
            </div>
            <TendersFeed tenders={tenders} />
          </div>
        </div>
      </main>

      {toast && <ZavuToast tender={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
