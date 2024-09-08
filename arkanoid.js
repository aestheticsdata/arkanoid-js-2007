$(init);

function init() {
	var raquette = $('#raquette'),
		ball = $('#ball'),
		xpos = 300,
		ypos = 50,
		ydir = 1, // La balle descend, dir == 0 la balle remonte
		xdir = 1,
		nbBriques = 17,
		briques = [],
		briquesPosLookUp = [], // Pour optimisation
		briquesColorLookUp = [], // Pour optimisation
		ybriquehaut = 150, // Ajustement pour la hauteur correcte des briques
		brique_height = 15, // Hauteur des briques
		x = 0,
		step = 3, // Vitesse de la balle
		briques_remaining = nbBriques,
		brique_width = 50,
		brique_spacing = 2,
		zoneactiveWidth = $('#zoneactive').innerWidth(),
		briqueAncrageLeftMargin = (zoneactiveWidth - (nbBriques * brique_width + (nbBriques - 1) * brique_spacing)) / 2, // Calcul pour centrer les briques
		zoneContactRaquetteDebut = 0,
		zoneContactRaquetteFin = 0,
		zoneactiveLborder = (window.innerWidth >> 1) - (zoneactiveWidth >> 1),
		zoneactiveRborder = (window.innerWidth >> 1) + (zoneactiveWidth >> 1),
		raquetteWidth = $('#raquette').width(),
		stop = false,
		scoreDiv = $('#score');

	makeBriques();
	moveBall();

	function makeBriques() {
		var brique;

		for (var i = 0; i < nbBriques; i += 1) {
			brique = document.createElement('span');
			brique.setAttribute('id', 'briques_id' + i);
			brique.style.width = brique_width + 'px';
			brique.style.height = brique_height + 'px';
			brique.style.position = 'absolute';
			brique.style.backgroundColor = 'blue';
			brique.style.top = ybriquehaut + 'px';
			brique.style.borderRadius = '5px';

			briquesColorLookUp[i] = 'blue';
			briquesPosLookUp[i] = i * (brique_width + brique_spacing) + briqueAncrageLeftMargin;
			brique.style.left = briquesPosLookUp[i] + 'px';

			briques[i] = brique;
		}

		var debutBrique = $('#briqueAncrage');

		for (var i = 0; i < briques.length; i += 1) {
			debutBrique.append(briques[i]);
		}
	}

	function moveBall() {
		$(document).on('mousemove', function (e) {
			if (e.clientX > zoneactiveRborder - raquetteWidth) {
				x = zoneactiveRborder - raquetteWidth;
			} else if (e.clientX < zoneactiveLborder) {
				x = zoneactiveLborder;
			} else {
				x = e.clientX;
			}
			raquette.css('left', x + 'px');
		});

		zoneContactRaquetteDebut = x;
		zoneContactRaquetteFin = x + raquetteWidth;

		if (ypos <= 605 && ydir === 1) { // La balle descend
			if (ypos + 15 >= ybriquehaut && ypos <= ybriquehaut + brique_height) { // Vérification de la collision verticale
				for (var i = 0; i < briques.length; i += 1) {
					if (briquesPosLookUp[i] <= (xpos - zoneactiveLborder) && (xpos - zoneactiveLborder) <= briquesPosLookUp[i] + brique_width) {
						if (briquesColorLookUp[i] === 'blue') {
							ydir = 0; // Inverser la direction de la balle
							briques_remaining -= 1;
							briquesColorLookUp[i] = 'hidden'; // Indique que la brique est cachée
							$(briques[i]).addClass('shrink');
						}
						updateScore();
						if (briques_remaining === 0) {
							stop = true;
						}
						break;
					}
				}
			}
			ypos += step;
		} else if (ypos > 605 && ydir === 1) {
			if (xpos < zoneContactRaquetteDebut || xpos > zoneContactRaquetteFin) {
				stop = true;
			}
			ydir = 0;
			ypos -= step;
		} else if (ypos >= 1 && ydir === 0) { // La balle monte
			if (ypos + 15 >= ybriquehaut && ypos <= ybriquehaut + brique_height) { // Collision en remontant
				for (var i = 0; i < briques.length; i += 1) {
					if (briquesPosLookUp[i] <= (xpos - zoneactiveLborder) && (xpos - zoneactiveLborder) <= briquesPosLookUp[i] + brique_width) {
						if (briquesColorLookUp[i] === 'blue') {
							ydir = 1; // Inverser la direction de la balle
							briques_remaining -= 1;
							briquesColorLookUp[i] = 'hidden';
							$(briques[i]).addClass('shrink');
						}
						updateScore();
						if (briques_remaining === 0) {
							stop = true;
						}
						break;
					}
				}
			}
			ypos -= step;
		} else if (ypos < 1 && ydir === 0) {
			ydir = 1;
			ypos += step;
		}

		if (xpos <= zoneactiveRborder && xdir == 1) {
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

		ball.css('left', xpos + 'px');
		ball.css('top', ypos + 'px');
	}

	function updateScore() {
		scoreDiv.text(briques_remaining);
	}

	(function enterframe() {
		moveBall();
		if (!stop) setTimeout(enterframe, 10);
	}());
}
