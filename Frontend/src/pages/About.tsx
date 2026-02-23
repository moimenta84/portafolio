import TimeLine from "../components/timeLine/TimeLine";
import CounterServices from "../services/CounterServices";
import SEO from "../components/SEO";

const About = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-6">
      <SEO
        title="Trayectoria"
        description="Conoce la trayectoria de Iker Martínez: 4 años de práctica autodidacta en frontend con React y backend con Spring Boot, orientado a integrarse en equipos de desarrollo profesional."
        path="/about"
      />
      <div className="text-white flex flex-col gap-6">

        {/* HEADER */}
        <header>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Mi{" "}
            <span className="text-cyan-400">
              trayectoria
            </span>
          </h2>
          <p className="text-sm text-white mt-2 max-w-xl leading-relaxed">
            Desarrollador en formación continua, con 4 años de práctica autodidacta en frontend con React y backend con Spring Boot, orientado a integrarse en equipos de desarrollo profesional.
          </p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2">
          <CounterServices />
        </div>

        {/* JOURNEY CARDS */}
        <TimeLine />

      </div>
    </section>
  );
};

export default About;
