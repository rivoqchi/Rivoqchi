let activeBanner: string | null = null;

export function tryActivateBanner(id: string): boolean {
  if (activeBanner !== null && activeBanner !== id) return false;
  activeBanner = id;
  return true;
}

export function deactivateBanner(id: string) {
  if (activeBanner === id) activeBanner = null;
}

export function isAnotherBannerActive(id: string): boolean {
  return activeBanner !== null && activeBanner !== id;
}

export function releaseBannerSlot(id: string) {
  deactivateBanner(id);
}

/** Boshqa banner slot band — qisqa kutib qayta urinish */
export function waitForBannerSlot(
  id: string,
  onReady: () => void,
  intervalMs = 350,
): () => void {
  let timer: number | undefined;

  const attempt = () => {
    if (tryActivateBanner(id)) {
      onReady();
      return;
    }
    timer = window.setTimeout(attempt, intervalMs);
  };

  attempt();

  return () => {
    if (timer !== undefined) window.clearTimeout(timer);
  };
}
