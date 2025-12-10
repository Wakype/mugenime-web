/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchAnime } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serverId = searchParams.get("id");

  if (!serverId) {
    return NextResponse.json({ error: "Server ID wajib ada" }, { status: 400 });
  }

  try {
    const endpoint = `anime/server/${serverId}`;
    const response = await fetchAnime<{ url: string }>(endpoint);

    return NextResponse.json({ url: response.url });
  } catch (error: any) {
    console.error("[API Server Proxy Error]", error);
    return NextResponse.json(
      { error: "Gagal mengambil URL video" },
      { status: error.status || 500 }
    );
  }
}
