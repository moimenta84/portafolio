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
    title: "Inicio en desarrollo",
    subtitle: "JavaScript y fundamentos",
    description: "Variables, funciones, DOM, eventos y primeros scripts dinámicos.",
    date: "2022",
  },
  {
    id: 2,
    title: "Frontend moderno",
    subtitle: "React & TypeScript",
    description: "Componentes, estado, props, hooks, SPAs y tipado estático.",
    date: "2023",
  },
  {
    id: 3,
    title: "Desarrollo full stack",
    subtitle: "Backend y bases de datos",
    description: "APIs REST, Node, PHP, Java, bases de datos relacionales y control de autenticación.",
    date: "2024",
  },
  {
    id: 4,
    title: "Arquitectura y despliegue",
    subtitle: "Calidad y producción",
    description: "Docker, CI/CD, buenas prácticas, testing, optimización y proyectos reales.",
    date: "2025",
  },
]
