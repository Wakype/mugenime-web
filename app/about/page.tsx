import {
  ShieldAlert,
  Zap,
  Heart,
  Code,
  Tv,
  Layers,
  Mail,
  Package2,
  BadgeQuestionMark,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami - Mugenime",
  description:
    "Pelajari lebih lanjut tentang Mugenime, platform streaming dan download anime subtitle Indonesia.",
};

export default function AboutPage() {
  // Placeholder URLs
  const bannerPlaceholder = "/assets/banner.png";
  const iconPlaceholder = "/assets/icon.png";

  return (
    <div className="min-h-screen pb-20 py-10 bg-background selection:bg-primary/30">
      <div className="container mx-auto px-4 space-y-10 animate-in fade-in duration-500">
        {/* --- 1. MUGENIME BANNER WITH ABSOLUTE ICON --- */}
        <div className="relative rounded-3xl bg-card border border-border shadow-xl overflow-hidden aspect-2460/936 group">
          {/* Main Banner Image */}
          <Image
            src={bannerPlaceholder}
            alt="Mugenime Official Banner"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
            unoptimized
          />

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* ABSOLUTE ICON: Placed at bottom right, tilted (rotated) */}
          <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-24 h-24 md:w-44 md:h-44 z-20 hidden xl:block">
            <div className="relative w-full h-full rotate-12 group-hover:rotate-6 transition-transform duration-500">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Image
                src={iconPlaceholder}
                alt="Mugenime Icon"
                fill
                className="object-contain drop-shadow-2xl rounded-2xl md:rounded-3xl border-4 border-white/10 backdrop-blur-sm"
                unoptimized
              />
            </div>
          </div>

          {/* Decorative Glows */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-70 transition-opacity" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* --- MAIN CONTENT (Left - 8 cols) --- */}
          <div className="md:col-span-8 space-y-10">
            {/* About Mugenime Card */}
            <div className="relative rounded-2xl bg-card p-6 md:p-8 border border-border shadow-sm overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-foreground text-center md:text-left">
                  Tentang <span className="text-primary">Mugenime</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify">
                  Mugenime adalah platform penyedia layanan streaming dan
                  download anime dengan subtitle Indonesia. Kami berkomitmen
                  untuk memberikan pengalaman menonton yang cepat, bersih, dan
                  nyaman bagi seluruh komunitas wibu di Indonesia.
                </p>
              </div>
            </div>

            {/* Goals Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-4 justify-center md:justify-start">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Tujuan Kami
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-justify px-1">
                Berawal dari hobi menonton anime, lalu menyadari betapa
                pentingnya antarmuka (UI) yang ramah pengguna dan bebas dari
                iklan yang mengganggu. <b>Mugenime</b> dibangun dengan fokus
                pada kecepatan akses, desain modern, serta kemudahan dalam
                mengunduh episode anime baik secara satuan (Reguler) maupun
                paketan (Batch).
              </p>
            </section>

            {/* Features Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4 justify-center md:justify-start">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Fitur Utama
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Tv className="w-6 h-6" />}
                  title="Streaming Cepat"
                  desc="Koleksi anime on-going dan completed yang bisa ditonton langsung dengan berbagai pilihan resolusi."
                />
                <FeatureCard
                  icon={<Package2 className="w-6 h-6" />}
                  title="Download Batch & Movie"
                  desc="Unduh seluruh episode atau movie dalam satu klik!"
                />
                <FeatureCard
                  icon={<Heart className="w-6 h-6" />}
                  title="UI/UX Modern"
                  desc="Desain responsif, clean, dan mendukung Dark Mode yang memanjakan mata."
                />
                <FeatureCard
                  icon={<ShieldAlert className="w-6 h-6" />}
                  title="Aman & Nyaman"
                  desc="Navigasi yang jelas dan bebas dari pop-up iklan yang berbahaya."
                />
              </div>
            </section>

            {/* DMCA Section */}
            <section className="space-y-4 bg-destructive/5 p-6 rounded-2xl border border-destructive/20">
              <div className="flex items-center gap-2 pb-2 text-destructive">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="text-xl font-bold tracking-tight">
                  Disclaimer (DMCA)
                </h2>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3 text-justify">
                <p>
                  Semua file video, gambar, dan aset lainnya yang ada di
                  Mugenime <b>tidak disimpan di server kami sendiri</b>. Kami
                  hanya mengindeks tautan-tautan yang sudah tersedia secara
                  publik di internet melalui API pihak ketiga.
                </p>
                <p>
                  Kami menghargai hak kekayaan intelektual. Jika Anda adalah
                  pemilik hak cipta dan ingin konten tersebut dihapus, silakan
                  hubungi kami melalui email resmi di bawah.
                </p>
              </div>
            </section>
          </div>

          {/* --- SIDEBAR (Right - 4 cols) --- */}
          <div className="md:col-span-4 space-y-6">
            {/* Tech Stack Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Tech Stack
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dibangun dengan teknologi terbaru untuk performa maksimal:
              </p>
              <div className="flex flex-wrap gap-2">
                <TechBadge name="Next.js 15" />
                <TechBadge name="React" />
                <TechBadge name="TypeScript" />
                <TechBadge name="Tailwind CSS" />
                <TechBadge name="Lucide Icons" />
                <TechBadge name="Shadcn UI" />
              </div>
            </div>

            {/* Feedback CTA Card */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 space-y-4 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto text-primary">
                <BadgeQuestionMark className="w-6 h-6 fill-primary/20" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Punya Masukan?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bantu kami menjadi lebih baik! Jika Anda menemukan bug atau
                memiliki saran fitur, jangan ragu untuk berdiskusi.
              </p>
              <Button
                asChild
                className="w-full rounded-xl shadow-lg shadow-primary/20 font-semibold"
              >
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>

            {/* NEW: Contact Email Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Mail className="w-5 h-5 text-primary" />
                <h3>Hubungi Kami</h3>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Untuk keperluan kerjasama, laporan konten (DMCA), atau
                  pertanyaan lainnya:
                </p>
                <a
                  href="mailto:mugenime.id@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground truncate">
                    mugenime.id@gmail.com
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FeatureCard({
  icon,
  title,
  desc,
}: Readonly<{ icon: React.ReactNode; title: string; desc: string }>) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all group">
      <div className="mb-3 p-3 bg-primary/10 w-fit rounded-lg text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed text-left">
        {desc}
      </p>
    </div>
  );
}

function TechBadge({ name }: Readonly<{ name: string }>) {
  return (
    <span className="px-2.5 py-1 text-[11px] font-semibold bg-secondary text-secondary-foreground rounded border border-border/60">
      {name}
    </span>
  );
}
