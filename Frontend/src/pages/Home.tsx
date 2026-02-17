// Home.tsx — Página principal / Hero del portfolio.
// Muestra las partículas interactivas de fondo, un avatar a la izquierda
// y el componente Introduction (con texto animado) a la derecha.
// Es lo primero que ve el usuario al entrar a la web.

import { CoverParticles } from "../components/ui/CoverParticles";
import Introduction from "../components/Introduction";

const Home = () => {
  return (
    <section className="relative flex-1 flex flex-col">
      {/* Fondo de partículas interactivas */}
      <CoverParticles />
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid md:grid-cols-2 items-center gap-6 md:gap-20 w-full">
          {/* COLUMNA FOTO — Imagen de perfil */}
          <div className="flex justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <img
                src="/img/1760052219751.jpg"
                alt="Iker Martinez"
                className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-slate-800 ring-2 ring-cyan-400/40 shadow-2xl shadow-cyan-500/20 grayscale-[20%] contrast-[1.05]"
              />
            </div>
          </div>
          {/* COLUMNA TEXTO — Introducción con texto que se escribe solo */}
          <div className="flex flex-col justify-center">
            <Introduction />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
