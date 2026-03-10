import type { RectangleBounds, Vector2D } from "@interfaces/types";

const DEG_TO_RAD = Math.PI / 180;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computePaddleBounceVelocity(
  ballCenterX: number,
  paddleBounds: RectangleBounds,
  speed: number,
  maxBounceAngleDeg: number,
): Vector2D {
  const paddleCenterX = (paddleBounds.left + paddleBounds.right) / 2;
  const paddleHalfWidth = (paddleBounds.right - paddleBounds.left) / 2;
  const relativeHit = clamp((ballCenterX - paddleCenterX) / paddleHalfWidth, -1, 1);
  const bounceAngleRad = relativeHit * maxBounceAngleDeg * DEG_TO_RAD;

  return {
    x: speed * Math.sin(bounceAngleRad),
    y: -Math.abs(speed * Math.cos(bounceAngleRad)),
  };
}
