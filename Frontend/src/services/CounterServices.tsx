// CounterServices.tsx — Contadores animados de la página About.
// Muestra estadísticas que arrancan desde 0 y suben hasta su valor real
// usando la librería react-countup para el efecto de conteo.
// Los datos (nº de proyectos, seguidores y visitas) se obtienen
// de la API en paralelo con Promise.all().

import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { getProjects, getFollowers, getVisitCount } from "./api";

interface CounterEntry {
  id: number;
  endCounter: number;
  text: string;
  lineRight?: boolean;
  lineRightMobile?: boolean;
}

const CounterServices = () => {
  const [counters, setCounters] = useState<CounterEntry[]>([
    { id: 1, endCounter: 4, text: "años de experiencia", lineRight: true, lineRightMobile: true },
    { id: 2, endCounter: 0, text: "proyectos reales", lineRight: true, lineRightMobile: false },
    { id: 3, endCounter: 0, text: "seguidores", lineRight: true, lineRightMobile: true },
    { id: 4, endCounter: 0, text: "visitas únicas", lineRight: false, lineRightMobile: false },
  ]);

  useEffect(() => {
    Promise.all([getProjects(), getFollowers(), getVisitCount()])
      .then(([projects, followers, visits]) => {
        setCounters((prev) =>
          prev.map((c) => {
            if (c.id === 2) return { ...c, endCounter: projects.length };
            if (c.id === 3) return { ...c, endCounter: followers.followers_count };
            if (c.id === 4) return { ...c, endCounter: visits.unique_visitors };
            return c;
          })
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid justify-between max-w-3xl grid-cols-2 gap-2 mx-auto my-3 md:flex md:grid-cols-4 md:gap-4">
      {counters.map(({ id, endCounter, text, lineRight, lineRightMobile }) => (
        <div key={id} className={lineRight ? "ltr" : ""}>
          <div
            className={`
              ${lineRight ? "px-3 border-2 border-transparent md:border-e-gray-100" : ""}
              ${lineRightMobile ? "border-e-gray-100" : ""}
            `}
          >
            <p className="flex mb-1 text-xl font-extrabold md:text-2xl text-secondary">
              + <CountUp end={endCounter} start={0} duration={5} />
            </p>
            <p className="text-xs uppercase max-w-[100px]">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterServices;
