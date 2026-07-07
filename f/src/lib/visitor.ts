const VISITOR_KEY = "cv-visitor-key";

export function getVisitorKey(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let key = localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, key);
  }

  return key;
}
