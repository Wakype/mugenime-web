import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipe data untuk Anime yang disimpan
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

interface AppState {
  bookmarks: AnimeItem[];
  watchHistory: AnimeItem[];

  // Actions
  addBookmark: (anime: AnimeItem) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  
  addToHistory: (anime: AnimeItem) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      watchHistory: [],

      // --- Bookmark Logic ---
      addBookmark: (anime) => set((state) => {
        // Cek duplikasi
        if (state.bookmarks.some((item) => item.slug === anime.slug)) return state;
        return { bookmarks: [anime, ...state.bookmarks] };
      }),

      removeBookmark: (slug) => set((state) => ({
        bookmarks: state.bookmarks.filter((item) => item.slug !== slug),
      })),

      isBookmarked: (slug) => {
        return get().bookmarks.some((item) => item.slug === slug);
      },

      // --- History Logic ---
      addToHistory: (anime) => set((state) => {
        const filteredHistory = state.watchHistory.filter((item) => item.slug !== anime.slug);
        const newEntry = { ...anime, lastWatchedAt: Date.now() };
        return { watchHistory: [newEntry, ...filteredHistory].slice(0, 50) };
      }),

      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: 'mugenime-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, 
    }
  )
);