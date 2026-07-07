import { getApiBaseUrl } from "@/lib/api-config";
import { CONTENT_LOCALE } from "@/types/locale";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = (await res.json()) as ApiResponse<T> | { message?: string };

  if (!res.ok) {
    const message =
      "message" in body && body.message
        ? body.message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  if ("data" in body) {
    return body.data;
  }

  return body as T;
}

export interface ContentResponse {
  cv: {
    personal: {
      name: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      avatar?: string;
      gallery?: string[];
      bio: string;
      aboutDetails?: string[];
      highlights?: { label: string; value: string }[];
      interests?: string[];
      social: { id: string; platform: string; url: string; icon: string }[];
    };
    experiences: {
      id: string;
      company: string;
      role: string;
      period: string;
      description: string;
      technologies: string[];
    }[];
    skills: {
      id: string;
      name: string;
      category: string;
      level: number;
    }[];
    projects: {
      id: string;
      title: string;
      description: string;
      content?: string;
      image?: string;
      images?: string[];
      technologies: string[];
      liveUrl?: string;
      repoUrl?: string;
      links?: { label: string; url: string; type: "live" | "repo" | "file" | "demo" }[];
      files?: { name: string; url: string; size?: string }[];
      likes?: number;
      views?: number;
      isPinned?: boolean;
    }[];
  };
  translations: Record<string, string>;
  siteSettings: { name: string; description: string; url: string };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    hiddenContent: string;
    twitterHandle: string;
  };
}

export interface ContactMessage {
  id: string;
  googleAccount: string;
  purpose: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: { role: { name: string } }[];
}

export function getUserRoles(user: AuthUser): string[] {
  return user.roles.map((r) => r.role.name);
}

export const api = {
  getContent: () =>
    request<ContentResponse>(`/content/${CONTENT_LOCALE}`),

  login: (login: string, password: string) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    }),

  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getMe: () => request<AuthUser>("/users/me"),

  getAdminContent: () =>
    request<ContentResponse>(`/admin/content/${CONTENT_LOCALE}`),

  updatePersonal: (
    data: {
      name: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      avatar?: string;
      gallery?: string[];
      bio: string;
      aboutDetails?: string[];
      highlights?: { label: string; value: string }[];
      interests?: string[];
    },
  ) =>
    request<void>(`/admin/content/personal/${CONTENT_LOCALE}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  uploadGalleryImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch(`${getApiBaseUrl()}/admin/uploads/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.status === 204) {
      return [];
    }

    const body = (await res.json()) as
      | ApiResponse<{ urls: string[] }>
      | { message?: string };

    if (!res.ok) {
      const message =
        "message" in body && body.message
          ? body.message
          : `Yuklash xatosi (${res.status})`;
      throw new ApiError(message, res.status);
    }

    if ("data" in body && body.data?.urls) {
      return body.data.urls;
    }

    throw new ApiError("Yuklash javobi noto‘g‘ri", res.status);
  },

  deleteGalleryImage: (filename: string) =>
    request<void>(`/admin/uploads/images/${encodeURIComponent(filename)}`, {
      method: "DELETE",
    }),

  createSocialLink: (data: { platform: string; url: string; icon: string }) =>
    request<void>(`/admin/content/social-links/${CONTENT_LOCALE}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSocialLink: (
    id: string,
    data: Partial<{ platform: string; url: string; icon: string }>,
  ) =>
    request<void>(`/admin/content/social-links/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteSocialLink: (id: string) =>
    request<void>(`/admin/content/social-links/${id}`, { method: "DELETE" }),

  createExperience: (data: {
    company: string;
    role: string;
    period: string;
    description: string;
    technologies: string[];
  }) =>
    request<void>("/admin/content/experiences", {
      method: "POST",
      body: JSON.stringify({ locale: CONTENT_LOCALE, ...data }),
    }),

  updateExperience: (
    id: string,
    data: Partial<{
      company: string;
      role: string;
      period: string;
      description: string;
      technologies: string[];
    }>,
  ) =>
    request<void>(`/admin/content/experiences/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteExperience: (id: string) =>
    request<void>(`/admin/content/experiences/${id}`, { method: "DELETE" }),

  createSkill: (data: {
    name: string;
    category: string;
    level: number;
  }) =>
    request<void>("/admin/content/skills", {
      method: "POST",
      body: JSON.stringify({ locale: CONTENT_LOCALE, ...data }),
    }),

  updateSkill: (
    id: string,
    data: Partial<{ name: string; category: string; level: number }>,
  ) =>
    request<void>(`/admin/content/skills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id: string) =>
    request<void>(`/admin/content/skills/${id}`, { method: "DELETE" }),

  createProject: (data: {
    title: string;
    description: string;
    image?: string;
    images?: string[];
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
    isPinned?: boolean;
  }) =>
    request<void>("/admin/content/projects", {
      method: "POST",
      body: JSON.stringify({ locale: CONTENT_LOCALE, ...data }),
    }),

  updateProject: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      image?: string;
      images?: string[];
      technologies: string[];
      liveUrl?: string;
      repoUrl?: string;
      isPinned?: boolean;
    }>,
  ) =>
    request<void>(`/admin/content/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    request<void>(`/admin/content/projects/${id}`, { method: "DELETE" }),

  updateTranslations: (translations: Record<string, string>) =>
    request<void>(`/admin/content/translations/${CONTENT_LOCALE}`, {
      method: "PATCH",
      body: JSON.stringify({ translations }),
    }),

  updateSiteSettings: (data: {
    name: string;
    description: string;
    url: string;
  }) =>
    request<void>("/admin/content/site-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateSeoSettings: (data: ContentResponse["seoSettings"]) =>
    request<void>("/admin/content/seo-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  submitContact: (data: { googleAccount: string; purpose: string }) =>
    request<ContactMessage>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getContactMessages: () => request<ContactMessage[]>("/admin/contacts"),

  deleteContactMessage: (id: string) =>
    request<void>(`/admin/contacts/${id}`, { method: "DELETE" }),

  sendContactEmail: (data: { to: string; subject: string; message: string }) =>
    request<void>("/admin/contacts/send-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProjectInteractions: (visitorKey: string) =>
    request<{
      projects: {
        id: string;
        likes: number;
        views: number;
        liked: boolean;
      }[];
    }>(`/content/projects/${CONTENT_LOCALE}/interactions?visitorKey=${encodeURIComponent(visitorKey)}`),

  toggleProjectLike: (projectId: string, visitorKey: string) =>
    request<{ likes: number; liked: boolean }>(
      `/content/projects/${projectId}/like`,
      {
        method: "POST",
        body: JSON.stringify({ visitorKey }),
      },
    ),

  recordProjectView: (projectId: string, visitorKey: string) =>
    request<{ views: number; recorded: boolean }>(
      `/content/projects/${projectId}/view`,
      {
        method: "POST",
        body: JSON.stringify({ visitorKey }),
      },
    ),
};

export { ApiError };
