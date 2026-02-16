// Newsletter.tsx — Agregador de noticias tech.
// Consume la API de noticias y las muestra en un layout tipo periódico digital:
// artículo destacado grande, grid de noticias secundarias y sidebar de tendencias.
// Permite filtrar por fuente de noticias y suscribirse por email.
// Incluye un skeleton de carga animado mientras se obtienen los datos.

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

  const handleSourceChange = (id: string) => {
    setActiveSource(id);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
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
  const gridArticles = articles.slice(1, 3);
  const sidebarArticles = articles.slice(3, 10);

  return (
      <section className="relative h-full overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto text-white px-4 flex-1 flex flex-col min-h-0">
        {/* CABECERA + SUSCRIPCIÓN */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-400/20 text-orange-300 rounded-full text-xs font-medium">
              <Newspaper size={12} />
              Noticias Dev
            </div>
            <h1 className="text-lg sm:text-xl font-bold">
              Noticias de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                tecnología
              </span>
            </h1>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1"
          >
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 px-3 py-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-xs"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-lg transition-all text-xs shrink-0"
            >
              <Send size={10} />
              {subscribed ? "¡Suscrito!" : "Suscribirse"}
            </button>
          </form>
        </div>

        {/* PESTAÑAS DE FUENTES */}
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleSourceChange("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeSource === "all"
                ? "bg-orange-400 text-white shadow-lg shadow-orange-400/25"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            Todas
          </button>
          {sources.map((src) => (
            <button
              key={src.id}
              onClick={() => handleSourceChange(src.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeSource === src.id
                  ? "bg-orange-400 text-white shadow-lg shadow-orange-400/25"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {src.name}
            </button>
          ))}

          <button
            onClick={() => fetchNews(activeSource)}
            disabled={loading}
            className="ml-auto p-1 text-white/40 hover:text-orange-400 transition"
            title="Actualizar"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <div className="text-center py-10">
            <BookOpen size={36} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/40 text-sm">No se pudieron cargar las noticias</p>
            <button
              onClick={() => fetchNews(activeSource)}
              className="mt-2 px-3 py-1.5 bg-orange-400 rounded-lg text-xs"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
            {/* CONTENIDO PRINCIPAL */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {/* ARTÍCULO DESTACADO */}
              {featured && <FeaturedCard article={featured} formatDate={formatDate} />}

              {/* GRID DE ARTÍCULOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                {gridArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>

            {/* BARRA LATERAL */}
            <div className="space-y-3 min-h-0">
              {/* TENDENCIAS */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3">
                <h3 className="flex items-center gap-1.5 text-sm font-bold mb-2">
                  <TrendingUp size={14} className="text-orange-400" />
                  Más recientes
                </h3>
                <div className="space-y-2">
                  {sidebarArticles.map((article, i) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-2 group"
                    >
                      <span className="text-lg font-black text-white/10 group-hover:text-orange-400/30 transition w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white/80 group-hover:text-orange-400 transition line-clamp-1 leading-snug">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                          <span>{article.source}</span>
                          <span>·</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* FUENTES */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3">
                <h3 className="text-sm font-bold mb-2">Nuestras fuentes</h3>
                <div className="space-y-1.5">
                  {sources.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => handleSourceChange(src.id)}
                      className="flex items-center justify-between w-full px-2 py-1 rounded-lg bg-white/5 hover:bg-orange-400/10 transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <Newspaper size={10} className="text-orange-400/60" />
                        <span className="text-xs text-white/70 group-hover:text-orange-300 transition">
                          {src.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 capitalize">{src.category}</span>
                    </button>
                  ))}
                </div>
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
      className="group block relative overflow-hidden rounded-xl bg-white/5 border border-white/10 shrink-0"
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <Newspaper size={40} className="text-white/10" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 text-[10px] bg-orange-400/30 text-orange-200 rounded-full">
            {article.source}
          </span>
          <span className="px-2 py-0.5 text-[10px] bg-white/10 text-white/60 rounded-full capitalize">
            {article.category}
          </span>
        </div>

        <h2 className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition line-clamp-2">
          {article.title}
        </h2>
        <p className="text-white/60 text-xs line-clamp-2 mb-1.5">
          {article.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <Clock size={10} />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-white/40">
            <ExternalLink size={10} />
            {new URL(article.url).hostname.replace("www.", "")}
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="flex items-center gap-0.5 px-2 py-1 bg-orange-400 text-white text-[10px] font-medium rounded-full">
          Leer <ChevronRight size={10} />
        </span>
      </div>
    </a>
  );
}

function ArticleCard({
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
      className="group flex flex-col bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-orange-400/30 transition-all"
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full flex-1 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full flex-1 bg-gradient-to-br from-purple-700/50 to-pink-700/50 flex items-center justify-center">
          <BookOpen size={24} className="text-white/20" />
        </div>
      )}

      <div className="p-2.5">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] text-orange-300/70 font-medium uppercase tracking-wide">
            {article.source}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition line-clamp-2 leading-snug mb-1">
          {article.title}
        </h3>

        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span className="flex items-center gap-0.5">
            <Clock size={10} />
            {formatDate(article.published_at)}
          </span>
          <span className="flex items-center gap-0.5">
            <ExternalLink size={10} />
            Leer
          </span>
        </div>
      </div>
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1">
      <div className="lg:col-span-2 space-y-3">
        <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/5 rounded-lg animate-pulse">
              <div className="h-14 bg-white/10 rounded-t-lg" />
              <div className="p-2 space-y-1">
                <div className="h-2 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default Newsletter;
