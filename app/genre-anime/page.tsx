import { fetchAnime } from "@/lib/api";
import { GenreListResponse } from "@/lib/types";
import Link from "next/link";
import { Tags, Hash } from "lucide-react";

// Cache 1 hari (Genre jarang berubah)
export const revalidate = 86400;

export default async function GenrePage() {
  const genres = await fetchAnime<GenreListResponse>("anime/genre");

  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 shadow-sm overflow-hidden group">
           {/* Dekorasi Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
           
           <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit">
                <Tags className="w-3.5 h-3.5" />
                List Genre
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                Cari <span className="text-indigo-600">Genre Anime</span>
              </h1>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                Temukan anime favoritmu berdasarkan genre. Mulai comedy, fantasy, drama, action hingga romance.
              </p>
           </div>
        </div>

        {/* --- GENRE GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {genres.map((genre) => (
            <Link 
              key={genre.slug} 
              href={`/genre-anime/${genre.slug}`}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-semibold text-sm md:text-base text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {genre.name}
                </span>
                <Hash className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-300 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}