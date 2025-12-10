import { fetchAnime } from "@/lib/api";
import { AnimeListResponse } from "@/lib/types";
import Link from "next/link";
import { Library, ArrowUpRight } from "lucide-react";

// Cache 24 jam (Data A-Z sangat jarang berubah)
export const revalidate = 86400;

export default async function ListAnimePage() {
  const response = await fetchAnime<AnimeListResponse>("anime/unlimited");
  const animeGroups = response.list;

  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SECTION (PREMIUM - INDIGO ONLY) --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration (Grid & Blobs) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* KONTEN UTAMA */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                <Library className="w-3.5 h-3.5" />
                List Anime
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                Daftar Anime <span className="text-indigo-600">A-Z</span>
              </h1>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                Indeks lengkap seluruh anime yang tersedia di Mugenime. Gunakan
                navigasi cepat di bawah untuk mencari judul favoritmu
                berdasarkan abjad.
              </p>
            </div>

            {/* STATS WIDGET (Total Anime Estimate) */}
            <div className="shrink-0">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm min-w-40">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Total
                </span>
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                  {animeGroups.reduce(
                    (acc, curr) => acc + curr.animeList.length,
                    0
                  )}
                  +
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">
                  Judul Anime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- STICKY NAVIGATION (A-Z Floating Dock) --- */}
        <div className="sticky top-24 z-40 -mx-4 px-4 md:mx-0 md:px-0 pointer-events-none">
          <div className="flex justify-center">
            {/* Container Dock - Pointer events auto agar bisa diklik */}
            <div className="pointer-events-auto bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/20 dark:shadow-black/40 rounded-2xl p-2 md:p-3 max-w-full overflow-hidden">
              {/* Scrollable Area pada Mobile, Wrap pada Desktop */}
              <div className="flex items-center gap-1.5 overflow-x-auto md:flex-wrap md:justify-center max-w-7xl no-scrollbar px-1 py-1">
                {animeGroups.map((group) => (
                  <a
                    key={group.startWith}
                    href={`#section-${group.startWith}`}
                    className="shrink-0 group relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-bold transition-all duration-300
              bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-transparent
              hover:bg-indigo-600 hover:text-white hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30
              focus:bg-indigo-600 focus:text-white"
                  >
                    {group.startWith}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LIST CONTENT --- */}
        <div className="space-y-12">
          {animeGroups.map((group) => (
            <div
              key={group.startWith}
              id={`section-${group.startWith}`}
              className="scroll-mt-36"
            >
              {/* Letter Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-600/20">
                  {group.startWith}
                </div>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs font-medium text-zinc-400 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                  {group.animeList.length} Judul
                </span>
              </div>

              {/* Grid Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.animeList.map((anime) => (
                  <Link
                    key={anime.animeId}
                    href={`/anime/${anime.animeId}`}
                    className="group flex items-start justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-relaxed">
                      {anime.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
