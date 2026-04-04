import { motion } from "framer-motion";
import { GraduationCap, Code2, Briefcase, Rocket } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  active?: boolean;
}

const ITEMS: TimelineItem[] = [
  {
    year: "2024 — hoy",
    title: "CFGS Desarrollo de Aplicaciones Web",
    subtitle: "Formación oficial · DAW",
    description: "Cursando el ciclo superior DAW mientras aplico los conocimientos en proyectos reales. Especialización en backend Java con Spring Boot, microservicios y DevOps.",
    icon: GraduationCap,
    color: "text-cyan-400",
    active: true,
  },
  {
    year: "2023",
    title: "React — Fundación Adecco",
    subtitle: "270 horas · Certificado oficial",
    description: "Curso intensivo de React con TypeScript. Desarrollo de SPAs, hooks, gestión de estado, consumo de APIs REST y buenas prácticas de frontend moderno.",
    icon: Code2,
    color: "text-purple-400",
  },
  {
    year: "2022",
    title: "Inicio en Java & Spring Boot",
    subtitle: "Formación autodidacta + certificaciones",
    description: "Primeros proyectos con Java, OOP, JPA/Hibernate, Spring Data JPA y Spring Security. Base sólida en arquitectura empresarial Java.",
    icon: Rocket,
    color: "text-amber-400",
  },
  {
    year: "2021",
    title: "Primeros pasos en programación",
    subtitle: "HTML · CSS · JavaScript",
    description: "Comienzo del camino en el desarrollo web. Fundamentos de programación, lógica y primeros proyectos estáticos.",
    icon: Briefcase,
    color: "text-green-400",
  },
];

const Timeline = () => (
  <section aria-label="Trayectoria formativa">
    <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-4">Trayectoria</p>
    <div className="relative flex flex-col gap-0">
      {/* Línea vertical */}
      <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent" />

      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="flex gap-4 pb-7 last:pb-0"
          >
            {/* Icono */}
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border shrink-0
              ${item.active
                ? "bg-cyan-400/15 border-cyan-400/40 shadow-lg shadow-cyan-400/10"
                : "bg-white/[0.04] border-white/10"
              }`}
            >
              <Icon size={16} className={item.color} />
              {item.active && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#0d1117] animate-pulse" />
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-white leading-snug">{item.title}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{item.subtitle}</p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0
                  ${item.active
                    ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-white/40"
                  }`}
                >
                  {item.year}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default Timeline;
