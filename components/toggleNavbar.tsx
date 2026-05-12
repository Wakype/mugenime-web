"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

export default function ToggleNavbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Deteksi apakah user berada di route /komik/[slug]/[chapter]
  // Contoh path: /komik/tokidoki-bosotto.../chapter-2
  const isReaderPage =
    pathname?.startsWith("/komik/") && pathname.split("/").length === 4;

  useEffect(() => {
    if (!isReaderPage) {
      setIsVisible(true); // Selalu tampilkan jika bukan di halaman baca
      return;
    }

    // Default tersembunyi saat pertama kali masuk ke halaman chapter
    setIsVisible(false);

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Sembunyikan navbar jika ada aktivitas scroll ke bawah (melewati 50px)
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Jangan toggle jika user mengklik bagian dalam navbar itu sendiri
      if (target.closest("#navbar-wrapper")) return;

      // Munculkan / Sembunyikan saat layar diklik
      setIsVisible((prev) => !prev);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
    };
  }, [isReaderPage]);

  // Jika bukan halaman reader, render Navbar normal tanpa wrapper animasi tambahan
  if (!isReaderPage) {
    return <Navbar />;
  }

  return (
    <div
      id="navbar-wrapper"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <Navbar />
    </div>
  );
}
