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
      {/* Image with overlay */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <img
          src={image}
          alt={`Imagen del proyecto ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleLike(id);
          }}
          aria-label={liked ? "Quitar like" : "Dar like"}
          aria-pressed={liked}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900"
        >
          <Heart
            size={13}
            aria-hidden="true"
            className={`transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-white/90"
            }`}
          />
          <span aria-live="polite" className="text-xs text-white font-medium">
            {likes_count}
          </span>
        </button>

        {/* Title overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 pt-2 gap-2 items-center text-center">
        <p className="text-xs text-white leading-relaxed line-clamp-2 font-light">
          {description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1 justify-center">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-400/20 text-cyan-200 rounded-full border border-cyan-400/25"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Link */}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => registerEvent("project_click", { project_id: id, title })}
          className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded tracking-wide"
        >
          <ExternalLink size={12} aria-hidden="true" />
          Ver proyecto
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
