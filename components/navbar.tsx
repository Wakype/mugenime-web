"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchInput from "./searchInput";
import Image from "next/image";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Jadwal", href: "/jadwal-anime" }, // Sesuaikan path Anda
  { name: "Ongoing", href: "/ongoing-anime" },
  { name: "Completed", href: "/completed-anime" },
  { name: "List Anime", href: "/list-anime" },
  { name: "Genre", href: "/genre-anime" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LOGO IMAGE */}

        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 hover:-rotate-2 transition-all ease-in-out"
        >
          <div className="relative h-8 md:h-10 w-auto aspect-1142/249">
            <Image
              src="/assets/logo.png"
              alt="Mugenime Logo"
              fill
              className="object-contain transition-transform duration-300 -mt-0.5"
              priority
              sizes="(max-width: 768px) 120px, 160px"
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-full transition-all duration-200",

                pathname === link.href
                  ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* SEARCH & ACTIONS */}

        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Search Input (Hidden on mobile initially, or styled differently) */}

          <div className="hidden md:block w-full max-w-[280px] lg:max-w-[320px]">
            <SearchInput />
          </div>

          {/* Mobile Menu Button */}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-zinc-700 dark:text-zinc-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}

      {isOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 absolute w-full left-0 top-16 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}

          <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <SearchInput onSearchSubmit={() => setIsOpen(false)} />
          </div>

          {/* Mobile Links */}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",

                  pathname === link.href
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                {link.name}

                {pathname === link.href && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
