"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Star, PlayCircle, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { searchAnimeAction } from "@/app/actions";
import { fetchKS } from "@/lib/api";
import { SearchResult } from "@/lib/types";
import { KS_SearchResponse, KS_AnimeItem } from "@/lib/batchAnimeTypes";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch Data (Reguler & Batch secara Paralel)
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        setBatchResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const [stdData, ksData] = await Promise.all([
          searchAnimeAction(debouncedQuery).catch(() => []),
          fetchKS<KS_SearchResponse>(
            `anime/kusonime/search/${encodeURIComponent(debouncedQuery)}`
          ).catch(() => null),
        ]);

        setResults(stdData || []);
        setBatchResults(ksData?.anime_list || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
        setIsOpen(true);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearchSubmit) onSearchSubmit();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const totalResults = results.length + batchResults.length;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs">Mencari Anime...</span>
        </div>
      );
    }

    if (totalResults > 0) {
      return (
        <div className="space-y-2">
          {/* List Anime Reguler */}
          {results.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Anime Series
              </div>
              {results.map((anime) => (
                <Link
                  key={anime.slug}
                  href={`/anime/${anime.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (onSearchSubmit) onSearchSubmit();
                  }}
                  className="group flex gap-3 p-2 hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={anime.poster ?? ""}
                      alt={anime.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs">
                      {anime.rating && (
                        <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-current" /> {anime.rating}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 border-border text-muted-foreground"
                      >
                        {anime.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">
                      {anime.genres?.map((g) => g.genreId).join(", ")}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="self-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List Anime Batch */}
          {batchResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-t border-border">
                Anime Batch / Movie
              </div>
              {batchResults.map((anime) => (
                <Link
                  key={anime.slug}
                  href={`/batch-anime/${anime.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (onSearchSubmit) onSearchSubmit();
                  }}
                  className="group flex gap-3 p-2 hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <div className="relative w-16 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={anime.poster ?? ""}
                      alt={anime.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Info Batch */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 border-primary/30 text-primary bg-primary/5 flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3" /> Batch
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">
                      {anime.genres?.map((g) => g.name).join(", ")}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="self-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          Tidak ditemukan hasil.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Coba kata kunci lain.
        </p>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder="Cari anime... ( min. 3 karakter )"
          className="w-full bg-secondary/50 text-foreground text-sm rounded-full pl-10 pr-10 py-2.5 border border-border/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm placeholder:text-muted-foreground"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setIsOpen(true);
          }}
          onFocus={() => {
            if (totalResults > 0) setIsOpen(true);
          }}
        />

        {/* Ikon Search Kiri */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Tombol Clear Kanan */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setBatchResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* --- DROPDOWN SUGGESTIONS --- */}
      {isOpen && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header Param */}
          <div className="px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground flex justify-between items-center">
            <span>
              Hasil pencarian:{" "}
              <span className="text-primary font-bold">
                &quot;{query}&quot;
              </span>
            </span>
            {totalResults > 0 && (
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-foreground">
                {totalResults} ditemukan
              </span>
            )}
          </div>

s          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {renderContent()}
          </div>

          {/* Footer: View All */}
          {totalResults > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsOpen(false);
                if (onSearchSubmit) onSearchSubmit();
              }}
              className="block p-3 text-center text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors border-t border-border"
            >
              Lihat Semua Hasil
            </Link>
          )}
        </div>
      )}
    </div>
  );
}