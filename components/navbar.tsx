"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Jadwal Anime", href: "/jadwal-anime" },
  { name: "Ongoing Anime", href: "/ongoing-anime" },
  { name: "Completed Anime", href: "/completed-anime" },
  { name: "List Anime", href: "/list-anime" },
  { name: "Genre", href: "/genre-anime" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 group-hover:text-indigo-700 transition-colors">
            <Moon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-black font-heading text-xl uppercase text-indigo-600 dark:text-zinc-100">
            Mugenime.
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium font-heading transition-colors hover:text-indigo-600 dark:hover:text-indigo-400",
                pathname === link.href
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* SEARCH & MOBILE TOGGLE */}
        <div className="flex items-center gap-2 md:gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative items-center"
          >
            <input
              type="text"
              placeholder="Cari anime..."
              className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-[200px] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 text-zinc-500 hover:text-indigo-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-700 dark:text-zinc-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 absolute w-full left-0 top-16 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari anime..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-zinc-500"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
