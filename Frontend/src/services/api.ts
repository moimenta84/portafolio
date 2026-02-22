// api.ts — Servicio centralizado de llamadas al backend.
// Contiene todas las funciones para comunicarse con la API REST:
// proyectos, likes, seguidores, visitas, reviews y noticias.
// Usa un helper genérico fetchJson<T> con tipado TypeScript
// que añade headers y maneja errores automáticamente.

import type { Project, FollowersData, VisitsData, Review } from "../types";

const API_BASE = "/api";

function getAuthHeaders(): Record<string, string> {
  const token = sessionStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper genérico — hace fetch, parsea JSON y lanza error si la respuesta no es OK
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error de red" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (password: string) =>
  fetchJson<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

// Projects
export const getProjects = () => fetchJson<Project[]>("/projects");
export const getProject = (id: number) => fetchJson<Project>(`/projects/${id}`);
export const createProject = (data: Partial<Project>) =>
  fetchJson<Project>("/projects", { method: "POST", body: JSON.stringify(data) });
export const updateProject = (id: number, data: Partial<Project>) =>
  fetchJson<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProject = (id: number) =>
  fetchJson<{ message: string }>(`/projects/${id}`, { method: "DELETE" });

// Likes
export const toggleLike = (projectId: number) =>
  fetchJson<{ likes_count: number; liked: boolean }>(`/projects/${projectId}/like`, {
    method: "POST",
  });
export const getLikes = (projectId: number) =>
  fetchJson<{ likes_count: number; liked: boolean }>(`/projects/${projectId}/likes`);

// Followers
export const getFollowers = () => fetchJson<FollowersData>("/followers");
export const toggleFollow = () =>
  fetchJson<FollowersData>("/followers/toggle", { method: "POST" });

// Visits
export const registerVisit = (page: string, referrer: string) =>
  fetchJson<{ total_visits: number }>("/visits", {
    method: "POST",
    body: JSON.stringify({ page, referrer }),
  });
export const getVisitCount = () => fetchJson<VisitsData>("/visits/count");
export const getVisitStats = () =>
  fetchJson<{
    unique_visitors: number;
    total_page_views: number;
    today_visitors: number;
    avg_duration_seconds: number;
    by_page: { page: string; views: number; unique_visitors: number }[];
    by_region: { region: string; visitors: number }[];
    by_referrer: { referrer: string; visitors: number }[];
    by_device: { device: string; visitors: number }[];
    empresa_visitors: number;
    usuario_visitors: number;
  }>("/visits/stats");

// CV Downloads
export const registerCvDownload = () =>
  fetchJson<{ total_downloads: number }>("/cv/download", { method: "POST" });
export const getCvDownloads = () =>
  fetchJson<{ total_downloads: number; unique_downloads: number; today_downloads: number }>(
    "/cv/downloads"
  );

// Reviews
export const getReviews = () => fetchJson<Review[]>("/reviews");
export const getAllReviews = () => fetchJson<Review[]>("/reviews/all");
export const createReview = (data: { name: string; comment: string; rating: number }) =>
  fetchJson<Review>("/reviews", { method: "POST", body: JSON.stringify(data) });
export const deleteReview = (id: number) =>
  fetchJson<{ message: string }>(`/reviews/${id}`, { method: "DELETE" });

// Subscribers
export const getSubscribers = () =>
  fetchJson<{ id: number; email: string; city: string; region: string; country: string; source: string; created_at: string }[]>("/subscribers");
export const deleteSubscriber = (id: number) =>
  fetchJson<{ ok: boolean }>(`/subscribers/${id}`, { method: "DELETE" });
export const sendNewsletter = () =>
  fetchJson<{ ok: boolean; sent: number; errors: number; total: number }>("/subscribers/send-newsletter", { method: "POST" });
export const getNewsletterHistory = () =>
  fetchJson<{ id: number; sent_at: string; total: number; sent: number; errors: number; opens: number }[]>("/subscribers/history");

// Visit history
export const getVisitHistory = () =>
  fetchJson<{ date: string; visitors: number }[]>("/visits/history");

// Conversion events
export const registerEvent = (type: string, metadata?: Record<string, unknown>) =>
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, metadata }),
  }).catch(() => {});

// Audit log
export const getAuditLog = () =>
  fetchJson<{ id: number; action: string; details: string; ip: string; created_at: string }[]>("/audit");

export const getConversionStats = () =>
  fetchJson<{
    funnel: { total_visitors: number; cv_downloads: number; project_clicks: number; contact_submits: number; follows: number };
    this_week: { visitors: number; cv_downloads: number; project_clicks: number; contact_submits: number; follows: number };
    last_week: { visitors: number; cv_downloads: number; project_clicks: number; contact_submits: number; follows: number };
    top_projects: { title: string; clicks: number }[];
  }>("/events/stats");
