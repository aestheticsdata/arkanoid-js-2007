import { BreakoutGame } from "@core/BreakoutGame";
import { getElementByIdOrThrow } from "@shared/dom";

document.addEventListener("DOMContentLoaded", () => {
  const game = new BreakoutGame({
    gameArea: getElementByIdOrThrow<HTMLDivElement>("gameArea"),
    brickAnchor: getElementByIdOrThrow<HTMLDivElement>("brickAnchor"),
    ball: getElementByIdOrThrow<HTMLDivElement>("ball"),
    paddle: getElementByIdOrThrow<HTMLDivElement>("paddle"),
    score: getElementByIdOrThrow<HTMLSpanElement>("score"),
  });

  game.start();
});
