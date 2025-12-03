import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");

  // 1. Validasi URL yang lebih ketat
  if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
    return NextResponse.json(
      { error: "URL gambar tidak valid" },
      { status: 400 }
    );
  }

  try {
    // Coba validasi bentuk URL
    new URL(imageUrl); 
  } catch {
    return NextResponse.json(
      { error: "Format URL salah" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // Hati-hati: new URL(imageUrl) bisa error jika URL relatif, tapi kita sudah try-catch di atas
        Referer: new URL(imageUrl).origin, 
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil gambar: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Image Proxy Error]", error); // Tetap log server error untuk debugging
    // Kembalikan gambar transparan 1x1 pixel base64 agar UI tidak broken (Optional)
    // Atau return JSON error
    return NextResponse.json(
      { error: "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}