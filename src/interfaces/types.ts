export interface RectangleBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface BrickVisualStyle {
  color?: string;
  background?: string;
}

export interface BrickRowConfig {
  style: BrickVisualStyle;
}

export interface SpecialBrickConfig {
  row: number;
  column: number;
  style: BrickVisualStyle;
}

export interface BrickLayoutConfig {
  columns: number;
  rows: BrickRowConfig[];
  width: number;
  height: number;
  horizontalGap: number;
  verticalGap: number;
  topOffset: number;
  specialBricks: SpecialBrickConfig[];
}

export type BrickState = "active" | "destroyed";
export type CollisionAxis = "x" | "y";

export interface BrickCollisionResult {
  hit: boolean;
  bounceAxis: CollisionAxis | null;
  remainingBricks: number;
}

export interface BreakoutPhysicsConfig {
  tickMs: number;
  ballSpeed: number;
  initialLaunchAngleDeg: number;
  maxPaddleBounceAngleDeg: number;
}

export interface BreakoutConfig {
  physics: BreakoutPhysicsConfig;
  bricks: BrickLayoutConfig;
}
