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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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
  private readonly brickGrid: Array<Array<Brick | null>> = [];
  private readonly specialBrickStyles = new Map<string, BrickVisualStyle>();
  private remaining = 0;
  private wallBounds: RectangleBounds = { left: 0, right: 0, top: 0, bottom: 0 };
  private wallStartX = 0;

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
    this.brickGrid.length = 0;

    const wallWidth = this.config.columns * this.config.width + (this.config.columns - 1) * this.config.horizontalGap;
    const wallHeight =
      this.config.rows.length * this.config.height + (this.config.rows.length - 1) * this.config.verticalGap;
    this.wallStartX = Math.max((gameAreaWidth - wallWidth) / 2, 0);
    this.wallBounds = {
      left: this.wallStartX,
      right: this.wallStartX + wallWidth,
      top: this.config.topOffset,
      bottom: this.config.topOffset + wallHeight,
    };

    for (let rowIndex = 0; rowIndex < this.config.rows.length; rowIndex++) {
      this.brickGrid[rowIndex] = [];

      for (let columnIndex = 0; columnIndex < this.config.columns; columnIndex++) {
        const left = this.wallStartX + columnIndex * (this.config.width + this.config.horizontalGap);
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
        this.brickGrid[rowIndex][columnIndex] = brick;
      }
    }

    this.remaining = this.config.rows.length * this.config.columns;
  }

  processCollision(ballBounds: RectangleBounds): BrickCollisionResult {
    if (!this.intersectsWall(ballBounds)) {
      return {
        hit: false,
        bounceAxis: null,
        remainingBricks: this.remaining,
      };
    }

    const candidateRange = this.computeCandidateRange(ballBounds);
    for (let rowIndex = candidateRange.rowStart; rowIndex <= candidateRange.rowEnd; rowIndex++) {
      for (let columnIndex = candidateRange.columnStart; columnIndex <= candidateRange.columnEnd; columnIndex++) {
        const brick = this.brickGrid[rowIndex]?.[columnIndex];
        if (!brick || !brick.intersects(ballBounds)) {
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

  private intersectsWall(bounds: RectangleBounds): boolean {
    return !(
      bounds.right < this.wallBounds.left ||
      bounds.left > this.wallBounds.right ||
      bounds.bottom < this.wallBounds.top ||
      bounds.top > this.wallBounds.bottom
    );
  }

  private computeCandidateRange(ballBounds: RectangleBounds): {
    rowStart: number;
    rowEnd: number;
    columnStart: number;
    columnEnd: number;
  } {
    const horizontalSpan = this.config.width + this.config.horizontalGap;
    const verticalSpan = this.config.height + this.config.verticalGap;
    const maxColumnIndex = this.config.columns - 1;
    const maxRowIndex = this.config.rows.length - 1;
    const relativeLeft = ballBounds.left - this.wallStartX;
    const relativeRight = ballBounds.right - this.wallStartX;
    const relativeTop = ballBounds.top - this.config.topOffset;
    const relativeBottom = ballBounds.bottom - this.config.topOffset;

    const looseColumnStart = Math.floor(relativeLeft / horizontalSpan) - 1;
    const looseColumnEnd = Math.floor(relativeRight / horizontalSpan) + 1;
    const looseRowStart = Math.floor(relativeTop / verticalSpan) - 1;
    const looseRowEnd = Math.floor(relativeBottom / verticalSpan) + 1;

    return {
      rowStart: clamp(looseRowStart, 0, maxRowIndex),
      rowEnd: clamp(looseRowEnd, 0, maxRowIndex),
      columnStart: clamp(looseColumnStart, 0, maxColumnIndex),
      columnEnd: clamp(looseColumnEnd, 0, maxColumnIndex),
    };
  }
}
