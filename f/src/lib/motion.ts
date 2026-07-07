export type RevealDirection = "up" | "down" | "left" | "right";

export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION = 0.75;

export const MOTION_VIEWPORT = {
  once: true,
  margin: "-80px",
  amount: 0.15,
} as const;

export const STAGGER_DELAY = 0.12;

export const DIRECTION_OFFSET: Record<
  RevealDirection,
  { x: number; y: number }
> = {
  up: { x: 0, y: 56 },
  down: { x: 0, y: -56 },
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
};

export const ALTERNATE_DIRECTIONS: RevealDirection[] = [
  "left",
  "right",
  "up",
  "down",
];

export function getAlternateDirection(index: number): RevealDirection {
  return ALTERNATE_DIRECTIONS[index % ALTERNATE_DIRECTIONS.length];
}
