import type { BrickCollisionResult, BrickState } from "@interfaces/types";

interface BrickWallConfig {
  count: number;
  width: number;
  height: number;
  spacing: number;
  topY: number;
}

export class BrickWall {
  private readonly bricks: HTMLSpanElement[] = [];
  private readonly brickPositionLookup: number[] = [];
  private readonly brickStateLookup: BrickState[] = [];
  private remaining = 0;
  private anchorLeftMargin = 0;

  constructor(
    private readonly anchorElement: HTMLDivElement,
    private readonly config: BrickWallConfig,
  ) {}

  get remainingBricks(): number {
    return this.remaining;
  }

  mount(anchorViewportLeft: number, anchorViewportTop: number, anchorLeftMargin: number): void {
    this.anchorElement.replaceChildren();
    this.bricks.length = 0;
    this.brickPositionLookup.length = 0;
    this.brickStateLookup.length = 0;
    this.remaining = this.config.count;
    this.anchorLeftMargin = anchorLeftMargin;

    this.anchorElement.style.left = `${anchorViewportLeft}px`;
    this.anchorElement.style.top = `${anchorViewportTop}px`;

    for (let i = 0; i < this.config.count; i++) {
      const brick = document.createElement("span");
      brick.id = `brick_id${i}`;
      brick.className = "brick";

      this.brickStateLookup[i] = "blue";
      this.brickPositionLookup[i] = i * (this.config.width + this.config.spacing) + this.anchorLeftMargin;
      this.bricks[i] = brick;
    }

    this.bricks.forEach((brick) => this.anchorElement.appendChild(brick));
  }

  processCollision(ballX: number, ballY: number, ballSize: number, gameAreaLeftBorder: number): BrickCollisionResult {
    if (!(ballY + ballSize >= this.config.topY && ballY <= this.config.topY + this.config.height)) {
      return { hit: false, shouldBounce: false, remainingBricks: this.remaining };
    }

    const relX = ballX - gameAreaLeftBorder;
    for (let i = 0; i < this.bricks.length; i++) {
      if (this.brickPositionLookup[i] <= relX && relX <= this.brickPositionLookup[i] + this.config.width) {
        if (this.brickStateLookup[i] === "blue") {
          this.brickStateLookup[i] = "hidden";
          this.remaining--;
          this.bricks[i].classList.add("shrink");

          return { hit: true, shouldBounce: true, remainingBricks: this.remaining };
        }

        return { hit: true, shouldBounce: false, remainingBricks: this.remaining };
      }
    }

    return { hit: false, shouldBounce: false, remainingBricks: this.remaining };
  }
}
