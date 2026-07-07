"use client";

import { useEffect } from "react";
import { ErrorPageShell } from "@/components/errors/error-page-shell";
import { SERVER_ERROR_PAGE } from "@/lib/error-pages";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPageShell config={SERVER_ERROR_PAGE} onRetry={reset} />;
}
