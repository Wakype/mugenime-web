import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Anime } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: Anime;
  variant?: "portrait" | "landscape"; // Opsional: jika ingin variasi tampilan
}

export default function AnimeCard({
  anime,
  variant = "portrait",
}: AnimeCardProps) {
  // Helper untuk menggunakan Proxy Image kita
  const getProxyUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group block space-y-3 w-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:shadow-md">
        {/* Image with Proxy */}
        <Image
          src={getProxyUrl(anime.poster)}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          unoptimized // Penting karena kita fetch dari API internal
        />

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <PlayCircle className="w-8 h-8 text-white fill-white/20" />
          </div>
        </div>

        {/* Badges Info (Top Left/Right) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {anime.rating && (
            <Badge
              variant="secondary"
              className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 text-[10px] h-5 px-1.5 backdrop-blur-md"
            >
              ★ {anime.rating}
            </Badge>
          )}
          {anime.episode_count && (
            <Badge
              variant="secondary"
              className="bg-black/60 text-white border-0 text-[10px] h-5 px-1.5 backdrop-blur-md"
            >
              {anime.episode_count} Eps
            </Badge>
          )}
        </div>

        {/* Episode Badge (Bottom Left) */}
        {anime.current_episode && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 text-[10px] h-5 px-2 shadow-lg">
              {anime.current_episode}
            </Badge>
          </div>
        )}
      </div>

      {/* Text Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{anime.release_day || "Tamat"}</span>
          <span>{anime.newest_release_date || anime.last_release_date}</span>
        </div>
      </div>
    </Link>
  );
}
