export const projects = [
  {
    id: 1,
    title: "Ecommerce – App Full Stack",
    image: "/img/FotoTtienda.png",
    // gif: "/img/gifs/ecommerce.gif",
    description:
      "Gestión de productos, usuarios y pedidos con autenticación y CRUD completo. Simula un proyecto real de empresa con arquitectura clara y código mantenible.",
    tech: ["React", "Firebase", "MySQL"],
    link: "https://proyectoreact-01-d72fe.web.app/",
    category: "fullstack" as const,
  },
  {
    id: 2,
    title: "VetCare – Clínica Veterinaria",
    image: "/img/projects/petclinic.png",
    // gif: "/img/gifs/petclinic.gif",
    description:
      "Sitio web completo para clínica veterinaria. Presenta servicios, información del centro y sistema de atención al cliente con chat integrado. Desplegado en producción.",
    tech: ["Spring Boot", "Angular", "Docker", "Eureka"],
    link: "https://petclinic.ikermartinezdev.com",
    category: "fullstack" as const,
  },
  {
    id: 3,
    title: "API de Productos – Backend",
    image: "/img/projects/products-api.png",
    // gif: "/img/gifs/products-api.gif",
    description:
      "API REST con Spring Boot para gestión de productos, categorías y stock. Arquitectura por capas, validaciones, JPA & Hibernate y documentación con Swagger. Orientada a entornos enterprise.",
    tech: ["Spring Boot", "JPA", "MySQL", "Swagger"],
    link: "https://github.com/moimenta84/Auth-php-puro",
    category: "backend" as const,
  },
  {
    id: 4,
    title: "CRM / ERP – Plataforma",
    image: "/img/projects/users-dashboard.png",
    // gif: "/img/gifs/crm.gif",
    description:
      "Plataforma empresarial desplegada con Angular y Metronic. Backend en Laravel con API REST para gestión de clientes, recursos y procesos internos. Arquitectura modular orientada a entornos enterprise.",
    tech: ["Spring Boot", "Angular", "REST API", "MySQL"],
    link: "https://crm.ikermartinezdev.com",
    category: "fullstack" as const,
  },
  {
    id: 5,
    title: "IBM MQ – Mensajería Asíncrona",
    image: "/img/projects/ibmmq.png",
    description:
      "Sistema de cupones con mensajería asíncrona implementando las dos modalidades de IBM MQ: punto a punto y publicador/suscriptor. Desplegado con Docker.",
    tech: ["Spring Boot", "IBM MQ", "Docker"],
    link: "https://ibmmq.ikermartinezdev.com",
    category: "backend" as const,
  },
];
