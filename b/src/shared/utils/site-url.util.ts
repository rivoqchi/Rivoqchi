const LOCAL_HOST_PATTERN =
  /^(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;

export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (
      LOCAL_HOST_PATTERN.test(parsed.hostname) &&
      parsed.protocol === 'https:'
    ) {
      parsed.protocol = 'http:';
      return parsed.toString().replace(/\/$/, '');
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return trimmed;
  }
}
