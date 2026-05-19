import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, Github } from "lucide-react";
import SEO from "../components/SEO";
import ProjectCard from "../components/projectCard/ProjectCard";
import ReviewSection from "../components/reviews/ReviewSection";
import { getProjects, toggleLike } from "../services/api";
import { projects as localProjects } from "../data/projects";
import type { Project } from "../types";

type Category = "todos" | "backend" | "fullstack";

const FILTERS: { key: Category; label: string; color: string }[] = [
  { key: "todos",     label: "Todos",      color: "from-white/10 to-white/5" },
  { key: "backend",   label: "Backend",    color: "from-violet-500/20 to-violet-500/5" },
  { key: "fullstack", label: "Full Stack", color: "from-secondary/20 to-secondary/5" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.94, y: -10, transition: { duration: 0.2 } },
};

const SkeletonCard = () => (
  <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-32 sm:h-48 bg-white/5" />
    <div className="p-3 flex flex-col gap-2.5">
      <div className="h-3 bg-white/8 rounded-full w-3/4" />
      <div className="h-2.5 bg-white/5 rounded-full w-full" />
      <div className="h-2.5 bg-white/5 rounded-full w-2/3" />
      <div className="flex gap-1">
        {[1, 2, 3].map(i => <div key={i} className="h-5 w-14 bg-white/5 rounded-full" />)}
      </div>
      <div className="h-8 bg-white/5 rounded-xl mt-auto" />
    </div>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Category>("todos");

  useEffect(() => {
    getProjects()
      .then((apiProjects) =>
        setProjects(
          apiProjects.map((p) => {
            const local = localProjects.find((lp) => lp.id === p.id);
            return { ...p, image: p.image || local?.image || "", gif: local?.gif, category: local?.category };
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
        prev.map((p) => p.id === id ? { ...p, likes_count: result.likes_count, liked: result.liked } : p)
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const filtered = activeFilter === "todos"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const countFor = (key: Category) =>
    key === "todos" ? projects.length : projects.filter((p) => p.category === key).length;

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

        {/* FILTER TABS */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } } }}
          className="flex items-center gap-2 flex-wrap"
        >
          {FILTERS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            const count = countFor(key);
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-secondary/15 border border-secondary/40"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className={`relative transition-colors duration-200 ${isActive ? "text-secondary" : "text-white/45 hover:text-white/70"}`}>
                  {label}
                </span>
                {!loading && (
                  <span className={`relative min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-all duration-200 ${
                    isActive
                      ? "bg-secondary/25 text-secondary"
                      : "bg-white/6 text-white/30"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[11px] text-white/25 font-mono">
            <FolderGit2 size={12} />
            {loading ? "—" : `${filtered.length} proyecto${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </motion.div>

        {/* PROJECTS GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <ProjectCard project={project} onToggleLike={handleToggleLike} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
