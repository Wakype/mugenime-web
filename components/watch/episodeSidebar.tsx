import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import Link from "next/link";

interface EpisodeSidebarProps {
  episodeList: { episodeId: string; eps: string | number }[];
  currentSlug: string;
  parentSlug: string;
}

export default function EpisodeSidebar({
  episodeList,
  currentSlug,
  parentSlug,
}: Readonly<EpisodeSidebarProps>) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col max-h-[450px]">
      <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
        <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
          <List className="w-4 h-4 text-primary" /> Daftar Episode
        </h3>
        <span className="text-[10px] font-bold bg-background text-muted-foreground px-2.5 py-1 rounded-full border border-border shadow-sm">
          {episodeList.length} Episode
        </span>
      </div>

      <div className="p-3 overflow-y-auto custom-scrollbar bg-card">
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
          {episodeList.toReversed().map((ep) => {
            const isCurrent = ep.episodeId === currentSlug;
            return (
              <Link
                key={ep.episodeId}
                href={`/watch/${parentSlug}/${ep.episodeId}`}
                className={cn(
                  "group relative flex flex-col items-center justify-center py-2.5 rounded-xl border text-xs font-bold transition-all duration-300",
                  isCurrent
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/20 ring-offset-1 ring-offset-card"
                    : "bg-muted/20 border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-sm",
                )}
              >
                <span className="z-10 relative">{ep.eps}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
