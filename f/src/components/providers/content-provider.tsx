"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import type { ContentResponse } from "@/lib/api";
import { useCVStore } from "@/stores/cv-store";

interface ContentContextValue {
  content: ContentResponse;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: ContentResponse;
  children: ReactNode;
}) {
  const hydratedKey = useRef<string | null>(null);
  const hydrationKey = content.siteSettings.name;

  useLayoutEffect(() => {
    if (hydratedKey.current === hydrationKey) return;

    useCVStore.getState().hydrateFromServer(content);
    hydratedKey.current = hydrationKey;
  }, [content, hydrationKey]);

  return (
    <ContentContext.Provider value={{ content }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  return useContext(ContentContext);
}
