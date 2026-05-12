import { fetchKomik } from "@/lib/api";
import { KomikDetailResponse, KomikDetail, KomikItem } from "@/lib/komikTypes";
import KomikCard from "@/components/komikCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Star,
  MonitorPlay,
  Info,
  Calendar,
  Users,
  Tags,
  Home,
  MapPin,
  Flame,
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
import CommentSection from "@/components/commentSection";
import ShareButton from "@/components/shareButton";
import BookmarkButton from "@/components/bookmarkButton";
import { getFormatWithFlag } from "@/lib/utils";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

// Type guard
function isKomikDetail(data: unknown): data is KomikDetail {
  if (typeof data !== "object" || data === null) return false;
  const d = data as KomikDetail;
  return typeof d.title === "string" && Array.isArray(d.readChapter);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetchKomik<KomikDetailResponse>(`komik/${slug}`);
    const komik = response?.data;

    if (!komik || !isKomikDetail(komik)) return { title: "Komik Not Found" };

    const title = `Baca ${komik.title} Bahasa Indonesia - Mugenime`;
    const description = `Baca komik ${komik.title} (${komik.nativeTitle}) chapter terbaru terjemahan Bahasa Indonesia gratis di Mugenime.`;

    return {
      title: title,
      description: description,
      alternates: {
        canonical: `/komik/${slug}`,
      },
      openGraph: {
        title: title,
        description: description,
        images: [komik.cover],
        type: "book",
        siteName: "Mugenime",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [komik.cover],
      },
    };
  } catch (e) {
    console.error(e);
    return { title: "Komik Not Found - Mugenime" };
  }
}

