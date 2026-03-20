import { motion } from "framer-motion";
import { Code2, Layers, Server, Rocket, GraduationCap, Briefcase } from "lucide-react";
import { dataAboutPage } from "../../data/dataAboutPage";

const icons = [Code2, Layers, Server, Rocket, GraduationCap, Briefcase];

const ICON_COLORS = [
  "text-cyan-400 bg-cyan-400/10 border-cyan-400/20 group-hover:bg-cyan-400/20",
  "text-purple-400 bg-purple-400/10 border-purple-400/20 group-hover:bg-purple-400/20",
  "text-amber-400 bg-amber-400/10 border-amber-400/20 group-hover:bg-amber-400/20",
  "text-blue-400 bg-blue-400/10 border-blue-400/20 group-hover:bg-blue-400/20",
  "text-green-400 bg-green-400/10 border-green-400/20 group-hover:bg-green-400/20",
  "text-orange-400 bg-orange-400/10 border-orange-400/20 group-hover:bg-orange-400/20",
];

const DATE_COLORS = [
  "text-cyan-400 bg-cyan-400/10",
  "text-purple-400 bg-purple-400/10",
  "text-amber-400 bg-amber-400/10",
  "text-blue-400 bg-blue-400/10",
  "text-green-400 bg-green-400/10",
  "text-orange-400 bg-orange-400/10",
];

const TimeLine = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {dataAboutPage.map((data, i) => {
        const Icon = icons[i] || Code2;
        const colorClass = ICON_COLORS[i] || ICON_COLORS[0];
        const dateColor = DATE_COLORS[i] || DATE_COLORS[0];
        const isLast = i === dataAboutPage.length - 1 && dataAboutPage.length % 2 !== 0;

        return (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300 card-hover ${isLast ? "sm:col-span-2" : ""}`}
          >
            {/* Top gradient line on hover */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-200 ${colorClass}`}>
                <Icon size={15} />
              </div>

              <div className="min-w-0 flex-1">
                {/* Date + Title */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${dateColor}`}>
                    {data.date}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {data.title}
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-[11px] font-semibold text-white/50 mb-1.5 tracking-wide uppercase">
                  {data.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-white/65 leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimeLine;
