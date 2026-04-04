// About.tsx — Página de trayectoria del portfolio.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GitHubActivity from "../components/github/GitHubActivity";
import Certifications from "../components/certifications/Certifications";
import Timeline from "../components/about/Timeline";
import SEO from "../components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Counter animado ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", label }: {
  target: number | null; suffix?: string; label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setCount(target); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 50;
        const duration = 1800;
        let cur = 0;
        const inc = target / steps;
        const id = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(id); }
          else setCount(Math.floor(cur));
        }, duration / steps);
      }
    }, { threshold: 0.4 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center px-4 py-5">
      <span className="text-3xl md:text-4xl font-black text-secondary tabular-nums">
        {count.toLocaleString()}<span className="text-secondary/60 text-2xl">{suffix}</span>
      </span>
      <p className="text-white/50 text-[11px] font-medium mt-1 leading-snug max-w-[90px]">{label}</p>
    </div>
  );
}

// ─── Contadores ──────────────────────────────────────────────────────────────
function GHCounters() {
  return (
    <div className="grid grid-cols-3 gap-0 bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
      <div className="border-r border-white/8">
        <AnimatedCounter target={442} suffix="+" label="commits recientes" />
      </div>
      <div className="border-r border-white/8">
        <AnimatedCounter target={20} suffix="+" label="tecnologías en stack" />
      </div>
      <div>
        <AnimatedCounter target={18} label="certificaciones" />
      </div>
    </div>
  );
}

// ─── Página About ─────────────────────────────────────────────────────────────
const About = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center py-6">
      <SEO
        title="Trayectoria"
        description="Desarrollador Backend Java especializado en Spring Boot, Spring Security, microservicios, Docker y Kubernetes. CFGS DAW con experiencia real en entorno enterprise."
        path="/about"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        className="text-white flex flex-col gap-8"
      >
        {/* HEADER */}
        <motion.header variants={fadeUp}>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Mi <span className="text-cyan-400">trayectoria</span>
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-xl leading-relaxed">
            Desarrollador Backend Java especializado en Spring Boot, microservicios, Docker y Kubernetes. Cursando el CFGS de DAW mientras aplico lo aprendido en proyectos reales y en entorno enterprise.
          </p>
        </motion.header>

        {/* SOBRE MÍ */}
        <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Sobre mí</p>
          <p className="text-sm text-white/70 leading-relaxed">
            Soy Iker, desarrollador con foco en el <span className="text-white font-medium">backend Java</span>. Me apasiona construir APIs limpias, sistemas escalables y arquitecturas bien pensadas. Aprendo rápido y aplico directamente — cada certificación, cada proyecto y cada commit es parte del proceso.
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            Cuando no estoy programando, estoy estudiando microservicios, explorando Docker y Kubernetes, o mejorando este mismo portfolio. Busco un entorno donde seguir creciendo y aportar desde el primer día.
          </p>
        </motion.div>

        {/* STATS */}
        <motion.div variants={fadeUp}>
          <GHCounters />
        </motion.div>

        {/* TIMELINE */}
        <motion.div variants={fadeUp}>
          <Timeline />
        </motion.div>

        {/* GITHUB ACTIVITY + TECH STACK */}
        <motion.div variants={fadeUp}>
          <GitHubActivity />
        </motion.div>

        {/* CERTIFICACIONES */}
        <motion.div variants={fadeUp}>
          <Certifications />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
