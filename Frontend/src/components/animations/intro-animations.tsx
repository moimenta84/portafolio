// IntroAnimation.tsx — Animación de terminal al entrar a la web.
// Simula una terminal que escribe líneas de código con efecto typewriter.
// Solo se muestra una vez por sesión (controlado desde App.tsx).

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const LINES = [
  { text: "> Inicializando portafolio...", status: null },
  { text: "> Cargando proyectos", status: "OK" },
  { text: "> Conectando backend", status: "OK" },
  { text: "> Bienvenido a ikermartinezdev.com", status: null },
];

const CHAR_SPEED = 20; // ms por carácter

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [completedLines, setCompletedLines] = useState<typeof LINES>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChars, setCurrentChars] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (currentLine >= LINES.length) return;

    const line = LINES[currentLine];

    if (currentChars < line.text.length) {
      const t = setTimeout(() => setCurrentChars((c) => c + 1), CHAR_SPEED);
      return () => clearTimeout(t);
    }

    // Línea completa — espera y avanza
    const pauseAfter = line.status ? 350 : 200;
    const t = setTimeout(() => {
      setCompletedLines((prev) => [...prev, line]);
      const next = currentLine + 1;
      if (next >= LINES.length) {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 500);
        }, 700);
      } else {
        setCurrentLine(next);
        setCurrentChars(0);
      }
    }, pauseAfter);
    return () => clearTimeout(t);
  }, [currentLine, currentChars, onComplete]);

  return (
    <motion.div
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0a0f1a] flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -10 : 0, scale: exiting ? 0.97 : 1 }}
        transition={{ duration: exiting ? 0.5 : 0.4, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Ventana de terminal */}
        <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl">

          {/* Barra de título */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <span className="ml-2 text-white/30 text-xs font-mono">iker@portfolio ~ bash</span>
          </div>

          {/* Contenido */}
          <div className="p-6 font-mono text-sm space-y-2 min-h-[160px]">

            {/* Líneas completadas */}
            {completedLines.map((line, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-cyan-400">{line.text}</span>
                {line.status && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-green-400 font-bold text-xs"
                  >
                    [{line.status}]
                  </motion.span>
                )}
              </div>
            ))}

            {/* Línea en proceso de escritura */}
            {currentLine < LINES.length && (
              <div className="flex items-center">
                <span className="text-cyan-400">
                  {LINES[currentLine].text.slice(0, currentChars)}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-[2px] h-4 bg-cyan-400 ml-0.5"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IntroAnimation;
