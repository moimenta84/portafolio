import { useState, useEffect } from "react";
import { Star, Trash2, Lock, FolderGit2, Plus, Pencil, X, ExternalLink, BarChart2, Users, Eye, TrendingUp, MapPin, Building2, FileDown, Clock, Globe } from "lucide-react";
import {
  login,
  getAllReviews,
  deleteReview,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getVisitStats,
  getCvDownloads,
} from "../services/api";
import type { Project, Review } from "../types";

// ─── Tipos internos ───────────────────────────────────────────────────────────

type Tab = "reviews" | "projects" | "stats";

interface ProjectForm {
  title: string;
  description: string;
  image: string;
  tech: string; // comma-separated
  link: string;
}

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  image: "",
  tech: "",
  link: "",
};

// ─── Componente principal ─────────────────────────────────────────────────────

const Admin = () => {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem("adminToken")
  );
  const [input, setInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState<Tab>("reviews");

  // ── Reviews state ──
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // ── Projects state ──
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ── Stats state ──
  const [stats, setStats] = useState<{
    unique_visitors: number;
    total_page_views: number;
    today_visitors: number;
    avg_duration_seconds: number;
    by_page: { page: string; views: number; unique_visitors: number }[];
    by_region: { region: string; visitors: number }[];
    by_referrer: { referrer: string; visitors: number }[];
    empresa_visitors: number;
    usuario_visitors: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── CV downloads state ──
  const [cvStats, setCvStats] = useState<{
    total_downloads: number;
    unique_downloads: number;
    today_downloads: number;
  } | null>(null);

  // ── Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    try {
      const { token } = await login(input);
      sessionStorage.setItem("adminToken", token);
      setAuthed(true);
    } catch {
      setLoginError(true);
      setInput("");
    }
  };

  // ── Cargar datos al autenticarse ──
  useEffect(() => {
    if (!authed) return;

    setReviewsLoading(true);
    getAllReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setReviewsLoading(false));

    setProjectsLoading(true);
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setProjectsLoading(false));

    setStatsLoading(true);
    getVisitStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    getCvDownloads()
      .then(setCvStats)
      .catch(() => {});
  }, [authed]);

  // ── Reviews ──
  const handleDeleteReview = async (id: number) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  // ── Projects: abrir modal ──
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image,
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech,
      link: p.link,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  // ── Projects: guardar ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      link: form.link.trim(),
    };
    try {
      if (editing) {
        const updated = await updateProject(editing.id, payload);
        setProjects((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...updated } : p))
        );
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [...prev, { ...created, likes_count: 0, liked: false }]);
      }
      closeModal();
    } catch {
      // el error no bloquea el flujo
    } finally {
      setSaving(false);
    }
  };

  // ── Projects: eliminar ──
  const handleDeleteProject = async (id: number) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  // ─── Login ────────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-8 w-72"
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Lock size={16} />
            <span className="text-sm font-semibold">Acceso restringido</span>
          </div>
          {loginError && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              Contraseña incorrecta
            </p>
          )}
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setLoginError(false); }}
            placeholder="Contraseña"
            autoFocus
            className={`px-3 py-2 bg-white/5 border rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none transition ${
              loginError ? "border-red-400/50" : "border-white/10 focus:border-cyan-400/50"
            }`}
          />
          <button
            type="submit"
            className="py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-semibold rounded-lg text-sm cursor-pointer hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ─── Panel principal ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-darkBg px-6 py-10 text-white">
      <div className="max-w-3xl mx-auto">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Panel de administración</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("adminToken");
              setAuthed(false);
            }}
            className="text-xs text-white/30 hover:text-white/60 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex gap-1 mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setTab("reviews")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              tab === "reviews"
                ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Star size={14} />
            Reseñas
            {reviews.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded-full text-[10px]">
                {reviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              tab === "projects"
                ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <FolderGit2 size={14} />
            Proyectos
            {projects.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded-full text-[10px]">
                {projects.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("stats")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              tab === "stats"
                ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/20"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <BarChart2 size={14} />
            Estadísticas
          </button>
        </div>

        {/* ── TAB: RESEÑAS ── */}
        {tab === "reviews" && (
          <div>
            {reviews.length > 0 && (
              <p className="text-xs text-white/40 mb-4">
                {reviews.length} reseña{reviews.length !== 1 ? "s" : ""} · media{" "}
                {avgRating.toFixed(1)} ★
              </p>
            )}

            {reviewsLoading && <Spinner />}

            {!reviewsLoading && reviews.length === 0 && (
              <p className="text-white/30 text-sm text-center py-12">
                Todavía no hay reseñas.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-white">
                          {review.name}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={11}
                              className={
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-white/15"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-[10px] text-white/30 mt-2">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-white/20 hover:text-red-400 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: PROYECTOS ── */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/40">
                {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 rounded-lg text-xs text-cyan-400 font-medium transition cursor-pointer"
              >
                <Plus size={13} />
                Nuevo proyecto
              </button>
            </div>

            {projectsLoading && <Spinner />}

            {!projectsLoading && projects.length === 0 && (
              <p className="text-white/30 text-sm text-center py-12">
                No hay proyectos todavía.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-white">
                          {project.title}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(project.tech) ? project.tech : []).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-400/10 text-cyan-300 rounded-full border border-cyan-400/15"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-white/30">
                        <span>❤ {project.likes_count}</span>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            <ExternalLink size={10} />
                            Ver enlace
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(project)}
                        className="text-white/20 hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      {deleteConfirm === project.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer font-medium"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-[10px] text-white/30 hover:text-white/60 cursor-pointer ml-1"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(project.id)}
                          className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: ESTADÍSTICAS ── */}
        {tab === "stats" && (
          <div>
            {statsLoading && <Spinner />}

            {!statsLoading && stats && (
              <>
                {/* Tarjetas resumen */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <Users size={13} />
                      Visitantes únicos
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.unique_visitors}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <Eye size={13} />
                      Páginas vistas
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.total_page_views}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <TrendingUp size={13} />
                      Hoy
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">{stats.today_visitors}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                      <Clock size={13} />
                      Duración media
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {stats.avg_duration_seconds > 0
                        ? `${Math.floor(stats.avg_duration_seconds / 60)}m ${stats.avg_duration_seconds % 60}s`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* CV Downloads */}
                {cvStats && (
                  <>
                    <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Curriculum Vitae</p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                          <FileDown size={13} />
                          Total descargas
                        </div>
                        <span className="text-2xl font-bold text-white">{cvStats.total_downloads}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                          <Users size={13} />
                          Personas únicas
                        </div>
                        <span className="text-2xl font-bold text-white">{cvStats.unique_downloads}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                          <TrendingUp size={13} />
                          Hoy
                        </div>
                        <span className="text-2xl font-bold text-cyan-400">{cvStats.today_downloads}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Tipo de visitante */}
                {(stats.empresa_visitors > 0 || stats.usuario_visitors > 0) && (
                  <>
                    <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Tipo de visitante</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                          <Users size={13} />
                          Usuarios residenciales
                        </div>
                        <span className="text-2xl font-bold text-white">{stats.usuario_visitors}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                          <Building2 size={13} />
                          Empresas / corporativo
                        </div>
                        <span className="text-2xl font-bold text-cyan-400">{stats.empresa_visitors}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Desglose por provincia */}
                {stats.by_region.length > 0 && (
                  <>
                    <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">
                      <MapPin size={11} className="inline mr-1" />
                      Por provincia / región
                    </p>
                    <div className="flex flex-col gap-2 mb-6">
                      {stats.by_region.map((r) => {
                        const maxVisitors = stats.by_region[0].visitors;
                        const pct = Math.round((r.visitors / maxVisitors) * 100);
                        return (
                          <div key={r.region} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-white">{r.region}</span>
                              <span className="text-xs text-white/60 font-semibold">{r.visitors} visitante{r.visitors !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-400/60 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Origen del tráfico */}
                {stats.by_referrer.length > 0 && (
                  <>
                    <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">
                      <Globe size={11} className="inline mr-1" />
                      Origen del tráfico
                    </p>
                    <div className="flex flex-col gap-2 mb-6">
                      {stats.by_referrer.map((r) => {
                        const max = stats.by_referrer[0].visitors;
                        const pct = Math.round((r.visitors / max) * 100);
                        return (
                          <div key={r.referrer} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-white capitalize">{r.referrer}</span>
                              <span className="text-xs text-white/60 font-semibold">{r.visitors}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400/60 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Desglose por página */}
                <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Por página</p>
                <div className="flex flex-col gap-2">
                  {stats.by_page.map((p) => {
                    const pct = stats.total_page_views > 0
                      ? Math.round((p.views / stats.total_page_views) * 100)
                      : 0;
                    return (
                      <div key={p.page} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-white">{p.page || "/"}</span>
                          <div className="flex items-center gap-3 text-xs text-white/40">
                            <span>{p.unique_visitors} únicos</span>
                            <span className="text-white/60 font-semibold">{p.views} vistas</span>
                          </div>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400/60 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {!statsLoading && !stats && (
              <p className="text-white/30 text-sm text-center py-12">
                No hay datos de visitas todavía.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: Crear / Editar proyecto ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl">
            {/* Cabecera modal */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">
                {editing ? "Editar proyecto" : "Nuevo proyecto"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/30 hover:text-white/70 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              {/* Título */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nombre del proyecto"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe el proyecto brevemente..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 resize-none"
                />
              </div>

              {/* URL imagen */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  URL de imagen
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              {/* Tecnologías */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Tecnologías{" "}
                  <span className="text-white/25">(separadas por coma)</span>
                </label>
                <input
                  type="text"
                  value={form.tech}
                  onChange={(e) => setForm({ ...form, tech: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              {/* Enlace */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Enlace del proyecto
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/60 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-90 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Spinner reutilizable ─────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="w-7 h-7 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Admin;
