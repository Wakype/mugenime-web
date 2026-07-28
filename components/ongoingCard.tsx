"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ImageOff, CalendarDays, Clock } from "lucide-react";
import { Anime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function OngoingCard({ anime }: Readonly<{ anime: Anime }>) {
  // 1. VALIDASI POSTER
  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  // const imageUrl = isValidPoster
  //   ? `/api/image-proxy?url=${encodeURIComponent(anime.poster)}`
  //   : "";

  return (
    <Link
      href={`/anime/${anime.animeId}`}
      prefetch={false}
      className="group block space-y-3 w-full"
    >
      {/* --- CARD CONTAINER --- */}
      <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-muted border border-border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
        {/* IMAGE LAYER */}
        {isValidPoster ? (
          <Image
            src={isValidPoster ? anime.poster : ""}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] font-medium">No Image</span>
          </div>
        )}

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* HOVER PLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl ring-1 ring-white/40 group-hover:scale-110 transition-transform">
            <PlayCircle className="w-8 h-8 text-white fill-white/20" />
          </div>
        </div>

        {/* TOP BADGES */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-start items-start z-20">
          {/* Badge Primary color */}
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-2.5 h-6 text-[11px] font-semibold shadow-lg shadow-primary/20">
            Episode {anime.episodes}
          </Badge>
        </div>

        {/* BOTTOM INFO (Day & Date - INSIDE CARD) */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 shadow-lg">
            {/* Hari */}
            <div className="flex items-center gap-1.5 text-zinc-100">
              <CalendarDays className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {anime.releaseDay || "Tamat"}
              </span>
            </div>

            {/* Tanggal */}
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] font-medium">
                {anime.latestReleaseDate || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- TITLE (OUTSIDE CARD) --- */}
      <div className="space-y-1 px-1">
        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
