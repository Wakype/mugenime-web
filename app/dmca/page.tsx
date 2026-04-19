import {
  Mail,
  Gavel,
  FileWarning,
  Scale,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA & Disclaimer - Mugenime",
  description: "Informasi hak cipta dan disclaimer legal Mugenime.",
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen pb-20 pt-8 bg-background selection:bg-primary/30">
      <div className="container mx-auto px-4 space-y-12 max-w-7xl animate-in fade-in duration-700 slide-in-from-bottom-4">
        {/* --- HERO HEADER --- */}
        <div className="relative rounded-3xl bg-card border border-border p-8 md:p-16 shadow-xl overflow-hidden text-center group">
          {/* Background Grid & Blur */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[32px_32px] text-muted-foreground/3 pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/15 transition-colors duration-1000" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary shadow-inner mb-2s">
              <Scale className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground font-heading">
                DMCA & <span className="text-primary">Disclaimer</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Pusat informasi legalitas, hak cipta, dan penyangkalan tanggung
                jawab. Harap baca ketentuan berikut dengan seksama sebelum
                menggunakan layanan Mugenime.
              </p>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="grid gap-8 relative z-10">
          {/* Section 1: General Disclaimer */}
          <div className="group relative p-6 md:p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            {/* Left Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-muted-foreground/30 group-hover:bg-primary transition-colors duration-300" />

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-muted rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Penyangkalan Umum
              </h2>
            </div>

            <div className="prose dark:prose-invert text-base text-muted-foreground space-y-4 leading-relaxed text-justify max-w-none">
              <p>
                Mugenime adalah layanan penyedia indeks link video anime yang
                tersedia secara publik di internet. Kami{" "}
                <strong>TIDAK MENYIMPAN</strong> file video, gambar, atau aset
                multimedia apapun di server kami sendiri.
              </p>
              <p>
                Semua konten video yang ditampilkan di situs ini diindeks
                otomatis dari layanan pihak ketiga atau sumber terbuka lainnya
                di internet. Kami tidak memiliki kendali atas konten tersebut
                dan tidak bertanggung jawab atas legalitas, keakuratan, atau isi
                dari konten yang disediakan oleh pihak ketiga tersebut.
              </p>
            </div>
          </div>

          {/* Section 2: Copyright & DMCA */}
          <div className="group relative p-6 md:p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            {/* Left Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-muted-foreground/30 group-hover:bg-primary transition-colors duration-300" />

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-muted rounded-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Hak Cipta & Takedown Notice
              </h2>
            </div>

            <div className="prose dark:prose-invert text-base text-muted-foreground space-y-5 leading-relaxed text-justify max-w-none">
              <p>
                Kami sangat menghormati Hak Kekayaan Intelektual (HAKI) para
                kreator. Jika Anda adalah pemilik hak cipta yang sah atau agen
                yang berwenang, dan Anda percaya bahwa konten yang terindeks di
                situs kami melanggar hak cipta Anda, silakan hubungi kami untuk
                permohonan penghapusan (<i>Takedown Request</i>).
              </p>

              <div className="bg-background/80 p-6 rounded-2xl border border-border/60 shadow-inner">
                <p className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-primary" />
                  Informasi yang diperlukan untuk pelaporan:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 marker:text-primary text-sm md:text-base">
                  <li>
                    Nama lengkap, kontak yang bisa dihubungi, dan afiliasi
                    perusahaan (jika ada).
                  </li>
                  <li>
                    Bukti identifikasi atau kepemilikan hak cipta yang sah atas
                    materi tersebut.
                  </li>
                  <li>
                    <strong>URL spesifik</strong> di situs Mugenime yang memuat
                    konten yang dipermasalahkan.
                  </li>
                  <li>
                    Pernyataan resmi bahwa penggunaan konten tersebut tidak
                    diizinkan oleh pemilik hak cipta dan laporan ini dibuat
                    dengan itikad baik.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT CTA --- */}
        <div className="relative overflow-hidden flex flex-col items-center justify-center p-10 md:p-14 rounded-[2.5rem] bg-linear-to-br from-primary to-primary/80 text-primary-foreground text-center space-y-8 shadow-2xl shadow-primary/30 mt-8 group">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-md shadow-inner mb-2 border border-white/20">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black font-heading tracking-tight">
              Kirimkan Laporan
            </h3>
            <p className="text-primary-foreground/90 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Tim kami berkomitmen untuk meninjau dan merespons setiap laporan
              DMCA yang sah dalam waktu <strong>3x24 jam kerja</strong>.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="relative z-10 bg-background text-primary hover:bg-muted hover:scale-105 active:scale-95 font-black rounded-full px-10 h-14 shadow-xl transition-all duration-300"
          >
            <Link href="mailto:mugenime.id@gmail.com">
              <Send className="w-5 h-5 mr-2" /> Hubungi Kami via Email
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
