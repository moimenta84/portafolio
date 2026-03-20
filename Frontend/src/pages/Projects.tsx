import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Github } from "lucide-react";
import SEO from "../components/SEO";
import ProjectCard from "../components/projectCard/ProjectCard";
import ReviewSection from "../components/reviews/ReviewSection";
import { getProjects, toggleLike } from "../services/api";
import { projects as localProjects } from "../data/projects";
import type { Project } from "../types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Skeleton card mientras carga
const SkeletonCard = () => (
  <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-32 sm:h-48 bg-white/5" />
    <div className="p-3 flex flex-col gap-2.5">
      <div className="h-3 bg-white/8 rounded-full w-3/4" />
      <div className="h-2.5 bg-white/5 rounded-full w-full" />
      <div className="h-2.5 bg-white/5 rounded-full w-2/3" />
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-5 w-14 bg-white/5 rounded-full" />
        ))}
      </div>
      <div className="h-8 bg-white/5 rounded-xl mt-auto" />
    </div>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((apiProjects) =>
        setProjects(
          apiProjects.map((p) => {
            const local = localProjects.find((lp) => lp.id === p.id);
            return { ...p, image: p.image || local?.image || "", gif: local?.gif };
          })
        )
      )
      .catch(() => {
        setProjects(localProjects.map((p) => ({ ...p, likes_count: 0, liked: false })));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleLike = async (id: number) => {
    try {
      const result = await toggleLike(id);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes_count: result.likes_count, liked: result.liked } : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <section className="relative flex-1 flex flex-col pt-8 pb-8">
      <SEO
        title="Proyectos — Iker Martínez"
        description="Proyectos full stack de Iker Martínez: microservicios Spring Boot, APIs REST, React + TypeScript. Aplicaciones desplegadas con Docker y CI/CD."
        path="/projects"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-col gap-8"
      >

        {/* HEADER */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="section-divider flex-1 max-w-[60px]" />
            <span className="text-secondary font-mono text-[11px] font-semibold tracking-widest uppercase">
              Portfolio
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                Proyectos{" "}
                <span className="gradient-text">reales</span>
              </h1>
              <p className="text-sm md:text-[15px] text-white/60 max-w-2xl leading-relaxed">
                Aplicaciones full stack orientadas a entornos enterprise. APIs REST, microservicios, autenticación JWT, CI/CD y arquitectura limpia aplicada desde el primer commit.
              </p>
            </div>

            <a
              href="https://github.com/moimenta84"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/70 text-xs font-semibold hover:border-secondary hover:text-secondary transition-all duration-200 shrink-0"
            >
              <Github size={14} />
              Ver en GitHub
            </a>
          </div>
        </motion.div>

        {/* PROJECTS GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {projects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
              >
                <ProjectCard project={project} onToggleLike={handleToggleLike} />
              </motion.div>
            ))}
          </div>
        )}

        {/* REVIEWS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <ReviewSection />
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Projects;
