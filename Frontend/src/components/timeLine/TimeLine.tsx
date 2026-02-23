import { Code2, Layers, Server, Rocket } from "lucide-react";
import { dataAboutPage } from "../../data/dataAboutPage";

const icons = [Code2, Layers, Server, Rocket];

const TimeLine = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {dataAboutPage.map((data, i) => {
        const Icon = icons[i] || Code2;
        const isLast = i === dataAboutPage.length - 1 && dataAboutPage.length % 2 !== 0;
        return (
          <div
            key={data.id}
            className={`group relative bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all duration-300 ${isLast ? "sm:col-span-2" : ""}`}
          >
            {/* Gradient accent top */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-400/20 transition-colors">
                <Icon size={16} className="text-cyan-400" />
              </div>

              <div className="min-w-0">
                {/* Year + Title */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                    {data.date}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">
                    {data.title}
                  </h3>
                </div>

                {/* Subtitle as tag */}
                <p className="text-xs font-semibold text-white/75 mb-1.5 tracking-wide uppercase">
                  {data.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeLine;
