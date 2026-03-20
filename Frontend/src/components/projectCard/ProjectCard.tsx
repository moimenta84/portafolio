import { useState } from "react";
import { Heart, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "../../types";
import { registerEvent } from "../../services/api";

interface ProjectCardProps {
  project: Project;
  onToggleLike: (id: number) => void;
}

const ProjectCard = ({ project, onToggleLike }: ProjectCardProps) => {
  const { id, image, gif, title, description, tech, link, likes_count, liked } = project;
  const [hovered, setHovered] = useState(false);

  // Detectar si el link es GitHub o URL externa
  const isGithub = link?.includes("github.com");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-secondary/30 hover:bg-white/[0.06] transition-colors duration-300 flex flex-col h-full"
      style={{
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(34,211,238,0.07)"
          : "none",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image */}
      <div
        className="relative h-32 sm:h-44 overflow-hidden shrink-0 bg-white/5"
        aria-hidden="true"
      >
        <img
          src={hovered && gif ? gif : image}
          alt={`Captura del proyecto ${title}`}
          width={400}
          height={220}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/30 to-transparent" />

        {/* Like button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(id); }}
          aria-label={liked ? "Quitar like" : "Dar like al proyecto"}
          aria-pressed={liked}
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/90 transition-all focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
        >
          <Heart
            size={11}
            aria-hidden="true"
            className={`transition-all duration-200 ${liked ? "fill-red-500 text-red-500 scale-110" : "text-white/70"}`}
          />
          <span aria-live="polite" className="text-[10px] text-white font-bold leading-none tabular-nums">
            {likes_count}
          </span>
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-[0_1px_6px_rgba(0,0,0,1)]">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <p className="text-[11px] sm:text-xs text-white/55 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1">
          {tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-mono font-medium bg-secondary/8 text-secondary/90 rounded-full border border-secondary/20"
            >
              {t}
            </span>
          ))}
          {tech.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-white/5 text-white/40 rounded-full border border-white/10">
              +{tech.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => registerEvent("project_click", { project_id: id, title })}
          aria-label={`Ver proyecto ${title} en ${isGithub ? "GitHub" : "producción"}`}
          className="group/btn mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-secondary/8 border border-secondary/25 text-[11px] font-bold text-secondary hover:bg-secondary/15 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          {isGithub ? (
            <Github size={11} aria-hidden="true" className="group-hover/btn:scale-110 transition-transform" />
          ) : (
            <ExternalLink size={11} aria-hidden="true" className="group-hover/btn:scale-110 transition-transform" />
          )}
          {isGithub ? "Ver código" : "Ver proyecto"}
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
