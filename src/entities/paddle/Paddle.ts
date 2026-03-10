import type { RectangleBounds } from "@interfaces/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class Paddle {
  private xPos: number;
  private readonly yPos: number;
  private readonly paddleWidth: number;
  private readonly paddleHeight: number;

  constructor(private readonly element: HTMLDivElement) {
    this.xPos = this.element.offsetLeft;
    this.yPos = this.element.offsetTop;
    this.paddleWidth = this.element.offsetWidth;
    this.paddleHeight = this.element.offsetHeight;
  }

  get bounds(): RectangleBounds {
    return {
      left: this.xPos,
      right: this.xPos + this.paddleWidth,
      top: this.yPos,
      bottom: this.yPos + this.paddleHeight,
    };
  }

  moveWithPointer(clientX: number, gameAreaRect: DOMRectReadOnly): void {
    const pointerXInGameArea = clientX - gameAreaRect.left;
    const maxLeft = gameAreaRect.width - this.paddleWidth;

    this.xPos = clamp(pointerXInGameArea - this.paddleWidth / 2, 0, maxLeft);
    this.render();
  }

  render(): void {
    this.element.style.left = `${this.xPos}px`;
  }
}
