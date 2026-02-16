// Projects.tsx — Página de proyectos.
// Carga los proyectos desde la API; si falla, usa datos locales de respaldo.
// Cada proyecto se muestra en una tarjeta (ProjectCard) con sistema de likes.
// Al final incluye ReviewSection para que los usuarios dejen opiniones con estrellas.

import { useState, useEffect } from "react";
import ProjectCard from "../components/projectCard/ProjectCard";
import ReviewSection from "../components/reviews/ReviewSection";
import { getProjects, toggleLike } from "../services/api";
import { projects as localProjects } from "../data/projects";
import type { Project } from "../types";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos proyectos de la API; si hay error, usamos los datos locales
  useEffect(() => {
    getProjects()
      .then((apiProjects) =>
        setProjects(
          apiProjects.map((p) => ({
            ...p,
            image: p.image || localProjects.find((lp) => lp.id === p.id)?.image || "",
          }))
        )
      )
      .catch(() => {
        setProjects(
          localProjects.map((p) => ({ ...p, likes_count: 0, liked: false }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // Alterna el like de un proyecto y actualiza el estado local
  const handleToggleLike = async (id: number) => {
    try {
      const result = await toggleLike(id);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, likes_count: result.likes_count, liked: result.liked }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
      <section className="relative min-h-full flex flex-col px-4 pb-4">

      <div className="text-center mb-3 pt-2">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Mis Proyectos
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {projects.slice(0, 4).map((project) => (
            <div key={project.id} className="w-full sm:w-[calc(50%-0.5rem)]">
              <ProjectCard
                project={project}
                onToggleLike={handleToggleLike}
              />
            </div>
          ))}
        </div>
      )}

      <ReviewSection />
    </section>
  );
};

export default Projects;
