// About.tsx — Página "Sobre mí" con la trayectoria profesional.
// Muestra contadores animados (años, proyectos, seguidores, visitas)
// obtenidos de la API, y un timeline visual con la evolución profesional.

import TimeLine from "../components/timeLine/TimeLine";
import CounterServices from "../services/CounterServices";

const About = () => {
  return (
    <section className="relative min-h-full py-4">
     <div className="max-w-7xl mx-auto px-4 md:px-6 text-white">

        {/* TÍTULO */}
        <h2 className="text-xl leading-tight text-center md:text-left md:text-3xl">
          Toda mi <span className="text-orange-400">trayectoria profesional</span>
        </h2>

        {/* CONTADORES */}
        <div className="grid justify-between max-w-3xl mx-auto my-3 grid-cols-2 gap-2 md:flex md:gap-4">
          <CounterServices />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-4 items-start">
          <TimeLine />

          <div className="hidden md:flex justify-end">
            <img
              src="/img/avatar-works.png"
              alt="Avatar trabajando"
              className="w-[180px] opacity-90"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
