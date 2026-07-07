"use client";

import { useEffect, useState } from "react";

export function useDomElement(elementId: string) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const resolve = () => {
      const found = document.getElementById(elementId);
      if (found) {
        setElement(found);
        return true;
      }
      return false;
    };

    if (resolve()) return;

    const observer = new MutationObserver(() => {
      if (resolve()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [elementId]);

  return element;
}
