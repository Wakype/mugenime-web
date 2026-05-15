/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  Star,
  PlayCircle,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  Tv,
  BookMarked,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { searchAnimeAction, searchKomikAction } from "@/app/actions";
import { fetchKS } from "@/lib/api";
import { SearchResult } from "@/lib/types";
import { KS_SearchResponse, KS_AnimeItem } from "@/lib/batchAnimeTypes";
import { KomikItem } from "@/lib/komikTypes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchInputProps {
  className?: string;
  onSearchSubmit?: () => void;
}

export default function SearchInput({
  className,
  onSearchSubmit,
}: Readonly<SearchInputProps>) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [batchResults, setBatchResults] = useState<KS_AnimeItem[]>([]);
  const [komikResults, setKomikResults] = useState<KomikItem[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ─── Independent Loading States ──────────────────────────────────────────
  const [isAnimeLoading, setIsAnimeLoading] = useState(false);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [isKomikLoading, setIsKomikLoading] = useState(false);

  // Global loading state (true jika salah satu masih fetch)
  const isLoading = isAnimeLoading || isBatchLoading || isKomikLoading;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      setBatchResults([]);
      setKomikResults([]);
      return;
    }

    setIsAnimeLoading(true);
    setIsBatchLoading(true);
    setIsKomikLoading(true);
    setIsOpen(true);

    // Fetch Anime Series
    searchAnimeAction(debouncedQuery)
      .then((data) => setResults(data || []))
      .catch((err) => {
        console.error("Anime search error:", err);
        setResults([]);
      })
      .finally(() => setIsAnimeLoading(false));

    // Fetch Batch / Movie
    fetchKS<KS_SearchResponse>(`search/${encodeURIComponent(debouncedQuery)}`)
      .then((data) => setBatchResults(data?.anime_list || []))
      .catch((err) => {
        console.error("Batch search error:", err);
        setBatchResults([]);
      })
      .finally(() => setIsBatchLoading(false));

    // Fetch Komik
    searchKomikAction(debouncedQuery)
      .then((data) => setKomikResults(data || []))
      .catch((err) => {
        console.error("Komik search error:", err);
        setKomikResults([]);
      })
      .finally(() => setIsKomikLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle dropdown positioning robustly
  useEffect(() => {
    if (!isOpen || !dropdownRef.current || !wrapperRef.current) return;
    const dropdown = dropdownRef.current;
    const rect = wrapperRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Mobile fallback
    if (viewportWidth < 768) {
      dropdown.style.left = "0";
      dropdown.style.right = "0";
      return;
    }

    // Desktop positioning logic
    const dropdownWidth = 800; // Must match md:w-[800px] class

    // Default to left-aligned relative to input
    if (rect.left + dropdownWidth > viewportWidth - 16) {
      if (rect.right - dropdownWidth < 16) {
        const offset = rect.left - (viewportWidth - dropdownWidth) / 2;
        dropdown.style.left = `-${offset}px`;
        dropdown.style.right = "auto";
      } else {
        dropdown.style.left = "auto";
        dropdown.style.right = "0";
      }
    } else {
      dropdown.style.left = "0";
      dropdown.style.right = "auto";
    }
  }, [isOpen, results, batchResults, komikResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearchSubmit) onSearchSubmit();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const totalResults =
    results.length + batchResults.length + komikResults.length;

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit();
  };

  const getLatestChapter = (chapters: KomikItem["chapters"]) => {
    if (!chapters || chapters.length === 0) return null;
    return chapters[0];
  };

  // ─── Shared Styles ───────────────────────────────────────────────────────
  const itemBase =
    "group relative flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-all duration-150";
  const accentBar =
    "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-primary rounded-full group-hover:h-8 transition-all duration-300";
  const itemTitle =
    "text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight mb-1.5";
  const itemArrow =
    "shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 text-primary self-center ml-auto";

  // ─── Column: Anime Series ────────────────────────────────────────────────
  const renderAnimeCol = () => {
    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 gap-2 px-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Tv className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-xs text-muted-foreground/50">Tidak ada hasil</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1 p-2">
        {results.map((anime) => {
          const genresText = anime.genres
            ?.map((g: any) => g?.genreId || g?.name || "")
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={anime.slug}
              href={`/anime/${anime.slug}`}
              onClick={handleLinkClick}
              className={itemBase}
            >
              <span className={accentBar} />
              <div className="relative w-12 h-[68px] shrink-0 rounded-lg overflow-hidden bg-muted ring-1 ring-border/20">
                {anime.poster ? (
                  <Image
                    src={anime.poster}
                    alt={anime.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="48px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tv className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className={itemTitle}>{anime.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {anime.rating && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {anime.rating}
                    </span>
                  )}
                  {anime.status && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5 font-medium bg-muted/80 text-muted-foreground border-0 rounded"
                    >
                      {anime.status}
                    </Badge>
                  )}
                </div>
                {genresText && (
                  <p className="text-[10px] text-muted-foreground/60 line-clamp-2 mt-1 leading-snug">
                    {genresText}
                  </p>
                )}
              </div>
              <div className={itemArrow}>
                <PlayCircle className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  // ─── Column: Batch / Movie ───────────────────────────────────────────────
  const renderBatchCol = () => {
    if (batchResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 gap-2 px-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Layers className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-xs text-muted-foreground/50">Tidak ada hasil</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1 p-2">
        {batchResults.map((anime) => {
          const genresText = anime.genres
            ?.map((g: any) => g?.name || "")
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={anime.slug}
              href={`/batch-anime/${anime.slug}`}
              onClick={handleLinkClick}
              className={itemBase}
            >
              <span className={accentBar} />
              <div className="relative w-[72px] h-[46px] shrink-0 rounded-lg overflow-hidden bg-muted ring-1 ring-border/20">
                {anime.poster ? (
                  <Image
                    src={anime.poster}
                    alt={anime.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="72px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className={itemTitle}>{anime.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5 font-medium flex items-center gap-1 border rounded"
                  >
                    <Layers className="w-2.5 h-2.5" /> Batch
                  </Badge>
                </div>
                {genresText && (
                  <p className="text-[10px] text-muted-foreground/60 line-clamp-2 mt-1 leading-snug">
                    {genresText}
                  </p>
                )}
              </div>
              <div className={itemArrow}>
                <PlayCircle className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  // ─── Column: Komik ───────────────────────────────────────────────────────
  const renderKomikCol = () => {
    if (komikResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 gap-2 px-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-xs text-muted-foreground/50">Tidak ada hasil</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1 p-2">
        {komikResults.map((komik) => {
          const latestChapter = getLatestChapter(komik.chapters);
          const genresText = komik.genres
            ?.map((g: any) => g?.data?.name || g?.name || "")
            .filter(Boolean)
            .join(", ");

          return (
            <Link
              key={komik.slug}
              href={`/komik/${komik.slug}`}
              onClick={handleLinkClick}
              className={itemBase}
            >
              <span className={accentBar} />
              <div className="relative w-12 h-[68px] shrink-0 rounded-lg overflow-hidden bg-muted ring-1 ring-border/20">
                {komik.cover ? (
                  <Image
                    src={komik.cover}
                    alt={komik.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="48px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className={itemTitle}>{komik.title}</p>

                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  {komik.rating && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {komik.rating}
                    </span>
                  )}
                  {komik.format && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5 font-medium border rounded"
                    >
                      {komik.format}
                    </Badge>
                  )}
                  {latestChapter && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 flex items-center gap-1"
                    >
                      <BookMarked className="w-2.5 h-2.5" />
                      Ch. {latestChapter.chapterIndex}
                    </Badge>
                  )}
                </div>

                {genresText && (
                  <p className="text-[10px] text-muted-foreground/60 line-clamp-2 mt-0.5 leading-snug">
                    {genresText}
                  </p>
                )}
              </div>
              <div className={itemArrow}>
                <BookOpen className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  // ─── Single Column Loading skeleton ──────────────────────────────────────
  const renderColLoading = () => (
    <div className="flex flex-col gap-3 p-4">
      {[...new Array(5)].map((_, j) => (
        <div key={j} className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-[68px] rounded-lg bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-4/5" />
            <div className="h-2.5 bg-muted rounded w-3/5" />
            <div className="h-2 bg-muted rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Global Empty state ──────────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="py-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Search className="w-8 h-8 text-muted-foreground/30" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground/80">
          Tidak ada hasil ditemukan
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Coba gunakan kata kunci yang berbeda
        </p>
      </div>
    </div>
  );

  const hasAnyResults = totalResults > 0;

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "absolute -inset-0.5 rounded-2xl bg-linear-to-r from-primary/25 via-primary/15 to-primary/25 blur-sm transition-opacity duration-300 pointer-events-none",
            isFocused ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "relative flex items-center rounded-xl border transition-all duration-300 overflow-hidden",
            isFocused
              ? "bg-background border-primary/40 shadow-lg shadow-primary/10"
              : "bg-secondary/60 border-border/60 hover:border-border",
          )}
        >
          <div
            className={cn(
              "pl-4 pr-3 shrink-0 transition-colors duration-200",
              isFocused ? "text-primary" : "text-muted-foreground",
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Cari anime atau komik... (min. 3 karakter)"
            className="flex-1 bg-transparent text-sm text-foreground py-2.5 outline-none placeholder:text-muted-foreground/50 min-w-0"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length >= 3) setIsOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (totalResults > 0 && query.length >= 3) setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
          />

          <div className="pr-3 flex items-center gap-2 shrink-0">
            {query.length > 0 && query.length < 3 && (
              <span className="text-xs text-muted-foreground/40 font-mono tabular-nums">
                {3 - query.length} lagi
              </span>
            )}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setBatchResults([]);
                  setKomikResults([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="w-7 h-7 rounded-lg bg-muted hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {query.length >= 3 && (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 h-6 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-200 shrink-0"
              >
                Cari
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* ── Dropdown Container ── */}
      {isOpen && query.length >= 3 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-3 bg-popover border border-border/60 rounded-2xl shadow-2xl shadow-black/20 z-50 flex flex-col overflow-hidden w-full md:w-[800px] max-h-[85vh] md:max-h-[80vh]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Sparkles className="w-4 h-4 text-muted-foreground/50" />
              )}
              <span className="text-sm text-muted-foreground">
                Hasil untuk{" "}
                <span className="font-semibold text-foreground">
                  &quot;{query}&quot;
                </span>
              </span>
            </div>
            {hasAnyResults && !isLoading && (
              <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {totalResults} hasil
              </span>
            )}
          </div>

          {/* Body Container */}
          <div className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden min-h-0">
            {!isLoading && !hasAnyResults ? (
              renderEmpty()
            ) : (
              <div className="flex-none md:flex-1 md:min-h-0 flex flex-col md:grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
                {/* Col 1: Anime Series */}
                <div className="flex flex-col flex-none md:h-full md:min-h-0">
                  <div className="shrink-0 sticky md:static top-0 z-10 bg-popover md:bg-muted/10 flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Anime Series
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/40">
                      {isAnimeLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        results.length
                      )}
                    </span>
                  </div>
                  <div className="flex-none md:flex-1 md:min-h-0 overflow-visible md:overflow-y-auto overscroll-contain pb-2 md:pb-0">
                    {isAnimeLoading ? renderColLoading() : renderAnimeCol()}
                  </div>
                </div>

                {/* Col 2: Batch / Movie */}
                <div className="flex flex-col flex-none md:h-full md:min-h-0">
                  <div className="shrink-0 sticky md:static top-0 z-10 bg-popover md:bg-muted/10 flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Batch / Movie
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/40">
                      {isBatchLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        batchResults.length
                      )}
                    </span>
                  </div>
                  <div className="flex-none md:flex-1 md:min-h-0 overflow-visible md:overflow-y-auto overscroll-contain pb-2 md:pb-0">
                    {isBatchLoading ? renderColLoading() : renderBatchCol()}
                  </div>
                </div>

                {/* Col 3: Komik */}
                <div className="flex flex-col flex-none md:h-full md:min-h-0">
                  <div className="shrink-0 sticky md:static top-0 z-10 bg-popover md:bg-muted/10 flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Komik
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/40">
                      {isKomikLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        komikResults.length
                      )}
                    </span>
                  </div>
                  <div className="flex-none md:flex-1 md:min-h-0 overflow-visible md:overflow-y-auto overscroll-contain pb-2 md:pb-0">
                    {isKomikLoading ? renderColLoading() : renderKomikCol()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasAnyResults && !isLoading && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={handleLinkClick}
              className="shrink-0 group flex items-center justify-center gap-2 p-4 text-sm font-semibold text-muted-foreground hover:text-primary bg-muted/10 hover:bg-primary/5 transition-all duration-200 border-t border-border/40"
            >
              Lihat semua {totalResults} hasil untuk &quot;{query}&quot;
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
