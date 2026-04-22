"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ImageOff, Layers, Disc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KS_AnimeItem } from "@/lib/batchAnimeTypes";
import { motion } from "motion/react";

interface BatchCardProps {
  anime: KS_AnimeItem;
  index?: number;
}

export default function BatchAnimeCard({
  anime,
  index = 0,
}: Readonly<BatchCardProps>) {
  // Validate poster URL
  const isValidPoster =
    anime.poster &&
    anime.poster !== "" &&
    anime.poster !== "null" &&
    anime.poster.startsWith("http");

  const isBD = /\bbd\b/i.test(anime.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        href={`/batch-anime/${anime.slug}`}
        className="group flex flex-col gap-3 w-full h-full"
      >
        {/* --- IMAGE CONTAINER (16:9 Aspect Ratio) --- */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card border border-border shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
          {/* 1. IMAGE LAYER */}
          {isValidPoster ? (
            <Image
              src={anime.poster}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-muted-foreground">
              <ImageOff className="w-10 h-10 mb-2 opacity-30" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}

          {/* 2. GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

          {/* 3. HOVER PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 scale-90 group-hover:scale-100">
            <div className="bg-white/20 backdrop-blur-md p-3 lg:p-4 rounded-full shadow-2xl ring-1 ring-white/50">
              <PlayCircle className="w-8 h-8 lg:w-10 lg:h-10 text-white fill-white/20" />
            </div>
          </div>

          {/* 4. TOP BADGES */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-start items-start gap-2 z-20">
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold shadow-lg shadow-primary/20 backdrop-blur-md flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Batch
            </Badge>

            {/* Badge BD */}
            {isBD && (
              <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold shadow-lg shadow-primary/20 backdrop-blur-md flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5" />
                BD
              </Badge>
            )}
          </div>
        </div>

        {/* --- CONTENT OUTSIDE IMAGE --- */}
        <div className="flex flex-col gap-2 px-1">
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {anime.title}
          </h3>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {anime.genres.map((g) => (
                <Badge
                  key={g.slug}
                  variant="secondary"
                  className="bg-secondary/50 text-[10px] px-1.5 py-0 h-5 font-medium border-border/50 text-muted-foreground hover:bg-secondary transition-colors"
                >
                  {g.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
