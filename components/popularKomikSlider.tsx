"use client";

import Link from "next/link";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import KomikCard from "./komikCard";
import { KomikItem } from "@/lib/komikTypes";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeInWrapper } from "@/components/homeSection";

export default function PopularSlider({
  comics,
}: {
  readonly comics: KomikItem[];
}) {
  // Initialize Embla Carousel with Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  // Navigation handlers for the custom next/prev buttons
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="space-y-6">
      <FadeInWrapper>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Flame className="w-5 h-5" />
              <span>Sedang Hangat</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Komik Populer
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Slider Controls */}
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full h-9 w-9 border-border hover:bg-secondary cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full h-9 w-9 border-border hover:bg-secondary cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              asChild
              className="rounded-full border-border hover:bg-secondary group h-9 px-4 text-xs font-semibold ml-1 sm:ml-2"
            >
              <Link href="/popular-komik">
                Lihat Semua{" "}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeInWrapper>

      <div className="overflow-hidden w-full pb-6 pt-2" ref={emblaRef}>
        <div className="flex -ml-4">
          {comics.map((comic, idx) => (
            <div
              key={comic.slug}
              className="flex-none pl-4 w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[20%]"
            >
              <KomikCard comic={comic} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
