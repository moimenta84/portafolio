import TimeLine from "../components/timeLine/TimeLine";
import Certifications from "../components/certifications/Certifications";
import CounterServices from "../services/CounterServices";
import SEO from "../components/SEO";

const About = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-6">
      <SEO
        title="Trayectoria"
        description="Desarrollador Backend Java especializado en Spring Boot, Spring Security, microservicios, Docker y Kubernetes. CFGS DAW con experiencia real en entorno enterprise. APIs REST, JPA, Hibernate, JUnit, Mockito, CI/CD, Maven, SOLID, arquitectura limpia."
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
            Desarrollador Backend Java especializado en Spring Boot, Spring Security, microservicios, Docker y Kubernetes, cursando el CFGS de DAW. Experiencia real en entorno enterprise con arquitectura por capas, APIs REST, JPA & Hibernate, testing con JUnit y Mockito, y pipelines CI/CD. Capacidad para trabajar en equipo bajo metodologías Agile/Scrum.
          </p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2">
          <CounterServices />
        </div>

        {/* JOURNEY CARDS */}
        <TimeLine />

        {/* CERTIFICATIONS */}
        <Certifications />

      </div>
    </section>
  );
};

export default About;
