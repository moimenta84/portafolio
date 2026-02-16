// api.ts — Servicio centralizado de llamadas al backend.
// Contiene todas las funciones para comunicarse con la API REST:
// proyectos, likes, seguidores, visitas, reviews y noticias.
// Usa un helper genérico fetchJson<T> con tipado TypeScript
// que añade headers y maneja errores automáticamente.

import type { Project, FollowersData, VisitsData, Review } from "../types";

const API_BASE = "/api";

// Helper genérico — hace fetch, parsea JSON y lanza error si la respuesta no es OK
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error de red" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

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
export const registerVisit = (page: string) =>
  fetchJson<{ total_visits: number }>("/visits", {
    method: "POST",
    body: JSON.stringify({ page }),
  });
export const getVisitCount = () => fetchJson<VisitsData>("/visits/count");

// Reviews
export const getReviews = () => fetchJson<Review[]>("/reviews");
export const createReview = (data: { name: string; comment: string; rating: number }) =>
  fetchJson<Review>("/reviews", { method: "POST", body: JSON.stringify(data) });
