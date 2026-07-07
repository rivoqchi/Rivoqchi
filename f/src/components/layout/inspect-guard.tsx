"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function shouldBlockShortcut(event: KeyboardEvent): boolean {
  const { key, ctrlKey, shiftKey, metaKey, altKey } = event;

  if (key === "F12") return true;

  const mod = ctrlKey || metaKey;

  if (mod && shiftKey && /^[ijc]$/i.test(key)) return true;
  if (mod && altKey && /^[ijc]$/i.test(key)) return true;
  if (mod && /^[us]$/i.test(key)) return true;

  return false;
}

export function InspectGuard() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BLOCK_INSPECT === "false") return;

    const onContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (!shouldBlockShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
