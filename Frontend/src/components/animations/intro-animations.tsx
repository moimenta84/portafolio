// IntroAnimation.tsx — Animación de bienvenida que se muestra al entrar a la web.
// Tiene 3 etapas: "lamp" (aparece la bombilla con rebote), "light" (explosión de luz)
// y "complete" (desaparece y muestra la app).
// Usa Framer Motion para las animaciones de escala, rotación, brillo y fade.
// Solo se muestra una vez por sesión (controlado desde App.tsx con sessionStorage).

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  // Tres fases: bombilla aparece → explota en luz → se completa
  const [stage, setStage] = useState<"lamp" | "light" | "complete">("lamp");

  // Temporizadores para avanzar entre fases automáticamente
  useEffect(() => {
    const lampTimer = setTimeout(() => setStage("light"), 1000);
    const lightTimer = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(lampTimer);
      clearTimeout(lightTimer);
    };
  }, [onComplete]);

  if (stage === "complete") return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-[#0f172a] to-[#030712] flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-center w-full h-full">

        {/* Lámpara */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{
            opacity: 1,
            scale: stage === "lamp" ? [0.5, 1.4, 1.1] : 1.1,
            y: stage === "lamp" ? [-50, -30, -40] : -40
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.7 },
            y: { duration: 0.7 }
          }}
        >
          <motion.div
            animate={{
              rotate: stage === "lamp" ? [-15, 15, -15, 15, -8, 8, 0] : 0,
            }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{
                opacity: stage === "lamp" ? [0, 1, 0.8, 1] : 0,
                scale: stage === "lamp" ? [0.5, 1.5, 1.2, 1.5] : 0.5,
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute inset-0 bg-cyan-400 rounded-full blur-xl"
            />
            
            <div className="relative bg-cyan-400/20 backdrop-blur-sm rounded-full p-6 md:p-10">
              <Lightbulb 
                size={100} 
                className="text-cyan-400"
                strokeWidth={2}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Explosión de luz */}
        {stage === "light" && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 15, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute w-64 h-64 bg-cyan-400 rounded-full blur-xl"
            />

            <motion.div
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 18, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
              className="absolute w-64 h-64 bg-white rounded-full blur-lg"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.4, 1] }}
              className="absolute inset-0 bg-white"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default IntroAnimation;