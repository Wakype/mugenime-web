/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchAnime } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // id yang diterima: "/anime/server/187226-0-360p"
  const serverId = searchParams.get("id");

  if (!serverId) {
    return NextResponse.json({ error: "Server ID wajib ada" }, { status: 400 });
  }

  try {
    // KOREKSI DISINI:
    // Jangan tambahkan prefix "/anime/server/" lagi karena serverId sudah berisi path lengkap.
    // Langsung gunakan serverId sebagai endpoint.
    const response = await fetchAnime<{ url: string }>(serverId);

    return NextResponse.json({ url: response.url });
  } catch (error: any) {
    console.error("[API Server Proxy Error]", error);
    return NextResponse.json(
      { error: "Gagal mengambil URL video" },
      { status: error.status || 500 }
    );
  }
}
