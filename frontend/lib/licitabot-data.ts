export type MatchLevel = "Alto" | "Medio" | "Bajo"

export type ZavuChannel = "Telegram" | "SMS" | "Pendiente"

export interface Tender {
  id: string
  title: string
  entity: string
  budget: string
  modality: string
  deadline: string
  matchScore: number
  matchLevel: MatchLevel
  keywords: string[]
  isNew: boolean
  zavuStatus: ZavuChannel
  zavuTime: string | null
  aiSummary: string
}

export const SECTORS = [
  "Obras civiles",
  "Proveeduría tecnológica",
  "Salud",
  "Alimentación",
  "Transporte y logística",
  "Consultoría",
] as const

export const INITIAL_TENDERS: Tender[] = [
  {
    id: "SICOES-2026-0451",
    title: "Adquisición de material de construcción para red vial urbana",
    entity: "Gobierno Autónomo Municipal de Santa Cruz de la Sierra",
    budget: "Bs. 350.000",
    modality: "ANPE - Apoyo Nacional a la Producción y Empleo",
    deadline: "5 días restantes",
    matchScore: 95,
    matchLevel: "Alto",
    keywords: ["cemento", "asfalto", "infraestructura"],
    isNew: true,
    zavuStatus: "Telegram",
    zavuTime: "hace 2 min",
    aiSummary:
      "Licitación de alto potencial. Requiere cemento portland, asfalto y agregados. El presupuesto y rubro coinciden con tu perfil de obras civiles. Plazo de presentación ajustado.",
  },
  {
    id: "SICOES-2026-0448",
    title: "Contratación de servicios de pavimentación flexible Av. Cañoto",
    entity: "Administradora Boliviana de Carreteras (ABC)",
    budget: "Bs. 1.240.000",
    modality: "Licitación Pública Nacional",
    deadline: "12 días restantes",
    matchScore: 88,
    matchLevel: "Alto",
    keywords: ["asfalto", "pavimentación", "infraestructura"],
    isNew: true,
    zavuStatus: "SMS",
    zavuTime: "hace 18 min",
    aiSummary:
      "Contrato de gran envergadura para pavimentación flexible. Exige experiencia comprobada en obras viales mayores a Bs. 1M. Coincidencia fuerte con tus palabras clave de asfalto e infraestructura.",
  },
  {
    id: "SICOES-2026-0439",
    title: "Suministro de equipos de cómputo para hospitales de tercer nivel",
    entity: "Servicio Departamental de Salud (SEDES) - Cochabamba",
    budget: "Bs. 620.000",
    modality: "ANPE",
    deadline: "8 días restantes",
    matchScore: 62,
    matchLevel: "Medio",
    keywords: ["tecnología", "equipos"],
    isNew: false,
    zavuStatus: "Telegram",
    zavuTime: "hace 1 h",
    aiSummary:
      "Coincidencia media. La licitación es de proveeduría tecnológica, ligeramente fuera de tu rubro principal de obras civiles. Considera solo si diversificas hacia el sector salud.",
  },
  {
    id: "SICOES-2026-0431",
    title: "Construcción de muro de contención y drenaje pluvial Zona Norte",
    entity: "Gobierno Autónomo Municipal de La Paz",
    budget: "Bs. 890.000",
    modality: "Licitación Pública Nacional",
    deadline: "15 días restantes",
    matchScore: 91,
    matchLevel: "Alto",
    keywords: ["cemento", "infraestructura", "drenaje"],
    isNew: false,
    zavuStatus: "Pendiente",
    zavuTime: null,
    aiSummary:
      "Obra civil de alto potencial que requiere hormigón armado y sistemas de drenaje. Coincide con tu especialidad. Aún no notificada por Zavu — actívala para recibir la alerta.",
  },
  {
    id: "SICOES-2026-0425",
    title: "Provisión de raciones alimentarias para unidades educativas",
    entity: "Gobierno Autónomo Municipal de El Alto",
    budget: "Bs. 210.000",
    modality: "ANPE",
    deadline: "6 días restantes",
    matchScore: 34,
    matchLevel: "Bajo",
    keywords: ["alimentación"],
    isNew: false,
    zavuStatus: "Pendiente",
    zavuTime: null,
    aiSummary:
      "Coincidencia baja. Corresponde al sector alimentación, fuera de tu perfil configurado de obras civiles. El agente lo filtró como prioridad secundaria.",
  },
]

export const SIMULATED_TENDER: Tender = {
  id: "SICOES-2026-0460",
  title: "Rehabilitación de puente vehicular sobre el río Piraí",
  entity: "Gobierno Autónomo Departamental de Santa Cruz",
  budget: "Bs. 2.100.000",
  modality: "Licitación Pública Nacional",
  deadline: "20 días restantes",
  matchScore: 98,
  matchLevel: "Alto",
  keywords: ["cemento", "infraestructura", "estructuras"],
  isNew: true,
  zavuStatus: "Telegram",
  zavuTime: "ahora mismo",
  aiSummary:
    "¡Máxima coincidencia! Proyecto estructural de gran presupuesto que encaja perfectamente con tu perfil de obras civiles e infraestructura. El agente recomienda postular con prioridad.",
}
