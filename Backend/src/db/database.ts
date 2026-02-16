import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "..", "portfolio.db");

const db: DatabaseType = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      tech TEXT,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      ip TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      UNIQUE(project_id, ip)
    );

    CREATE TABLE IF NOT EXISTS followers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      page TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      ip TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedProjects();
}

function seedProjects() {
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number };
  if (count.c > 0) return;

  const insert = db.prepare(
    "INSERT INTO projects (title, description, image, tech, link) VALUES (?, ?, ?, ?, ?)"
  );

  const projects = [
    {
      title: "Tienda online",
      image: "/img/FotoTtienda.png",
      description: "Aplicación fullstack con Vite + Express + MySQL para gestionar tareas con autenticación.",
      tech: ["Vite", "Express", "MySQL", "Axios"],
      link: "https://proyectoreact-01-d72fe.web.app/",
    },
    {
      title: "gestor parking",
      image: "/img/Captura de pantalla 2026-02-16 001622.png",
      description: "Portfolio moderno construido con React, Tailwind y animaciones con Framer Motion.",
      tech: ["React", "Tailwind", "Framer Motion"],
      link: "https://moimenta84.github.io/Gestor-Parking/",
    },
    {
      title: "API de Productos",
      image: "https://picsum.photos/seed/api-productos/600/400",
      description: "API REST construida con Express y MySQL para gestionar productos, categorías y stock. Incluye validación con Zod y documentación con Swagger.",
      tech: ["Express", "MySQL", "Zod", "Swagger"],
      link: "https://github.com/iker/products-api",
    },
    {
      title: "Dashboard de Usuarios",
      image: "https://picsum.photos/seed/dashboard-users/600/400",
      description: "Aplicación frontend con Vite que consume una API propia. Incluye gráficos con Chart.js, filtros dinámicos y carga de datos desde JSON.",
      tech: ["Vite", "Chart.js", "Axios", "Sass"],
      link: "https://github.com/iker/users-dashboard",
    },
    {
      title: "Clon de Twitter (Mini)",
      image: "/img/projects/twitter-clone.png",
      description: "Mini clon de Twitter con Express, SQLite y autenticación JWT. Permite publicar tweets, likes y seguir usuarios.",
      tech: ["Express", "SQLite", "JWT", "Bcrypt"],
      link: "https://github.com/iker/twitter-mini",
    },
    {
      title: "Buscador de Películas",
      image: "/img/projects/movies.png",
      description: "Buscador de películas usando la API de OMDb. Incluye debounce con Lodash, almacenamiento local y diseño responsive.",
      tech: ["Vite", "Lodash", "LocalStorage", "CSS Modules"],
      link: "https://github.com/iker/movies-search",
    },
    {
      title: "Ecommerce Frontend",
      image: "/img/projects/ecommerce.png",
      description: "Frontend de ecommerce con carrito persistente, filtros avanzados y consumo de API. Animaciones suaves con GSAP.",
      tech: ["Vite", "GSAP", "Axios", "Sass"],
      link: "https://github.com/iker/ecommerce-frontend",
    },
  ];

  const insertMany = db.transaction((items: typeof projects) => {
    for (const p of items) {
      insert.run(p.title, p.description, p.image, JSON.stringify(p.tech), p.link);
    }
  });

  insertMany(projects);
  console.log("Seed: 7 proyectos insertados");
}

export default db;
