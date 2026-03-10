import { Brick } from "@entities/bricks/Brick";

import type {
  BrickCollisionResult,
  BrickLayoutConfig,
  BrickVisualStyle,
  CollisionAxis,
  RectangleBounds,
  SpecialBrickConfig,
} from "@interfaces/types";

function specialBrickKey(row: number, column: number): string {
  return `${row}:${column}`;
}

function collisionAxis(ballBounds: RectangleBounds, brickBounds: RectangleBounds): CollisionAxis {
  const overlapLeft = ballBounds.right - brickBounds.left;
  const overlapRight = brickBounds.right - ballBounds.left;
  const overlapTop = ballBounds.bottom - brickBounds.top;
  const overlapBottom = brickBounds.bottom - ballBounds.top;
  const minHorizontalOverlap = Math.min(overlapLeft, overlapRight);
  const minVerticalOverlap = Math.min(overlapTop, overlapBottom);

  return minHorizontalOverlap < minVerticalOverlap ? "x" : "y";
}

export class BrickWall {
  private readonly bricks: Brick[] = [];
  private readonly specialBrickStyles = new Map<string, BrickVisualStyle>();
  private remaining = 0;

  constructor(
    private readonly anchorElement: HTMLDivElement,
    private readonly config: BrickLayoutConfig,
  ) {
    this.specialBrickStyles = this.createSpecialBrickStyleLookup(this.config.specialBricks);
  }

  get remainingBricks(): number {
    return this.remaining;
  }

  mount(gameAreaWidth: number): void {
    this.anchorElement.replaceChildren();
    this.bricks.length = 0;

    const wallWidth = this.config.columns * this.config.width + (this.config.columns - 1) * this.config.horizontalGap;
    const wallStartX = Math.max((gameAreaWidth - wallWidth) / 2, 0);

    for (let rowIndex = 0; rowIndex < this.config.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.config.columns; columnIndex++) {
        const left = wallStartX + columnIndex * (this.config.width + this.config.horizontalGap);
        const top = this.config.topOffset + rowIndex * (this.config.height + this.config.verticalGap);
        const rectangleBounds: RectangleBounds = {
          left,
          right: left + this.config.width,
          top,
          bottom: top + this.config.height,
        };
        const style = this.resolveBrickStyle(rowIndex, columnIndex);
        const brick = Brick.create(
          `brick-r${rowIndex}-c${columnIndex}`,
          rectangleBounds,
          style,
          this.config.width,
          this.config.height,
        );

        brick.mount(this.anchorElement);
        this.bricks.push(brick);
      }
    }

    this.remaining = this.bricks.length;
  }

  processCollision(ballBounds: RectangleBounds): BrickCollisionResult {
    for (const brick of this.bricks) {
      if (!brick.intersects(ballBounds)) {
        continue;
      }

      brick.destroy();
      this.remaining -= 1;

      return {
        hit: true,
        bounceAxis: collisionAxis(ballBounds, brick.bounds),
        remainingBricks: this.remaining,
      };
    }

    return {
      hit: false,
      bounceAxis: null,
      remainingBricks: this.remaining,
    };
  }

  private createSpecialBrickStyleLookup(specialBricks: SpecialBrickConfig[]): Map<string, BrickVisualStyle> {
    const lookup = new Map<string, BrickVisualStyle>();

    for (const specialBrick of specialBricks) {
      lookup.set(specialBrickKey(specialBrick.row, specialBrick.column), specialBrick.style);
    }

    return lookup;
  }

  private resolveBrickStyle(rowIndex: number, columnIndex: number): BrickVisualStyle {
    const rowStyle = this.config.rows[rowIndex].style;
    const specialStyle = this.specialBrickStyles.get(specialBrickKey(rowIndex, columnIndex));

    if (!specialStyle) {
      return rowStyle;
    }

    return {
      ...rowStyle,
      ...specialStyle,
    };
  }
}
