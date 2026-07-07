"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deactivateBanner,
  waitForBannerSlot,
} from "@/components/layout/banner-coordinator";

export function useBannerVisibility(bannerId: string) {
  const [visible, setVisible] = useState(false);
  const cancelWaitRef = useRef<(() => void) | null>(null);

  const show = useCallback(() => {
    cancelWaitRef.current?.();
    cancelWaitRef.current = waitForBannerSlot(bannerId, () => {
      setVisible(true);
    });
  }, [bannerId]);

  const hide = useCallback(() => {
    cancelWaitRef.current?.();
    cancelWaitRef.current = null;
    setVisible(false);
    deactivateBanner(bannerId);
  }, [bannerId]);

  useEffect(
    () => () => {
      cancelWaitRef.current?.();
      deactivateBanner(bannerId);
    },
    [bannerId],
  );

  return { visible, show, hide };
}
