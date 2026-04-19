import { searchAnimeAction } from "@/app/actions";
import { fetchKS } from "@/lib/api";
import { SearchResult } from "@/lib/types";
import { KS_SearchResponse } from "@/lib/batchAnimeTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import BatchAnimeCard from "@/components/batchAnimeCard";
import {
  Search,
  Frown,
  ArrowLeft,
  Star,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export const revalidate = 300;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({
  searchParams,
}: Readonly<SearchPageProps>) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch secara paralel
  const [results, batchResponse] = await Promise.all([
    searchAnimeAction(query).catch(() => [] as SearchResult[]),
    fetchKS<KS_SearchResponse>(
      `anime/kusonime/search/${encodeURIComponent(query)}`,
    ).catch(() => null),
  ]);

  const batchResults = batchResponse?.anime_list || [];

  const totalFound = results.length + batchResults.length;
  const hasResults = totalFound > 0;

  return (
    <div className="min-h-screen pb-20 py-10 bg-background">
      <div className="container mx-auto px-4 space-y-12">
        {/* --- HERO HEADER SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                  <Search className="w-3.5 h-3.5" />
                  Hasil Pencarian
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                  Menampilkan hasil: <br />
                  <span className="text-primary">&quot;{query}&quot;</span>
                </h1>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                  {hasResults
                    ? `Ditemukan ${totalFound} judul anime yang cocok dengan kata kunci pencarian Anda. Klik pada kartu untuk mulai menonton atau mengunduh.`
                    : `Maaf, kami tidak dapat menemukan anime dengan kata kunci tersebut. Coba gunakan judul lain atau periksa ejaan.`}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden lg:min-w-[200px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary/10" />

                <div className="relative z-10 flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  TOTAL DITEMUKAN
                </div>

                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-primary">
                    {totalFound}
                  </span>
                </div>

                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary">
                    Judul Anime & Batch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {hasResults ? (
          <div className="space-y-16">
            {/* --- 1. REGULAR ANIME GRID --- */}
            {results.length > 0 && (
              <div className="space-y-8">
                {/* SECTION HEADER BARU UNTUK REGULAR ANIME */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                      Anime Series
                    </h2>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium border-border/50 shadow-sm whitespace-nowrap"
                  >
                    {results.length} Ditemukan
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  {results.map((anime, idx) => (
                    <Link
                      key={anime.slug + idx}
                      href={anime.url}
                      className="group relative flex flex-col gap-3"
                    >
                      {/* Poster Wrapper */}
                      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-primary/10 border border-border">
                        <Image
                          src={
                            anime.poster &&
                            anime.poster !== "" &&
                            anime.poster !== "null" &&
                            anime.poster.startsWith("http")
                              ? anime.poster
                              : ""
                          }
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white fill-white/20 scale-50 group-hover:scale-100 transition-transform duration-300" />
                        </div>

                        {anime.rating && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-bold text-white">
                              {anime.rating}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 right-2 z-10">
                          <Badge
                            variant={
                              anime.status.toLowerCase().includes("ongoing")
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px] h-5 px-1.5 shadow-sm"
                          >
                            {anime.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Info Text */}
                      <div className="space-y-1.5 px-1">
                        <h3 className="font-bold text-sm md:text-base leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {anime.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {anime.genres?.slice(0, 2).map((g) => (
                            <span
                              key={g.genreId}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                            >
                              {g.title}
                            </span>
                          ))}
                          {anime.genres && anime.genres.length > 2 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{anime.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* --- 2. BATCH ANIME GRID --- */}
            {batchResults.length > 0 && (
              <div className="space-y-8">
                {/* SECTION HEADER BARU UNTUK BATCH ANIME */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                      Anime Batch & Movie
                    </h2>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium border-border/50 shadow-sm whitespace-nowrap"
                  >
                    {batchResults.length} Ditemukan
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  {batchResults.map((anime) => (
                    <BatchAnimeCard key={anime.slug} anime={anime} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-card p-6 rounded-full border-2 border-dashed border-border">
                <Frown className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Waduh, tidak ketemu nih!
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Kami tidak dapat menemukan anime dengan kata kunci{" "}
              <span className="font-semibold text-foreground">
                &quot;{query}&quot;
              </span>
              . Coba gunakan judul lain atau periksa ejaanmu.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Home
                </Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/ongoing-anime">
                  <Sparkles className="w-4 h-4 mr-2" /> Lihat Ongoing
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
