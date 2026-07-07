import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (!stored) return;
    var parsed = JSON.parse(stored);
    var theme = parsed.state && parsed.state.theme ? parsed.state.theme : "light";
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    var dark = theme === "dark";
    var root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {themeScript}
    </Script>
  );
}
