"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ApiStatusUpdater({
  isDown,
}: Readonly<{ isDown: boolean }>) {
  const { setApiDown } = useStore();

  useEffect(() => {
    useStore.persist.rehydrate();
    setApiDown(isDown);
  }, [isDown, setApiDown]);

  return null;
}
