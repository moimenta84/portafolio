import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ExternalLink,
  Clock,
  TrendingUp,
  BookOpen,
  Send,
  ChevronRight,
  Newspaper,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string | null;
  published_at: string;
  source: string;
  category: string;
}

interface NewsSource {
  id: string;
  name: string;
  category: string;
}

const Newsletter = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [activeSource, setActiveSource] = useState("all");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");

  const fetchNews = useCallback(async (sourceId: string) => {
    setLoading(true);
    try {
      const endpoint = sourceId === "all" ? "/api/news" : `/api/news/${sourceId}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setArticles(data.articles || []);
      if (data.sources) setSources(data.sources);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeSource);
  }, [activeSource, fetchNews]);

  const handleSourceChange = (id: string) => setActiveSource(id);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    setSubError("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al suscribirse");

      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch {
      setSubError("Error al suscribirse");
      setTimeout(() => setSubError(""), 4000);
    } finally {
      setSubLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diff < 1) return "Ahora";
    if (diff < 24) return `Hace ${diff}h`;
    const days = Math.floor(diff / 24);
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const featured = articles[0];
  const secondaryArticles = articles.slice(1, 5);
  const trendingArticles = articles.slice(5, 10);

  return (
    <section className="relative flex-1 flex flex-col overflow-x-hidden">
      <div className="max-w-5xl mx-auto text-white px-4 md:px-6 flex-1 flex flex-col min-h-0 py-4 w-full">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-xs text-cyan-400 font-medium">
              <Newspaper size={12} />
              Feed
            </div>
            <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/10 to-transparent w-16" />
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-1"
          >
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-0 w-36 px-2.5 py-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-xs"
              />
              <button
                type="submit"
                disabled={subLoading}
                className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-md transition text-xs shrink-0 disabled:opacity-60"
              >
                <Send size={10} />
                {subLoading ? "..." : subscribed ? "¡Listo!" : "Suscribir"}
              </button>
            </div>
            {subError && (
              <p className="text-[10px] text-red-400 px-1">{subError}</p>
            )}
          </form>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleSourceChange("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
              activeSource === "all"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Todas
          </button>
          {sources.map((src) => (
            <button
              key={src.id}
              onClick={() => handleSourceChange(src.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                activeSource === src.id
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {src.name}
            </button>
          ))}
          <button
            onClick={() => fetchNews(activeSource)}
            disabled={loading}
            className="ml-auto p-1 text-white/50 hover:text-cyan-400 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <BookOpen size={32} className="text-white/20 mb-2" />
            <p className="text-white/50 text-xs mb-2">No se pudieron cargar las noticias</p>
            <button
              onClick={() => fetchNews(activeSource)}
              className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-xs"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 flex-1 min-h-0 items-start">

            {/* MAIN CONTENT */}
            <div className="flex flex-col gap-3 min-h-0">
              {/* Featured */}
              {featured && <FeaturedCard article={featured} formatDate={formatDate} />}

              {/* Secondary articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {secondaryArticles.map((article) => (
                  <CompactCard key={article.id} article={article} formatDate={formatDate} />
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex flex-col">
              <h3 className="flex items-center gap-1.5 text-xs font-bold mb-3 text-white shrink-0">
                <TrendingUp size={12} className="text-cyan-400" />
                Tendencias
              </h3>
              <div className="flex flex-col divide-y divide-white/[0.05]">
                {trendingArticles.map((article, i) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 group py-2"
                  >
                    <span className="text-sm font-black text-white/50 group-hover:text-cyan-400 transition w-5 shrink-0 leading-tight">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-cyan-400 transition line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                      <p className="text-xs text-white/60 mt-0.5">
                        {article.source} · {formatDate(article.published_at)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── SUBCOMPONENTES ─── */

function FeaturedCard({
  article,
  formatDate,
}: {
  article: NewsArticle;
  formatDate: (d: string) => string;
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all shrink-0"
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-36 sm:h-44 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
          <Newspaper size={32} className="text-white/20" />
        </div>
      )}

      {/* Gradiente más oscuro para que el texto blanco sea siempre legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="px-2 py-0.5 text-[10px] bg-cyan-400/25 text-cyan-200 rounded-full font-semibold">
            {article.source}
          </span>
          <span className="px-2 py-0.5 text-[10px] bg-white/15 text-white rounded-full capitalize">
            {article.category}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 leading-snug mb-1">
          {article.title}
        </h2>
        <p className="text-white/85 text-[11px] line-clamp-1 mb-1.5">{article.description}</p>
        <div className="flex items-center gap-3 text-[10px] text-white/70">
          <span className="flex items-center gap-1">
            <Clock size={9} />
            {formatDate(article.published_at)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <ExternalLink size={9} />
            <span className="truncate">{new URL(article.url).hostname.replace("www.", "")}</span>
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="flex items-center gap-0.5 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-semibold rounded-full">
          Leer <ChevronRight size={10} />
        </span>
      </div>
    </a>
  );
}

function CompactCard({
  article,
  formatDate,
}: {
  article: NewsArticle;
  formatDate: (d: string) => string;
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-2.5 bg-white/[0.04] border border-white/10 rounded-lg p-2 hover:border-cyan-400/30 hover:bg-white/[0.07] transition-all"
    >
      {/* Thumbnail */}
      <div className="w-20 h-16 rounded-md overflow-hidden shrink-0">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-700/60 flex items-center justify-center">
            <BookOpen size={14} className="text-white/30" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-0.5">
            {article.source}
          </p>
          <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-white/55 mt-1">
          <Clock size={9} />
          {formatDate(article.published_at)}
        </span>
      </div>
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 flex-1">
      <div className="space-y-3">
        <div className="h-36 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2 bg-white/5 rounded-lg p-2 animate-pulse">
              <div className="w-20 h-16 bg-white/10 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-2 bg-white/10 rounded w-1/3" />
                <div className="h-2.5 bg-white/10 rounded w-full" />
                <div className="h-2.5 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 rounded-xl animate-pulse" />
    </div>
  );
}

export default Newsletter;
