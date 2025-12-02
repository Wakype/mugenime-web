/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchAnime } from "@/lib/api"; // Menggunakan fetcher yang sudah kita buat

export async function GET(request: NextRequest) {
  // 1. Ambil 'id' server dari parameter URL (misal: ?id=187226-0-720p)
  const searchParams = request.nextUrl.searchParams;
  const serverId = searchParams.get("id");

  if (!serverId) {
    return NextResponse.json({ error: "Server ID wajib ada" }, { status: 400 });
  }

  try {
    // 2. Panggil API Sanka Vollerei lewat Server Next.js
    // Endpoint: /anime/server/:serverId
    // Kita definisikan tipe return-nya agar TypeScript senang
    const response = await fetchAnime<{ url: string }>(
      `/anime/server/${serverId}`
    );

    // 3. Kembalikan URL embed ke frontend
    return NextResponse.json({ url: response.url });
  } catch (error: any) {
    console.error("[API Server Proxy Error]", error);
    return NextResponse.json(
      { error: "Gagal mengambil URL video" },
      { status: error.status || 500 }
    );
  }
}
