document.addEventListener("DOMContentLoaded", init);

function init() {
  const raquette = document.getElementById("raquette");
  const ball = document.getElementById("ball");
  let xpos = 300;
  let ypos = 50;
  let ydir = 1;
  let xdir = 1;
  const nbBriques = 17;
  const briques = [];
  const briquesPosLookUp = [];
  const briquesColorLookUp = [];
  const ybriquehaut = 150;
  const brique_height = 15;
  let x = 0;
  const step = 3;
  let briques_remaining = nbBriques;
  const brique_width = 50;
  const brique_spacing = 2;
  const zoneactiveWidth = document.getElementById("zoneactive").clientWidth;
  const briqueAncrageLeftMargin =
    (zoneactiveWidth -
      (nbBriques * brique_width + (nbBriques - 1) * brique_spacing)) /
    2;
  let zoneContactRaquetteDebut = 0;
  let zoneContactRaquetteFin = 0;
  const zoneactiveLborder = (window.innerWidth >> 1) - (zoneactiveWidth >> 1);
  const zoneactiveRborder = (window.innerWidth >> 1) + (zoneactiveWidth >> 1);
  const raquetteWidth = raquette.offsetWidth;
  let stop = false;
  const scoreDiv = document.getElementById("score");

  makeBriques();
  moveBall();

  function makeBriques() {
    for (let i = 0; i < nbBriques; i++) {
      const brique = document.createElement("span");
      brique.id = "briques_id" + i;
      brique.style.width = `${brique_width}px`;
      brique.style.height = `${brique_height}px`;
      brique.style.position = "absolute";
      brique.style.backgroundColor = "blue";
      brique.style.top = `${ybriquehaut}px`;
      brique.style.borderRadius = "5px";

      briquesColorLookUp[i] = "blue";
      briquesPosLookUp[i] =
        i * (brique_width + brique_spacing) + briqueAncrageLeftMargin;
      brique.style.left = `${briquesPosLookUp[i]}px`;

      briques[i] = brique;
    }

    const debutBrique = document.getElementById("briqueAncrage");
    briques.forEach((brique) => debutBrique.appendChild(brique));
  }

  function moveBall() {
    document.addEventListener("mousemove", (e) => {
      if (e.clientX > zoneactiveRborder - raquetteWidth) {
        x = zoneactiveRborder - raquetteWidth;
      } else if (e.clientX < zoneactiveLborder) {
        x = zoneactiveLborder;
      } else {
        x = e.clientX;
      }
      raquette.style.left = `${x}px`;
    });

    zoneContactRaquetteDebut = x;
    zoneContactRaquetteFin = x + raquetteWidth;

    if (ypos <= 605 && ydir === 1) {
      if (ypos + 15 >= ybriquehaut && ypos <= ybriquehaut + brique_height) {
        for (let i = 0; i < briques.length; i++) {
          const relX = xpos - zoneactiveLborder;
          if (
            briquesPosLookUp[i] <= relX &&
            relX <= briquesPosLookUp[i] + brique_width
          ) {
            if (briquesColorLookUp[i] === "blue") {
              ydir = 0;
              briques_remaining--;
              briquesColorLookUp[i] = "hidden";
              briques[i].classList.add("shrink");
            }
            updateScore();
            if (briques_remaining === 0) stop = true;
            break;
          }
        }
      }
      ypos += step;
    } else if (ypos > 605 && ydir === 1) {
      if (xpos < zoneContactRaquetteDebut || xpos > zoneContactRaquetteFin)
        stop = true;
      ydir = 0;
      ypos -= step;
    } else if (ypos >= 1 && ydir === 0) {
      if (ypos + 15 >= ybriquehaut && ypos <= ybriquehaut + brique_height) {
        for (let i = 0; i < briques.length; i++) {
          const relX = xpos - zoneactiveLborder;
          if (
            briquesPosLookUp[i] <= relX &&
            relX <= briquesPosLookUp[i] + brique_width
          ) {
            if (briquesColorLookUp[i] === "blue") {
              ydir = 1;
              briques_remaining--;
              briquesColorLookUp[i] = "hidden";
              briques[i].classList.add("shrink");
            }
            updateScore();
            if (briques_remaining === 0) stop = true;
            break;
          }
        }
      }
      ypos -= step;
    } else if (ypos < 1 && ydir === 0) {
      ydir = 1;
      ypos += step;
    }

    if (xpos <= zoneactiveRborder && xdir === 1) {
      xpos += step;
    } else if (xpos > zoneactiveRborder && xdir === 1) {
      xdir = 0;
      xpos -= step;
    } else if (xpos >= zoneactiveLborder && xdir === 0) {
      xpos -= step;
    } else if (xpos < zoneactiveLborder && xdir === 0) {
      xdir = 1;
      xpos += step;
    }

    ball.style.left = `${xpos}px`;
    ball.style.top = `${ypos}px`;
  }

  function updateScore() {
    scoreDiv.textContent = briques_remaining;
  }

  (function enterframe() {
    moveBall();
    if (!stop) setTimeout(enterframe, 10);
  })();
}