const LOCAL_HOST_PATTERN =
  /^(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;

export function isLocalDevHost(hostname: string): boolean {
  return LOCAL_HOST_PATTERN.test(hostname);
}

/** localhost/127.0.0.1 uchun https → http (SSL xatosiz dev) */
export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (isLocalDevHost(parsed.hostname) && parsed.protocol === "https:") {
      parsed.protocol = "http:";
      return parsed.toString().replace(/\/$/, "");
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return trimmed;
  }
}

export function toSameOriginMediaPath(url?: string): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (trimmed.startsWith("/uploads/")) return trimmed;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (
        isLocalDevHost(parsed.hostname) &&
        parsed.pathname.startsWith("/uploads/")
      ) {
        return parsed.pathname;
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
