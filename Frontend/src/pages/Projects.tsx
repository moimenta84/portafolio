import { useState, useEffect } from "react";
import { FolderGit2 } from "lucide-react";
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
    <section className="relative flex-1 flex flex-col px-4 md:px-6 py-4">
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-xs text-cyan-400 font-medium">
            <FolderGit2 size={12} />
            Proyectos
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
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
