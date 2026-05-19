import { useState, useEffect } from "react";
import { ExternalLink, Trash2, RefreshCw, Plus, X, FileText, MapPin, Building2, Send } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  url: string;
  location: string;
  salary: string;
  tech: string;
  status: Status;
  notes: string;
  source: string;
  match_score: number;
  cover_letter: string;
  created_at: string;
  applied_at: string | null;
  is_disability: number;
}

type Status = "nueva" | "pre-aplicada" | "aplicada" | "entrevista" | "oferta" | "rechazada";

const COLUMNS: { key: Status; label: string; color: string; bg: string }[] = [
  { key: "nueva",        label: "Nueva",        color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20" },
  { key: "pre-aplicada", label: "Pre-aplicada",  color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { key: "aplicada",     label: "Aplicada",      color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { key: "entrevista",   label: "Entrevista",    color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  { key: "oferta",       label: "Oferta",        color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20" },
  { key: "rechazada",    label: "Rechazada",     color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20" },
];

const token = () => sessionStorage.getItem("adminToken") ?? "";
const api = (path: string, opts?: RequestInit) =>
  fetch(`/api/jobs${path}`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, ...opts });

export default function JobKanban() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<{ by_status: { status: string; count: number }[]; avg_score: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [selected, setSelected] = useState<Job | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [onlyDisability, setOnlyDisability] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", url: "", location: "", salary: "" });

  const load = async () => {
    const [jRes, sRes] = await Promise.all([api("/"), api("/stats")]);
    setJobs(await jRes.json());
    setStats(await sRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: Status) => {
    await api(`/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const deleteJob = async (id: number) => {
    await api(`/${id}`, { method: "DELETE" });
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const [applying, setApplying] = useState(false);

  const applyNow = async (id: number) => {
    setApplying(true);
    try {
      const res = await api(`/${id}/apply`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("✅ Candidatura enviada correctamente");
        await load();
      } else {
        alert(`⚠️ No se pudo enviar: ${data.reason}`);
      }
    } finally { setApplying(false); }
  };

  const scrapeNow = async () => {
    setScraping(true);
    try {
      const res = await api("/scrape", { method: "POST" });
      const data = await res.json();
      await load();
      alert(`✅ Scraping completado\nRemotive: ${data.scraped_remotive} nuevas\nDiscapacidad: ${data.scraped_disability} nuevas\nAuto-aplicadas hoy: ${data.auto_applied}`);
    } finally { setScraping(false); }
  };

  const addManual = async () => {
    if (!form.title || !form.company) return;
    await api("/", { method: "POST", body: JSON.stringify(form) });
    setForm({ title: "", company: "", url: "", location: "", salary: "" });
    setAddOpen(false);
    await load();
  };

  const scoreColor = (s: number) => s >= 75 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400";
  const techArr = (raw: string): string[] => { try { return JSON.parse(raw); } catch { return []; } };

  const visibleJobs = onlyDisability ? jobs.filter(j => j.is_disability) : jobs;

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Cargando ofertas...</div>;

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Total", value: stats.total, cls: "text-white" },
            { label: "Match medio", value: `${stats.avg_score}%`, cls: scoreColor(stats.avg_score) },
            { label: "Aplicadas", value: stats.by_status.find(s => s.status === "aplicada")?.count ?? 0, cls: "text-yellow-400" },
            { label: "Entrevistas", value: stats.by_status.find(s => s.status === "entrevista")?.count ?? 0, cls: "text-purple-400" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-white/[0.04] rounded-xl p-3 border border-white/8">
              <div className="text-xs text-white/40">{label}</div>
              <div className={`text-xl font-bold ${cls}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={scrapeNow} disabled={scraping}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-all disabled:opacity-50">
          <RefreshCw size={12} className={scraping ? "animate-spin" : ""} />
          {scraping ? "Scrapeando..." : "Scrape ahora"}
        </button>
        <button onClick={() => setAddOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 transition-all">
          <Plus size={12} /> Manual
        </button>
        <button onClick={() => setOnlyDisability(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            onlyDisability
              ? "bg-blue-500/20 border-blue-400/40 text-blue-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
          }`}>
          ♿ Discapacidad {onlyDisability && `(${jobs.filter(j => j.is_disability).length})`}
        </button>
      </div>

      {/* Add form */}
      {addOpen && (
        <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {(["title", "company", "url", "location", "salary"] as const).map(f => (
              <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                className="col-span-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-secondary/40"
              />
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <button onClick={addManual} className="px-3 py-1.5 rounded-lg bg-secondary/15 text-secondary text-xs font-semibold border border-secondary/30 hover:bg-secondary/25 transition-all">Guardar</button>
            <button onClick={() => setAddOpen(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs border border-white/10">Cancelar</button>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 overflow-x-auto">
        {COLUMNS.map(col => {
          const colJobs = visibleJobs.filter(j => j.status === col.key);
          return (
            <div key={col.key} className={`flex flex-col gap-2 rounded-xl p-2 border min-h-[180px] ${col.bg}`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${col.color}`}>{col.label}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 ${col.color}`}>{colJobs.length}</span>
              </div>
              {colJobs.map(job => (
                <div key={job.id} onClick={() => setSelected(job)}
                  className="bg-white/[0.05] hover:bg-white/[0.09] border border-white/8 rounded-lg p-2 cursor-pointer transition-all">
                  {job.is_disability === 1 && <span className="text-[9px] text-blue-300">♿ </span>}
                  <div className="text-[10px] font-semibold text-white leading-tight line-clamp-2">{job.title}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building2 size={8} className="text-white/30 shrink-0" />
                    <span className="text-[9px] text-white/35 truncate">{job.company}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[9px] font-bold ${scoreColor(job.match_score)}`}>{job.match_score}%</span>
                    <span className="text-[8px] text-white/20 font-mono truncate max-w-[50px]">{job.source.replace("tecnoempleo-discapacidad","tecno-dis")}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#0d1117] border border-white/12 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                {selected.is_disability === 1 && <span className="text-[10px] text-blue-400 font-semibold">♿ Cuota discapacidad</span>}
                <h3 className="text-sm font-bold text-white">{selected.title}</h3>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-white/50 flex items-center gap-1"><Building2 size={10} />{selected.company}</span>
                  {selected.location && <span className="text-xs text-white/50 flex items-center gap-1"><MapPin size={10} />{selected.location}</span>}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/6 text-white/30 font-mono">{selected.source}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/70 shrink-0"><X size={16} /></button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${scoreColor(selected.match_score)}`}>Match: {selected.match_score}%</span>
              {selected.salary && <span className="text-xs text-white/40">{selected.salary}</span>}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Estado</span>
              <div className="flex gap-1.5 flex-wrap">
                {COLUMNS.map(col => (
                  <button key={col.key} onClick={() => updateStatus(selected.id, col.key)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      selected.status === col.key
                        ? `${col.color} ${col.bg} border-current`
                        : "text-white/30 bg-white/4 border-white/10 hover:bg-white/8"
                    }`}>
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech */}
            {techArr(selected.tech).length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {techArr(selected.tech).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/8 text-secondary/70 border border-secondary/15 font-mono">{t}</span>
                ))}
              </div>
            )}

            {/* Cover letter */}
            {selected.cover_letter && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider flex items-center gap-1"><FileText size={10} />Carta generada</span>
                <p className="text-[11px] text-white/60 leading-relaxed bg-white/[0.03] rounded-lg p-3 border border-white/8 whitespace-pre-wrap">{selected.cover_letter}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-white/8 flex-wrap">
              {selected.url && (
                <a href={selected.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-all">
                  <ExternalLink size={11} /> Ver oferta
                </a>
              )}
              {selected.url?.includes("greenhouse.io") && selected.cover_letter && selected.status !== "aplicada" && (
                <button onClick={() => applyNow(selected.id)} disabled={applying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-all disabled:opacity-50">
                  <Send size={11} /> {applying ? "Enviando..." : "Aplicar ahora"}
                </button>
              )}
              <button onClick={() => deleteJob(selected.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all ml-auto">
                <Trash2 size={11} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
