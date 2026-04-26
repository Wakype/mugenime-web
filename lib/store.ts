import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  type?: string;
  url?: string;
  rating?: string;
  currentEpisode?: string;
  lastWatchedAt?: number;
  studios?: string;
  isBatch?: boolean;
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
  bookmarks: AnimeItem[];
  watchHistory: HistoryItem[];

  // Actions
  addBookmark: (anime: AnimeItem) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;

  addToHistory: (history: HistoryItem) => void;
  clearHistory: () => void;
  cleanupOldHistory: () => void;
}

// 30 Hari dalam milidetik (30 * 24 * 60 * 60 * 1000)
const THIRTY_DAYS_MS = 2592000000;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      watchHistory: [],

      // --- Bookmark Logic ---
      addBookmark: (anime) =>
        set((state) => {
          if (state.bookmarks.some((item) => item.slug === anime.slug))
            return state;
          return { bookmarks: [anime, ...state.bookmarks] };
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
          updatedHistory = updatedHistory.slice(0, 200);

          return { watchHistory: updatedHistory };
        }),

      clearHistory: () => set({ watchHistory: [] }),

      // Fungsi untuk memfilter out data lama
      cleanupOldHistory: () =>
        set((state) => {
          const now = Date.now();
          const freshHistory = state.watchHistory.filter(
            (item) => now - item.updated_at < THIRTY_DAYS_MS,
          );

          // Hanya update state jika memang ada data yang dihapus (mencegah re-render sia-sia)
          if (freshHistory.length !== state.watchHistory.length) {
            return { watchHistory: freshHistory };
          }
          return state;
        }),
    }),
    {
      name: "mugenime-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
