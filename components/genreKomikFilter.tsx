"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Hash, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Genre } from "@/lib/komikTypes";

interface GenreFilterProps {
  genres: Genre[];
}

export default function GenreFilter({ genres }: Readonly<GenreFilterProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mengambil genre yang aktif di URL saat ini
  const currentUrlGenres = searchParams.getAll("genre");

  // Local state untuk menyimpan pilihan sebelum diterapkan (apply)
  const [selectedGenres, setSelectedGenres] =
    useState<string[]>(currentUrlGenres);

  // Sync local state jika URL berubah dari luar (misal pengguna menekan Reset Filter di halaman utama)
  useEffect(() => {
    setSelectedGenres(searchParams.getAll("genre"));
  }, [searchParams]);

  const toggleGenre = (genreName: string) => {
    if (selectedGenres.includes(genreName)) {
      // Hapus jika sudah terpilih
      setSelectedGenres((prev) => prev.filter((g) => g !== genreName));
    } else {
      // Tambahkan jika belum terpilih
      setSelectedGenres((prev) => [...prev, genreName]);
    }
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Kembalikan halaman ke 1 setiap kali filter baru diterapkan
    params.set("page", "1");

    // Hapus parameter genre yang lama
    params.delete("genre");

    // Masukkan parameter genre yang baru dipilih
    selectedGenres.forEach((g) => params.append("genre", g));

    // Eksekusi perubahan URL (ini akan men-trigger fetch di Server Component)
    router.push(`/genre-komik?${params.toString()}`, { scroll: false });
  };

  // Mengecek apakah ada perubahan pilihan yang belum diterapkan
  const hasChanges =
    selectedGenres.length !== currentUrlGenres.length ||
    !selectedGenres.every((g) => currentUrlGenres.includes(g));

  return (
    <div className="space-y-4">
      {/* List Badges */}
      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 py-1">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.data.name);
          return (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.data.name)}
              className="outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground hover:border-primary/50",
                )}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 mr-1.5" />
                ) : (
                  <Hash className="w-3 h-3 mr-1.5 opacity-50" />
                )}
                {genre.data.name}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
        {selectedGenres.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedGenres([])}
            className="text-muted-foreground hover:text-destructive text-xs h-9 cursor-pointer"
          >
            Bersihkan Pilihan
          </Button>
        )}
        <Button
          size="sm"
          onClick={applyFilter}
          disabled={!hasChanges}
          className="h-9 px-4 font-bold rounded-xl cursor-pointer"
        >
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
}
