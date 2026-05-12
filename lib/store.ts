import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface BookmarkItem {
  title: string;
  slug: string;
  poster: string;
  category?: "anime" | "komik";
  type?: string;
  url?: string;
  currentEpisode?: string;
  lastWatchedAt?: number;
  studios?: string;
  isBatch?: boolean;
  author?: string;
  genres?: string;
  format?: string;
  rating?: string;
}

export interface HistoryItem {
  anime_slug: string;
  anime_title: string;
  episode_slug: string;
  episode_title: string;
  poster: string;
  updated_at: number;
}

interface AppState {
  bookmarks: BookmarkItem[];
  watchHistory: HistoryItem[];

  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;

  addToHistory: (history: HistoryItem) => void;
  clearHistory: () => void;
  cleanupOldHistory: () => void;
  removeAnimeHistory: (animeSlug: string) => void;

  isApiDown: boolean;
  setApiDown: (status: boolean) => void;
}

// 30 Days in milliseconds (30 * 24 * 60 * 60 * 1000)
const THIRTY_DAYS_MS = 2592000000;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      watchHistory: [],

      isApiDown: false,
      setApiDown: (status) => set({ isApiDown: status }),

      // --- Bookmark Logic ---
      addBookmark: (item) =>
        set((state) => {
          if (state.bookmarks.some((b) => b.slug === item.slug)) return state;
          return { bookmarks: [item, ...state.bookmarks] };
        }),

      removeBookmark: (slug) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((item) => item.slug !== slug),
        })),

      isBookmarked: (slug) => {
        return get().bookmarks.some((item) => item.slug === slug);
      },

      // --- History Logic (GUEST) ---
      addToHistory: (newItem) =>
        set((state) => {
          let updatedHistory = state.watchHistory.filter(
            (item) =>
              !(
                item.anime_slug === newItem.anime_slug &&
                item.episode_slug === newItem.episode_slug
              ),
          );
          updatedHistory = [newItem, ...updatedHistory];
          // Keep only the latest 200 items
          updatedHistory = updatedHistory.slice(0, 200);

          return { watchHistory: updatedHistory };
        }),

      clearHistory: () => set({ watchHistory: [] }),

      cleanupOldHistory: () =>
        set((state) => {
          const now = Date.now();
          const freshHistory = state.watchHistory.filter(
            (item) => now - item.updated_at < THIRTY_DAYS_MS,
          );

          if (freshHistory.length !== state.watchHistory.length) {
            return { watchHistory: freshHistory };
          }
          return state;
        }),

      // Remove specific anime from history
      removeAnimeHistory: (animeSlug) =>
        set((state) => ({
          watchHistory: state.watchHistory.filter(
            (item) => item.anime_slug !== animeSlug,
          ),
        })),
    }),
    {
      name: "mugenime-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
