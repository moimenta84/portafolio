import { Heart, ExternalLink } from "lucide-react";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  onToggleLike: (id: number) => void;
}

const ProjectCard = ({ project, onToggleLike }: ProjectCardProps) => {
  const { id, image, title, description, tech, link, likes_count, liked } = project;

  return (
    <article className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all duration-300 flex flex-col h-full">
      {/* Image with overlay */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Like button floating */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleLike(id);
          }}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition"
        >
          <Heart
            size={12}
            className={`transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white/70"}`}
          />
          <span className="text-[10px] text-white/80 font-medium">{likes_count}</span>
        </button>

        {/* Title overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 pt-2">
        <p className="text-[11px] text-white/50 line-clamp-2 mb-2 leading-relaxed">{description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[9px] font-medium bg-cyan-400/10 text-cyan-300/80 rounded-full border border-cyan-400/10"
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
          className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-cyan-400 transition-colors"
        >
          <ExternalLink size={11} />
          Ver proyecto
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
