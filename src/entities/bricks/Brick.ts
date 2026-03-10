import type { BrickState, BrickVisualStyle, RectangleBounds } from "@interfaces/types";

export class Brick {
  private state: BrickState = "active";

  constructor(
    private readonly element: HTMLSpanElement,
    private readonly rectangleBounds: RectangleBounds,
  ) {}

  static create(
    id: string,
    rectangleBounds: RectangleBounds,
    visualStyle: BrickVisualStyle,
    width: number,
    height: number,
  ): Brick {
    const element = document.createElement("span");
    element.id = id;
    element.className = "brick";
    element.style.left = `${rectangleBounds.left}px`;
    element.style.top = `${rectangleBounds.top}px`;
    element.style.setProperty("--brick-width", `${width}px`);
    element.style.setProperty("--brick-height", `${height}px`);

    if (visualStyle.color) {
      element.style.setProperty("--brick-color", visualStyle.color);
    }
    if (visualStyle.background) {
      element.style.setProperty("--brick-background", visualStyle.background);
    }

    return new Brick(element, rectangleBounds);
  }

  get bounds(): RectangleBounds {
    return this.rectangleBounds;
  }

  get isActive(): boolean {
    return this.state === "active";
  }

  mount(anchorElement: HTMLDivElement): void {
    anchorElement.appendChild(this.element);
  }

  intersects(targetBounds: RectangleBounds): boolean {
    if (!this.isActive) {
      return false;
    }

    return !(
      targetBounds.right < this.rectangleBounds.left ||
      targetBounds.left > this.rectangleBounds.right ||
      targetBounds.bottom < this.rectangleBounds.top ||
      targetBounds.top > this.rectangleBounds.bottom
    );
  }

  destroy(): void {
    if (!this.isActive) {
      return;
    }

    this.state = "destroyed";
    this.element.classList.add("shrink");
  }
}
