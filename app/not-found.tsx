import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      {/* 1. BACKGROUND DECORATION */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px] text-muted-foreground/5 pointer-events-none" />

      {/* Glow Effect di tengah */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* 2. CONTENT */}
      <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
        {/* Angka 404 Besar */}
        <div className="relative">
          {/* Gradient text menggunakan primary color */}
          <h1 className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-linear-to-b from-primary/80 to-transparent select-none opacity-80">
            404
          </h1>

          {/* Ilustrasi Teks di atas angka */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest backdrop-blur-sm border border-primary/20">
              Page Not Found
            </span>
          </div>
        </div>

        <div className="space-y-2 -mt-10">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground font-heading">
            Ara ara... Kamu Tersesat?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Sepertinya kamu gagal masuk ke isekai 🗿
          </p>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
          >
            <Link href="/" prefetch={false}>
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Link href="/ongoing-anime" prefetch={false}>
              <Search className="w-4 h-4 mr-2" />
              Cari Anime Lain
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-xs text-muted-foreground/50 font-mono">
        ERROR_CODE: 404_GAGAL_MASUK_ISEKAI
      </div>
    </div>
  );
}
