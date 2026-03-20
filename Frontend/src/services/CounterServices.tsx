import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { dataCounter } from "../data/dataCounter";

const CounterServices = () => {
  const allItems = dataCounter.map((item) => ({
    id: String(item.id),
    value: item.endCounter,
    label: item.text,
    lineRight: item.lineRight ?? false,
    animated: true,
  }));

  return (
    <>
      {allItems.map((item, i) => (
        <CounterCard
          key={item.id}
          value={item.value}
          label={item.label}
          lineRight={item.lineRight}
          animated={item.animated}
          index={i}
        />
      ))}
    </>
  );
};

interface CounterCardProps {
  value: number | null;
  label: string;
  lineRight: boolean;
  animated: boolean;
  index: number;
}

function CounterCard({ value, label, lineRight, animated, index }: CounterCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!animated || value === null) return;

    // Respeta prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setCount(value); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 50;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated, value]);

  const displayValue = animated ? count : (value ?? "—");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`flex flex-col items-center justify-center text-center px-4 py-5 ${
        lineRight ? "border-r border-white/8" : ""
      }`}
    >
      <span className="text-3xl md:text-4xl font-black text-secondary tabular-nums text-glow-cyan">
        {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
        {value !== null && <span className="text-secondary/60 text-2xl">+</span>}
      </span>
      <p className="text-white/50 text-[11px] font-medium mt-1 leading-snug max-w-[80px]">
        {label}
      </p>
    </motion.div>
  );
}

export default CounterServices;
