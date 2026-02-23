// Introduction.tsx — Componente de texto principal del Hero.
// Mensaje específico sobre servicios de desarrollo web,
// microcredenciales de confianza y CTAs orientados a conversión.

import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { CheckCircle } from "lucide-react";
import FollowButton from "./ui/FollowButton";

const Introduction = () => {
  return (
    <div className="z-20 w-full">
      <div className="flex flex-col justify-center max-w-md rounded-2xl bg-darkBg/40 backdrop-blur-[2px] p-4 md:p-6 -m-4 md:-m-6">
        <p className="text-secondary font-mono text-xs mb-1.5 text-center md:text-left tracking-wide">
          Desarrollador Full Stack
        </p>

        <h1 className="mb-3 text-lg leading-tight text-center md:text-left md:text-2xl text-white">
          Especializado en{" "}
          {/* min-h fija evita el salto de layout al cambiar el texto */}
          <span className="block min-h-[1.6em]">
            <TypeAnimation
              sequence={[
                "React & TypeScript",
                1500,
                "Spring Boot & Java",
                1500,
                "Laravel & PHP",
                1500,
                "APIs REST robustas",
                1500,
                "arquitecturas limpias",
                1500,
              ]}
              speed={50}
              repeat={Infinity}
              className="font-bold text-secondary text-xl md:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            />
          </span>
        </h1>


        <p className="mx-auto mb-3 text-sm md:mx-0 text-white/70 text-center md:text-left leading-relaxed">
          Convierto ideas en productos web reales — del diseño al deploy en producción, sin rodeos.
        </p>

        {/* Stack de tecnologías */}
        <div className="flex flex-wrap gap-1.5 mb-3 justify-center md:justify-start">
          {["React", "TypeScript", "Spring Boot", "Laravel", "Node.js", "Docker", "Git", "PostgreSQL", "MySQL", "CI/CD", "Nginx", "REST API"].map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full border border-secondary/25 bg-secondary/8 text-secondary text-[11px] font-mono font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Microcredenciales */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 mb-4">
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <CheckCircle size={11} className="text-secondary" />
            Frontend React · Backend Spring Boot · Laravel
          </span>
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <CheckCircle size={11} className="text-secondary" />
            Docker · CI/CD · despliegue en VPS
          </span>
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <CheckCircle size={11} className="text-secondary" />
            APIs REST · código limpio · testing
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pr-14 md:pr-0">
          <Link
            to="/projects"
            className="px-4 py-2 rounded-full bg-secondary text-main font-semibold text-xs
                       shadow-lg shadow-secondary/25
                       hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 hover:brightness-110
                       active:translate-y-0 transition-all duration-200"
          >
            Ver proyectos reales
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-full border border-white/30 text-white font-semibold text-xs
                       hover:border-secondary hover:text-secondary hover:shadow-lg hover:shadow-secondary/15 hover:-translate-y-0.5
                       active:translate-y-0 transition-all duration-200"
          >
            Contactar
          </Link>
          <FollowButton size="sm" />
        </div>
      </div>
    </div>
  );
};

export default Introduction;
