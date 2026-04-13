"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Star,
  Trash2,
  Tv,
  Clapperboard,
  Library,
} from "lucide-react";
import { toast } from "sonner";

// const getProxyUrl = (url: string) =>
//   `/api/image-proxy?url=${encodeURIComponent(url)}`;

export default function BookmarkPage() {
  const { bookmarks, removeBookmark } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useStore.persist.rehydrate();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleRemove = (e: React.MouseEvent, slug: string, title: string) => {
    e.preventDefault();
    removeBookmark(slug);
    toast.info("Dihapus", {
      description: `${title} dihapus dari bookmark.`,
    });
  };

  // Prevent Hydration Mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 space-y-10">
        {/* --- HERO SECTION --- */}
        <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Bookmark className="w-3.5 h-3.5" />
                Bookmark
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                Koleksi <span className="text-primary">Bookmark</span> Saya
              </h1>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Daftar anime favorit yang telah Anda simpan. Lanjutkan menonton
                kapan saja tanpa takut kehilangan jejak episode terakhir Anda.
              </p>
            </div>

            {/* Total Widget */}
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

        {/* --- CONTENT GRID --- */}
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {bookmarks.map((anime) => (
              <Link
                key={anime.slug}
                href={`/anime/${anime.slug}`}
                className="group relative flex flex-col gap-3"
              >
                {/* Image Container */}
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-muted shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1">
                  <Image
                    // src={getProxyUrl(anime.poster)}
                    src={anime.poster ?? ""}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  {anime.rating && anime.rating !== "N/A" && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {anime.rating}
                    </div>
                  )}

                  {/* Remove Button (Hover Only) */}
                  <button
                    onClick={(e) => handleRemove(e, anime.slug, anime.title)}
                    className="absolute top-2 left-2 p-2 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600 z-20 shadow-lg cursor-pointer"
                    title="Hapus Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Type Badge */}
                  {anime.type && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-primary text-[10px] font-bold text-primary-foreground uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 shadow-lg">
                      <Tv className="w-3 h-3" />
                      {anime.type}
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
                    {anime.title}
                  </h3>

                  {/* Studio Info */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clapperboard className="w-3 h-3" />
                    <span className="truncate">
                      {anime.studios ? anime.studios : "Unknown Studio"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Library className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Koleksi Kosong
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              Anda belum menyimpan anime apapun. Jelajahi koleksi kami dan
              simpan anime favorit Anda di sini.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Link href="/">Jelajahi Anime</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
