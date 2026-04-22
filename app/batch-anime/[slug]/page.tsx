import { fetchKS } from "@/lib/api";
import { KS_DetailResponse, KS_DownloadLink } from "@/lib/batchAnimeTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Info,
  Calendar,
  Clock,
  Layers,
  Tv,
  Download,
  Home,
  Film,
  Disc,
  Tags,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShareButton from "@/components/shareButton";
import BookmarkButton from "@/components/bookmarkButton";
import CommentSection from "@/components/commentSection";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
};

// --- Extract Resolution via URL & Host Pattern ---
function parseDownloadLinks(
  rawLinks: KS_DetailResponse["detail"]["download_links"],
) {
  if (!rawLinks) return [];

  return rawLinks.map((section) => {
    if (section.links.length === 1) {
      return {
        sectionTitle: section.resolution,
        groups: [
          {
            resolution: "All Resolution",
            links: section.links,
          },
        ],
      };
    }

    const groups: { resolution: string; links: KS_DownloadLink[] }[] = [];
    let currentRes = "Unknown";
    let currentGroup: KS_DownloadLink[] = [];

    const fallbackResolutions = ["360P", "480P", "720P", "1080P"];
    let fallbackIndex = 0;
    const seenHosts = new Set<string>();

    for (const link of section.links) {
      const url = link.url.toLowerCase().trim();
      const host = link.host.toLowerCase().trim();

      // Coba deteksi dari URL terlebih dahulu
      const resMatch = new RegExp(
        /(360p|480p|720p|1080p|1440p|01-12|13-24)/,
      ).exec(url);
      const isSub = new RegExp(/(fontsubs|subtitle|subs)/).exec(url);

      let detectedRes = null;

      if (resMatch) {
        detectedRes = resMatch[1].toUpperCase();
      } else if (isSub) {
        detectedRes = "Subtitle";
      } else {
        // --- Deteksi Resolusi via Perulangan Host ---
        if (seenHosts.has(host)) {
          // Jika host sudah ada (mengulang), berarti naik tier resolusi
          fallbackIndex++;
          seenHosts.clear(); // Reset memori host untuk tier baru ini
        }
        
        seenHosts.add(host); // Catat host ini ke dalam memori
        
        // Ambil label resolusi. Pakai Math.min agar index tidak kelebihan/error 
        // jika ternyata ada lebih dari 4 kali perulangan.
        const safeIndex = Math.min(fallbackIndex, fallbackResolutions.length - 1);
        detectedRes = fallbackResolutions[safeIndex];
      }

      // --- Grouping Logic ---
      if (detectedRes && detectedRes !== currentRes) {
        if (currentGroup.length > 0) {
          groups.push({
            resolution: currentRes,
            links: currentGroup,
          });
        }
        currentRes = detectedRes;
        currentGroup = [link];
      } else {
        currentGroup.push(link);
      }
    }

    // Masukkan sisa link ke grup terakhir
    if (currentGroup.length > 0) {
      groups.push({
        resolution: currentRes,
        links: currentGroup,
      });
    }

    return {
      sectionTitle: section.resolution,
      groups,
    };
  });
}

// --- FORMAT SINOPSIS ---
const formatSynopsis = (text: string) => {
  if (!text) return "Sinopsis belum tersedia untuk anime ini.";
  return text.split("\n").map((paragraph, index) => {
    if (!paragraph.trim()) return null;
    return (
      <p key={index} className="mb-4 last:mb-0 text-justify">
        {paragraph.trim()}
      </p>
    );
  });
};

