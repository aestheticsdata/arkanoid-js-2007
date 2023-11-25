//window.addEventListener("load", init, false);

$(init);

// use window.innerWidth instead of screen.availWidth

////////////////////////////////  http://paulirish.com/2011/requestanimationframe-for-smart-animating/ ///////
 window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
	        	window.setTimeout(callback, 1000 / 60);
            };
})();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


function init(){

	//var	raquette = document.getElementById("raquette"),
	var	raquette = $("#raquette"),
		ball = $("#ball"),
		xpos = _.random(400, 700),
		ypos = 50, 
		ydir = 1, // la ball descend, dir == 0 la balle remonte
		xdir = _.random(0,1), //la ball va vers la droite, dir == 0 la balle va vers la gauche
		nbBriques = 18,
		briques = [],
		//ybriquedessous = 1,
		ybriquehaut = 140,
		ybriquebas = 164,
		x = 0,
		step = 3, // vitesse de la balle, une vitesse donnee marche avec des valeurs donnees de ybrique[haut/bas]
		briques_left = nbBriques,
		briqueAncrageLeftMargin = 0;
	
	makebriques();
	moveBall();


	function makebriques() {
		
		//var briques = [],
		var	brique;

		for (var i=0; i < nbBriques; i++) {
		
			brique = document.createElement("span");
			brique.setAttribute("id", "briques_id"+i);

			brique.style.width = "50px";
			brique.style.height = "15px";
			brique.style.position = "absolute";
			brique.style.backgroundColor = "blue";
			brique.style.top = "150px";
				
			brique.style.left = i*(parseInt(brique.style.width)) + i*2 + briqueAncrageLeftMargin + "px";

			briques[i] = brique;
		}

		var debutBrique = document.getElementById("briqueAncrage");

		for (var i=0, len = briques.length; i < len; i++) {
			debutBrique.appendChild(briques[i]);
		}
	}


	function moveBall(){
		//////////////// deplacement de la raquette /////////////////////////////////////////////////////////////////
		//document.onmousemove = function(e){ 
		$(document).on('mousemove' , function (e) { 
			if (e.clientX > window.innerWidth - 280) { // taille de la raquette: 100px
				x = window.innerWidth - 280;
			} else if (e.clientX < 170) {
				x = 170;
			} else {
				x = e.clientX; 
			}
			//raquette.style.left = x + "px";
			raquette.css('left', x+'px');
		});
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		
		var zoneContactRaquetteDebut = x,
			zoneContactRaquetteFin   = x + 100;


		if (ypos <= 605 && ydir == 1 ) { //la balle descend
			if (ypos == ybriquehaut) {
				for(var i=0; i < briques_left; i++) {
					if (parseInt(briques[i].style.left) <= xpos && xpos <= (parseInt(briques[i].style.left) + 50)) {
						if ((document.getElementById("briques_id"+i).style.backgroundColor) == "blue") {
							ydir = 0;	
							briques_left--;
						}
						briques[i].style.backgroundColor = "white";
						
						if (briques_left == 0) {
							alert("you win");
							clearInterval(timer);
							//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
						}
						break;
					}
				}
			}	
			ypos += step;
		} else if (ypos > 605 && ydir == 1) { //la balle a touche le bas, elle va remonter
				if (xpos < zoneContactRaquetteDebut || xpos > zoneContactRaquetteFin) { //si la balle ne touche pas la raquette
					alert("you lose");
					clearInterval(timer);
					//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
				}
				ydir = 0;
				ypos -= step;
		} else if (ypos >= 1 && ydir == 0) { // la balle remonte
			if (ypos == ybriquebas){ // si la balle a touche une brique en remontant
				console.log("666");
				//console.log('briques : ' + briques);
				//console.log("briques length : " + briques.length);
				for (var i=0; i < briques.length; i++) {
					//console.log('parsing des briques');
					if (parseInt(briques[i].style.left) <= xpos && xpos <= (parseInt(briques[i].style.left) + 50)) {
						console.log("777");
						if ((document.getElementById("briques_id"+i).style.backgroundColor) == "blue") {
							ydir = 1;	
							briques_left--;
						}
						briques[i].style.backgroundColor = "white";
						if (briques_left == 0) {
							alert("you win");
							clearInterval(timer);
							//document.body.innerHTML = "<br /><h2><center>Play again : press F5</center></h2><br/><a href='http://www.w-and-co.com/ichigoFlash/ichigostudio.html'>ichigostudio home</a>";
						}
						break;
					}
				}
			}
			ypos -= step;
		} else if (ypos < 1 && ydir == 0) { //la balle a touche le haut, elle va redescendre
			ydir = 1;
			ypos += step;
		}
		
		if (xpos <= 1096 && xdir == 1) {
			xpos += step;
		} else if (xpos > 1096 && xdir == 1) {
			xdir = 0;
			xpos -= step;
		} else if (xpos >= 165 && xdir == 0) {
			xpos -= step;
		} else if (xpos < 165 && xdir == 0) {
			xdir = 1;
			xpos += step;
			
		}
		
		//ball.style.left = xpos + "px";
		//ball.style.top = ypos + "px";
		ball.css('left', xpos+'px');
		ball.css('top',  ypos+'px');
	}
	var timer = setInterval(moveBall, 10);
}


