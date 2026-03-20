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
    subtitle: "Microservicios · JPA · APIs REST",
    description: "Diseño de APIs REST con Spring Boot, arquitectura por capas, JPA & Hibernate, testing con JUnit y Mockito. Patrones de microservicios y comunicación entre servicios.",
    date: "2024",
  },
  {
    id: 4,
    title: "Arquitectura y despliegue",
    subtitle: "Docker · Kubernetes · CI/CD",
    description: "Contenedores Docker, orquestación con Kubernetes y pipelines CI/CD en entornos reales. Despliegue en VPS, Nginx como proxy inverso y gestión de procesos con PM2.",
    date: "2025",
  },
  {
    id: 5,
    title: "Ciclo Superior DAW",
    subtitle: "Formación oficial · En curso",
    description: "Cursando el Ciclo Superior de Desarrollo de Aplicaciones Web, consolidando fundamentos técnicos con formación oficial mientras aplico lo aprendido en proyectos reales.",
    date: "2026",
  },
  {
    id: 6,
    title: "Prácticas profesionales",
    subtitle: "Backend · Spring Boot · Docker · Kubernetes",
    description: "Desarrollo de microservicios con Spring Boot en un entorno empresarial real. Orquestación de contenedores con Kubernetes y despliegue con Docker dentro de un equipo de desarrollo profesional.",
    date: "Mar – Jun 2026",
  },
]