// --- GENERATE METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const responseData = await fetchKS<KS_DetailResponse>(
      `anime/kusonime/detail/${slug}`,
    );

    if (responseData.status !== "success" || !responseData.detail) {
      return { title: "Anime Not Found" };
    }

    const anime = responseData.detail;
    const title = `Download ${anime.title} Batch Sub Indo - Mugenime`;
    const description = `Download anime ${anime.title} Batch Subtitle Indonesia resolusi 1080p, 720p, 480p, 360p lengkap dengan link Google Drive, Pixeldrain, dll.`;

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/batch-anime/${slug}`,
      },
      openGraph: {
        title: title,
        description: description,
        images: [anime.poster],
        type: "video.tv_show",
        siteName: "Mugenime",
      },
    };
  } catch (e) {
    console.error(e);
    return { title: "Anime Not Found - Mugenime" };
  }
}

export default async function BatchAnimeDetailPage({
  params,
}: Readonly<Props>) {
  const { slug } = await params;
  let responseData: KS_DetailResponse;

  try {
    responseData = await fetchKS<KS_DetailResponse>(
      `anime/kusonime/detail/${slug}`,
    );
  } catch (error) {
    console.error("Failed to fetch anime detail:", error);
    return notFound();
  }

  if (responseData.status !== "success" || !responseData.detail) {
    return notFound();
  }

  const anime = responseData.detail;
  const isBD = /\bbd\b/i.test(anime.title);

  const parsedDownloadSections = parseDownloadLinks(anime.download_links);
  const genreString = anime.genres
    ? anime.genres.map((g) => g.name).join(", ")
    : "Unknown";

  // Data mapping bookmark
  const animeBookmarkData = {
    title: anime.title,
    slug: slug,
    poster: anime.poster,
    type: anime.info.type,
    rating: anime.info.score,
    studios: anime.info.producers,
    isBatch: true,
  };

  // --- UI COMPONENTS ---
  const PosterBlock = (
    <div className="group relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-muted">
      <Image
        src={anime.poster ?? ""}
        alt={anime.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 800px"
        priority
        unoptimized
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-80" />

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge className="bg-primary/90 text-primary-foreground border-0 px-3 py-1 shadow-lg backdrop-blur-md flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          Batch
        </Badge>
        {isBD && (
          <Badge className="bg-primary/90 text-primary-foreground border-0 px-3 py-1 shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Disc className="w-4 h-4" />
            BD
          </Badge>
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-bold shadow-lg">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span>{anime.info.score || "N/A"}</span>
        </div>
      </div>
    </div>
  );

  const HeaderBlock = (
    <div className="space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left w-full overflow-hidden">
      <Breadcrumb className="text-muted-foreground/80 w-full">
        <BreadcrumbList className="flex flex-nowrap items-center justify-center lg:justify-start whitespace-nowrap overflow-hidden text-ellipsis">
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-3.5 h-3.5" /> Beranda
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0" />
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink asChild>
              <Link
                href="/batch-anime"
                className="hover:text-primary transition-colors"
              >
                Batch
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="shrink-0" />
          <BreadcrumbItem className="truncate min-w-0">
            <BreadcrumbPage className="font-medium text-foreground truncate block">
              {anime.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.15]">
        {anime.title}
      </h1>

      {anime.info.japanese && (
        <p className="text-lg text-muted-foreground font-medium font-serif italic">
          {anime.info.japanese}
        </p>
      )}

      {anime.genres && anime.genres.length > 0 && (
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
          {anime.genres.map((genre) => (
            <Badge
              key={genre.slug}
              variant="secondary"
              className="px-3 py-1 text-sm bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  const SynopsisBlock = (
    <div className="prose dark:prose-invert max-w-none w-full">
      <h3 className="text-xl font-bold text-foreground flex items-center justify-center lg:justify-start gap-2 mb-4">
        <span className="w-1 h-6 bg-primary rounded-full mr-2 hidden lg:block"></span>
        Sinopsis
      </h3>
      <div className="text-muted-foreground leading-relaxed text-base">
        {formatSynopsis(anime.synopsis)}
      </div>
    </div>
  );

  const DownloadBlock = (
    <div id="download-section" className="space-y-6 pt-4 scroll-mt-28">
      <div className="flex items-center justify-center lg:justify-start gap-2 border-b border-border pb-4">
        <span className="w-1 h-6 bg-primary rounded-full mr-2 hidden lg:block"></span>
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          Link Download Batch
        </h3>
      </div>

      {parsedDownloadSections.length > 0 ? (
        <div className="space-y-8">
          {parsedDownloadSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-bold text-lg text-foreground text-center lg:text-left leading-snug">
                {section.sectionTitle}
              </h4>

              <div className="grid gap-3">
                {section.groups.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-secondary/10 hover:bg-secondary/30 border border-border/50 transition-colors"
                  >
                    {/* Badge Resolusi */}
                    <div className="shrink-0 w-full sm:w-28 flex justify-center sm:justify-start">
                      <Badge
                        className={`w-fit sm:w-full justify-center py-1 font-bold text-xs ${
                          group.resolution === "Subtitle"
                            ? "border-secondary/50 text-muted-foreground bg-secondary/50"
                            : "border-primary/20 text-primary bg-primary/10"
                        }`}
                        variant="outline"
                      >
                        {group.resolution}
                      </Badge>
                    </div>

                    {/* Daftar Link Host */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 items-center flex-1">
                      {group.links.map((link, lIdx) => (
                        <Button
                          key={lIdx}
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground dark:hover:border-primary border-border/60 transition-all bg-background/50"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.host}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/30">
          <p className="text-muted-foreground">Link download belum tersedia.</p>
        </div>
      )}
    </div>
  );

  const TagsBlock = (
    <div className="bg-card rounded-xl p-6 border border-border space-y-4 mt-8">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Tags className="w-4 h-4 text-primary shrink-0" />
          Download {anime.title} Batch Sub Indo
        </h2>
        <div className="text-sm text-muted-foreground leading-relaxed text-justify">
          Download anime <b>{anime.title}</b> Batch Subtitle Indonesia
          terlengkap dan terbaru di Mugenime. Kamu bisa mengunduh{" "}
          <b>{anime.title}</b> sub indo dalam format paket dengan kualitas HD
          720p, 1080p, hingga paket hemat 360p dan 480p. Tersedia format MP4 dan
          MKV yang bisa diakses gratis. Jangan lupa cek juga anime dari produser{" "}
          {anime.info.producers} dan genre {genreString} lainnya hanya di sini.
        </div>
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground/80 leading-normal">
          <span className="font-bold text-muted-foreground">Keywords: </span>
          Download {anime.title} Batch, {anime.title} Batch Sub Indo, Download{" "}
          {anime.title} Subtitle Indonesia, {anime.title} 360p 480p 720p 1080p,
          Streaming Anime Sub Indo Gratis.
        </p>
      </div>
    </div>
  );

  const InfoBlock = (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-4 shadow-sm">
      <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
        <Info className="w-4 h-4 text-primary" /> Informasi
      </h3>
      <Separator className="bg-border" />
      <div className="space-y-3 text-sm">
        <InfoRow
          icon={<Tv className="w-4 h-4" />}
          label="Tipe"
          value={anime.info.type}
        />
        <InfoRow
          icon={<Layers className="w-4 h-4" />}
          label="Episode"
          value={anime.info.total_episode}
        />
        <InfoRow
          icon={<Calendar className="w-4 h-4" />}
          label="Status"
          value={anime.info.status}
        />
        <InfoRow
          icon={<Clock className="w-4 h-4" />}
          label="Durasi"
          value={anime.info.duration}
        />
        <InfoRow
          icon={<Film className="w-4 h-4" />}
          label="Produser"
          value={anime.info.producers}
        />
      </div>
    </div>
  );

  const ActionBlock = (
    <div className="space-y-3">
      <Button
        asChild
        size="lg"
        className="w-full cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20 transition-all"
      >
        <a href="#download-section">
          <Download className="w-5 h-5 mr-2" />
          Download Batch
        </a>
      </Button>

      {/* Grid Button Share dan Bookmark */}
      <div className="grid grid-cols-2 gap-3">
        <ShareButton title={anime.title} slug={slug} />
        <BookmarkButton data={animeBookmarkData} />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background pb-20">
      {/* --- HERO BACKGROUND --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-[40vh] md:h-[50vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <Image
            src={anime.poster ?? ""}
            alt="Background"
            fill
            className="object-cover opacity-50 dark:opacity-20 blur-xl scale-110"
            priority
            unoptimized
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background opacity-100" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 pt-[5vh] md:pt-[10vh] relative z-10">
        {/* MOBILE LAYOUT */}
        <div className="flex flex-col gap-8 lg:hidden">
          <div className="max-w-full w-full mx-auto">{PosterBlock}</div>
          {HeaderBlock}
          {InfoBlock}
          {ActionBlock}
          {SynopsisBlock}
          {DownloadBlock}
          {TagsBlock}
          <div className="pt-4">
            <CommentSection />
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid grid-cols-12 gap-10">
          {/* CONTENT AREA (Kiri) */}
          <div className="col-span-8 space-y-10">
            {PosterBlock}
            {HeaderBlock}
            {SynopsisBlock}
            {DownloadBlock}
            {TagsBlock}
            <div className="pt-4">
              <CommentSection />
            </div>
          </div>

          {/* SIDEBAR AREA (Kanan) */}
          <div className="col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
            {InfoBlock}
            {ActionBlock}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT ---
function InfoRow({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value?: string;
}>) {
  if (!value || value === "?") return null;
  return (
    <div className="flex items-start justify-between group py-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className="font-medium text-foreground text-right max-w-[150px] group-hover:text-primary transition-colors line-clamp-2"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
