"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ScrollToDownloadButton() {
  const handleScroll = () => {
    const element = document.getElementById("download-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      onClick={handleScroll}
      size="lg"
      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Batch
    </Button>
  );
}