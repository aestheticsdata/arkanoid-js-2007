import type { RectangleBounds, Vector2D } from "@interfaces/types";

const DEG_TO_RAD = Math.PI / 180;

export class Ball {
  private xPos: number;
  private yPos: number;
  private velocity: Vector2D = { x: 0, y: 0 };
  private readonly sizePx: number;

  constructor(private readonly element: HTMLDivElement) {
    this.xPos = this.element.offsetLeft;
    this.yPos = this.element.offsetTop;
    this.sizePx = this.element.offsetWidth || 15;
  }

  get size(): number {
    return this.sizePx;
  }

  get bounds(): RectangleBounds {
    return {
      left: this.xPos,
      right: this.xPos + this.sizePx,
      top: this.yPos,
      bottom: this.yPos + this.sizePx,
    };
  }

  get centerX(): number {
    return this.xPos + this.sizePx / 2;
  }

  get isMovingDown(): boolean {
    return this.velocity.y > 0;
  }

  place(left: number, top: number): void {
    this.xPos = left;
    this.yPos = top;
  }

  placeAbove(paddleBounds: RectangleBounds, margin = 1): void {
    const paddleCenterX = (paddleBounds.left + paddleBounds.right) / 2;
    this.xPos = paddleCenterX - this.sizePx / 2;
    this.yPos = paddleBounds.top - this.sizePx - margin;
  }

  setVelocity(nextVelocity: Vector2D): void {
    this.velocity = nextVelocity;
  }

  setVelocityFromLaunch(angleDeg: number, speed: number): void {
    const angleRad = angleDeg * DEG_TO_RAD;
    this.velocity = {
      x: speed * Math.sin(angleRad),
      y: -Math.abs(speed * Math.cos(angleRad)),
    };
  }

  step(): void {
    this.xPos += this.velocity.x;
    this.yPos += this.velocity.y;
  }

  invertHorizontalVelocity(): void {
    this.velocity.x *= -1;
  }

  invertVerticalVelocity(): void {
    this.velocity.y *= -1;
  }

  setLeft(left: number): void {
    this.xPos = left;
  }

  setTop(top: number): void {
    this.yPos = top;
  }

  setBottom(bottom: number): void {
    this.yPos = bottom - this.sizePx;
  }

  render(): void {
    this.element.style.left = `${this.xPos}px`;
    this.element.style.top = `${this.yPos}px`;
  }
}
