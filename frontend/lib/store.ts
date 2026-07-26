import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AgentState {
  company: string
  keywords: string[]
  selectedSectors: string[]
  telegramOn: boolean
  smsOn: boolean
  telegramId: string
  phone: string
  setCompany: (v: string) => void
  setKeywords: (v: string[]) => void
  addKeyword: (kw: string) => void
  removeKeyword: (kw: string) => void
  toggleSector: (sector: string) => void
  setTelegramOn: (v: boolean) => void
  setSmsOn: (v: boolean) => void
  setTelegramId: (v: string) => void
  setPhone: (v: string) => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      company: "Constructora e Ingeniería del Sur",
      keywords: ["cemento", "asfalto", "infraestructura"],
      selectedSectors: ["Obras civiles"],
      telegramOn: true,
      smsOn: false,
      telegramId: "",
      phone: "",
      setCompany: (v) => set({ company: v }),
      setKeywords: (v) => set({ keywords: v }),
      addKeyword: (kw) => set((state) => ({ keywords: [...state.keywords, kw] })),
      removeKeyword: (kw) => set((state) => ({ keywords: state.keywords.filter((k) => k !== kw) })),
      toggleSector: (sector) => set((state) => ({
        selectedSectors: state.selectedSectors.includes(sector)
          ? state.selectedSectors.filter((s) => s !== sector)
          : [...state.selectedSectors, sector]
      })),
      setTelegramOn: (v) => set({ telegramOn: v }),
      setSmsOn: (v) => set({ smsOn: v }),
      setTelegramId: (v) => set({ telegramId: v }),
      setPhone: (v) => set({ phone: v }),
    }),
    {
      name: 'agent-config-storage',
    }
  )
)
