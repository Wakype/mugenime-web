"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ImageOff, Star, Layers, Calendar, Clapperboard } from "lucide-react";
import { Anime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function GenreCard({ anime }: Readonly<{ anime: Anime }>) {
  // 1. VALIDASI POSTER
  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  const imageUrl = isValidPoster
    ? `/api/image-proxy?url=${encodeURIComponent(anime.poster)}`
    : "";

  return (
    <Link href={`/anime/${anime.slug}`} className="group block h-full">
      <div className="flex flex-col h-full gap-3">
        
        {/* --- CARD CONTAINER (IMAGE) --- */}
        <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
          
          {/* IMAGE LAYER */}
          {isValidPoster ? (
            <Image
              src={imageUrl}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* HOVER PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl ring-1 ring-white/40 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-white fill-white/20" />
            </div>
          </div>

          {/* TOP BADGES (Rating & Eps) */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20">
             {/* Kiri: Episode Count */}
             {anime.episode_count ? (
               <Badge className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-0 px-2 h-6 text-[10px] font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
                  {anime.episode_count} Episode
               </Badge>
             ) : (
               <Badge variant="outline" className="bg-black/40 text-white border-white/20 px-2 h-6 text-[10px] backdrop-blur-sm">
                  ? Episode
               </Badge>
             )}

             {/* Kanan: Rating */}
             {anime.rating && anime.rating !== "" && (
               <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-0 px-2 h-6 text-[10px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {anime.rating}
               </Badge>
             )}
          </div>

          {/* BOTTOM INFO (Season) */}
          {anime.season && (
            <div className="absolute bottom-2 left-2 right-2 z-20">
                <div className="flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide">
                        {anime.season}
                    </span>
                </div>
            </div>
          )}
        </div>

        {/* --- TEXT CONTENT (BELOW CARD) --- */}
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {anime.title}
          </h3>

          {/* Studio Info */}
          {anime.studio && (
             <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Clapperboard className="w-3 h-3" />
                <span className="line-clamp-1">{anime.studio}</span>
             </div>
          )}

          {/* Genre Tags (Limit 3) */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {anime.genres.slice(0, 3).map((g) => (
                <span 
                  key={g.slug} 
                  className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  {g.name}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="text-[10px] text-zinc-400 self-center">+{anime.genres.length - 3}</span>
              )}
            </div>
          )}
        </div>

      </div>
    </Link>
  );
}