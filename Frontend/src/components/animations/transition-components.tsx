// MotionTransition.tsx — Componente wrapper reutilizable para animaciones.
// Envuelve cualquier elemento hijo y le aplica un fade-in de 0.6 segundos.
// Se usa en Header, Navbar y otros componentes para que aparezcan suavemente.

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionTransitionProps {
  children: ReactNode;
  position?: "bottom" | "right";
  className?: string;
}

export const MotionTransition = ({
  children,
  position: _position = "bottom",
  className = "",
}: MotionTransitionProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};
