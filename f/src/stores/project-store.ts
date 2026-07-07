import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import { getVisitorKey } from "@/lib/visitor";
import { markProjectViewedInSession, getViewedProjectIds } from "@/lib/project-view-session";
import type { Project } from "@/types/cv";

export interface ProjectStat {
  likes: number;
  views: number;
  liked: boolean;
}

interface ProjectInteractionStore {
  stats: Record<string, ProjectStat>;
  savedIds: string[];
  viewedProjectIds: string[];
  synced: boolean;
  pendingLikes: Set<string>;
  pendingViews: Set<string>;

  initFromProjects: (projects: Project[]) => void;
  initViewedProjects: () => void;
  syncInteractions: () => Promise<void>;
  toggleLike: (projectId: string) => Promise<void>;
  recordView: (projectId: string) => Promise<void>;
  toggleSave: (id: string) => void;
  isLiked: (id: string) => boolean;
  isSaved: (id: string) => boolean;
  getStats: (id: string) => ProjectStat | null;
}

const defaultStat = (): ProjectStat => ({
  likes: 0,
  views: 0,
  liked: false,
});

export const useProjectStore = create<ProjectInteractionStore>()(
  persist(
    (set, get) => ({
      stats: {},
      savedIds: [],
      viewedProjectIds: [],
      synced: false,
      pendingLikes: new Set(),
      pendingViews: new Set(),

      initFromProjects: (projects) => {
        set((state) => {
          const stats = { ...state.stats };
          for (const project of projects) {
            const current = stats[project.id];
            stats[project.id] = {
              likes: current?.likes ?? project.likes ?? 0,
              views: current?.views ?? project.views ?? 0,
              liked: current?.liked ?? false,
            };
          }
          return { stats };
        });
      },

      initViewedProjects: () => {
        set({ viewedProjectIds: getViewedProjectIds() });
      },

      syncInteractions: async () => {
        try {
          const data = await api.getProjectInteractions(getVisitorKey());
          set((state) => {
            const stats = { ...state.stats };
            for (const item of data.projects) {
              stats[item.id] = {
                likes: item.likes,
                views: item.views,
                liked: item.liked,
              };
            }
            return { stats, synced: true };
          });
        } catch {
          // Keep local stats if sync fails
        }
      },

      toggleLike: async (projectId) => {
        const current = get().stats[projectId] ?? defaultStat();
        const optimisticLiked = !current.liked;
        const optimisticLikes = Math.max(
          0,
          current.likes + (optimisticLiked ? 1 : -1),
        );

        set((state) => ({
          stats: {
            ...state.stats,
            [projectId]: {
              likes: optimisticLikes,
              views: current.views,
              liked: optimisticLiked,
            },
          },
          pendingLikes: new Set(state.pendingLikes).add(projectId),
        }));

        try {
          const result = await api.toggleProjectLike(projectId, getVisitorKey());
          set((state) => {
            const pending = new Set(state.pendingLikes);
            pending.delete(projectId);
            return {
              stats: {
                ...state.stats,
                [projectId]: {
                  likes: result.likes,
                  views: state.stats[projectId]?.views ?? current.views,
                  liked: result.liked,
                },
              },
              pendingLikes: pending,
            };
          });
        } catch {
          set((state) => {
            const pending = new Set(state.pendingLikes);
            pending.delete(projectId);
            return {
              stats: {
                ...state.stats,
                [projectId]: current,
              },
              pendingLikes: pending,
            };
          });
        }
      },

      recordView: async (projectId) => {
        const viewedIds = markProjectViewedInSession(projectId);
        set({ viewedProjectIds: viewedIds });

        if (get().pendingViews.has(projectId)) return;

        const current = get().stats[projectId] ?? defaultStat();

        set((state) => ({
          pendingViews: new Set(state.pendingViews).add(projectId),
        }));

        try {
          const result = await api.recordProjectView(projectId, getVisitorKey());
          if (result.recorded) {
            set((state) => ({
              stats: {
                ...state.stats,
                [projectId]: {
                  likes: state.stats[projectId]?.likes ?? current.likes,
                  views: result.views,
                  liked: state.stats[projectId]?.liked ?? current.liked,
                },
              },
            }));
          }
        } catch {
          // Ignore view errors silently
        } finally {
          set((state) => {
            const pending = new Set(state.pendingViews);
            pending.delete(projectId);
            return { pendingViews: pending };
          });
        }
      },

      toggleSave: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((x) => x !== id)
            : [...state.savedIds, id],
        })),

      isLiked: (id) => get().stats[id]?.liked ?? false,
      isSaved: (id) => get().savedIds.includes(id),
      getStats: (id) => get().stats[id] ?? null,
    }),
    {
      name: "cv-project-interactions",
      skipHydration: true,
      partialize: (state) => ({ savedIds: state.savedIds }),
    },
  ),
);