export default async function KomikDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  let responseData: KomikDetailResponse | null = null;

  try {
    responseData = await fetchKomik<KomikDetailResponse>(`komik/${slug}`);
  } catch (error) {
    console.error("Failed to fetch komik detail:", error);
    return notFound();
  }

  const komik = responseData?.data;

  if (!komik || !isKomikDetail(komik)) {
    return notFound();
  }

  const chapterLists = komik.readChapter || [];
  // Assuming chapters are sorted descending (newest first).
  // The oldest/first chapter would be at the end of the array.
  const firstChapter = chapterLists.length > 0 ? chapterLists.at(-1) : null;
  const genres = komik.genres || [];

  const genreString = genres.map((g) => g.data.name).join(", ");

  // Mocking data structure for BookmarkButton consistency
  const bookmarkData = {
    title: komik.title,
    slug: slug,
    poster: komik.cover ?? "",
    category: "komik" as const,
    rating: komik.rating,
    author: komik.author,
    format: komik.format,
    genres: genreString,
  };

  // Map the 'recommended' data to match 'KomikItem' interface so we can reuse KomikCard
  const recommendedMapped: KomikItem[] = (komik.recommended || []).map((r) => ({
    title: r.title,
    slug: r.slug,
    cover: r.cover,
    backgroundImage: r.cover,
    rating: r.rating,
    type: r.type,
    isHot: r.isHot,
    isRecommended: true,
    chapters: [
      {
        chapterIndex: Number.parseInt(r.totalChapters) || 0,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "",
    updatedAt: "",
    author: r.author,
    format: r.format,
    nativeTitle: r.nativeTitle,
    releaseDate: "",
    genres: [],
  }));

  const isValidBg = komik.backgroundImage?.startsWith("http");

  const PosterBlock = (
    <div className="group relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-muted">
      <Image
        src={komik.cover ?? ""}
        alt={komik.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 60vw, 300px"
        priority
        unoptimized
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-bold shadow-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>{komik.rating || "N/A"}</span>
        </div>
      </div>
    </div>
  );

  const ButtonsBlock = (
    <div className="space-y-3">
      {firstChapter ? (
        <Button
          asChild
          size="lg"
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 transition-all"
        >
          <Link href={`/komik/${slug}/chapter-${firstChapter.chapterIndex}`}>
            <BookOpen fill="white" className="w-5 h-5 mr-2" />
            Mulai Baca (Ch. {firstChapter.chapterIndex})
          </Link>
        </Button>
      ) : (
        <Button
          disabled
          size="lg"
          className="w-full rounded-xl"
          variant="secondary"
        >
          Belum Ada Chapter
        </Button>
      )}
      <div className="grid grid-cols-2 gap-3">
        <ShareButton title={komik.title} slug={`komik/${slug}`} />
        <BookmarkButton data={bookmarkData} />
      </div>
    </div>
  );

  const InfoBlock = (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-4 shadow-sm">
      <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
        <Info className="w-4 h-4" /> Informasi
      </h3>
      <Separator className="bg-border" />
      <div className="space-y-3 text-sm">
        <InfoRow
          icon={<MapPin className="w-4 h-4" />}
          label="Format"
          value={komik.format}
        />
        <InfoRow
          icon={<BookOpen className="w-4 h-4" />}
          label="Total Chapter"
          value={komik.totalChapters}
        />
        <InfoRow
          icon={<Calendar className="w-4 h-4" />}
          label="Status"
          value={komik.status}
        />
        <InfoRow
          icon={<Users className="w-4 h-4" />}
          label="Author"
          value={komik.author}
        />
        <InfoRow
          icon={<Calendar className="w-4 h-4" />}
          label="Released"
          value={komik.releaseDate}
        />
        <InfoRow
          icon={<Flame className="w-4 h-4" />}
          label="Adaptasi Anime"
          value={komik.isAnimeAdapted ? "Ya" : "Tidak"}
        />
      </div>
    </div>
  );

  const HeaderBlock = (
    <div className="space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
      <Breadcrumb className="text-muted-foreground/80 w-full flex justify-center lg:justify-start">
        <BreadcrumbList className="justify-center lg:justify-start">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-3.5 h-3.5" /> Beranda
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/komik"
                className="hover:text-primary transition-colors"
              >
                Komik
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground line-clamp-1 max-w-[200px] sm:max-w-none">
              {komik.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl md:text-5xl font-black text-foreground leading-[1.15]">
        {komik.title}
      </h1>

      {komik.nativeTitle && (
        <p className="text-lg text-muted-foreground font-medium font-serif italic">
          {komik.nativeTitle}
        </p>
      )}

      <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre-komik/${genre.data.name.toLowerCase()}`}
          >
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20"
            >
              {genre.data.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );

  const SynopsisBlock = (
    <div className="prose dark:prose-invert max-w-none w-full">
      <h3 className="text-xl font-bold text-foreground flex items-center justify-center lg:justify-start gap-2 mb-4">
        <span className="w-1 h-6 bg-primary rounded-full mr-2 hidden lg:block"></span>
        Sinopsis
      </h3>
      <div className="text-muted-foreground leading-relaxed text-base text-justify ">
        {komik.synopsis || "Sinopsis belum tersedia untuk komik ini."}
      </div>
    </div>
  );

  const EpisodesBlock = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center">
          <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
          Daftar Chapter
        </h3>
        <Badge
          variant="outline"
          className="h-7 border-border text-muted-foreground"
        >
          Total: {chapterLists.length}
        </Badge>
      </div>

      {chapterLists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {/* Mapping original reversed (assuming API returns newest first) */}
          {chapterLists.map((ep) => (
            <Link
              key={ep.id}
              href={`/komik/${slug}/chapter-${ep.chapterIndex}`}
              className="group relative flex items-center justify-center p-3 h-16 bg-card border border-border hover:border-primary/50 rounded-lg transition-all hover:shadow-md hover:shadow-primary/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Chapter
                </span>
                <span className="text-lg font-bold text-foreground group-hover:text-primary">
                  {ep.chapterIndex}
                </span>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
                <BookOpen className="w-3 h-3 text-primary" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/30">
          <MonitorPlay className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Belum ada chapter yang tersedia.
          </p>
        </div>
      )}
    </div>
  );

  const ExtrasBlock = (
    <div className="space-y-8">
      {recommendedMapped && recommendedMapped.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
            Rekomendasi Serupa
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
            {recommendedMapped.map((rec) => (
              <KomikCard key={rec.slug} comic={rec} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Tags className="w-4 h-4 text-primary shrink-0" />
            Baca {komik.title} Bahasa Indonesia
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed text-justify">
            Baca komik <b>{komik.title}</b> terjemahan Bahasa Indonesia
            terlengkap dan terbaru di Mugenime. Kamu bisa membaca chapter
            terbaru dari <b>{komik.title}</b> secara gratis dengan kualitas
            gambar yang tajam. Jangan lupa untuk menjelajahi karya{" "}
            {komik.format} dari {komik.author}
            lainnya hanya disini.
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground/80 leading-normal">
            <span className="font-bold text-muted-foreground">Keywords: </span>
            Baca {komik.title}, {komik.title} Bahasa Indonesia, Download{" "}
            {komik.title} PDF, {komik.title} Chapter Terbaru,{" "}
            {getFormatWithFlag(komik.format)} Bahasa Indo.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <CommentSection
          identifier={`komik-${slug}`}
          page_url={`/komik/${slug}`}
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background pb-20">
      {/* --- HERO BACKGROUND --- */}
      <div className="absolute top-0 left-0 z-0 w-full h-[50vh] md:h-[60vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <Image
            src={isValidBg ? komik.backgroundImage : (komik.cover ?? "")}
            alt="Background"
            fill
            className="object-cover opacity-50 dark:opacity-20 blur scale-110"
            priority
            unoptimized
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background opacity-100" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 pt-[5vh] md:pt-[15vh] relative z-10">
        {/* MOBILE LAYOUT */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="max-w-[200px] w-full mx-auto">{PosterBlock}</div>
          {HeaderBlock}
          {SynopsisBlock}
          {ButtonsBlock}
          {InfoBlock}
          {EpisodesBlock}
          {ExtrasBlock}
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid grid-cols-12 gap-10">
          {/* SIDEBAR (Kiri) */}
          <div className="col-span-3 space-y-6">
            {PosterBlock}
            {ButtonsBlock}
            {InfoBlock}
          </div>

          {/* CONTENT AREA (Kanan) */}
          <div className="col-span-9 space-y-8">
            {HeaderBlock}
            {SynopsisBlock}
            {EpisodesBlock}
            {ExtrasBlock}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value?: string;
}>) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className="font-medium text-foreground text-right capitalize max-w-[150px] group-hover:text-primary transition-colors"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
