const VIEWED_KEY = "cv-viewed-project-ids";

export function getViewedProjectIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function markProjectViewedInSession(projectId: string): string[] {
  const ids = getViewedProjectIds();
  if (!ids.includes(projectId)) {
    ids.push(projectId);
    sessionStorage.setItem(VIEWED_KEY, JSON.stringify(ids));
  }
  return ids;
}

export function openProjectById(projectId: string) {
  window.dispatchEvent(
    new CustomEvent("cv-open-project", { detail: { projectId } }),
  );
}
