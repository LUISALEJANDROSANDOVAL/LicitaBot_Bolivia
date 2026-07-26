"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/licitabot/site-header"
import { AgentConfig } from "@/components/licitabot/agent-config"
import { ChatPanel } from "@/components/licitabot/chat-panel"
import { TendersFeed } from "@/components/licitabot/tenders-feed"
import { LiveSimulator } from "@/components/licitabot/live-simulator"
import { ZavuToast } from "@/components/licitabot/zavu-toast"
import { INITIAL_TENDERS, type Tender } from "@/lib/licitabot-data"
import { useAgentStore } from "@/lib/store"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function Dashboard() {
  // Estado del store para el ChatPanel y los canales de Zavu
  const { company, keywords, selectedSectors } = useAgentStore()

  const [tenders, setTenders] = useState<Tender[]>([])
  const [isLoadingFeed, setIsLoadingFeed] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const [toast, setToast] = useState<Tender | null>(null)

  // --- A. Obtener Licitaciones Reales al cargar la página ---
  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoadingFeed(true)
      try {
        const res = await fetch(`${API_URL}/api/licitaciones`)
        if (res.ok) {
          const data = await res.json() as Tender[]
          // Si el backend devuelve datos, usarlos; si está vacío, mostrar datos de demo
          setTenders(data.length > 0 ? data : INITIAL_TENDERS)
        } else {
          console.warn("[LicitaBot] Backend no disponible, usando datos de demostración.")
          setTenders(INITIAL_TENDERS)
        }
      } catch {
        console.warn("[LicitaBot] No se pudo conectar al backend. Mostrando datos de demo.")
        setTenders(INITIAL_TENDERS)
      } finally {
        setIsLoadingFeed(false)
      }
    }

    fetchTenders()
  }, [])

  // --- C. Botón Simular: dispara el pipeline completo en el backend (Scraper → IA → Zavu) ---
  const handleSimulate = async () => {
    if (isSimulating) return
    setIsSimulating(true)

    try {
      // El backend orquesta TODO: genera la licitación, la evalúa con IA y envía la alerta por Zavu
      const res = await fetch(`${API_URL}/api/demo/simular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        const freshTender: Tender = await res.json()
        setTenders((prev) => [freshTender, ...prev])
        setToast(freshTender)
        setTimeout(() => setToast(null), 6000)
      } else {
        const error = await res.json()
        console.error("[LicitaBot] Error al simular:", error.detail)
        alert(`⚠️ ${error.detail || "Error al simular. ¿Configuraste y guardaste tu perfil primero?"}`)
      }
    } catch {
      console.error("[LicitaBot] Backend no disponible para la simulación.")
      alert("⚠️ El backend no está corriendo. Inicia con: uvicorn main:app --reload (en /backend2)")
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
            {/* Columna izquierda: Configuración del Agente + Chat de IA (Sandoval) */}
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
            <TendersFeed tenders={tenders} isLoading={isLoadingFeed || isSimulating} />
          </div>
        </div>
      </main>

      {toast && <ZavuToast tender={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
