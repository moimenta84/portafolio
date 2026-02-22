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
      city TEXT,
      region TEXT,
      country TEXT,
      org TEXT,
      is_company INTEGER DEFAULT 0,
      timezone TEXT,
      isp TEXT,
      as_number TEXT,
      duration_seconds INTEGER,
      referrer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cv_downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
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

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      unsubscribe_token TEXT,
      city TEXT,
      region TEXT,
      country TEXT,
      source TEXT DEFAULT 'follow',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migraciones: añadir columnas nuevas si no existen (producción)
  const migrate = (sql: string) => { try { db.exec(sql); } catch {} };
  migrate("ALTER TABLE visits ADD COLUMN city TEXT");
  migrate("ALTER TABLE visits ADD COLUMN region TEXT");
  migrate("ALTER TABLE visits ADD COLUMN country TEXT");
  migrate("ALTER TABLE visits ADD COLUMN org TEXT");
  migrate("ALTER TABLE visits ADD COLUMN is_company INTEGER DEFAULT 0");
  migrate("ALTER TABLE visits ADD COLUMN timezone TEXT");
  migrate("ALTER TABLE visits ADD COLUMN isp TEXT");
  migrate("ALTER TABLE visits ADD COLUMN as_number TEXT");
  migrate("ALTER TABLE visits ADD COLUMN duration_seconds INTEGER");
  migrate("ALTER TABLE visits ADD COLUMN referrer TEXT");
  migrate("CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at)");
  migrate(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    unsubscribe_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  migrate("ALTER TABLE subscribers ADD COLUMN unsubscribe_token TEXT");
  migrate("ALTER TABLE subscribers ADD COLUMN city TEXT");
  migrate("ALTER TABLE subscribers ADD COLUMN region TEXT");
  migrate("ALTER TABLE subscribers ADD COLUMN country TEXT");
  migrate("ALTER TABLE subscribers ADD COLUMN source TEXT DEFAULT 'follow'");
  migrate(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    ip TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  migrate("CREATE INDEX IF NOT EXISTS idx_events_type_created ON events(type, created_at)");
  migrate(`CREATE TABLE IF NOT EXISTS newsletter_sends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total INTEGER NOT NULL,
    sent INTEGER NOT NULL,
    errors INTEGER NOT NULL
  )`);
  migrate("ALTER TABLE visits ADD COLUMN device TEXT DEFAULT 'desktop'");
  migrate(`CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  migrate("CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC)");

  // Eliminar proyectos placeholder con links falsos (github.com/iker/*)
  try {
    db.prepare("DELETE FROM projects WHERE link LIKE 'https://github.com/iker/%'").run();
  } catch {}
  migrate(`CREATE TABLE IF NOT EXISTS newsletter_opens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    send_id INTEGER NOT NULL,
    subscriber_id INTEGER NOT NULL,
    opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(send_id, subscriber_id)
  )`);

  seedProjects();
  seedReviews();
}

function seedReviews() {
  const count = db.prepare("SELECT COUNT(*) as c FROM reviews").get() as { c: number };
  if (count.c > 0) return;

  db.prepare("INSERT INTO reviews (name, comment, rating, ip) VALUES (?, ?, ?, ?)").run(
    "Alejandra Espinosa",
    "Un gran desarrollador fullstack. Nada le frena. Literalmente un CRACK!!",
    5,
    "seed"
  );
}

function seedProjects() {
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number };
  if (count.c > 0) return;

  const insert = db.prepare(
    "INSERT INTO projects (title, description, image, tech, link) VALUES (?, ?, ?, ?, ?)"
  );

  const projects = [
    {
      title: "Ecommerce – App Full Stack",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
      description: "Gestión de productos, usuarios y pedidos con autenticación y CRUD completo. Simula un proyecto real de empresa con arquitectura clara y código mantenible.",
      tech: ["React", "TypeScript", "Spring Boot", "MySQL"],
      link: "https://proyectoreact-01-d72fe.web.app/",
    },
    {
      title: "Gestor de Parking",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&h=400&fit=crop&auto=format",
      description: "Sistema para la gestión de plazas, usuarios y disponibilidad en tiempo real. Orientado a practicar lógica de negocio, arquitectura frontend modular y consumo de API.",
      tech: ["React", "Tailwind", "API REST"],
      link: "https://moimenta84.github.io/Gestor-Parking/",
    },
    {
      title: "API de Productos – Backend",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format",
      description: "API REST para gestión de productos, categorías y stock. Estructura por capas, validaciones y documentación de endpoints. Simula un backend de entorno real de empresa.",
      tech: ["Spring Boot", "MySQL", "Swagger"],
      link: "https://github.com/moimenta84/Auth-php-puro",
    },
    {
      title: "CRM / ERP – Consumo de API",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format",
      description: "Interfaz frontend para gestión de clientes y recursos consumiendo API externa. Buenas prácticas en React, separación de componentes y arquitectura escalable.",
      tech: ["React", "TypeScript", "Chart.js"],
      link: "https://github.com/moimenta84/Crm-platform",
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
