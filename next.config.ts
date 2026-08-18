import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["sv1.imgkc1.my.id", "be.komikcast.cc"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otakudesu.best",
      },
      {
        protocol: "https",
        hostname: "otakudesu.blog",
      },
      {
        protocol: "https",
        hostname: "otakudesu.cloud",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kusonime.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sv1.imgkc1.my.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "be.komikcast.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wzytosfptgmdhyygsrzh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cvr.voratoon.id",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
