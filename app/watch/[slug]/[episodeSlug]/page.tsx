import WatchView from "@/components/watchView";
import { fetchAnime } from "@/lib/api";
import { AnimeDetail, EpisodeDetail } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Revalidate every 1 hour
export const revalidate = 3600;

type Props = {
  params: Promise<{ episodeSlug: string, slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episodeSlug } = await params;
  try {
    const data = await fetchAnime<EpisodeDetail>(
      `anime/episode/${episodeSlug}`
    );
    return {
      title: `Nonton ${data.episode} - Mugenime`,
      description: `Streaming ${data.episode} subtitle Indonesia gratis.`,
    };
  } catch {
    return {
      title: "Episode Not Found",
    };
  }
}

export default async function WatchPage({ params }: Props) {
  const { episodeSlug, slug } = await params;

  let episodeData: EpisodeDetail | null = null;
  let animeData: AnimeDetail | null = null;

  try {
    // 1. Fetch Data Episode
    episodeData = await fetchAnime<EpisodeDetail>(
      `anime/episode/${episodeSlug}`
    );

    // Debugging: Cek slug apa yang sebenarnya kita kirim ke API
    // console.log("Raw Slug:", rawSlug);
    // console.log("Clean Slug:", cleanAnimeSlug);

    try {
      animeData = await fetchAnime<AnimeDetail>(
        `anime/anime/${slug}`
      );
    } catch (err) {
      console.warn(
        `[Sidebar Info] Gagal fetch detail anime: ${slug}`,
        err
      );
      // Biarkan animeData null, jangan crash page
    }
  } catch (error) {
    console.error("Error fetching episode data:", error);
    return notFound();
  }

  if (!episodeData) {
    return notFound();
  }

  return (
    <div className="min-h-screen pb-20 pt-8 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <WatchView
          episode={episodeData}
          animeDetail={animeData}
          slug={slug}
          episodeSlug={episodeSlug}
        />
      </div>
    </div>
  );
}
