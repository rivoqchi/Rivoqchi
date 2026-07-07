"use client";

import { ErrorPageShell } from "@/components/errors/error-page-shell";
import { fontVariables } from "@/lib/fonts";
import { SERVER_ERROR_PAGE } from "@/lib/error-pages";
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uz" className={fontVariables}>
      <body className="min-h-screen antialiased">
        <ErrorPageShell config={SERVER_ERROR_PAGE} onRetry={reset} />
      </body>
    </html>
  );
}
