import { Moon } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* 1. BACKGROUND DECORATION */}
      {/* Grid Pattern: Menggunakan currentColor agar adaptif */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />

      {/* Glow: Menggunakan bg-primary */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 2. LOADING CONTENT */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated Icon Wrapper */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Ring Luar Berputar: Menggunakan border-muted */}
          <div className="absolute inset-0 border-4 border-muted rounded-full" />
          {/* Ring Loading: Menggunakan border-primary */}
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />

          {/* Logo Tengah (M) */}
          <div className="bg-primary p-1.5 rounded-lg transition-colors shadow-lg shadow-primary/20">
            <Moon className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-foreground tracking-tight animate-pulse">
            Memuat Mugenime...
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Nonton anime dan baca komik gratis tanpa iklan, sabar yaa...
          </p>
        </div>
      </div>
    </div>
  );
}
