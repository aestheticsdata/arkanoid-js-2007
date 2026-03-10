document.addEventListener("DOMContentLoaded", init);

type BrickState = "blue" | "hidden";
type VerticalDirection = 0 | 1;

function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing required HTMLElement with id "${id}"`);
  }
  return element as T;
}

function init(): void {
  const paddle = getElementByIdOrThrow<HTMLDivElement>("paddle");
  const ball = getElementByIdOrThrow<HTMLDivElement>("ball");
  const gameArea = getElementByIdOrThrow<HTMLDivElement>("gameArea");
  const brickAnchor = getElementByIdOrThrow<HTMLDivElement>("brickAnchor");
  const scoreDiv = getElementByIdOrThrow<HTMLSpanElement>("score");

  let xPos = 300;
  let yPos = 50;
  let yDirection: VerticalDirection = 1;
  let xDirection = 1;

  const brickCount = 17;
  const bricks: HTMLSpanElement[] = [];
  const brickPositionLookup: number[] = [];
  const brickStateLookup: BrickState[] = [];
  const brickTopY = 150;
  const brickHeight = 15;
  const brickWidth = 50;
  const brickSpacing = 2;
  const ballSize = 15;
  const paddleY = 605;
  const ceilingY = 1;

  let paddleX = 0;
  let paddleContactStart = 0;
  let paddleContactEnd = 0;
  let remainingBricks = brickCount;
  let stop = false;

  const step = 3;
  const tickMs = 10;
  const gameAreaWidth = gameArea.clientWidth;
  const brickAnchorLeftMargin = (gameAreaWidth - brickCount * brickWidth - (brickCount - 1) * brickSpacing) / 2;
  const gameAreaLeftBorder = (window.innerWidth >> 1) - (gameAreaWidth >> 1);
  const gameAreaRightBorder = (window.innerWidth >> 1) + (gameAreaWidth >> 1);
  const paddleWidth = paddle.offsetWidth;

  let lastTime = performance.now();
  let accumulator = 0;
  let animationFrameId: number | null = null;

  makeBricks();
  updateScore();
  document.addEventListener("mousemove", onMouseMove);
  animationFrameId = requestAnimationFrame(gameLoop);

  function onMouseMove(e: MouseEvent): void {
    if (e.clientX > gameAreaRightBorder - paddleWidth) {
      paddleX = gameAreaRightBorder - paddleWidth;
    } else if (e.clientX < gameAreaLeftBorder) {
      paddleX = gameAreaLeftBorder;
    } else {
      paddleX = e.clientX;
    }
    paddle.style.left = `${paddleX}px`;
  }

  function makeBricks(): void {
    brickAnchor.style.left = `${gameAreaLeftBorder + brickAnchorLeftMargin}px`;
    brickAnchor.style.top = `${gameArea.offsetTop + brickTopY}px`;

    for (let i = 0; i < brickCount; i++) {
      const brick = document.createElement("span");
      brick.id = `brick_id${i}`;
      brick.className = "brick";

      brickStateLookup[i] = "blue";
      brickPositionLookup[i] = i * (brickWidth + brickSpacing) + brickAnchorLeftMargin;
      bricks[i] = brick;
    }

    bricks.forEach((brick) => brickAnchor.appendChild(brick));
  }

  function moveBall(): void {
    paddleContactStart = paddleX;
    paddleContactEnd = paddleX + paddleWidth;

    if (yPos <= paddleY && yDirection === 1) {
      processBrickCollision(0);
      yPos += step;
    } else if (yPos > paddleY && yDirection === 1) {
      if (xPos < paddleContactStart || xPos > paddleContactEnd) stop = true;
      yDirection = 0;
      yPos -= step;
    } else if (yPos >= ceilingY && yDirection === 0) {
      processBrickCollision(1);
      yPos -= step;
    } else if (yPos < ceilingY && yDirection === 0) {
      yDirection = 1;
      yPos += step;
    }

    if (xPos <= gameAreaRightBorder && xDirection === 1) {
      xPos += step;
    } else if (xPos > gameAreaRightBorder && xDirection === 1) {
      xDirection = 0;
      xPos -= step;
    } else if (xPos >= gameAreaLeftBorder && xDirection === 0) {
      xPos -= step;
    } else if (xPos < gameAreaLeftBorder && xDirection === 0) {
      xDirection = 1;
      xPos += step;
    }

    ball.style.left = `${xPos}px`;
    ball.style.top = `${yPos}px`;
  }

  function processBrickCollision(nextVerticalDirection: VerticalDirection): void {
    if (!(yPos + ballSize >= brickTopY && yPos <= brickTopY + brickHeight)) return;

    const relX = xPos - gameAreaLeftBorder;
    for (let i = 0; i < bricks.length; i++) {
      if (brickPositionLookup[i] <= relX && relX <= brickPositionLookup[i] + brickWidth) {
        if (brickStateLookup[i] === "blue") {
          yDirection = nextVerticalDirection;
          remainingBricks--;
          brickStateLookup[i] = "hidden";
          bricks[i].classList.add("shrink");
        }

        updateScore();
        if (remainingBricks === 0) stop = true;
        break;
      }
    }
  }

  function updateScore(): void {
    scoreDiv.textContent = String(remainingBricks);
  }

  function gameLoop(now: number): void {
    accumulator += now - lastTime;
    lastTime = now;

    while (accumulator >= tickMs && !stop) {
      moveBall();
      accumulator -= tickMs;
    }

    if (!stop) {
      animationFrameId = requestAnimationFrame(gameLoop);
      return;
    }

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    document.removeEventListener("mousemove", onMouseMove);
  }
}
