"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScheduleAnime, AnimeDetail } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  CalendarClock,
  Film,
  Info,
  Loader2,
  PlayCircle,
  ImageOff,
} from "lucide-react";
import { getAnimeDetailAction } from "@/app/actions";

export default function ScheduleCard({
  anime,
}: Readonly<{ anime: ScheduleAnime }>) {
  const [detail, setDetail] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  const imageUrl = isValidPoster
    ? `/api/image-proxy?url=${encodeURIComponent(anime.poster)}`
    : "";

  const onHover = async (open: boolean) => {
    if (open && !hasFetched && !detail) {
      setLoading(true);
      const res = await getAnimeDetailAction(anime.slug);
      if (res) setDetail(res);
      setLoading(false);
      setHasFetched(true);
    }
  };

  const renderHoverContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Memuat info detail...</span>
        </div>
      );
    }

    if (detail) {
      const synopsisText =
        typeof detail.synopsis === "string"
          ? detail.synopsis
          : detail.synopsis.paragraphs?.join(" ") || "Sinopsis belum tersedia.";

      return (
        <>
          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
              <CalendarClock className="w-3 h-3" />
              {detail.duration}
            </div>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
              <Film className="w-3 h-3" />
              {detail.type}
            </div>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
              <Info className="w-3 h-3" />
              {detail.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(detail.genreList || []).slice(0, 3).map((g) => (
              <Badge
                key={g.genreId}
                variant="secondary"
                className="text-[10px] h-5 px-1.5 bg-secondary text-secondary-foreground"
              >
                {g.title}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {synopsisText}
          </p>
        </>
      );
    }

    return (
      <div className="py-2 text-xs text-muted-foreground text-center">
        Gagal memuat detail atau arahkan ulang mouse.
      </div>
    );
  };

  return (
    <HoverCard onOpenChange={onHover}>
      <HoverCardTrigger asChild>
        <Link
          href={`/anime/${anime.slug}`}
          prefetch={false}
          className="group relative block space-y-3"
        >
          {/* POSTER WRAPPER */}
          <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-muted border border-border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            {isValidPoster ? (
              <Image
                src={isValidPoster ? anime.poster : ""}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 20vw"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[10px] font-medium">No Image</span>
              </div>
            )}

            {/* Overlay Play Icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* TITLE */}
          <div className="space-y-1">
            <h3 className="font-bold text-sm leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {anime.title}
            </h3>
          </div>
        </Link>
      </HoverCardTrigger>

      {/* HOVER CONTENT */}
      {/* Menggunakan bg-popover untuk popup card agar konsisten */}
      <HoverCardContent className="w-80 p-0 overflow-hidden border-border bg-popover shadow-xl z-50">
        <div className="relative h-32 bg-black">
          {isValidPoster && (
            <Image
              src={isValidPoster ? anime.poster : ""}
              alt="bg"
              fill
              className="object-cover opacity-30"
              unoptimized
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h4 className="font-bold text-white text-lg line-clamp-1">
              {anime.title}
            </h4>
            <h4 className="font-normal text-zinc-300 text-xs line-clamp-1">
              {detail?.studios || detail?.studio}
            </h4>
          </div>
        </div>

        {/* Memanggil fungsi renderHoverContent di sini */}
        <div className="p-4 space-y-3">{renderHoverContent()}</div>
      </HoverCardContent>
    </HoverCard>
  );
}
