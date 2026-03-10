import { Ball } from "@entities/Ball";
import { BrickWall } from "@entities/BrickWall";
import { Paddle } from "@entities/Paddle";
import { Scoreboard } from "@ui/Scoreboard";

import type { VerticalDirection } from "@interfaces/types";

interface BreakoutGameElements {
  gameArea: HTMLDivElement;
  brickAnchor: HTMLDivElement;
  ball: HTMLDivElement;
  paddle: HTMLDivElement;
  score: HTMLSpanElement;
}

export class BreakoutGame {
  private readonly brickCount = 17;
  private readonly brickTopY = 150;
  private readonly brickHeight = 15;
  private readonly brickWidth = 50;
  private readonly brickSpacing = 2;
  private readonly ballSize = 15;
  private readonly paddleY = 605;
  private readonly ceilingY = 1;
  private readonly step = 3;
  private readonly tickMs = 10;
  private readonly gameAreaLeftBorder: number;
  private readonly gameAreaRightBorder: number;
  private readonly brickAnchorLeftMargin: number;
  private readonly brickAnchorTop: number;
  private readonly paddle: Paddle;
  private readonly ball: Ball;
  private readonly brickWall: BrickWall;
  private readonly scoreboard: Scoreboard;

  private stop = false;
  private lastTime = performance.now();
  private accumulator = 0;
  private animationFrameId: number | null = null;

  constructor(private readonly elements: BreakoutGameElements) {
    const gameAreaWidth = this.elements.gameArea.clientWidth;
    this.brickAnchorLeftMargin =
      (gameAreaWidth - this.brickCount * this.brickWidth - (this.brickCount - 1) * this.brickSpacing) / 2;
    this.gameAreaLeftBorder = (window.innerWidth >> 1) - (gameAreaWidth >> 1);
    this.gameAreaRightBorder = (window.innerWidth >> 1) + (gameAreaWidth >> 1);
    this.brickAnchorTop = this.elements.gameArea.offsetTop + this.brickTopY;

    this.paddle = new Paddle(this.elements.paddle);
    this.ball = new Ball(this.elements.ball);
    this.brickWall = new BrickWall(this.elements.brickAnchor, {
      count: this.brickCount,
      width: this.brickWidth,
      height: this.brickHeight,
      spacing: this.brickSpacing,
      topY: this.brickTopY,
    });
    this.scoreboard = new Scoreboard(this.elements.score);
  }

  start(): void {
    this.brickWall.mount(
      this.gameAreaLeftBorder + this.brickAnchorLeftMargin,
      this.brickAnchorTop,
      this.brickAnchorLeftMargin,
    );
    this.scoreboard.update(this.brickWall.remainingBricks);
    this.elements.gameArea.classList.add("is-playing");
    document.addEventListener("mousemove", this.onMouseMove);
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  private readonly onMouseMove = (event: MouseEvent): void => {
    this.paddle.moveWithPointer(event.clientX, this.gameAreaLeftBorder, this.gameAreaRightBorder);
  };

  private readonly gameLoop = (now: number): void => {
    this.accumulator += now - this.lastTime;
    this.lastTime = now;

    while (this.accumulator >= this.tickMs && !this.stop) {
      this.moveBall();
      this.accumulator -= this.tickMs;
    }

    if (!this.stop) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
      return;
    }

    this.stopGame();
  };

  private moveBall(): void {
    if (this.ball.y <= this.paddleY && this.ball.isMovingDown()) {
      this.processBrickCollision(0);
      this.ball.stepDown(this.step);
    } else if (this.ball.y > this.paddleY && this.ball.isMovingDown()) {
      if (this.ball.x < this.paddle.contactStart || this.ball.x > this.paddle.contactEnd) {
        this.stop = true;
      }
      this.ball.setVerticalDirection(0);
      this.ball.stepUp(this.step);
    } else if (this.ball.y >= this.ceilingY && this.ball.isMovingUp()) {
      this.processBrickCollision(1);
      this.ball.stepUp(this.step);
    } else if (this.ball.y < this.ceilingY && this.ball.isMovingUp()) {
      this.ball.setVerticalDirection(1);
      this.ball.stepDown(this.step);
    }

    this.ball.moveHorizontally(this.step, this.gameAreaLeftBorder, this.gameAreaRightBorder);
    this.ball.render();
  }

  private processBrickCollision(nextVerticalDirection: VerticalDirection): void {
    const collision = this.brickWall.processCollision(this.ball.x, this.ball.y, this.ballSize, this.gameAreaLeftBorder);
    if (!collision.hit) return;

    if (collision.shouldBounce) {
      this.ball.setVerticalDirection(nextVerticalDirection);
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
