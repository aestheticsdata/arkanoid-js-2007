export class Paddle {
  private xPos = 0;
  private readonly paddleWidth: number;

  constructor(private readonly element: HTMLDivElement) {
    this.paddleWidth = this.element.offsetWidth;
  }

  get width(): number {
    return this.paddleWidth;
  }

  get contactStart(): number {
    return this.xPos;
  }

  get contactEnd(): number {
    return this.xPos + this.paddleWidth;
  }

  moveWithPointer(clientX: number, leftBorder: number, rightBorder: number): void {
    if (clientX > rightBorder - this.paddleWidth) {
      this.xPos = rightBorder - this.paddleWidth;
    } else if (clientX < leftBorder) {
      this.xPos = leftBorder;
    } else {
      this.xPos = clientX;
    }
    this.element.style.left = `${this.xPos}px`;
  }
}
