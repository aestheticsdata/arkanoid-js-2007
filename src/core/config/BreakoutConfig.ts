import type { BreakoutConfig } from "@interfaces/types";

export const breakoutConfig: BreakoutConfig = {
  physics: {
    tickMs: 10,
    ballSpeed: 4.2,
    initialLaunchAngleDeg: 22,
    maxPaddleBounceAngleDeg: 68,
  },
  bricks: {
    columns: 17,
    rows: [
      { style: { color: "var(--color-brick-row-1)" } },
      { style: { color: "var(--color-brick-row-2)" } },
      { style: { color: "var(--color-brick-row-3)" } },
    ],
    width: 50,
    height: 15,
    horizontalGap: 2,
    verticalGap: 8,
    topOffset: 45,
    specialBricks: [
      { row: 0, column: 4, style: { background: "var(--gradient-brick-special)" } },
      { row: 1, column: 12, style: { background: "var(--gradient-brick-special-alt)" } },
    ],
  },
};
