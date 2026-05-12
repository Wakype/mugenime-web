"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const FORMAT_OPTIONS = [
  { id: "manga", label: "Manga" },
  { id: "manhwa", label: "Manhwa" },
  { id: "manhua", label: "Manhua" },
  { id: "mangatoon", label: "Mangatoon" },
];

export default function FormatFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Simpan format aktif dari URL ke dalam state lokal terlebih dahulu
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  useEffect(() => {
    setSelectedFormats(searchParams.getAll("format"));
  }, [searchParams]);

  // Fungsi toggle state (BELUM PUSH URL)
  const toggleFormat = (formatId: string) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((f) => f !== formatId)
        : [...prev, formatId],
    );
  };

  // Fungsi Apply Filter (EKSEKUSI PUSH URL)
  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page ke 1 setiap kali filter di-apply
    params.set("page", "1");
    params.delete("format");

    // Tambahkan format yang sudah dipilih di local state
    selectedFormats.forEach((f) => params.append("format", f));

    router.push(`/format-komik?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-card border border-border shadow-sm w-full">
      <div className="flex items-center gap-2.5 text-sm font-bold text-foreground capitalize tracking-wider whitespace-nowrap">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm shadow-primary/20">
          <Filter className="w-4 h-4 text-white" />{" "}
        </div>
        Filter Format:
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {FORMAT_OPTIONS.map((fmt) => {
          const isSelected = selectedFormats.includes(fmt.id);
          return (
            <button
              key={fmt.id}
              onClick={() => toggleFormat(fmt.id)}
              className="outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "px-3.5 py-1.5 text-sm md:text-base font-semibold transition-all cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground border-border hover:bg-secondary hover:text-foreground hover:border-primary/50",
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 mr-1.5" />}
                {fmt.label}
              </Badge>
            </button>
          );
        })}
      </div>

      <Button
        onClick={applyFilter}
        className="w-full md:w-auto shrink-0 font-semibold"
      >
        Terapkan Filter
      </Button>
    </div>
  );
}
