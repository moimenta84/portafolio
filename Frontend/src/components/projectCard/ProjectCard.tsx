// ProjectCard.tsx — Tarjeta individual de proyecto.
// Muestra la imagen, título, descripción, tags de tecnologías usadas,
// un enlace "Ver más" y un botón de like con corazón que se rellena de rojo.
// Usa glassmorphism (backdrop-blur + fondo semitransparente) para el estilo.

import { Heart } from "lucide-react";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  onToggleLike: (id: number) => void;
}

const ProjectCard = ({ project, onToggleLike }: ProjectCardProps) => {
  const { id, image, title, description, tech, link, likes_count, liked } = project;

  return (
    <article className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-white/20 flex flex-col h-full">
      {/* Imagen arriba */}
      <div className="w-full h-40 bg-gray-200">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Contenido abajo */}
      <div className="flex flex-col min-w-0 p-2">
        <h3 className="text-xs font-semibold text-white mb-0.5">{title}</h3>
        <p className="text-[10px] text-gray-200 line-clamp-2 mb-1">{description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-0.5 mb-1">
          {tech.map((t) => (
            <span
              key={t}
              className="px-1 py-0.5 text-[8px] bg-purple-600/50 text-purple-200 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-0.5 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
          >
            Ver más
          </a>

          <button
            onClick={() => onToggleLike(id)}
            className="flex items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <Heart
              size={12}
              className={liked ? "fill-red-500 text-red-500" : "text-white/60"}
            />
            <span className="text-[10px] font-medium">{likes_count}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
