"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "cursor-pointer fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-white/10 transition-all duration-500 hover:bg-primary/90 hover:scale-110 active:scale-95 focus:outline-none",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0 pointer-events-none",
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4 stroke-[2.5]" />
    </button>
  );
}
