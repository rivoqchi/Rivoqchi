import type { Translation } from "./types";
import { uz } from "./translations/uz";

export const translation = uz;

export function getTranslation(): Translation {
  return translation;
}

export type { Translation };
