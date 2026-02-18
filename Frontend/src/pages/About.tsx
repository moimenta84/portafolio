import { useState, useEffect } from "react";
import TimeLine from "../components/timeLine/TimeLine";
import CounterServices from "../services/CounterServices";
import { getFollowers } from "../services/api";

const About = () => {
  const [followersCount, setFollowersCount] = useState<number | null>(null);

  useEffect(() => {
    getFollowers()
      .then((data) => setFollowersCount(data.followers_count))
      .catch(() => setFollowersCount(0));
  }, []);

  return (
    <section className="relative flex-1 flex flex-col justify-center py-6">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-white w-full space-y-6">

        {/* HEADER */}
        <header>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Mi{" "}
            <span className="text-white">
              trayectoria
            </span>
          </h2>
          <p className="text-sm text-white mt-2 max-w-xl leading-relaxed">
            Desarrollador en formación continua, con 4 años de práctica autodidacta en frontend con React y backend con Spring Boot, orientado a integrarse en equipos de desarrollo profesional.
          </p>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CounterServices followersCount={followersCount} />
        </div>

        {/* JOURNEY CARDS */}
        <TimeLine />

      </div>
    </section>
  );
};

export default About;
