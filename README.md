<div align="center">
  <!-- Ganti link gambar di bawah dengan logo proyek Anda jika ada -->
  <a href="https://mugenime.my.id"><img src="https://i.ibb.co.com/7JcFYF2Q/Mugenime-Logo-stroke.png" alt="Mugenime Logo" width="500"></a>
 
  
  <p>
    <strong>Modern Anime Streaming Platform</strong>
  </p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind v4"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
  </p>
</div>

<br />

## 📖 Deskripsi

Download dan streaming anime subtitle Indonesia lengkap dalam format Mp4 dan MKV dengan berbagai resolusi (360p, 480p, 720p, dan 1080p) di platform gratis, tanpa iklan yang mengganggu, dan hemat kuota.

## 📸 Preview

<a href="https://mugenime.my.id">
  <img width="3057" height="1912" alt="preview" src="https://github.com/user-attachments/assets/cb922dad-29cb-4d04-865c-d61dc060fbf4" />
</a>

## 🚀 Fitur Utama

- **📚 Katalog Lengkap**: Akses ribuan anime, baik yang sedang tayang (_Ongoing_) maupun yang sudah tamat (_Completed_).
- **📥 Download Center**: Unduh anime per episode atau langsung satu paket (_Batch_) dengan berbagai pilihan resolusi.
- **📅 Jadwal Rilis**: Pantau anime favorit yang rilis setiap hari secara _real-time_.
- **🔍 Pencarian Cepat**: Fitur pencarian instan dengan _live suggestion_.
- **🔖 Riwayat & Bookmark**: Simpan progres tontonan dan anime favorit di perangkat lokal (**Local Storage**) tanpa perlu login.
- **🌗 Dark Mode**: Tampilan yang nyaman di mata dengan opsi tema gelap/terang.
- **📱 Responsive Design**: Tampilan optimal di Desktop, Tablet, dan Mobile.

## 🛠 Tech Stack

Project ini dibangun menggunakan ekosistem Next.js dan library modern untuk performa maksimal:

### Core

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: React 19

### Styling & UI

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### State Management

- **Local State**: [Zustand](https://github.com/pmndrs/zustand) (History/Bookmark)

## 📂 Struktur Halaman (Sitemap)

Aplikasi ini memiliki struktur routing yang rapi menggunakan Next.js App Router:

```text
/                                   (Home Page)
├── /about                          (Tentang Kami)
├── /anime
│   └── /[slug]                     (Detail Anime)
├── /batch-anime                    (Daftar Batch Anime)
│   └── /[slug]                     (Detail Batch Anime)
├── /bookmark                       (Daftar Bookmark)
├── /completed-anime                (List Completed)
├── /dmca                           (Legal & DMCA)
├── /genre-anime                    (Daftar Semua Genre)
│   └── /[genre]                    (Detail Genre)
├── /guide
│   ├── /download                   (Panduan Download)
│   └── /streaming                  (Panduan Streaming)
├── /history                        (Riwayat Tontonan)
├── /jadwal-anime                   (Jadwal Rilis Harian)
├── /list-anime                     (A-Z Directory)
├── /ongoing-anime                  (List Ongoing)
├── /privacy                        (Kebijakan Privasi)
├── /profile                        (Profil Pengguna)
├── /report                         (Lapor Masalah/Link Rusak)
├── /search                         (Pencarian Anime)
├── /terms                          (Syarat & Ketentuan)
└── /watch
    └── /[slug]
        └── /[episodeSlug]          (Streaming Room)
```

## 🤝 Credit

- **Data Anime**: Diambil dari API publik **Sanka Vollerei**.

## 📄 Disclaimer

Project ini dibuat untuk tujuan pembelajaran dan edukasi. Hak cipta konten anime (gambar, video, sinopsis) sepenuhnya milik pemegang hak cipta asli dan produsen anime terkait.

<br />

<div align="center">
  Made with ❤️ and 🧅
</div>
