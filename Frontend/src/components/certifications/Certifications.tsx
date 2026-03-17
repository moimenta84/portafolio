import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { trackCertView } from "../../services/api";

interface Cert {
  name: string;
  category: Category;
  file: string;
  path?: string; // ruta completa opcional, si no se usa /Certificados/Certificados/
}

type Category = "Todos" | "Java" | "Microservicios" | "Testing" | "DevOps" | "Python" | "React";

const CATEGORIES: Category[] = ["Todos", "React", "Java", "Microservicios", "Testing", "DevOps", "Python"];

const CATEGORY_STYLES: Record<string, string> = {
  React:         "bg-cyan-400/10   text-cyan-400   border-cyan-400/20",
  Java:          "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Microservicios:"bg-purple-400/10 text-purple-400 border-purple-400/20",
  Testing:       "bg-green-400/10  text-green-400  border-green-400/20",
  DevOps:        "bg-blue-400/10   text-blue-400   border-blue-400/20",
  Python:        "bg-yellow-400/10 text-yellow-300  border-yellow-400/20",
};

const CERTS: Cert[] = [
  { name: "React — Fundación Adecco", category: "React", file: "DIPLOMA MARTINEZ VELASCO IKER.pdf", path: "/Certificados/DIPLOMA%20MARTINEZ%20VELASCO%20IKER.pdf" },
  { name: "Java Fundamentals",          category: "Java",          file: "Getting Started with Java_ The Fundamentals of Java Programming.pdf" },
  { name: "Java OOP",                   category: "Java",          file: "Java Certified Foundations Associate_ Object-oriented Programming.pdf" },
  { name: "JPA & Hibernate",            category: "Java",          file: "Java Persistence API_ Getting Started With JPA & Hibernate.pdf" },
  { name: "Spring Data JPA",            category: "Java",          file: "Working with Spring Data JPA_ The Fundamentals of Spring Data JPA.pdf" },
  { name: "Spring Data JPA — Queries",  category: "Java",          file: "Working with Spring Data JPA_ Custom Queries.pdf" },
  { name: "Spring Boot Microservices",  category: "Java",          file: "Spring Boot Microservices_ Asynchronous Methods, Schedulers, & Forms.pdf" },
  { name: "Microservices Concepts",     category: "Microservicios",file: "Basic Concepts of a Microservices Architecture.pdf" },
  { name: "Apache Camel & EAI",        category: "Microservicios",file: "EAI Patterns_ Overview of Apache Camel.pdf" },
  { name: "Microservices Patterns",     category: "Microservicios",file: "Microservices Architecture and Design Patterns.pdf" },
  { name: "Microservices Deep Dive",    category: "Microservicios",file: "Microservices Deep Dive.pdf" },
  { name: "Microservices CI/CD",        category: "Microservicios",file: "Microservices Deployment and Continuous Integration.pdf" },
  { name: "Mockito",                    category: "Testing",       file: "Unit Testing with Mocks_ Getting Started with Mockito.pdf" },
  { name: "JUnit — Introducción",       category: "Testing",       file: "Unit Testing_ An Introduction to the JUnit Framework.pdf" },
  { name: "JUnit — Assertions",         category: "Testing",       file: "Unit Testing_ Assertions & Assumptions in JUnit.pdf" },
  { name: "Git & GitHub",               category: "DevOps",        file: "Git & GitHub_ Introduction.pdf" },
  { name: "Git para DevOps",            category: "DevOps",        file: "Using Git for DevOps_ Managing Conflict & Effectively Using Git Workflow.pdf" },
  { name: "Python — Introducción",      category: "Python",        file: "Getting Started with Python_ Introduction.pdf" },
];

const Certifications = () => {
  const [active, setActive] = useState<Category>("Todos");

  const filtered = active === "Todos" ? CERTS : CERTS.filter(c => c.category === active);

  const countFor = (cat: Category) =>
    cat === "Todos" ? CERTS.length : CERTS.filter(c => c.category === cat).length;

  return (
    <section>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Mis{" "}
          <span className="text-cyan-400">certificaciones</span>
        </h2>
        <p className="text-sm text-white/60 mt-1">
          {CERTS.length} certificados verificables — haz clic para ver el PDF
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              active === cat
                ? "bg-cyan-400 text-gray-900 border-cyan-400"
                : "bg-white/5 text-white/60 border-white/10 hover:border-cyan-400/40 hover:text-white"
            }`}
          >
            {cat}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              active === cat ? "bg-gray-900/30" : "bg-white/10"
            }`}>
              {countFor(cat)}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filtered.map(cert => (
          <a
            key={cert.file}
            href={cert.path ?? `/Certificados/Certificados/${encodeURIComponent(cert.file)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCertView(cert.name)}
            className="group relative bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-cyan-400/40 hover:bg-white/8 transition-all duration-200 flex items-start justify-between gap-2"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="min-w-0">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${CATEGORY_STYLES[cert.category]}`}>
                {cert.category}
              </span>
              <p className="text-sm font-semibold text-white leading-snug">
                {cert.name}
              </p>
            </div>

            <ExternalLink
              size={14}
              className="text-white/30 group-hover:text-cyan-400 transition-colors shrink-0 mt-1"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
