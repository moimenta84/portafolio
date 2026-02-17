// Introduction.tsx — Componente de texto principal del Hero.
// Mensaje específico sobre servicios de desarrollo web,
// microcredenciales de confianza y CTAs orientados a conversión.

import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { CheckCircle } from "lucide-react";

const Introduction = () => {
  return (
    <div className="z-20 w-full">
      {/* Overlay sutil detrás del texto para legibilidad sobre estrellas */}
      <div className="flex flex-col justify-center max-w-lg rounded-2xl bg-darkBg/40 backdrop-blur-[2px] p-5 md:p-8 -m-5 md:-m-8">
        <p className="text-secondary font-mono text-sm md:text-base mb-2 text-center md:text-left tracking-wide">
          Desarrollador Full Stack
        </p>

        <h1 className="mb-4 text-2xl leading-tight text-center md:text-left md:text-4xl md:mb-6 text-white">
          Especializado en{" "}
          <TypeAnimation
            sequence={[
              "React & Spring Boot",
              1500,
              "APIs REST robustas",
              1500,
              "arquitecturas limpias",
              1500,
              "entornos de producción",
              1500,
            ]}
            speed={50}
            repeat={Infinity}
            className="font-bold text-secondary text-3xl md:text-5xl drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
          />
        </h1>

        <p className="mx-auto mb-5 text-base md:text-lg md:mx-0 md:mb-6 text-white/70 text-center md:text-left leading-relaxed">
          Desarrollo aplicaciones web escalables para entornos de empresa., Desarrollo aplicaciones web modernas, limpias y escalables. Código limpio y despliegue profesional.
        </p>

        {/* Microcredenciales — stack y disponibilidad */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mb-6 md:mb-8">
          <span className="flex items-center gap-1.5 text-white/60 text-xs md:text-sm">
            <CheckCircle size={14} className="text-secondary" />
            React · TypeScript · Spring Boot
          </span>
          <span className="flex items-center gap-1.5 text-white/60 text-xs md:text-sm">
            <CheckCircle size={14} className="text-secondary" />
            Docker & despliegue CI/CD
          </span>
          <span className="flex items-center gap-1.5 text-white/60 text-xs md:text-sm">
            <CheckCircle size={14} className="text-secondary" />
            Disponible para equipo
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-5 flex-wrap">
          <Link
            to="/projects"
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-secondary text-main font-semibold text-sm md:text-base
                       shadow-lg shadow-secondary/25
                       hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5 hover:brightness-110
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200"
          >
            Ver proyectos reales
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-full border-2 border-white/30 text-white font-semibold text-sm md:text-base
                       hover:border-secondary hover:text-secondary hover:shadow-lg hover:shadow-secondary/15 hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-none
                       transition-all duration-200"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
