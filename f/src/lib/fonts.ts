import { Cormorant_Garamond, JetBrains_Mono, Onest } from "next/font/google";

export const fontSans = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const fontHeading = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = [
  fontSans.variable,
  fontHeading.variable,
  fontMono.variable,
].join(" ");
