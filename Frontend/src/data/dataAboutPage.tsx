export interface AboutItem {
  id: number
  title: string
  subtitle: string
  description: string
  date: string
}

export const dataAboutPage: AboutItem[] = [
  {
    id: 1,
    title: "Fundamentos de programación",
    subtitle: "JavaScript y lógica",
    description: "Primeros proyectos con JavaScript: lógica de programación, estructuras básicas, DOM y buenas prácticas aplicadas desde el inicio en proyectos propios.",
    date: "2022",
  },
  {
    id: 2,
    title: "Frontend con React",
    subtitle: "React & TypeScript",
    description: "Desarrollo de interfaces con React + TypeScript en proyectos propios: componentes reutilizables, manejo de estado, SPAs y estructura de proyectos mantenible.",
    date: "2023",
  },
  {
    id: 3,
    title: "Backend con Spring Boot",
    subtitle: "APIs REST y arquitectura",
    description: "Creación de APIs REST con Spring Boot en proyectos de práctica: autenticación básica, conexión a bases de datos relacionales y arquitectura por capas.",
    date: "2024",
  },
  {
    id: 4,
    title: "Arquitectura y despliegue",
    subtitle: "DevOps & Producción",
    description: "Despliegues en entornos reales con Docker, CI/CD y VPS. Foco en buenas prácticas, testing básico y preparación para trabajar en equipos de desarrollo profesional.",
    date: "2025",
  },
  {
    id: 5,
    title: "Ciclo Superior DAW",
    subtitle: "Formación oficial · En curso",
    description: "Cursando el Ciclo Superior de Desarrollo de Aplicaciones Web, consolidando fundamentos técnicos con formación oficial mientras aplico lo aprendido en proyectos reales.",
    date: "2026",
  },
]
