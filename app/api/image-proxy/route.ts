import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Ambil URL gambar asli dari parameter (misal: ?url=https://otakudesu...)
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "URL gambar wajib ada" },
      { status: 400 }
    );
  }

  try {
    // 2. Fetch gambar dari sumber aslinya
    const response = await fetch(imageUrl, {
      headers: {
        // PENTING: Kita "menyamar" sebagai browser agar tidak diblokir
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // Beberapa situs mewajibkan referer dari domain mereka sendiri
        Referer: new URL(imageUrl).origin,
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil gambar: ${response.statusText}`);
    }

    // 3. Ambil data binary gambar
    const imageBuffer = await response.arrayBuffer();

    // 4. Deteksi tipe konten (jpg/png)
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // 5. Kembalikan sebagai file gambar, bukan JSON
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        "Content-Type": contentType,
        // Cache gambar di browser user selama 1 tahun agar hemat bandwidth
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Image Proxy Error]", error);
    // Jika gagal, kirim placeholder transparan atau error
    return NextResponse.json(
      { error: "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}
