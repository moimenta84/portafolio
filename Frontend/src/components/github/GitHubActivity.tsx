// GitHubActivity.tsx — Mapa real de contribuciones + stats + terminal feed + código decorativo.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommitHorizontal, Github, Flame, Star, BookOpen, Users, ExternalLink, GitPullRequest, GitMerge, GitFork } from "lucide-react";

const GH_USER = "moimenta84";
const GH_URL  = `https://github.com/${GH_USER}`;

// ─── Tipos ─────────────────────────────────────────────────────────────────
interface Contribution { date: string; count: number; level: 0|1|2|3|4; }
interface ContribAPI   { total: { lastYear: number }; contributions: Contribution[]; }
interface GHProfile    { public_repos: number; followers: number; }
interface GHEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: { commits?: { message: string }[]; size?: number };
}
interface GHRepo { language: string | null; }
interface GHPR {
  title: string;
  html_url: string;
  state: "open" | "closed";
  pull_request: { merged_at: string | null };
  number: number;
  repository_url: string;
  created_at: string;
}
interface GHSearchResult { items: GHPR[]; }

// ─── Colores cyan por nivel ────────────────────────────────────────────────
const CELL_STYLE: Record<number, string> = {
  0: "bg-white/[0.04] border border-white/[0.07]",
  1: "bg-cyan-900/50  border border-cyan-800/30",
  2: "bg-cyan-700/65  border border-cyan-600/40",
  3: "bg-cyan-500/80  border border-cyan-400/60",
  4: "bg-cyan-400     border border-cyan-300",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function relativeDate(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
  if (diff < 86400)return `hace ${Math.floor(diff/3600)}h`;
  const d = Math.floor(diff/86400);
  return `hace ${d} día${d !== 1 ? "s" : ""}`;
}

function getMonthLabels(contributions: Contribution[]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  let lastMonth = -1;
  contributions.forEach((c, i) => {
    const m = new Date(c.date).getMonth();
    if (m !== lastMonth) { labels.push({ label: MONTHS[m], col: Math.floor(i / 7) }); lastMonth = m; }
  });
  return labels;
}

function computeStreak(contributions: Contribution[]): number {
  const sorted = [...contributions].reverse();
  let streak = 0;
  for (const c of sorted) {
    if (c.count > 0) streak++;
    else if (streak > 0) break;
  }
  return streak;
}

// ─── Snippet Java decorativo ───────────────────────────────────────────────
const JAVA_SNIPPET = `@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(
            @PathVariable Long id) {
        return userService
            .findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity
                .notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(
            @Valid @RequestBody
            CreateUserRequest req) {
        return userService.create(req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(
            @PathVariable Long id) {
        userService.delete(id);
    }
}

@Service
@Transactional
public class UserServiceImpl
        implements UserService {

    @Autowired
    private UserRepository repo;

    @Override
    public Optional<UserDTO> findById(
            Long id) {
        return repo.findById(id)
            .map(UserMapper::toDTO);
    }
}`;

// Syntax highlight muy simple
function highlight(code: string) {
  const keywords = /\b(public|private|class|interface|void|return|new|import|package|extends|implements|throws|try|catch|if|else|for|while|static|final|null|this|super|true|false|new|var)\b/g;
  const annotations = /(@\w+)/g;
  const strings = /(".*?")/g;
  const types = /\b(String|Long|List|Optional|ResponseEntity|HttpStatus|UserDTO|UserService|UserRepository|CreateUserRequest|UserServiceImpl|UserController|UserMapper)\b/g;
  const comments = /(\/\/.*)/g;

  return code
    .replace(strings, '<span style="color:#86efac">$1</span>')
    .replace(comments, '<span style="color:#64748b;font-style:italic">$1</span>')
    .replace(annotations, '<span style="color:#f0abfc">$1</span>')
    .replace(keywords, '<span style="color:#67e8f9">$1</span>')
    .replace(types, '<span style="color:#fde68a">$1</span>');
}

// ─── Componente: Terminal de commits ───────────────────────────────────────
function CommitTerminal({ events }: { events: GHEvent[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    const id = setInterval(() => {
      setVisible(v => (v < events.length ? v + 1 : v));
    }, 600);
    return () => clearInterval(id);
  }, [events.length]);

  return (
    <div className="h-full bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden font-mono text-xs flex flex-col">
      {/* Terminal bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.07] bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-white/30 text-[10px]">~/actividad — bash</span>
      </div>

      <div className="p-3 flex-1 flex flex-col gap-3 overflow-hidden">
        <AnimatePresence>
          {events.slice(0, visible).map((ev, i) => {
            const msg = ev.payload.commits?.[0]?.message ?? "update";
            const repo = ev.repo.name.replace(`${GH_USER}/`, "");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-0.5"
              >
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400 shrink-0">$</span>
                  <span className="text-white/80">
                    git commit -m{" "}
                    <span className="text-green-400">
                      "{msg.length > 55 ? msg.slice(0, 55) + "…" : msg}"
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <a
                    href={`${GH_URL}/${repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
                  >
                    {repo}
                  </a>
                  <span className="text-white/25">·</span>
                  <span className="text-white/35">{relativeDate(ev.created_at)}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Cursor parpadeante */}
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-400">$</span>
          <span className="w-2 h-3.5 bg-cyan-400/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/8">
      <Icon size={14} className={color} />
      <span className={`text-lg font-black tabular-nums ${color}`}>{value}</span>
      <span className="text-[10px] text-white/40 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Tech stack ────────────────────────────────────────────────────────────
const DV = (n: string, v = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}/${n}-${v}.svg`;

const TECH_CATEGORIES = [
  {
    label: "Backend",    color: "text-amber-400",  border: "border-amber-400/20",
    techs: [
      { name: "Java",          icon: DV("java") },
      { name: "Spring Boot",   icon: DV("spring") },
      { name: "Spring Sec.",   icon: DV("spring", "plain") },
      { name: "Maven",         icon: DV("maven", "plain") },
      { name: "Hibernate",     icon: DV("hibernate", "plain") },
    ],
  },
  {
    label: "Frontend",   color: "text-cyan-400",    border: "border-cyan-400/20",
    techs: [
      { name: "React",         icon: DV("react") },
      { name: "TypeScript",    icon: DV("typescript", "plain") },
      { name: "JavaScript",    icon: DV("javascript", "plain") },
      { name: "HTML5",         icon: DV("html5") },
      { name: "CSS3",          icon: DV("css3") },
    ],
  },
  {
    label: "DevOps",     color: "text-blue-400",    border: "border-blue-400/20",
    techs: [
      { name: "Docker",        icon: DV("docker", "plain") },
      { name: "Kubernetes",    icon: DV("kubernetes", "plain") },
      { name: "Git",           icon: DV("git") },
      { name: "GitHub",        icon: DV("github") },
      { name: "Linux",         icon: DV("linux") },
    ],
  },
  {
    label: "Testing",    color: "text-green-400",   border: "border-green-400/20",
    techs: [
      { name: "JUnit",         icon: DV("junit", "plain") },
      { name: "Postman",       icon: DV("postman", "plain") },
    ],
  },
  {
    label: "Databases",  color: "text-purple-400",  border: "border-purple-400/20",
    techs: [
      { name: "MySQL",         icon: DV("mysql") },
      { name: "PostgreSQL",    icon: DV("postgresql") },
      { name: "SQLite",        icon: DV("sqlite", "plain") },
    ],
  },
];

// ─── Componente principal ──────────────────────────────────────────────────
const GitHubActivity = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [profile, setProfile] = useState<GHProfile | null>(null);
  const [events, setEvents] = useState<GHEvent[]>([]);
  const [languages, setLanguages] = useState<{ lang: string; pct: number; color: string }[]>([]);
  const [streak, setStreak] = useState(0);
  const [prs, setPrs] = useState<GHPR[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  // Auto-scroll código Java
  const codeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    let pos = 0;
    const id = setInterval(() => {
      pos += 0.4;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
    }, 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const base = `https://api.github.com/users/${GH_USER}`;
    Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`).then(r => r.json() as Promise<ContribAPI>),
      fetch(`${base}`).then(r => r.json() as Promise<GHProfile>),
      fetch(`${base}/events?per_page=100`).then(r => r.json() as Promise<GHEvent[]>),
      fetch(`${base}/repos?per_page=100`).then(r => r.json() as Promise<GHRepo[]>),
      fetch(`https://api.github.com/search/issues?q=author:${GH_USER}+type:pr+is:merged&sort=created&order=desc&per_page=12`)
        .then(r => r.json() as Promise<GHSearchResult>),
    ]).then(([contribs, prof, evs, repos, prSearch]) => {
      setContributions(contribs.contributions);
      setTotalContribs(contribs.total.lastYear);
      setStreak(computeStreak(contribs.contributions));
      setProfile(prof);

      // Commits del feed
      const pushes = evs.filter(e => e.type === "PushEvent").slice(0, 6);
      setEvents(pushes);

      // Pull Requests
      if (prSearch?.items) setPrs(prSearch.items);

      // Lenguajes
      const LANG_COLORS: Record<string, string> = {
        Java:"#b07219", TypeScript:"#3178c6", JavaScript:"#f1e05a",
        PHP:"#4F5D95", HTML:"#e34c26", CSS:"#563d7c", SCSS:"#c6538c",
      };
      const cnt: Record<string, number> = {};
      for (const r of repos) if (r.language) cnt[r.language] = (cnt[r.language]||0)+1;
      const tot = Object.values(cnt).reduce((a,b)=>a+b,0);
      setLanguages(
        Object.entries(cnt).sort(([,a],[,b])=>b-a).slice(0,5)
          .map(([lang,c])=>({ lang, pct: Math.round(c/tot*100), color: LANG_COLORS[lang]||"#8b8b8b" }))
      );
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  // Scroll al final (reciente a la derecha)
  useEffect(() => {
    if (gridRef.current) gridRef.current.scrollLeft = gridRef.current.scrollWidth;
  }, [contributions]);

  // Agrupar por semanas
  const weeks: Contribution[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }
  const monthLabels = getMonthLabels(contributions);
  const DAYS = ["","L","","X","","V",""];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Mapa de contribuciones ────────────────────────────── */}
      <section aria-label="Mapa de contribuciones GitHub">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GitCommitHorizontal size={15} className="text-secondary" />
            <h3 className="text-sm font-bold text-white">Contribuciones en GitHub</h3>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak */}
            {streak > 0 && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold
                ${streak >= 7
                  ? "bg-orange-500/15 border-orange-400/30 text-orange-400 animate-glow-pulse"
                  : "bg-white/5 border-white/10 text-white/60"}`}
              >
                <Flame size={11} className={streak>=7?"text-orange-400":"text-white/40"} />
                {streak} día{streak!==1?"s":""} de racha
              </div>
            )}
            <span className="text-[11px] text-white/35 font-mono">{totalContribs} en el último año</span>
          </div>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-[#0d1117] border border-white/[0.08] rounded-xl p-3 md:p-4">
            {/* Meses */}
            <div ref={gridRef} className="overflow-x-auto pb-1">
              <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: "3px" }}>
                {/* Row: month labels */}
                <div className="flex gap-[3px] pl-6">
                  {weeks.map((_, wi) => {
                    const label = monthLabels.find(m => m.col === wi);
                    return (
                      <div key={wi} className="w-[11px] shrink-0">
                        {label && (
                          <span className="text-[9px] text-white/30 whitespace-nowrap" style={{ marginLeft: "-2px" }}>
                            {label.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Grid: días × semanas */}
                <div className="flex gap-[3px]">
                  {/* Etiquetas días */}
                  <div className="flex flex-col gap-[3px] mr-1">
                    {DAYS.map((d, i) => (
                      <div key={i} className="w-4 h-[11px] flex items-center justify-end">
                        <span className="text-[9px] text-white/25">{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Semanas */}
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          title={`${day.date}: ${day.count} contribución${day.count!==1?"es":""}`}
                          className={`w-[11px] h-[11px] rounded-[2px] cursor-default transition-transform hover:scale-125 ${CELL_STYLE[day.level]}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05]">
              <a href={GH_URL} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-secondary transition-colors">
                <Github size={11} /> Ver perfil completo
              </a>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/25">Menos</span>
                {[0,1,2,3,4].map(l => <div key={l} className={`w-[11px] h-[11px] rounded-[2px] ${CELL_STYLE[l]}`} />)}
                <span className="text-[10px] text-white/25">Más</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Terminal + Snippet — misma altura via flex stretch ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

        {/* Terminal de commits */}
        <div className="flex flex-col">
          <p className="text-[11px] text-white/40 font-mono uppercase tracking-wider mb-2">Última actividad</p>
          {loading ? (
            <div className="flex-1 min-h-[200px] bg-[#0d1117] border border-white/10 rounded-xl animate-pulse" />
          ) : (
            <div className="flex-1 overflow-hidden">
              <CommitTerminal events={events} />
            </div>
          )}
        </div>

        {/* Código Java decorativo */}
        <div className="flex flex-col">
          <p className="text-[11px] text-white/40 font-mono uppercase tracking-wider mb-2">Snippet real — Spring Boot</p>
          <div
            ref={codeRef}
            className="flex-1 min-h-[200px] bg-[#0d1117] border border-white/10 rounded-xl p-3 overflow-hidden select-none"
            aria-hidden="true"
          >
            <pre
              className="text-[11px] leading-relaxed text-white/75 font-mono"
              dangerouslySetInnerHTML={{ __html: highlight(JAVA_SNIPPET) }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      {!loading && profile && (
        <motion.div
          initial={{ opacity:0, y:12 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <StatCard icon={BookOpen}            label="Repositorios"       value={profile.public_repos}  color="text-cyan-400" />
          <StatCard icon={GitCommitHorizontal} label="Contribuciones/año" value={`${totalContribs}+`}  color="text-secondary" />
          <StatCard icon={Users}               label="Seguidores"         value={profile.followers}     color="text-purple-400" />
          <StatCard icon={Star}                label="Lang. principal"    value="Java"                  color="text-amber-400" />
        </motion.div>
      )}

      {/* ── Pull Requests ─────────────────────────────────────── */}
      {prs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          aria-label="Pull Requests"
        >
          <div className="flex items-center gap-2 mb-3">
            <GitPullRequest size={14} className="text-green-400" />
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Pull Requests</p>
            <span className="ml-auto text-[10px] text-white/30 font-mono">{prs.length} PRs</span>
          </div>
          <div className="flex flex-col gap-2">
            {prs.map(pr => {
              const repoName = pr.repository_url.replace("https://api.github.com/repos/", "");
              const isOwn    = repoName.startsWith(`${GH_USER}/`);
              const shortRepo = repoName.replace(`${GH_USER}/`, "");
              const isMerged  = !!pr.pull_request?.merged_at;
              const isOpen    = pr.state === "open";

              return (
                <motion.a
                  key={pr.number}
                  href={pr.html_url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]
                             hover:border-white/15 hover:bg-white/[0.04] transition-colors group"
                >
                  {/* Estado */}
                  <div className="mt-0.5 shrink-0">
                    {isMerged
                      ? <GitMerge  size={14} className="text-purple-400" />
                      : isOpen
                        ? <GitPullRequest size={14} className="text-green-400" />
                        : <GitPullRequest size={14} className="text-red-400/70" />
                    }
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/80 group-hover:text-white transition-colors truncate leading-snug">
                      {pr.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-[10px] font-mono ${isOwn ? "text-cyan-400/60" : "text-amber-400/70"}`}>
                        {isOwn ? shortRepo : repoName}
                      </span>
                      {!isOwn && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400/50">
                          <GitFork size={9} /> colaboración
                        </span>
                      )}
                      <span className="text-[10px] text-white/25">
                        {new Date(pr.created_at).toLocaleDateString("es-ES", { day:"numeric", month:"short", year:"2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Badge estado */}
                  <span className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border
                    ${isMerged
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      : isOpen
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/25 text-red-400/70"
                    }`}>
                    {isMerged ? "merged" : isOpen ? "open" : "closed"}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ── Lenguajes ─────────────────────────────────────────── */}
      {languages.length > 0 && (
        <motion.div
          initial={{ opacity:0, y:12 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.5 }}
          className="bg-white/[0.02] border border-white/8 rounded-xl p-4"
        >
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">Lenguajes en repos</p>
          <div className="flex flex-col gap-2.5">
            {languages.map(({ lang, pct, color }) => (
              <div key={lang}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/65 font-medium">{lang}</span>
                  <span className="text-xs text-white/35 font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:`${pct}%` }}
                    viewport={{ once:true }}
                    transition={{ duration:0.8, ease:"easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Tech stack ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity:0, y:12 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        transition={{ duration:0.5 }}
        aria-label="Stack tecnológico"
      >
        <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-3">Stack tecnológico</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TECH_CATEGORIES.map(cat => (
            <div key={cat.label} className={`rounded-xl border ${cat.border} p-3 bg-white/[0.02]`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${cat.color}`}>{cat.label}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {cat.techs.map(tech => (
                  <div key={tech.name} className="flex items-center gap-1.5 group">
                    <img src={tech.icon} alt={tech.name} width={16} height={16} loading="lazy"
                      className="w-4 h-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                      onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
                    />
                    <span className="text-[11px] text-white/55 group-hover:text-white/90 transition-colors">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Botón GitHub ──────────────────────────────────────── */}
      <div className="flex justify-center">
        <a
          href={GH_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/15
                     text-white/60 text-sm font-semibold
                     hover:border-secondary hover:text-secondary hover:shadow-lg hover:shadow-secondary/15
                     transition-all duration-200"
        >
          <Github size={15} className="group-hover:rotate-12 transition-transform duration-200" />
          Ver mi GitHub completo
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* ── Frase ─────────────────────────────────────────────── */}
      <p className="text-center text-sm italic text-cyan-400/55 leading-relaxed max-w-lg mx-auto">
        "El código limpio no solo funciona, también se entiende y se mantiene."
      </p>

    </div>
  );
};

export default GitHubActivity;
