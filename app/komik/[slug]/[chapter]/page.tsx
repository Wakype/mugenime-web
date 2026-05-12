import { fetchKomik } from "@/lib/api";
import { ReadKomikChapterResponse } from "@/lib/komikTypes";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CommentSection from "@/components/commentSection";
import ComicReader from "@/components/comicReader";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string; chapter: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapter } = await params;
  const chapterNumber = chapter.replace("chapter-", "");

  try {
    const response = await fetchKomik<ReadKomikChapterResponse>(
      `komik/${slug}/${chapterNumber}`,
    );
    const data = response?.data;

    if (!data) return { title: "Chapter Not Found" };

    const title = `Baca ${data.komikTitle} Chapter ${data.chapterIndex} - Mugenime`;
    const description = `Baca komik ${data.komikTitle} Chapter ${data.chapterIndex} Bahasa Indonesia gratis.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/komik/${slug}/chapter-${data.chapterIndex}`,
      },
    };
  } catch {
    return { title: "Chapter Not Found - Mugenime" };
  }
}

export default async function ReadKomikPage({ params }: Readonly<Props>) {
  const { slug, chapter } = await params;
  const chapterNumber = chapter.replace("chapter-", "");

  let responseData: ReadKomikChapterResponse | null = null;

  try {
    responseData = await fetchKomik<ReadKomikChapterResponse>(
      `komik/${slug}/${chapterNumber}`,
    );
  } catch (error) {
    console.error("Failed to fetch read chapter:", error);
    return notFound();
  }

  const data = responseData?.data;

  if (!data) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Interactive Reader Component */}
      <ComicReader data={data} slug={slug} />

      {/* Comment Section at the bottom */}
      <div className="pt-10 container mx-auto px-4 relative z-10">
        <CommentSection
          identifier={`komik-${slug}-ch-${data.chapterIndex}`}
          page_url={`/komik/${slug}/chapter-${data.chapterIndex}`}
        />
      </div>
    </div>
  );
}
