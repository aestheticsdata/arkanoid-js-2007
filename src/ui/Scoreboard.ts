export class Scoreboard {
  constructor(private readonly scoreElement: HTMLSpanElement) {}

  update(remainingBricks: number): void {
    this.scoreElement.textContent = String(remainingBricks);
  }
}
