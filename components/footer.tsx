import Link from "next/link";
import { AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* --- TOP SECTION (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* KOLOM 1: BRANDING & SOSMED (4 SPAN) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
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
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
                Download dan streaming anime subtitle Indonesia lengkap dalam
                format Mp4 dan MKV dengan berbagai resolusi (360p, 480p, 720p,
                dan 1080p) di platform gratis, tanpa iklan yang mengganggu, dan
                hemat kuota.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <SocialLink
                href="https://www.facebook.com/profile.php?id=61584752845992"
                icon={
                  <Image
                    width={0}
                    height={0}
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'%3E%3Cpath d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'/%3E%3C/svg%3E"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                }
                label="Facebook"
              />
              <SocialLink
                href="#"
                icon={
                  <Image
                    width={0}
                    height={0}
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'%3E%3Cpath d='M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077'/%3E%3C/svg%3E"
                    alt="Instagram"
                    className="w-5 h-5"
                  />
                }
                label="Instagram"
              />
              <SocialLink
                href="#"
                icon={
                  <Image
                    width={0}
                    height={0}
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'%3E%3Cpath d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'/%3E%3C/svg%3E"
                    alt="Discord"
                    className="w-5 h-5"
                  />
                }
                label="Discord"
              />
            </div>
          </div>

          {/* KOLOM 2: EXPLORE (2 SPAN) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              Jelajahi
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/jadwal-anime"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Jadwal Rilis
                </Link>
              </li>
              <li>
                <Link
                  href="/ongoing-anime"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sedang Tayang
                </Link>
              </li>
              <li>
                <Link
                  href="/completed-anime"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Anime Tamat
                </Link>
              </li>
              <li>
                <Link
                  href="/genre-anime"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Daftar Genre
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: BANTUAN (3 SPAN) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              Panduan & Bantuan
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/guide/streaming"
                  className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Cara Streaming
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/download"
                  className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Cara Download
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  DMCA / Copyright
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: STATUS & LAPOR (3 SPAN) */}
          <div className="lg:col-span-3 space-y-6">
            {/* API Status Box */}

            {/* SYSTEM STATUS CARD */}
            <div className="group p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:shadow-sm">
              {/* Header Label */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  System Status
                </span>
                {/* Pulsing Dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>

              {/* Main Content */}
              <div className="flex items-center gap-3">
                {/* Icon Box */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-amber-500 transition-all">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>

                {/* Text Info */}
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 leading-none">
                    API Service
                  </p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Operational (Stable)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Lapor (Call to Action) */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Menemukan link rusak, episode salah, atau error player?
              </p>
              <Button
                variant="outline"
                className="w-full border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-900/50 dark:bg-red-950/10 dark:hover:bg-red-950/30 dark:text-red-400 justify-start"
                asChild
              >
                <Link href="/report">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Lapor Link Rusak / Error
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-800" />

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              &copy; {currentYear} Mugenime. Dibuat karena gabut
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 max-w-xl">
              Mugenime tidak menyimpan file video di server sendiri. Semua
              konten disediakan oleh pihak ketiga non-afiliasi.
            </p>
          </div>

          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Component untuk Social Icon
function SocialLink({
  href,
  icon,
  label,
}: Readonly<{
  href: string;
  icon: React.ReactNode;
  label: string;
}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
    >
      {icon}
    </a>
  );
}
