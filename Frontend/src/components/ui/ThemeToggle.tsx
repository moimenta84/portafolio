// ThemeToggle.tsx — Botón de cambio de tema dark/light con animación.

import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggle, isDark } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
      title={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
      className={`relative w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200
        ${isDark
          ? "border-white/15 bg-white/5 hover:border-secondary/40 hover:bg-secondary/10 text-white/60 hover:text-secondary"
          : "border-amber-400/30 bg-amber-400/10 hover:border-amber-400/60 text-amber-400"
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={14} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={14} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {theme === "dark" ? "Modo oscuro activo" : "Modo claro activo"}
      </span>
    </button>
  );
};

export default ThemeToggle;
