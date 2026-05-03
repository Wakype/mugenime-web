"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle, Package2, RectangleHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const announcementList = [
  {
    id: 3,
    date: "3 Mei 2026",
    tag: "Baru",
    tagColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: RectangleHorizontal,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "Theater Mode Telah Hadir!",
    content:
      "Nonton makin fokus dengan Theater Mode! Klik icon di player atau cukup tekan tombol 'T' di keyboard.",
  },
  {
    id: 1,
    date: "26 April 2026",
    tag: "Baru",
    tagColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: MessageCircle,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Fitur Komentar Sudah Tersedia!",
    content: "Udah bisa komen di mugenime nih! tinggal login aja",
  },
  {
    id: 2,
    date: "20 April 2026",
    tag: "Update",
    tagColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    icon: Package2,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    title: "Halaman Batch",
    content:
      "Anime Batch sekarang punya halaman khusus. Download seluruh episode / movie anime disini.",
  },
];

export default function AnnouncementSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Update dots pagination saat slide berubah
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  // Setup dots pagination
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="relative w-full pb-8">
      {/* Viewport Embla (Area yang bisa di drag) */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom -ml-4">
          {announcementList.map((item) => {
            const Icon = item.icon;
            return (
              // Menentukan lebar per item.
              // Mobile: 100% (1 item). Desktop/Tablet: 50% (2 item bersandingan)
              // min-w-0 penting untuk mencegah flex item melebar keluar container
              <div
                key={item.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-4"
              >
                {/* Desain Card Asli */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group cursor-grab active:cursor-grabbing">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${item.iconColor} group-hover:scale-110 transition-transform`}
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 h-4 border uppercase tracking-wider ${item.tagColor}`}
                      >
                        {item.tag}
                      </Badge>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground leading-tight truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed select-none">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Titik Navigasi (Pagination Dots) di Bawah */}
      {scrollSnaps.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                selectedIndex === idx
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-primary/20 hover:bg-primary/50",
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
