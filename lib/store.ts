import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipe data sederhana untuk Anime yang disimpan
export interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  currentEpisode?: string; // Untuk history: episode terakhir ditonton
  lastWatchedAt?: number; // Timestamp
  url?: string;
}

interface AppState {
  // --- States ---
  bookmarks: AnimeItem[];
  watchHistory: AnimeItem[];

  // --- Actions ---
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
        // Hapus entri lama jika anime yang sama ditonton lagi (biar naik ke paling atas)
        const filteredHistory = state.watchHistory.filter((item) => item.slug !== anime.slug);
        
        // Tambahkan timestamp
        const newEntry = { ...anime, lastWatchedAt: Date.now() };
        
        // Simpan max 50 history saja biar storage tidak penuh
        return { watchHistory: [newEntry, ...filteredHistory].slice(0, 50) };
      }),

      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: 'mugenime-storage', // Nama key di Local Storage
      storage: createJSONStorage(() => localStorage), // Simpan di browser
      skipHydration: true, // Penting untuk Next.js agar tidak error Hydration mismatch
    }
  )
);