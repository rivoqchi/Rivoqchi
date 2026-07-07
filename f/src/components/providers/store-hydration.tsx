"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";

export function StoreHydration() {
  useEffect(() => {
    void useProjectStore.persist.rehydrate();
  }, []);

  return null;
}
