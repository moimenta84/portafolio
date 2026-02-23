// Home.tsx — Página principal / Hero del portfolio.

import Introduction from "../components/Introduction";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <section className="relative flex-1 flex flex-col">
      <SEO
        title="Desarrollador Full Stack"
        description="Portfolio de Iker Martínez, desarrollador Full Stack especializado en React, TypeScript y Spring Boot. Proyectos reales, APIs REST y arquitecturas limpias."
        path="/"
        type="profile"
      />

      {/* HERO */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="grid md:grid-cols-2 items-center gap-6 md:gap-20 w-full">
          {/* COLUMNA FOTO */}
          <div className="flex justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-secondary via-cyan-600 to-secondary opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500 animate-pulse" />
              <div className="absolute -inset-1 rounded-full border border-secondary/20 group-hover:border-secondary/40 transition-colors duration-500" />
              <img
                src="/img/1760052219751.jpg"
                alt="Iker Martinez — Desarrollador Web"
                className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full border-2 border-secondary/30 shadow-2xl shadow-secondary/10 grayscale-[30%] group-hover:grayscale-0 contrast-[1.08] transition-all duration-500"
              />
              <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center gap-1.5 bg-main/90 backdrop-blur px-2.5 py-1 rounded-full border border-secondary/30 text-xs text-white/80">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Disponible
              </span>
            </div>
          </div>

          {/* COLUMNA TEXTO */}
          <div className="flex flex-col justify-center">
            <Introduction />
          </div>
        </div>
      </div>

    </section>
  );
};

export default Home;
