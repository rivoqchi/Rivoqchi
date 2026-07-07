import type { Metadata } from "next";
import { ErrorPageShell } from "@/components/errors/error-page-shell";
import { NOT_FOUND_PAGE } from "@/lib/error-pages";

export const metadata: Metadata = {
  title: "Sahifa topilmadi",
  description: NOT_FOUND_PAGE.description,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <ErrorPageShell config={NOT_FOUND_PAGE} />;
}
