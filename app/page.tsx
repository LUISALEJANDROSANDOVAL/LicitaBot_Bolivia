"use client"

import { useState } from "react"
import { LandingPage } from "@/components/licitabot/landing-page"
import { AuthScreen } from "@/components/licitabot/auth-screen"
import { Dashboard } from "@/components/licitabot/dashboard"

export type View = "landing" | "auth" | "dashboard"

export default function Page() {
  const [view, setView] = useState<View>("landing")

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-200">
      {view === "landing" && <LandingPage onNavigate={setView} />}
      {view === "auth" && <AuthScreen onNavigate={setView} />}
      {view === "dashboard" && <Dashboard onNavigate={setView} />}
    </div>
  )
}
