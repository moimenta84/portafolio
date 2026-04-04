import { useState } from "react";
import { ExternalLink, Award, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackCertView } from "../../services/api";

interface Cert {
  name: string;
  category: Category;
  file: string;
  path?: string;
}

type Category = "Todos" | "Java" | "Microservicios" | "Testing" | "DevOps" | "Python" | "React";

const CATEGORIES: Category[] = ["Todos", "React", "Java", "Microservicios", "Testing", "DevOps", "Python"];

const CATEGORY_STYLES: Record<string, string> = {
  React:          "bg-cyan-400/10   text-cyan-400   border-cyan-400/20",
  Java:           "bg-amber-400/10  text-amber-400  border-amber-400/20",
  Microservicios: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  Testing:        "bg-green-400/10  text-green-400  border-green-400/20",
  DevOps:         "bg-blue-400/10   text-blue-400   border-blue-400/20",
  Python:         "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
};

const CERTS: Cert[] = [
  { name: "React — Fundación Adecco (270h)", category: "React", file: "DIPLOMA MARTINEZ VELASCO IKER.pdf", path: "/Certificados/DIPLOMA%20MARTINEZ%20VELASCO%20IKER.pdf" },
  { name: "Java Fundamentals",               category: "Java",           file: "Getting Started with Java_ The Fundamentals of Java Programming.pdf" },
  { name: "Java OOP",                        category: "Java",           file: "Java Certified Foundations Associate_ Object-oriented Programming.pdf" },
  { name: "JPA & Hibernate",                 category: "Java",           file: "Java Persistence API_ Getting Started With JPA & Hibernate.pdf" },
  { name: "Spring Data JPA",                 category: "Java",           file: "Working with Spring Data JPA_ The Fundamentals of Spring Data JPA.pdf" },
  { name: "Spring Data JPA — Queries",       category: "Java",           file: "Working with Spring Data JPA_ Custom Queries.pdf" },
  { name: "Spring Boot Microservices",       category: "Java",           file: "Spring Boot Microservices_ Asynchronous Methods, Schedulers, & Forms.pdf" },
  { name: "Microservices Concepts",          category: "Microservicios", file: "Basic Concepts of a Microservices Architecture.pdf" },
  { name: "Apache Camel & EAI",              category: "Microservicios", file: "EAI Patterns_ Overview of Apache Camel.pdf" },
  { name: "Microservices Patterns",          category: "Microservicios", file: "Microservices Architecture and Design Patterns.pdf" },
  { name: "Microservices Deep Dive",         category: "Microservicios", file: "Microservices Deep Dive.pdf" },
  { name: "Microservices CI/CD",             category: "Microservicios", file: "Microservices Deployment and Continuous Integration.pdf" },
  { name: "Mockito",                         category: "Testing",        file: "Unit Testing with Mocks_ Getting Started with Mockito.pdf" },
  { name: "JUnit — Introducción",            category: "Testing",        file: "Unit Testing_ An Introduction to the JUnit Framework.pdf" },
  { name: "JUnit — Assertions",              category: "Testing",        file: "Unit Testing_ Assertions & Assumptions in JUnit.pdf" },
  { name: "Git & GitHub",                    category: "DevOps",         file: "Git & GitHub_ Introduction.pdf" },
  { name: "Git para DevOps",                 category: "DevOps",         file: "Using Git for DevOps_ Managing Conflict & Effectively Using Git Workflow.pdf" },
  { name: "Python — Introducción",           category: "Python",         file: "Getting Started with Python_ Introduction.pdf" },
];

const Certifications = () => {
  const [active, setActive] = useState<Category>("Todos");
  const [open, setOpen] = useState(true);

  const filtered = active === "Todos" ? CERTS : CERTS.filter(c => c.category === active);
  const countFor = (cat: Category) =>
    cat === "Todos" ? CERTS.length : CERTS.filter(c => c.category === cat).length;

  return (
    <section aria-labelledby="certs-title">

      {/* ── Cabecera — siempre visible ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="certs-body"
        className="w-full flex items-center justify-between gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Award size={16} className="text-secondary shrink-0" aria-hidden="true" />
          <div className="text-left">
            <h2 id="certs-title" className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
              Mis <span className="gradient-text">certificaciones</span>
            </h2>
            <p className="text-sm text-white/45 mt-0.5">
              {CERTS.length} certificados verificables — clic para ver
            </p>
          </div>
        </div>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`text-white/40 group-hover:text-secondary transition-all duration-300 shrink-0 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* ── Contenido colapsable ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="certs-body"
            key="certs-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5">

              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Filtrar por categoría">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active === cat}
                    onClick={() => setActive(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                      active === cat
                        ? "bg-secondary text-main border-secondary shadow-lg shadow-secondary/20"
                        : "bg-white/5 text-white/55 border-white/10 hover:border-secondary/40 hover:text-white"
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      active === cat ? "bg-main/30 text-main" : "bg-white/10 text-white/50"
                    }`}>
                      {countFor(cat)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
                  role="tabpanel"
                >
                  {filtered.map((cert, i) => (
                    <motion.a
                      key={cert.file}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      href={cert.path ?? `/Certificados/Certificados/${encodeURIComponent(cert.file)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver certificado ${cert.name} en PDF`}
                      onClick={() => trackCertView(cert.name)}
                      className="group relative bg-white/[0.03] border border-white/8 rounded-xl p-3.5 hover:border-secondary/35 hover:bg-white/[0.06] transition-all duration-200 flex items-start justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="min-w-0">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${CATEGORY_STYLES[cert.category]}`}>
                          {cert.category}
                        </span>
                        <p className="text-sm font-semibold text-white leading-snug">
                          {cert.name}
                        </p>
                      </div>
                      <ExternalLink
                        size={13}
                        aria-hidden="true"
                        className="text-white/25 group-hover:text-secondary transition-colors shrink-0 mt-1"
                      />
                    </motion.a>
                  ))}
                </motion.div>
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Certifications;
