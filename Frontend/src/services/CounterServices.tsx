import { useEffect, useState, useRef } from "react";
import { dataCounter } from "../data/dataCounter";

const CounterServices = () => {
  return (
    <>
      {dataCounter.map((item) => (
        <CounterCard key={item.id} item={item} />
      ))}
    </>
  );
};

function CounterCard({ item }: { item: (typeof dataCounter)[0] }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = item.endCounter / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= item.endCounter) {
              setCount(item.endCounter);
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
  }, [item.endCounter]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center text-center px-2 py-4 ${
        item.lineRight ? "border-r border-white/10" : ""
      }`}
    >
      <span className="text-3xl md:text-4xl font-black text-cyan-400 tabular-nums">
        {count.toLocaleString()}
        <span className="text-cyan-300">+</span>
      </span>
      <p className="text-white/60 text-xs mt-1 leading-snug">{item.text}</p>
    </div>
  );
}

export default CounterServices;
