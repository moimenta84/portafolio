import { Heart, ExternalLink } from "lucide-react";
import type { Project } from "../../types";
import { registerEvent } from "../../services/api";

interface ProjectCardProps {
  project: Project;
  onToggleLike: (id: number) => void;
}

const ProjectCard = ({ project, onToggleLike }: ProjectCardProps) => {
  const { id, image, title, description, tech, link, likes_count, liked } =
    project;

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/30 hover:bg-white/[0.08] transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-28 sm:h-40 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`Imagen del proyecto ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleLike(id); }}
          aria-label={liked ? "Quitar like" : "Dar like"}
          aria-pressed={liked}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Heart
            size={12}
            aria-hidden="true"
            className={`transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white/80"}`}
          />
          <span aria-live="polite" className="text-[11px] text-white font-medium leading-none">
            {likes_count}
          </span>
        </button>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 gap-2">
        <p className="text-[11px] sm:text-xs text-white/65 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tech tags — máx 3 visibles en móvil */}
        <div className="flex flex-wrap gap-1">
          {tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[10px] font-medium bg-cyan-400/10 text-cyan-300 rounded-full border border-cyan-400/20"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => registerEvent("project_click", { project_id: id, title })}
          className="mt-auto flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-white/15 bg-white/5 text-[11px] font-semibold text-white/75 hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ExternalLink size={11} aria-hidden="true" />
          Ver proyecto
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
