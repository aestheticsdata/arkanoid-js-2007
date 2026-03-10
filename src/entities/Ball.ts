import type { HorizontalDirection, VerticalDirection } from "@interfaces/types";

export class Ball {
  private xPos: number;
  private yPos: number;
  private xDirection: HorizontalDirection;
  private yDirection: VerticalDirection;

  constructor(
    private readonly element: HTMLDivElement,
    initialX = 300,
    initialY = 50,
    initialXDirection: HorizontalDirection = 1,
    initialYDirection: VerticalDirection = 1,
  ) {
    this.xPos = initialX;
    this.yPos = initialY;
    this.xDirection = initialXDirection;
    this.yDirection = initialYDirection;
  }

  get x(): number {
    return this.xPos;
  }

  get y(): number {
    return this.yPos;
  }

  isMovingDown(): boolean {
    return this.yDirection === 1;
  }

  isMovingUp(): boolean {
    return this.yDirection === 0;
  }

  setVerticalDirection(direction: VerticalDirection): void {
    this.yDirection = direction;
  }

  stepDown(step: number): void {
    this.yPos += step;
  }

  stepUp(step: number): void {
    this.yPos -= step;
  }

  moveHorizontally(step: number, leftBorder: number, rightBorder: number): void {
    if (this.xPos <= rightBorder && this.xDirection === 1) {
      this.xPos += step;
    } else if (this.xPos > rightBorder && this.xDirection === 1) {
      this.xDirection = 0;
      this.xPos -= step;
    } else if (this.xPos >= leftBorder && this.xDirection === 0) {
      this.xPos -= step;
    } else if (this.xPos < leftBorder && this.xDirection === 0) {
      this.xDirection = 1;
      this.xPos += step;
    }
  }

  render(): void {
    this.element.style.left = `${this.xPos}px`;
    this.element.style.top = `${this.yPos}px`;
  }
}
