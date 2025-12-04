import { fetchAnime } from "@/lib/api";
import { BatchResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    // Memanggil fungsi fetchAnime yang ada di lib/api.ts
    // Endpoint: /anime/batch/:slug
    const data = await fetchAnime<BatchResponse>(`anime/batch/${slug}`);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[API Batch Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 }
    );
  }
}
