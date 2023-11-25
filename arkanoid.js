//window.addEventListener("load", init, false);

$(init);

// use window.innerWidth instead of screen.availWidth

function init(){

	//var	raquette = document.getElementById("raquette"),
	var	raquette = $('#raquette'),
		ball = $('#ball'),
		// xpos = _.random(400, 700),
		xpos = 300,
		ypos = 50, 
		ydir = 1, // la ball descend, dir == 0 la balle remonte
		// xdir = _.random(0,1), //la ball va vers la droite, dir == 0 la balle va vers la gauche
		xdir = 1,
		nbBriques = 17,
		briques = [],
		briquesPosLookUp = [], // for optimization
		briquesColorLookUp = [], // for optimization
		//ybriquedessous = 1,
		ybriquehaut = 140,
		ybriquebas = 164,
		x = 0,
		step = 3, // vitesse de la balle, une vitesse donnee marche avec des valeurs donnees de ybrique[haut/bas]
		briques_remaining = nbBriques,
		briqueAncrageLeftMargin = 0,
		zoneContactRaquetteDebut = 0,
		zoneContactRaquetteFin = 0,
		zoneactiveLborder = (window.innerWidth >> 1) - ($('#zoneactive').innerWidth() >> 1),
		zoneactiveRborder = (window.innerWidth >> 1) + ($('#zoneactive').innerWidth() >> 1),
		raquetteWidth = $('#raquette').width(),
		brique_width,
		stop = false,
		scoreDiv = $('#score');
	
	makeBriques();
	moveBall();


	function makeBriques() {
		
		var	brique;

		for (var i=0; i<nbBriques; i+=1) {
		
			brique = document.createElement('span');
			brique.setAttribute('id', 'briques_id'+i);

			brique.style.width = '50px';
			brique.style.height = '15px';
			brique.style.position = 'absolute';
			briquesColorLookUp[i] = brique.style.backgroundColor = 'blue'; 
			brique.style.top = '150px';
			// brique.innerHTML = i;
			
			briquesPosLookUp[i] = i*(parseInt(brique.style.width)) + i*2 + briqueAncrageLeftMargin;
			brique.style.left =  briquesPosLookUp[i] + 'px';
			// brique.style.left = i*(parseInt(brique.style.width)) + i*2 + briqueAncrageLeftMargin + "px";

			briques[i] = brique;
		}

		var debutBrique = $('#briqueAncrage');

		var l = briques.length;
		for (var i=0; i<l; i+=1) {
			debutBrique.append(briques[i]);
		}

		brique_width = parseInt(briques[0].style.width);
	}


	function moveBall(){
		//////////////// deplacement de la raquette /////////////////////////////////////////////////////////////////
		//document.onmousemove = function(e){ 
		$(document).on('mousemove' , function (e) { 
			if (e.clientX > zoneactiveRborder - raquetteWidth ) { // taille de la raquette: 100px
				x = zoneactiveRborder - raquetteWidth;
			} else if (e.clientX < zoneactiveLborder) {
				x = zoneactiveLborder;
			} else {
				x = e.clientX; 
			}
			//raquette.style.left = x + "px";
			raquette.css('left', x+'px');
		});
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		
		zoneContactRaquetteDebut = x;
		zoneContactRaquetteFin   = x + raquetteWidth;


		if (ypos <= 605 && ydir == 1 ) { //la balle descend
			if (ypos == ybriquehaut) {
				console.log('---');
				console.log('hit');
				console.log('xpos = '+xpos);
				for(var i=0; i < briques_remaining; i+=1) {
					if (briquesPosLookUp[i] <= (xpos - zoneactiveLborder) && (xpos - zoneactiveLborder) <= briquesPosLookUp[i]+brique_width) {
						if (briquesColorLookUp[i] === 'blue') {
							console.log('good hit, brique no: ' + i);
							console.log('brique [' + briquesPosLookUp[i] + ', ' + parseInt(briquesPosLookUp[i]+brique_width)+']');
							console.log('---');
							ydir = 0;	
							briques_remaining -= 1;
							briquesColorLookUp[i] = briques[i].style.backgroundColor = 'white';
						}
						updateScore();
						if (briques_remaining === 0) {
							// alert("you win");
							// clearInterval(timer);
							stop = true;
							//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
						}
						break;
					}
				}
			}	
			ypos += step;
		} else if (ypos > 605 && ydir === 1) { //la balle a touche le bas, elle va remonter
				if (xpos < zoneContactRaquetteDebut || xpos > zoneContactRaquetteFin) { //si la balle ne touche pas la raquette
					// alert("you lose");
					// clearInterval(timer);
					stop = true;
					//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
				}
				ydir = 0;
				ypos -= step;
		} else if (ypos >= 1 && ydir === 0) { // la balle remonte
			if (ypos == ybriquebas) { // si la balle a touche une brique en remontant
				// console.log("hit from bottom");
				for (var i=0; i < briques.length; i+=1) {
					if (briquesPosLookUp[i] <= (xpos - zoneactiveLborder) && (xpos - zoneactiveLborder) <= briquesPosLookUp[i]+brique_width) {
						if (briquesColorLookUp[i] === 'blue') {
							ydir = 1;	
							briques_remaining -= 1;
							briquesColorLookUp[i] = briques[i].style.backgroundColor = 'white';
						}
						updateScore();
						if (briques_remaining === 0) {
							// alert("you win");
							// clearInterval(timer);
							stop = true;
							//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
						}
						break;
					}
				}
			}
			ypos -= step;
		} else if (ypos < 1 && ydir === 0) { //la balle a touche le haut, elle va redescendre
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
		
		//ball.style.left = xpos + "px";
		//ball.style.top = ypos + "px";
		ball.css('left', xpos+'px');
		ball.css('top',  ypos+'px');
	}

	function updateScore() {
		scoreDiv.text(briques_remaining);
	}

	// var timer = setInterval(moveBall, 10);
	

	(function enterframe() {
		moveBall();
		if(!stop) setTimeout(enterframe, 10);
	}());


}


