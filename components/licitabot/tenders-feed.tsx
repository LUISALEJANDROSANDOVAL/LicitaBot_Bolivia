"use client"

import { useMemo, useState } from "react"
import { Inbox, Filter, Send } from "lucide-react"
import type { Tender } from "@/lib/licitabot-data"
import { TenderCard } from "./tender-card"

type TabKey = "todas" | "ia" | "zavu"

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "todas", label: "Todas las Alertas", icon: Inbox },
  { key: "ia", label: "Filtradas por IA", icon: Filter },
  { key: "zavu", label: "Enviadas a Zavu", icon: Send },
]

export function TendersFeed({ tenders }: { tenders: Tender[] }) {
  const [tab, setTab] = useState<TabKey>("todas")

  const filtered = useMemo(() => {
    if (tab === "ia") return tenders.filter((t) => t.matchScore >= 80)
    if (tab === "zavu") return tenders.filter((t) => t.zavuStatus !== "Pendiente")
    return tenders
  }, [tab, tenders])

  const counts = useMemo(
    () => ({
      todas: tenders.length,
      ia: tenders.filter((t) => t.matchScore >= 80).length,
      zavu: tenders.filter((t) => t.zavuStatus !== "Pendiente").length,
    }),
    [tenders],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#27272a] bg-[#121216] p-1.5">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:bg-[#27272a] hover:text-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                  active ? "bg-zinc-900/10 text-zinc-900" : "bg-[#27272a] text-zinc-400"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#27272a] bg-[#121216] px-6 py-16 text-center">
            <Inbox className="h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-400">No hay licitaciones en esta categoría todavía.</p>
          </div>
        ) : (
          filtered.map((tender) => <TenderCard key={tender.id} tender={tender} />)
        )}
      </div>
    </div>
  )
}
