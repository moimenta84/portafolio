// useMotion.ts — Hook para adaptar animaciones según dispositivo y preferencias del usuario.
// Respeta prefers-reduced-motion, detecta móvil/tablet/desktop y ajusta duraciones.

import { useMemo } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

interface MotionConfig {
  device: DeviceType;
  reducedMotion: boolean;
  // Duraciones base en segundos
  fast: number;       // transiciones rápidas
  normal: number;     // animaciones normales
  slow: number;       // animaciones elaboradas
  // Flags de funcionalidades
  enableParticles: boolean;
  enableParallax: boolean;
  enableGlow: boolean;
  enableHover: boolean;
  // Variantes de Framer Motion preconfiguradas
  fadeUp: object;
  fadeIn: object;
  stagger: (i?: number) => object;
}

export function useMotion(): MotionConfig {
  return useMemo(() => {
    const reducedMotion =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const isMobile =
      typeof window !== "undefined"
        ? window.matchMedia("(max-width: 639px)").matches
        : false;

    const isTablet =
      typeof window !== "undefined"
        ? window.matchMedia("(min-width: 640px) and (max-width: 1023px)").matches
        : false;

    const device: DeviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

    // Duraciones en segundos (Framer Motion)
    let fast = 0.2;
    let normal = 0.5;
    let slow = 0.8;

    if (reducedMotion) {
      fast = 0;
      normal = 0.01;
      slow = 0.01;
    } else if (isMobile) {
      fast = 0.15;
      normal = 0.25;
      slow = 0.3;
    } else if (isTablet) {
      fast = 0.2;
      normal = 0.4;
      slow = 0.5;
    }

    const enableParticles = !reducedMotion && !isMobile;
    const enableParallax = !reducedMotion && !isMobile;
    const enableGlow = !reducedMotion;
    const enableHover = !isMobile; // hover en tablet y desktop

    // Variante fadeUp adaptativa
    const fadeUp = reducedMotion
      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.01 } } }
      : {
          hidden: { opacity: 0, y: isMobile ? 10 : 20 },
          show: { opacity: 1, y: 0, transition: { duration: normal, ease: [0.22, 1, 0.36, 1] } },
        };

    const fadeIn = reducedMotion
      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.01 } } }
      : {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: normal } },
        };

    const stagger = (i = 0) =>
      reducedMotion
        ? {}
        : { transition: { delay: i * (isMobile ? 0.04 : 0.08), duration: normal } };

    return {
      device,
      reducedMotion,
      fast,
      normal,
      slow,
      enableParticles,
      enableParallax,
      enableGlow,
      enableHover,
      fadeUp,
      fadeIn,
      stagger,
    };
  }, []);
}
