"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ImageOff, Star, CalendarCheck } from "lucide-react";
import { Anime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function CompletedCard({ anime }: Readonly<{ anime: Anime }>) {
  // 1. VALIDASI POSTER (Defensive Coding)
  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  const imageUrl = isValidPoster
    ? `/api/image-proxy?url=${encodeURIComponent(anime.poster)}`
    : "";

  return (
    <Link
      href={`/anime/${anime.animeId}`}
      className="group block space-y-3 w-full"
    >
      {/* --- CARD CONTAINER --- */}
      <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* 1. IMAGE LAYER */}
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

        {/* 2. GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* 3. HOVER PLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl ring-1 ring-white/40 group-hover:scale-110 transition-transform">
            <PlayCircle className="w-8 h-8 text-white fill-white/20" />
          </div>
        </div>

        {/* 4. TOP BADGES (Info Utama Anime Tamat) */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20">
          {/* KIRI: Episode Count (Indigo) */}
          <Badge className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-0 px-2 h-6 text-[10px] font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
            {anime.episodes} Episode
          </Badge>

          {/* KANAN: Rating (Yellow/Gold) */}
          <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-0 px-2 h-6 text-[10px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            {anime.score}
          </Badge>
        </div>

        {/* 5. BOTTOM INFO (Tanggal Tamat) */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <div className="flex items-center justify-center gap-2 bg-black/60 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-medium text-zinc-200">
              Tamat: {anime.lastReleaseDate}
            </span>
          </div>
        </div>
      </div>

      {/* --- TITLE (OUTSIDE CARD) --- */}
      <div className="space-y-1 px-1">
        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
