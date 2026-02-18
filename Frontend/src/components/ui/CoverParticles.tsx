// CoverParticles.tsx — Fondo global de partículas interactivas (tsParticles).
// Se renderiza como capa fixed que cubre toda la ventana (incluido header).
// - Desktop: 50 partículas con links, interactividad repulse/push
// - Móvil: 15 partículas, sin interactividad hover para rendimiento
// Parallax suave incluido via el plugin de tsparticles.

import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export const CoverParticles = () => {
  const [init, setInit] = useState(false);
  const [mobile] = useState(isMobile);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="!fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      options={{
        fullScreen: false,
        background: { color: "transparent" },
        fpsLimit: mobile ? 30 : 60,
        interactivity: {
          events: {
            onClick: { enable: false },
            onHover: { enable: false },
          },
          modes: {
            push: { quantity: 2 },
            repulse: { distance: 120, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#22d3ee" },
          links: {
            color: "#22d3ee",
            distance: 150,
            enable: true,
            opacity: mobile ? 0.15 : 0.25,
            width: 0.8,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: mobile ? 0.3 : 0.6,
            straight: false,
          },
          number: {
            density: { enable: true },
            value: mobile ? 15 : 50,
          },
          opacity: {
            value: { min: 0.15, max: 0.4 },
            animation: {
              enable: true,
              speed: 0.4,
              sync: false,
            },
          },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
};
