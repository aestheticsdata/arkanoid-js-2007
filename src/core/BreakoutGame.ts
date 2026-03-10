import { breakoutConfig } from "@core/config/BreakoutConfig";
import { computePaddleBounceVelocity } from "@core/physics/PaddleBounce";
import { Ball } from "@entities/ball/Ball";
import { BrickWall } from "@entities/bricks/BrickWall";
import { Paddle } from "@entities/paddle/Paddle";
import { Scoreboard } from "@ui/Scoreboard";

import type { RectangleBounds } from "@interfaces/types";

interface BreakoutGameElements {
  gameArea: HTMLDivElement;
  brickAnchor: HTMLDivElement;
  ball: HTMLDivElement;
  paddle: HTMLDivElement;
  score: HTMLSpanElement;
}

function rectanglesIntersect(firstBounds: RectangleBounds, secondBounds: RectangleBounds): boolean {
  return !(
    firstBounds.right < secondBounds.left ||
    firstBounds.left > secondBounds.right ||
    firstBounds.bottom < secondBounds.top ||
    firstBounds.top > secondBounds.bottom
  );
}

export class BreakoutGame {
  private readonly config = breakoutConfig;
  private readonly paddle: Paddle;
  private readonly ball: Ball;
  private readonly brickWall: BrickWall;
  private readonly scoreboard: Scoreboard;

  private stop = false;
  private lastTime = performance.now();
  private accumulator = 0;
  private animationFrameId: number | null = null;

  constructor(private readonly elements: BreakoutGameElements) {
    this.paddle = new Paddle(this.elements.paddle);
    this.ball = new Ball(this.elements.ball);
    this.brickWall = new BrickWall(this.elements.brickAnchor, this.config.bricks);
    this.scoreboard = new Scoreboard(this.elements.score);
  }

  start(): void {
    this.brickWall.mount(this.elements.gameArea.clientWidth);
    this.scoreboard.update(this.brickWall.remainingBricks);

    this.ball.placeAbove(this.paddle.bounds);
    this.ball.setVelocityFromLaunch(this.config.physics.initialLaunchAngleDeg, this.config.physics.ballSpeed);
    this.ball.render();

    this.stop = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.elements.gameArea.classList.add("is-playing");
    document.addEventListener("mousemove", this.onMouseMove);
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  private readonly onMouseMove = (event: MouseEvent): void => {
    this.paddle.moveWithPointer(event.clientX, this.elements.gameArea.getBoundingClientRect());
  };

  private readonly gameLoop = (now: number): void => {
    this.accumulator += now - this.lastTime;
    this.lastTime = now;

    while (this.accumulator >= this.config.physics.tickMs && !this.stop) {
      this.update();
      this.accumulator -= this.config.physics.tickMs;
    }

    if (!this.stop) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
      return;
    }

    this.stopGame();
  };

  private update(): void {
    this.ball.step();
    this.handleGameAreaCollision();

    if (this.stop) {
      return;
    }

    this.handlePaddleCollision();
    this.handleBrickCollision();
    this.ball.render();
  }

  private handleGameAreaCollision(): void {
    const gameAreaWidth = this.elements.gameArea.clientWidth;
    const gameAreaHeight = this.elements.gameArea.clientHeight;
    const ballBounds = this.ball.bounds;

    if (ballBounds.left <= 0) {
      this.ball.setLeft(0);
      this.ball.invertHorizontalVelocity();
    }

    if (ballBounds.right >= gameAreaWidth) {
      this.ball.setLeft(gameAreaWidth - this.ball.size);
      this.ball.invertHorizontalVelocity();
    }

    if (ballBounds.top <= 0) {
      this.ball.setTop(0);
      this.ball.invertVerticalVelocity();
    }

    if (ballBounds.bottom >= gameAreaHeight) {
      this.stop = true;
    }
  }

  private handlePaddleCollision(): void {
    if (!this.ball.isMovingDown) {
      return;
    }

    const paddleBounds = this.paddle.bounds;
    if (!rectanglesIntersect(this.ball.bounds, paddleBounds)) {
      return;
    }

    this.ball.setBottom(paddleBounds.top - 1);
    this.ball.setVelocity(
      computePaddleBounceVelocity(
        this.ball.centerX,
        paddleBounds,
        this.config.physics.ballSpeed,
        this.config.physics.maxPaddleBounceAngleDeg,
      ),
    );
  }

  private handleBrickCollision(): void {
    const collision = this.brickWall.processCollision(this.ball.bounds);
    if (!collision.hit) {
      return;
    }

    if (collision.bounceAxis === "x") {
      this.ball.invertHorizontalVelocity();
    } else {
      this.ball.invertVerticalVelocity();
    }

    this.scoreboard.update(collision.remainingBricks);
    if (collision.remainingBricks === 0) {
      this.stop = true;
    }
  }

  private stopGame(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    document.removeEventListener("mousemove", this.onMouseMove);
    this.elements.gameArea.classList.remove("is-playing");
  }
}
