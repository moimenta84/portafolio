import { useState, useEffect } from "react";
import { FolderGit2 } from "lucide-react";
import SEO from "../components/SEO";
import ProjectCard from "../components/projectCard/ProjectCard";
import ReviewSection from "../components/reviews/ReviewSection";
import { getProjects, toggleLike } from "../services/api";
import { projects as localProjects } from "../data/projects";
import type { Project } from "../types";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="relative flex-1 flex flex-col pt-14 pb-6">
      <SEO
        title="Proyectos"
        description="Proyectos full stack de Iker Martínez: aplicaciones con React, TypeScript y Spring Boot desplegadas en producción. APIs REST, CI/CD y arquitecturas orientadas a empresa."
        path="/projects"
      />
      <div className="flex flex-col gap-4">

        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-xs text-cyan-400 font-medium">
              <FolderGit2 size={12} />
              Proyectos
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl font-light">
            Proyectos personales orientados a entornos reales de empresa. Apps full stack y APIs REST para practicar arquitectura, buenas prácticas y flujos de trabajo de consultoría.
          </p>
        </div>

        {/* PROJECTS GRID */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        )}

        {/* REVIEWS */}
        <ReviewSection />
      </div>
    </section>
  );
};

export default Projects;
