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
    description: "Aprendizaje autodidacta de JavaScript, lógica de programación, estructuras básicas, DOM y buenas prácticas iniciales aplicadas en proyectos personales.",
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
    subtitle: "En formación",
    description: "Primeros despliegues en entornos reales con Docker y CI/CD, foco en buenas prácticas, testing básico y preparación para trabajar en equipos de desarrollo.",
    date: "2025",
  },
]
