import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Minimize,
  RectangleHorizontal,
} from "lucide-react";
import Link from "next/link";
import { EpisodeDetail } from "@/lib/types";

interface PlayerControlsProps {
  episode: EpisodeDetail;
  epNumber: string;
  slug: string;
  isTheaterMode: boolean;
  toggleTheaterMode: () => void;
}

export default function PlayerControls({
  episode,
  epNumber,
  slug,
  isTheaterMode,
  toggleTheaterMode,
}: Readonly<PlayerControlsProps>) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 flex-1 relative z-10">
        <h1 className="text-xl md:text-2xl font-extrabold text-foreground leading-snug">
          {episode.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 rounded-md shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {episode.releaseTime || "N/A"}
          </Badge>
          <span className="flex items-center gap-1 font-medium px-1">
            <Eye className="w-3.5 h-3.5" /> Watching Episode {epNumber}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 bg-muted/40 p-1.5 rounded-xl border border-border/60 relative z-10">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheaterMode}
                className={cn(
                  "hover:bg-background rounded-lg transition-colors",
                  isTheaterMode
                    ? "text-primary shadow-sm bg-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isTheaterMode ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <RectangleHorizontal className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-semibold">
              <p>Theater Mode (T)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-border hover:bg-background text-muted-foreground hover:text-primary transition-all disabled:opacity-40"
          disabled={!episode.hasPrevEpisode}
          asChild
        >
          {episode.prevEpisode ? (
            <Link href={`/watch/${slug}/${episode.prevEpisode.episodeId}`} prefetch={false}>
              <ChevronLeft className="w-4 h-4 sm:mr-1" />{" "}
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <span>
              <ChevronLeft className="w-4 h-4 sm:mr-1" />{" "}
              <span className="hidden sm:inline">Prev</span>
            </span>
          )}
        </Button>

        <Button
          size="sm"
          className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all disabled:opacity-40"
          disabled={!episode.hasNextEpisode}
          asChild
        >
          {episode.nextEpisode ? (
            <Link href={`/watch/${slug}/${episode.nextEpisode.episodeId}`} prefetch={false}>
              <span className="hidden sm:inline">Next</span>{" "}
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Link>
          ) : (
            <span>
              <span className="hidden sm:inline">Next</span>{" "}
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
