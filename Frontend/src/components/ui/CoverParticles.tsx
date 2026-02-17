// CoverParticles.tsx — Fondo de partículas interactivas usando tsParticles.
// Renderiza 80 partículas blancas conectadas por líneas que reaccionan al ratón:
// - Hover: las partículas se repelen (efecto repulse)
// - Click: se crean 4 partículas nuevas (efecto push)
// Se usa como fondo en la Home y en la animación de intro.

import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

import Particles, { initParticlesEngine } from "@tsparticles/react";

export const CoverParticles = () => {
  const [init, setInit] = useState(false);

  // Inicializamos el motor de partículas una sola vez al montar
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    init && (
      <div className="absolute inset-0 z-0">
      <Particles
  id="tsparticles"
  style={{ backgroundColor: "transparent" }}
  options={{
    background: {
      color: "transparent",
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#22d3ee" },
      links: {
        color: "#22d3ee",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 80,
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  }}
    />

        </div>  
    )
  );
}