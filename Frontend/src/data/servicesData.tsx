import type { ReactNode } from "react"

import { Code, Palette, Rocket, Database } from "lucide-react"

export interface ServiceItem {
  id: number
  title: string
  description: string
  icon: ReactNode
}

export const serviceData: ServiceItem[] = [
  {
    id: 1,
    title: "Frontend",
    description: "React, TypeScript, Tailwind, animaciones y UX moderno",
    icon: <Palette size={28} />,
  },
  {
    id: 2,
    title: "Backend",
    description: "APIs REST, Node, Java, bases de datos y seguridad",
    icon: <Database size={28} />,
  }, 
  {
    id: 3,
    title: "Full Stack",
    description: "Arquitectura completa de aplicaciones web",
    icon: <Code size={28} />,
  },
  {
    id: 4,
    title: "Deploy & Performance",
    description: "Optimización, CI/CD, Docker y despliegue",
    icon: <Rocket size={28} />,
  },
]
