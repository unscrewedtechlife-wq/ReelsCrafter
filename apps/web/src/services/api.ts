import axios from "axios";
import type { AuthTokens, PipelineUserOptions, User } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Token management ─────────────────────────────────────────────────────────

export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// ─── Request interceptor: attach Bearer token ─────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: refresh on 401 ─────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refresh_token");
      try {
        const { data } = await api.post<AuthTokens>("/api/auth/refresh", {
          refresh_token: refreshToken,
        });
        setTokens(data);
        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (email: string, name: string, password: string) =>
    api.post<AuthTokens>("/api/auth/signup", { email, name, password }),
  login: (email: string, password: string) =>
    api.post<AuthTokens>("/api/auth/login", { email, password }),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get<User>("/api/auth/me"),
};

// ─── Generations ──────────────────────────────────────────────────────────────

export const generationsApi = {
  generateVideo: (data: {
    prompt: string; model: string; aspect_ratio: string;
    duration: number; resolution?: string; project_id?: string;
  }) => api.post("/api/generate/video", data),

  generateImage: (data: {
    prompt: string; model: string; width?: number;
    height?: number; num_images?: number; project_id?: string;
  }) => api.post("/api/generate/image", data),

  generateVoice: (data: {
    text: string; model?: string; voice_id?: string; project_id?: string;
  }) => api.post("/api/generate/voice", data),

  getGeneration: (id: string) => api.get(`/api/generate/${id}`),
  listGenerations: (params?: { type?: string; status?: string; limit?: number; offset?: number }) =>
    api.get("/api/generate/", { params }),
  listVideoModels: () => api.get("/api/generate/models/video"),
  listImageModels: () => api.get("/api/generate/models/image"),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (params?: { type?: string }) => api.get("/api/projects/", { params }),
  create: (data: { name: string; description?: string; type?: string }) =>
    api.post("/api/projects/", data),
  get: (id: string) => api.get(`/api/projects/${id}`),
  update: (id: string, data: { name?: string; description?: string; status?: string }) =>
    api.patch(`/api/projects/${id}`, data),
  delete: (id: string) => api.delete(`/api/projects/${id}`),
};

// ─── Assets ───────────────────────────────────────────────────────────────────

export const assetsApi = {
  upload: (file: File, projectId?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    if (projectId) fd.append("project_id", projectId);
    return api.post("/api/assets/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  list: (params?: { type?: string; project_id?: string }) =>
    api.get("/api/assets/", { params }),
  delete: (id: string) => api.delete(`/api/assets/${id}`),
};

// ─── Billing ──────────────────────────────────────────────────────────────────

export const billingApi = {
  getPlans: () => api.get("/api/billing/plans"),
  getSubscription: () => api.get("/api/billing/subscription"),
  subscribe: (plan: string, success_url: string, cancel_url: string) =>
    api.post("/api/billing/subscribe", { plan, success_url, cancel_url }),
  getPortalUrl: () => api.post("/api/billing/portal"),
  getCredits: () => api.get("/api/billing/credits"),
};

// ─── Templates ────────────────────────────────────────────────────────────────

export const templatesApi = {
  list: (params?: { category?: string }) => api.get("/api/templates/", { params }),
  get: (id: string) => api.get(`/api/templates/${id}`),
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export const teamApi = {
  createTeam: (name: string) => api.post("/api/team/", { name }),
  getMyTeams: () => api.get("/api/team/"),
  getMembers: (teamId: string) => api.get(`/api/team/${teamId}/members`),
  invite: (teamId: string, email: string, role?: string) =>
    api.post(`/api/team/${teamId}/invite`, { email, role }),
  removeMember: (teamId: string, userId: string) =>
    api.delete(`/api/team/${teamId}/members/${userId}`),
};

// ─── AI Video Pipeline API ───────────────────────────────────────────────────

export const pipelineApi = {
  generate: (data: { prompt: string; options?: PipelineUserOptions }) =>
    api.post("/api/pipeline/generate", data),
  getJob: (jobId: string) =>
    api.get(`/api/pipeline/jobs/${jobId}`),
  listJobs: () =>
    api.get("/api/pipeline/jobs"),
  enhancePrompt: (data: { prompt: string; options?: PipelineUserOptions }) =>
    api.post("/api/pipeline/enhance", data),
  checkModeration: (text: string) =>
    api.post("/api/pipeline/moderate", { text }),
  generateScript: (data: { prompt: string; options?: PipelineUserOptions }) =>
    api.post("/api/pipeline/script", data),
  generateScenePlan: (data: { prompt: string; options?: PipelineUserOptions }) =>
    api.post("/api/pipeline/scene-plan", data),
};
