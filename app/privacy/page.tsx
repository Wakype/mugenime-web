import { Shield, Lock, Eye, Database, Cookie, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Mugenime",
  description: "Bagaimana kami mengelola dan melindungi data privasi Anda.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-20 py-10 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 space-y-12 max-w-4xl">
        {/* --- HEADER --- */}
        <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm overflow-hidden text-center group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          <div className="absolute -top-24 right-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-heading">
              Privacy <span className="text-indigo-600">Policy</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Privasi Anda adalah prioritas kami. Halaman ini menjelaskan jenis
              informasi pribadi yang diterima dan dikumpulkan oleh Mugenime dan
              bagaimana informasi tersebut digunakan.
            </p>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="grid gap-6 md:grid-cols-2">
          <PrivacyCard
            icon={<Database className="w-5 h-5 text-indigo-500" />}
            title="Log Files"
          >
            Seperti banyak situs Web lain, Mugenime menggunakan file log.
            Informasi dalam file log meliputi alamat protokol internet (IP),
            jenis browser, Penyedia Layanan Internet (ISP), stempel
            tanggal/waktu, dan jumlah klik untuk menganalisis tren, dan
            mengelola situs.
          </PrivacyCard>

          <PrivacyCard
            icon={<Cookie className="w-5 h-5 text-indigo-500" />}
            title="Cookies"
          >
            Mugenime menggunakan cookies untuk menyimpan informasi tentang
            preferensi pengunjung, merekam informasi spesifik pengguna pada
            halaman mana yang diakses atau dikunjungi pengguna, menyesuaikan
            konten halaman Web berdasarkan jenis browser pengunjung atau
            informasi lain yang dikirimkan pengunjung melalui browser mereka.
          </PrivacyCard>

          <PrivacyCard
            icon={<Lock className="w-5 h-5 text-indigo-500" />}
            title="Local Storage"
          >
            Kami menggunakan <strong>Local Storage</strong> browser Anda untuk
            menyimpan data fitur seperti <i>Riwayat Menonton</i> dan{" "}
            <i>Bookmark</i>. Data ini disimpan secara lokal di perangkat Anda
            dan tidak dikirim ke server kami, sehingga privasi tontonan Anda
            sepenuhnya terjaga di tangan Anda sendiri.
          </PrivacyCard>

          <PrivacyCard
            icon={<Eye className="w-5 h-5 text-indigo-500" />}
            title="Pihak Ketiga"
          >
            Server iklan pihak ketiga atau jaringan iklan menggunakan teknologi
            pada iklan dan tautan yang muncul di Mugenime yang dikirim langsung
            ke browser Anda. Mereka secara otomatis menerima alamat IP Anda saat
            ini terjadi. Teknologi lain (seperti cookie, JavaScript, atau Web
            Beacon) juga dapat digunakan oleh jaringan iklan pihak ketiga untuk
            mengukur efektivitas iklan mereka.
          </PrivacyCard>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            Persetujuan
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Dengan menggunakan situs web kami, Anda dengan ini menyetujui
            kebijakan privasi kami dan menyetujui syarat-syaratnya. Jika Anda
            memerlukan informasi lebih lanjut atau memiliki pertanyaan tentang
            kebijakan privasi kami, jangan ragu untuk menghubungi kami melalui
            email.
          </p>
        </div>

        <Separator className="my-8 bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex justify-center pb-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-indigo-600 dark:bg-indigo-100 text-white dark:text-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-200"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PrivacyCard({
  icon,
  title,
  children,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
          {icon}
        </div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
