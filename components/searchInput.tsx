"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Star, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { searchAnimeAction } from "@/app/actions";
import { SearchResult } from "@/lib/types";
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

  // Fetch Data
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const data = await searchAnimeAction(debouncedQuery);
      setResults(data);
      setIsLoading(false);
      setIsOpen(true);
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

  const getProxyUrl = (url: string) =>
    `/api/image-proxy?url=${encodeURIComponent(url)}`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-zinc-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs">Mencari Anime...</span>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="space-y-1">
          {results.map((anime) => (
            <Link
              key={anime.slug}
              href={`/anime/${anime.slug}`}
              onClick={() => {
                setIsOpen(false);
                if (onSearchSubmit) onSearchSubmit();
              }}
              className="group flex gap-3 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-lg transition-colors"
            >
              <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={getProxyUrl(anime.poster)}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  {anime.rating && (
                    <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-current" /> {anime.rating}
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 border-zinc-200 dark:border-zinc-700 text-zinc-500"
                  >
                    {anime.status}
                  </Badge>
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1">
                  {anime.genres?.map((g) => g.genreId).join(", ")}
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="self-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
              </div>
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-500 font-medium">
          Tidak ditemukan hasil.
        </p>
        <p className="text-xs text-zinc-400 mt-1">Coba kata kunci lain.</p>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder="Cari anime... ( min. 3 karakter )"
          className="w-full bg-zinc-100 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 text-sm rounded-full pl-10 pr-10 py-2.5 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />

        {/* Ikon Search Kiri */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
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
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* --- DROPDOWN SUGGESTIONS --- */}
      {isOpen && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header Param */}
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-500 flex justify-between items-center">
            <span>
              Hasil pencarian:{" "}
              <span className="text-indigo-600 font-bold">
                &quot;{query}&quot;
              </span>
            </span>
            {results.length > 0 && (
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                {results.length} ditemukan
              </span>
            )}
          </div>

          {/* Render Content Function dipanggil disini */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
            {renderContent()}
          </div>

          {/* Footer: View All */}
          {results.length > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsOpen(false);
                if (onSearchSubmit) onSearchSubmit();
              }}
              className="block p-3 text-center text-xs font-bold text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border-t border-zinc-100 dark:border-zinc-800"
            >
              Lihat Semua Hasil
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
