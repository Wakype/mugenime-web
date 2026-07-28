import { Badge } from "@/components/ui/badge";
import { Building2, Info, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimeDetail } from "@/lib/types";

interface AnimeInfoCardProps {
  animeDetail: AnimeDetail;
  parentSlug: string;
}

export default function AnimeInfoCard({ animeDetail, parentSlug }: Readonly<AnimeInfoCardProps>) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
      <div className="shrink-0 relative w-[100px] md:w-[130px] aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-md border border-border mx-auto md:mx-0 group">
        {animeDetail.poster ? (
          <Image
            src={animeDetail.poster}
            alt={animeDetail.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="130px"
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Info className="w-8 h-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
          <Link href={`/anime/${parentSlug}`} prefetch={false}>{animeDetail.title}</Link>
        </h2>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-border rounded-md px-2.5 py-0.5 text-[10px] font-semibold tracking-wide">
            {animeDetail.status}
          </Badge>
          {animeDetail.score && (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 rounded-md flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              {animeDetail.score}
            </Badge>
          )}
          {animeDetail.studios && (
            <Badge variant="outline" className="border-border text-muted-foreground flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-semibold">
              <Building2 className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{animeDetail.studios}</span>
            </Badge>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border/60 flex-1">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Sinopsis</h4>
          <p className="text-sm text-muted-foreground line-clamp-3 md:line-clamp-4 leading-relaxed">
            {(typeof animeDetail.synopsis === "string"
              ? animeDetail.synopsis
              : animeDetail.synopsis?.paragraphs?.join(" ")) || "Sinopsis tidak tersedia."}
          </p>
        </div>
      </div>
    </div>
  );
}