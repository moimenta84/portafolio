// Introduction.tsx — Componente de texto principal del Hero.
// Usa react-type-animation para crear el efecto de "máquina de escribir"
// que va alternando palabras como "programarlo", "optimizarlo", etc.
// Incluye dos botones CTA: "Ver proyectos" y "Contacta conmigo".

import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Introduction = () => {
  return (
    <div className="z-20 w-full">
      <div className="flex flex-col justify-center max-w-md">
        <h1 className="mb-5 text-2xl leading-tight text-center md:text-left md:text-4xl md:mb-10 text-white">
          Si puedes pensarlo, <br />
          <TypeAnimation
            sequence={[
              "puedes programarlo",
              1000,
              "puedes optimizarlo",
              1000,
              "puedes implementarlo",
              1000,
              "puedes desarrollarlo",
              1000,
            ]}
            speed={50}
            repeat={Infinity}
            className="font-bold text-secondary"
          />
        </h1>

        <p className="mx-auto mb-2 text-xl md:mx-0 md:mb-8 text-white/80">
          Como desarrollador frontend y creador de contenido, me dedico a
          combinar diseno y funcionalidad para crear experiencias digitales
          impactantes y accesibles.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-6 flex-wrap">
          <Link
            to="/projects"
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-secondary text-white font-semibold text-sm md:text-base
                       hover:bg-orange-500 transition-colors shadow-lg shadow-secondary/25"
          >
            Ver proyectos
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-full border-2 border-white/30 text-white font-semibold text-sm md:text-base
                       hover:border-secondary hover:text-secondary transition-colors"
          >
            Contacta conmigo
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Introduction;
