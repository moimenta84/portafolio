import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Calendar, FolderGit2, Users, Eye } from "lucide-react";
import { getProjects, getFollowers, getVisitCount } from "./api";

const icons = [Calendar, FolderGit2, Users, Eye];

interface CounterEntry {
  id: number;
  endCounter: number;
  text: string;
}

const CounterServices = () => {
  const [counters, setCounters] = useState<CounterEntry[]>([
    { id: 1, endCounter: 4, text: "Años exp." },
    { id: 2, endCounter: 0, text: "Proyectos" },
    { id: 3, endCounter: 0, text: "Seguidores" },
    { id: 4, endCounter: 0, text: "Visitas" },
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
    <>
      {counters.map(({ id, endCounter, text }, i) => {
        const Icon = icons[i];
        return (
          <div
            key={id}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                <CountUp end={endCounter} start={0} duration={4} />
                <span className="text-cyan-400">+</span>
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{text}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CounterServices;
