"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore, BookmarkItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  Star,
  Trash2,
  Tv,
  Clapperboard,
  Library,
  BookOpen,
  PenTool,
  Tags,
  Play,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BookmarkPage() {
  const { bookmarks, removeBookmark } = useStore();
  const [mounted, setMounted] = useState(false);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  useEffect(() => {
    useStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const handleRemove = (e: React.MouseEvent, slug: string, title: string) => {
    e.preventDefault();
    setRemovingSlug(slug);
    setTimeout(() => {
      removeBookmark(slug);
      setRemovingSlug(null);
      toast.info("Dihapus", {
        description: `${title} dihapus dari bookmark.`,
      });
    }, 280);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  const animeBookmarks = bookmarks.filter((b) => b.category !== "komik");
  const komikBookmarks = bookmarks.filter((b) => b.category === "komik");

  const EmptyState = ({ isKomikTab }: { isKomikTab: boolean }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Layered icon with glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
        <div className="relative w-20 h-20 bg-muted rounded-2xl flex items-center justify-center border border-border/60 shadow-inner">
          <Library className="w-9 h-9 text-muted-foreground/40" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
        Koleksi Kosong
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-7 leading-relaxed">
        Belum ada {isKomikTab ? "komik" : "anime"} yang disimpan. Jelajahi
        koleksi dan tambahkan favorit kamu.
      </p>
      <Button
        asChild
        size="sm"
        className="rounded-full px-6 font-semibold gap-1.5 shadow-md shadow-primary/20 hover:scale-[1.03] transition-transform"
      >
        <Link href={isKomikTab ? "/komik" : "/"}>
          Jelajahi {isKomikTab ? "Komik" : "Anime"}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </div>
  );

  const renderGrid = (items: BookmarkItem[], isKomikTab: boolean) => {
    if (items.length === 0) return <EmptyState isKomikTab={isKomikTab} />;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {items.map((item, idx) => {
          const isKomik = item.category === "komik";
          const href = isKomik
            ? `/komik/${item.slug}`
            : item.isBatch
              ? `/batch-anime/${item.slug}`
              : `/anime/${item.slug}`;
          const typeBadge = isKomik ? item.format : item.type;
          const isRemoving = removingSlug === item.slug;

          return (
            <Link
              key={item.slug}
              href={href}
              className={cn(
                "group relative flex flex-col gap-2.5 transition-all duration-300",
                isRemoving && "opacity-0 scale-95 pointer-events-none",
              )}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* ── Poster ── */}
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-muted shadow-sm ring-1 ring-border/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/15 group-hover:ring-primary/30 group-hover:-translate-y-0.5">
                <Image
                  src={item.poster ?? ""}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                  unoptimized
                  referrerPolicy="no-referrer"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating */}
                {item.rating && item.rating !== "N/A" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    {item.rating}
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={(e) => handleRemove(e, item.slug, item.title)}
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-red-500/90 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-20 border border-white/10 hover:border-red-400/50"
                  title="Hapus Bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Play/Read CTA — center overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground font-bold px-3 py-1.5 rounded-full shadow-lg border border-primary-foreground/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {isKomik ? (
                      <BookOpen className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                    {isKomik ? "Baca" : "Tonton"}
                  </div>
                </div>

                {/* Type badge bottom */}
                {typeBadge && (
                  <div className="absolute bottom-2 left-2 right-2 flex">
                    <span className="text-xs font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {typeBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Info ── */}
              <div className="space-y-1 px-0.5">
                <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                    {isKomik ? (
                      <PenTool className="w-2.5 h-2.5 shrink-0" />
                    ) : (
                      <Clapperboard className="w-2.5 h-2.5 shrink-0" />
                    )}
                    <span className="truncate">
                      {isKomik
                        ? item.author || "Unknown Author"
                        : item.studios || "Unknown Studio"}
                    </span>
                  </div>

                  {isKomik && item.genres && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      <Tags className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{item.genres}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 space-y-8">
        {/* ── HERO SECTION (unchanged) ── */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Bookmark className="w-3.5 h-3.5" />
                Bookmark
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Koleksi <span className="text-primary">Bookmark</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Daftar anime dan komik favorit yang telah Anda simpan. Lanjutkan
                menonton atau membaca kapan saja.
              </p>
            </div>

            <div className="flex flex-col items-end justify-center px-6 py-3 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Total Koleksi
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">
                  {bookmarks.length}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Judul
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <Tabs defaultValue="anime" className="w-full space-y-6">
          {/* Tab bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList className="p-1 bg-muted/50 rounded-xl border border-border/50 h-auto gap-1">
              <TabsTrigger
                value="anime"
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground flex items-center gap-2"
              >
                <Tv className="w-3.5 h-3.5" />
                Anime
                <span
                  className={cn(
                    "text-[10px] font-black px-1.5 py-0.5 rounded-full tabular-nums transition-colors",
                    "bg-muted text-muted-foreground data-[state=active]:bg-primary/15 data-[state=active]:text-primary",
                  )}
                >
                  {animeBookmarks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="komik"
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Komik
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full tabular-nums bg-muted text-muted-foreground">
                  {komikBookmarks.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Subtle divider line filling remaining space */}
            <div className="hidden sm:flex flex-1 items-center">
              <div className="h-px flex-1 bg-border/40" />
            </div>
          </div>

          <TabsContent
            value="anime"
            className="focus-visible:outline-none mt-0"
          >
            {renderGrid(animeBookmarks, false)}
          </TabsContent>

          <TabsContent
            value="komik"
            className="focus-visible:outline-none mt-0"
          >
            {renderGrid(komikBookmarks, true)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
