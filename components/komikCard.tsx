"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ImageOff, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { KomikItem } from "@/lib/komikTypes";
import { getFormatWithFlag, timeAgo } from "@/lib/utils";

interface KomikCardProps {
  comic: KomikItem;
  index?: number;
  showChaptersList?: boolean;
  viewType?: "grid" | "list";
}

export default function KomikCard({
  comic,
  index = 0,
  showChaptersList = false,
  viewType = "grid",
}: Readonly<KomikCardProps>) {
  const isValidCover =
    comic.cover &&
    comic.cover !== "" &&
    comic.cover !== "null" &&
    comic.cover.startsWith("http");

  const latestChapter = comic.chapters?.[0]?.chapterIndex;
  const formatLabel = getFormatWithFlag(comic.format);

  // --- LIST VIEW ---
  if (viewType === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="w-full h-full"
      >
        <div className="flex flex-row gap-4 bg-secondary/10 border border-border/50 rounded-xl p-3 hover:border-primary/30 transition-colors h-full">
          {/* List Image */}
          <Link
            href={`/komik/${comic.slug}`}
            className="relative w-24 sm:w-28 shrink-0 aspect-[3/4.2] overflow-hidden rounded-lg group"
          >
            {isValidCover ? (
              <Image
                src={comic.cover}
                alt={comic.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="120px"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-muted-foreground">
                <ImageOff className="w-6 h-6 mb-1 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
            <Badge className="absolute top-1 left-1 bg-primary text-primary-foreground border-0 px-1.5 h-5 text-[9px] font-bold">
              {formatLabel}
            </Badge>
          </Link>

          {/* List Content */}
          <div className="flex flex-col flex-1 min-w-0">
            <Link
              href={`/komik/${comic.slug}`}
              className="group-hover:text-primary transition-colors block mb-2"
            >
              <h3 className="font-bold text-base leading-snug line-clamp-2">
                {comic.title}
              </h3>
              {comic.author && (
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-1">
                  {comic.author}
                </p>
              )}
            </Link>

            {/* Genres */}
            {comic.genres && comic.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {comic.genres.slice(0, 3).map((g) => (
                  <Badge
                    key={g.id}
                    variant="secondary"
                    className="bg-secondary/50 text-[9px] px-1.5 py-0 h-4 font-medium border-border/50 text-muted-foreground line-clamp-1"
                  >
                    {g.data.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Chapters List */}
            {showChaptersList &&
              comic.chapters &&
              comic.chapters.length > 0 && (
                <div className="mt-auto space-y-1.5">
                  {comic.chapters.slice(0, 2).map((ch) => (
                    <Link
                      key={ch.chapterIndex}
                      href={`/komik/${comic.slug}/chapter-${ch.chapterIndex}`}
                      className="flex items-center justify-between bg-background hover:bg-secondary border border-border/50 rounded-md px-2.5 py-1.5 transition-colors group/ch"
                    >
                      <span className="text-[11px] font-semibold text-foreground group-hover/ch:text-primary">
                        Chapter {ch.chapterIndex}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(ch.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- GRID VIEW (Default) ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex flex-col h-full w-full"
    >
      <Link
        href={`/komik/${comic.slug}`}
        className="group space-y-3 flex-1 flex flex-col"
      >
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative aspect-[3/4.2] overflow-hidden rounded-xl bg-secondary/20 border border-border/50 group-hover:border-primary/30 transition-colors shrink-0"
        >
          {/* 1. IMAGE LAYER */}
          {isValidCover ? (
            <Image
              src={comic.cover}
              alt={comic.title}
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              unoptimized
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-muted-foreground">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}

          {/* 2. GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* 3. HOVER READ BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full ring-1 ring-white/40"
            >
              <BookOpen className="w-8 h-8 text-white fill-white/20" />
            </motion.div>
          </div>

          {/* 4. TOP BADGES */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20 gap-1">
            {comic.rating && (
              <Badge className="bg-yellow-500 text-white border-0 px-2 py-0.5 h-6 text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-white mr-1" />
                {comic.rating}
              </Badge>
            )}

            <Badge className="bg-primary text-primary-foreground border-0 px-2.5 h-6 text-[11px] font-bold whitespace-nowrap">
              {formatLabel}
            </Badge>
          </div>

          {/* 5. BOTTOM INFO */}
          {!showChaptersList && (
            <div className="absolute bottom-2 left-2 right-2 z-20">
              <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <div className="flex items-center gap-1.5 text-zinc-100">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold capitalize tracking-wide truncate">
                    {latestChapter ? `Chapter ${latestChapter}` : "Tamat"}
                  </span>
                </div>

                {comic.updatedAt && (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[9px] font-medium">
                      {timeAgo(comic.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* --- TITLE, AUTHOR & GENRES --- */}
        <div className="space-y-1.5 px-1 flex-1 flex flex-col">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {comic.title}
            </h3>
            {comic.author && (
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {comic.author}
              </p>
            )}
          </div>

          {/* Genres Badges */}
          {comic.genres && comic.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-auto">
              {comic.genres.slice(0, 3).map((g) => (
                <Badge
                  key={g.id}
                  variant="secondary"
                  className="bg-secondary/50 text-[9px] px-1.5 py-0 h-4 font-medium border-border/50 text-muted-foreground hover:bg-secondary transition-colors line-clamp-1"
                >
                  {g.data.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* --- CHAPTER LIST (Only for Newest Section) --- */}
      {showChaptersList && comic.chapters && comic.chapters.length > 0 && (
        <div className="mt-3 space-y-1.5 px-1 flex-1 flex flex-col justify-end">
          {comic.chapters.slice(0, 2).map((ch) => (
            <Link
              key={ch.chapterIndex}
              href={`/komik/${comic.slug}/chapter-${ch.chapterIndex}`}
              className="flex items-center justify-between bg-secondary/30 hover:bg-secondary/70 border border-border/50 rounded-md px-2.5 py-1.5 transition-colors group/ch"
            >
              <span className="text-[11px] sm:text-xs font-semibold text-foreground group-hover/ch:text-primary">
                Chapter {ch.chapterIndex}
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                {timeAgo(ch.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
