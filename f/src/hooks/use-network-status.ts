"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiBaseUrl } from "@/lib/api-config";

const CHECK_INTERVAL_MS = 10_000;
const PING_TIMEOUT_MS = 4_000;

async function pingBackend(): Promise<boolean> {
  if (typeof window === "undefined") return true;
  if (!navigator.onLine) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), PING_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const mountedRef = useRef(true);

  const verify = useCallback(async () => {
    if (!mountedRef.current) return;

    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    setIsChecking(true);
    const ok = await pingBackend();

    if (mountedRef.current) {
      setIsOnline(ok);
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setIsOnline(navigator.onLine);

    if (navigator.onLine) {
      void verify();
    }

    const handleOnline = () => {
      void verify();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsChecking(false);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void verify();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = window.setInterval(() => {
      void verify();
    }, CHECK_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(interval);
    };
  }, [verify]);

  return { isOnline, isChecking };
}
