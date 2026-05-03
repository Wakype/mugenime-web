import Link from "next/link";
import Image from "next/image";
import { MonitorPlay, Clock, Film, Play, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface GroupedHistory {
  anime_slug: string;
  anime_title: string;
  poster: string;
  last_updated: number;
  episodes: {
    episode_slug: string;
    episode_title: string;
    updated_at: number;
  }[];
}

interface HistoryCardProps {
  group: GroupedHistory;
  onDelete: (slug: string) => void;
}

export function HistoryCard({ group, onDelete }: Readonly<HistoryCardProps>) {
  return (
    <div className="group relative flex flex-row gap-3 sm:gap-5 p-3 sm:p-4 rounded-3xl bg-card/40 hover:bg-card border border-border/40 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden backdrop-blur-sm">
      {/* Sleek Delete Button */}
      <button
        onClick={() => onDelete(group.anime_slug)}
        className="cursor-pointer absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-300 shadow-sm opacity-100 sm:opacity-0 sm:-translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
        title="Hapus riwayat anime ini"
      >
        <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
      </button>

      {/* Anime Poster - Responsive sizing (Horizontal Layout) */}
      <Link
        href={`/anime/${group.anime_slug}`}
        className="relative w-[90px] min-w-[90px] sm:w-[130px] sm:min-w-[130px] aspect-3/4 rounded-2xl overflow-hidden shrink-0 bg-muted cursor-pointer block group/image"
      >
        <Image
          src={group.poster || ""}
          alt={group.anime_title}
          fill
          className="object-cover transition-transform duration-700 group-hover/image:scale-110"
          sizes="(max-width: 640px) 90px, 130px"
        />
        {/* Elegant overlay on image hover */}
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/90 backdrop-blur-md text-white rounded-full flex items-center justify-center transform scale-50 opacity-0 group-hover/image:scale-100 group-hover/image:opacity-100 transition-all duration-300 shadow-xl">
            <MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col justify-start min-w-0 flex-1 py-1 pr-7 sm:pr-12">
        <h3 className="font-bold text-sm sm:text-xl text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {group.anime_title}
        </h3>

        <div className="flex items-center gap-1.5 mt-1 sm:mt-2">
          <Clock className="w-3 h-3 text-primary shrink-0" />
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">
            {formatDistanceToNow(group.last_updated, {
              addSuffix: true,
              locale: id,
            })}
          </span>
        </div>

        {/* Episodes List - Horizontal Scroll for Mobile friendliness */}
        <div className="mt-auto pt-3 flex flex-col gap-2 overflow-hidden">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Film className="w-3 h-3" /> Lanjutkan:
          </p>

          {/* Custom inline classes to hide scrollbar but keep functionality */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {group.episodes.map((ep) => {
              const epMatch = new RegExp(/Episode\s+(\d+)/i).exec(
                ep.episode_title,
              );
              const displayTitle = epMatch
                ? `Eps ${epMatch[1]}`
                : ep.episode_title || "Eps ?";
              const timeAgo = formatDistanceToNow(ep.updated_at, {
                addSuffix: true,
                locale: id,
              });

              return (
                <Tooltip key={ep.episode_slug}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/watch/${group.anime_slug}/${ep.episode_slug}`}
                      className="group/btn flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-secondary/50 hover:bg-primary border border-border/50 hover:border-primary transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-background/50 flex items-center justify-center group-hover/btn:bg-primary-foreground/20 transition-colors shrink-0">
                        <Play className="w-2.5 h-2.5 text-primary group-hover/btn:text-primary-foreground fill-current ml-0.5" />
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-[10px] sm:text-xs font-bold text-foreground group-hover/btn:text-primary-foreground leading-none">
                          {displayTitle}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-muted-foreground group-hover/btn:text-primary-foreground/80 mt-1 leading-none truncate">
                          {timeAgo}
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs font-semibold"
                  >
                    <p>Ditonton {timeAgo}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
