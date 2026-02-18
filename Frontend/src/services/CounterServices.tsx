import { useEffect, useState, useRef } from "react";
import { dataCounter } from "../data/dataCounter";
import { getFollowers } from "./api";

const CounterServices = () => {
  const [followersCount, setFollowersCount] = useState<number | null>(null);

  useEffect(() => {
    getFollowers()
      .then((data) => setFollowersCount(data.followers_count))
      .catch(() => setFollowersCount(0));
  }, []);

  return (
    <>
      {dataCounter.map((item) => (
        <CounterCard
          key={item.id}
          value={item.endCounter}
          label={item.text}
          lineRight={item.lineRight}
          animated
        />
      ))}
      <CounterCard
        value={followersCount}
        label="seguidores"
        lineRight={false}
        animated={false}
      />
    </>
  );
};

interface CounterCardProps {
  value: number | null;
  label: string;
  lineRight?: boolean;
  animated: boolean;
}

function CounterCard({ value, label, lineRight, animated }: CounterCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!animated || value === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated, value]);

  const displayValue = animated ? count : (value ?? "—");

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center text-center px-2 py-4 ${
        lineRight ? "border-r border-white/10" : ""
      }`}
    >
      <span className="text-3xl md:text-4xl font-black text-cyan-400 tabular-nums">
        {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
        {value !== null && <span className="text-cyan-300">+</span>}
      </span>
      <p className="text-white/60 text-xs mt-1 leading-snug">{label}</p>
    </div>
  );
}

export default CounterServices;
