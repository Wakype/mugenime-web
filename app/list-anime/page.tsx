import { fetchAnime } from "@/lib/api";
import { AnimeListResponse } from "@/lib/types";
import Link from "next/link";
import { Library, ArrowUpRight } from "lucide-react";

export const revalidate = 86400;

export default async function ListAnimePage() {
  const response = await fetchAnime<AnimeListResponse>("anime/unlimited").catch(
    (err) => {
      console.error("Failed to fetch anime list A-Z:", err);
      return null;
    },
  );

  if (!response?.list) {
    throw new Error(
      "Gagal memuat daftar indeks Anime A-Z. Server API mungkin sedang sibuk atau lambat, silakan muat ulang (refresh) halaman ini.",
    );
  }

  const animeGroups = response.list;

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* KONTEN UTAMA */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Library className="w-3.5 h-3.5" />
                List Anime
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Daftar Anime <span className="text-primary">A-Z</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Indeks lengkap seluruh anime yang tersedia di Mugenime. Gunakan
                navigasi cepat di bawah untuk mencari judul favoritmu
                berdasarkan abjad.
              </p>
            </div>

            {/* STATS WIDGET */}
            <div className="shrink-0">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm min-w-40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Total
                </span>
                <span className="text-4xl font-black text-primary tracking-tighter">
                  {animeGroups.reduce(
                    (acc, curr) => acc + curr.animeList.length,
                    0,
                  )}
                  +
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Judul Anime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- STICKY NAVIGATION (A-Z Floating Dock) --- */}
        <div className="sticky top-24 z-40 -mx-4 px-4 md:mx-0 md:px-0 pointer-events-none">
          <div className="flex justify-center">
            {/* Container Dock */}
            <div className="pointer-events-auto bg-background/80 backdrop-blur-xl border border-border shadow-xl shadow-primary/5 rounded-2xl p-2 md:p-3 max-w-full overflow-hidden">
              {/* Scrollable Area */}
              <div className="flex items-center gap-1.5 overflow-x-auto md:flex-wrap md:justify-center max-w-7xl no-scrollbar px-1 py-1">
                {animeGroups.map((group) => (
                  <a
                    key={group.startWith}
                    href={`#section-${group.startWith}`}
                    className="shrink-0 group relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-bold transition-all duration-300
              bg-muted/50 text-muted-foreground border border-transparent
              hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30
              focus:bg-primary focus:text-primary-foreground"
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
                <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20">
                  {group.startWith}
                </div>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full border border-border">
                  {group.animeList.length} Judul
                </span>
              </div>

              {/* Grid Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.animeList.map((anime) => (
                  <Link
                    key={anime.animeId}
                    href={`/anime/${anime.animeId}`}
                    prefetch={false}
                    className="group flex items-start justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2 leading-relaxed">
                      {anime.title}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 ml-2" />
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
