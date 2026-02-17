// Home.tsx — Página principal / Hero del portfolio.
// Muestra las partículas interactivas de fondo, un avatar a la izquierda
// y el componente Introduction (con texto animado) a la derecha.
// Es lo primero que ve el usuario al entrar a la web.

import { CoverParticles } from "../components/ui/CoverParticles";
import Introduction from "../components/Introduction";

const Home = () => {
  return (
    <section className="relative min-h-full">
      {/* Fondo de partículas interactivas */}
      <CoverParticles />
      <div className="relative z-10 flex items-center min-h-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid md:grid-cols-2 items-center gap-6 md:gap-20 w-full">
          {/* COLUMNA AVATAR — Imagen del personaje */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/img/home-4.png"
              alt="Walking avatar"
              className="w-44 h-44 sm:w-64 sm:h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl"
            />
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
