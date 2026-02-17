// StarField.tsx — Fondo de estrellas tipo espacio.
// Canvas ligero con estrellas que parpadean y parallax suave al hacer scroll.
// En móvil reduce la cantidad de estrellas para rendimiento.

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number; // 0-1, para parallax (0 = lejos, 1 = cerca)
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 40 : 200;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.45 + 0.1,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth: Math.random(),
      }));
    };

    const onScroll = () => {
      scrollYRef.current = window.scrollY || document.documentElement.scrollTop;
    };

    const frameInterval = isMobile ? 50 : 0; // ~20fps en móvil, sin límite en desktop
    let lastFrame = 0;

    const draw = (time: number) => {
      // Throttle en móvil
      if (isMobile && time - lastFrame < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scroll = scrollYRef.current;

      for (const star of starsRef.current) {
        // Parallax: estrellas lejanas se mueven menos
        const parallaxY = (star.y - scroll * star.depth * 0.05) % canvas.height;
        const drawY = parallaxY < 0 ? parallaxY + canvas.height : parallaxY;

        // Parpadeo
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.opacity + twinkle * 0.25;

        ctx.beginPath();
        ctx.arc(star.x, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(alpha, 0.9))})`;
        ctx.fill();

        // Brillo sutil para estrellas grandes
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, drawY, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 220, 255, ${Math.max(0, alpha * 0.15)})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    animationRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", () => {
      resize();
      createStars();
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    // También escuchamos scroll en el main scrollable
    const mainEl = document.querySelector("main");
    const onMainScroll = () => {
      scrollYRef.current = mainEl?.scrollTop ?? 0;
    };
    mainEl?.addEventListener("scroll", onMainScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      mainEl?.removeEventListener("scroll", onMainScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default StarField;
