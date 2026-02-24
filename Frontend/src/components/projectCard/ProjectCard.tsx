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
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-32 sm:h-48 overflow-hidden shrink-0">
        <img
          src={image}
          alt={`Imagen del proyecto ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleLike(id); }}
          aria-label={liked ? "Quitar like" : "Dar like"}
          aria-pressed={liked}
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2.5">
        <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tech tags — máx 3 */}
        <div className="flex flex-wrap gap-1">
          {tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-medium bg-cyan-400/10 text-cyan-300 rounded-full border border-cyan-400/20"
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
          className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ExternalLink size={11} aria-hidden="true" />
          Ver proyecto
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
