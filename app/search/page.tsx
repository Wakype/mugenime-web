import { searchAnimeAction } from "@/app/actions";
import { SearchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Frown, 
  ArrowLeft, 
  Star, 
  PlayCircle, 
  Sparkles,
  Hash
} from "lucide-react";

// Cache pencarian sebentar agar navigasi cepat, tapi data tetap segar
export const revalidate = 300; 

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({
  searchParams,
}: Readonly<SearchPageProps>) {
  const params = await searchParams;
  const query = params.q || "";
  
  // Menggunakan action yang sudah kita perbaiki struktur datanya
  const results: SearchResult[] = await searchAnimeAction(query);
  const hasResults = results.length > 0;

  // Helper untuk proxy gambar
  const getProxyUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  return (
    <div className="min-h-screen pb-20 py-10 dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-10">
        
        {/* --- HERO HEADER SECTION (Style: Ongoing Page) --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          
          {/* Blur Blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-6 max-w-2xl flex-1">
              <div className="space-y-3">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                  <Search className="w-3.5 h-3.5" />
                  Hasil Pencarian
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-zinc-900 dark:text-zinc-50">
                  Menampilkan hasil: <br />
                  <span className="text-indigo-600">&quot;{query}&quot;</span>
                </h1>
                
                {/* Description */}
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                   {hasResults 
                     ? `Ditemukan ${results.length} judul anime yang cocok dengan kata kunci pencarian Anda. Klik pada kartu untuk mulai menonton.`
                     : `Maaf, kami tidak dapat menemukan anime dengan kata kunci tersebut. Coba gunakan judul lain atau periksa ejaan.`}
                </p>
              </div>
            </div>

            {/* Right Card (Stats) */}
            <div className="shrink-0 w-full lg:w-auto">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden lg:min-w-[200px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/10" />
                
                <div className="relative z-10 flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  <Hash className="w-3 h-3" />
                  TOTAL DITEMUKAN
                </div>
                
                <div className="relative z-10">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-indigo-600">
                    {results.length}
                  </span>
                </div>
                
                <div className="relative z-10 mt-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    Judul Anime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {hasResults ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {results.map((anime, idx) => (
              <Link
                key={anime.slug + idx}
                href={anime.url}
                className="group relative flex flex-col gap-3"
              >
                {/* Poster Wrapper */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-indigo-500/10 border border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={getProxyUrl(anime.poster)}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    unoptimized
                  />
                  
                  {/* Overlay Gradient & Play Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white fill-white/20 scale-50 group-hover:scale-100 transition-transform duration-300" />
                  </div>

                  {/* Rating Badge (Top Left) */}
                  {anime.rating && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-white">{anime.rating}</span>
                    </div>
                  )}

                  {/* Status Badge (Top Right) */}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant={anime.status.toLowerCase().includes("ongoing") ? "default" : "secondary"} className="text-[10px] h-5 px-1.5 shadow-sm">
                       {anime.status}
                    </Badge>
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-1.5 px-1">
                  <h3 className="font-bold text-sm md:text-base leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {anime.title}
                  </h3>
                  
                  {/* Genres (Limit 2) */}
                  <div className="flex flex-wrap gap-1.5">
                    {anime.genres?.slice(0, 2).map((g) => (
                      <span 
                        key={g.genreId} 
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                      >
                        {g.title}
                      </span>
                    ))}
                    {anime.genres && anime.genres.length > 2 && (
                       <span className="text-[10px] text-zinc-400 self-center">+{anime.genres.length - 2}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-6">
               <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
               <div className="relative bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <Frown className="w-12 h-12 text-zinc-400" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Waduh, tidak ketemu nih!
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
              Kami tidak dapat menemukan anime dengan kata kunci <span className="font-semibold text-zinc-900 dark:text-zinc-200">&quot;{query}&quot;</span>. 
              Coba gunakan judul lain atau periksa ejaanmu.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Home
                </Link>
              </Button>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
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