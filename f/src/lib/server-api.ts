import { getApiBaseUrl } from "@/lib/api-config";
import type { ContentResponse } from "@/lib/api";
import { CONTENT_LOCALE } from "@/types/locale";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getServerContent(): Promise<ContentResponse> {
  const res = await fetch(`${getApiBaseUrl()}/content/${CONTENT_LOCALE}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Content fetch failed (${res.status})`);
  }

  const body = (await res.json()) as ApiResponse<ContentResponse>;
  return body.data;
}
