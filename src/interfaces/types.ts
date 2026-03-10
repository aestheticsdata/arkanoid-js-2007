export type BrickState = "blue" | "hidden";
export type HorizontalDirection = 0 | 1;
export type VerticalDirection = 0 | 1;

export interface BrickCollisionResult {
  hit: boolean;
  shouldBounce: boolean;
  remainingBricks: number;
}
