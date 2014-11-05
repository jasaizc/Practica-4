var sprites = {
    ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
    missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
    enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
};

var enemies = {
    // B, C y E substituir�n a los valores por defecto definidos en la
    // variable baseParameters del constructor Enemy(). Ver
    // comentarios en el c�digo del constructor al final del fichero.
    basic: { x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 4, E: 100 }
};


var startGame = function() {
    Game.setBoard(0,new Starfield(20,0.4,100,true))
    Game.setBoard(1,new Starfield(50,0.6,100))
    Game.setBoard(2,new Starfield(100,1.0,50));
    Game.setBoard(3,new TitleScreen("Alien Invasion", 
                                    "Press fire to start playing",
                                    playGame));
}


var playGame = function() {
    var board = new GameBoard();

    // Se a�ade un enemigo con las propiedades definidas en enemies.basic
    board.add(new Enemy(enemies.basic));
    // Se a�ade un enemigo con las propiedades definidas en
    // enemies.basic, pero con la propiedad x = 200 definida en el
    // segundo argumento de la llamada al constructor. Ver comentarios en el
    // constructor Enemy al final de este fichero.
    board.add(new Enemy(enemies.basic, { x: 200 }));

    board.add(new PlayerShip());
    Game.setBoard(3,board);
}


// Si se construye con clear==true no se pintan estrellas con fondo
// transparente, sino fondo en negro
var Starfield = function(speed,opacity,numStars,clear) {

    // Creamos un objeto canvas, no visible en la p�gina Web
    var stars = $('<canvas/>')
	.attr('width', Game.width)
	.attr('height', Game.height)[0];
    // Sin jQuery lo hacemos asi:
    //    var stars = document.createElement("canvas");
    //    stars.width = Game.width; 
    //    stars.height = Game.height;


    var starCtx = stars.getContext("2d");

    var offset = 0;

    // Si la opci�n clear est� activada, el fondo del canvas se pinta
    // de negro. Utilizado en el nivel mas profundo de estrellas
    if(clear) {
	starCtx.fillStyle = "#000";
	starCtx.fillRect(0,0,stars.width,stars.height);
    }

    // Dibujamos las estrellas blancas sobre el canvas no visible,
    // como rect�ngulos de 2 pixeles en posiciones aleatorias
    starCtx.fillStyle = "#FFF";
    starCtx.globalAlpha = opacity; // nivel de transparencia de las estrellas
    for(var i=0;i<numStars;i++) {
	starCtx.fillRect(Math.floor(Math.random()*stars.width),
			 Math.floor(Math.random()*stars.height),
			 2,
			 2);
    }

    // Se llama a este m�todo en cada frame de la animaci�n para dibujar
    // el campo de estrellas en la pantalla
    this.draw = function(ctx) {
	var intOffset = Math.floor(offset);
	var remaining = stars.height - intOffset;

	// Dibujar sobre el contexto ctx la parte de arriba del canvas con
	// las estrellas
	if(intOffset > 0) {
	    ctx.drawImage(stars,
			  0, remaining,
			  stars.width, intOffset,
			  0, 0,
			  stars.width, intOffset);
	}

	// Dibujar sobre el contexto ctx la parte inferior del canvas con
	// las estrellas
	if(remaining > 0) {
	    ctx.drawImage(stars,
			  0, 0,
			  stars.width, remaining,
			  0, intOffset,
			  stars.width, remaining);
	}
    }

    // En cada paso de la animaci�n, movemos el campo de estrellas
    // modificando el offset seg�n la cantidad de tiempo transcurrida
    this.step = function(dt) {
	offset += dt * speed; // velocidad = espacio / tiempo
	offset = offset % stars.height;
    }
}


// La clase PlayerShip tambien ofrece la interfaz step(), draw() para
// poder ser dibujada desde el bucle principal del juego
var PlayerShip = function() { 
    this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x = Game.width/2 - this.w / 2;
    this.y = Game.height - 10 - this.h;

    this.step = function(dt) {
	if(Game.keys['left']) { this.vx = -this.maxVel; }
	else if(Game.keys['right']) { this.vx = this.maxVel; }
	else { this.vx = 0; }

	this.x += this.vx * dt;

	if(this.x < 0) { this.x = 0; }
	else if(this.x > Game.width - this.w) { 
	    this.x = Game.width - this.w 
	}

	this.reload-=dt;
	if(Game.keys['fire'] && this.reload < 0) {
	    // Esta pulsada la tecla de disparo y ya ha pasado el tiempo reload
	    Game.keys['fire'] = false;
	    this.reload = this.reloadTime;

	    // Se a�aden al gameboard 2 misiles 
	    this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
	    this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
	}
	if (Game.keys['ball_left']) {

	    Game.keys['fire'] = false;
	    this.reload = this.reloadTime;

	    // Se a�aden al gameboard una bola de fuegos 
	    this.board.add(new PlayerFireBallLeft(this.x, this.y + this.h / 2));

	}
	if (Game.keys['ball_right']) {

	    Game.keys['fire'] = false;
	    this.reload = this.reloadTime;

	    // Se a�aden al gameboard 1 bola de fuego 
	    this.board.add(new PlayerFireBallRight(this.x + this.w, this.y + this.h / 2));

	}
    }
}

// Heredamos del prototipo new Sprite()
PlayerShip.prototype = new Sprite();

var PlayerFireBallLeft = function (x, y) {
    this.setup("explosion", { vy: -1500, vx: -200 });
    this.x = x - this.w / 2;
    this.y = y - this.h;
};
PlayerFireBallLeft.prototype = new Sprite();
PlayerFireBallLeft.prototype.step = function (dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy = this.vy + 150;
    if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
        this.board.remove(this);
    }
};
var PlayerFireBallRight = function (x, y) {
    this.setup("explosion", { vy: -1500, vx: 200 });
    this.x = x - this.w / 2;
    this.y = y - this.h;
};
PlayerFireBallRight.prototype = new Sprite();
PlayerFireBallRight.prototype.step = function (dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy = this.vy + 150;
    if (this.y > Game.height ||
    this.x < -this.w ||
    this.x > Game.width) {
        this.board.remove(this);
    }
};


// Constructor para los misiles.
// Los metodos de esta clase los a�adimos a su prototipo. De esta
// forma solo existe una copia de cada uno para todos los misiles, y
// no una copia para cada objeto misil
var PlayerMissile = function(x,y) {
    this.setup('missile',{ vy: -700 });
    this.x = x + this.w/2;
    this.y = y + this.h; 
};

PlayerMissile.prototype = new Sprite();

PlayerMissile.prototype.step = function(dt)  {
    this.y += this.vy * dt;
    if(this.y < -this.h) { this.board.remove(this); }
};



// Constructor para las naves enemigas. Un enemigo se define mediante
// un conjunto de propiedades provenientes de 3 sitios distintos, que
// se aplican  este orden:
// 1. baseParameters: propiedad del prototipo con los valores por
//    omisi�n para las constantes A..H de las velocidades vx y vy
// 2. par�metros definidos en la plantilla blueprint que se pasa como
//    par�metro al crear el enemigo. Pueden modificar las propiedades
//    definidas en 1.
// 3. par�metros definidos en el par�metro override. Pueden modificar
// las propiedades definidas en 1 y 2.

// El c�digo del constructor a�ade las propiedades en este orden al
// objeto que crea.

// Para definir un nuevo tipo de enemigo: se elige una plantilla
// existente o se crea una nueva, y se pasan opcionalmente en override
// valores alternativos para los par�metros de la plantilla o de
// baseParameters. Ver c�mo se a�aden 2 enemigos en la funci�n
// playGame() de este fichero.

var Enemy = function(blueprint,override) {
    // Cada instancia tendr� las propiedades definidas en baseParameters
    this.merge(this.baseParameters);

    // Se llama a setup para que se a�adan como propiedades el sprite
    // y los atributos definidos en el par�metro blueprint, pudiendo
    // estas modificar los definidos en baseParameters
    this.setup(blueprint.sprite,blueprint);

    // Se copian los atributos definidos en el par�metro override,
    // pudiendo modificar los definidos en baseParameters y en
    // blueprint
    this.merge(override);
}

Enemy.prototype = new Sprite();

// Inicializa los par�metros de las ecuacione de velocidad, y t, que
// es la edad de este enemigo
Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0 };


Enemy.prototype.step = function(dt) {
    // Actualizamos la edad
    this.t += dt;

    // El patr�n de movimiento lo dictan las ecuaciones que se utilizar�n
    // para calcular las componentes x e y de su velocidad: vx e vy:
    
    // vx tiene una componente constante A, y otra que va variando
    // c�clicamente en funci�n de la edad del enemigo (t), seg�n la
    // sinuisoide definida por las constantes B, C y D.
    // A: componente constante de la velocidad horizontal
    // B: fuerza de la velocidad horizontal sinusoidal
    // C: periodo de la velocidad horizontal sinusoidal
    // D: desplazamiento en el tiempo de la velocidad horizontal sinusoidal
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);

    // vy tiene una componente constante E, y otra que va variando
    // c�clicamente en funci�n de la edad del enemigo (t), seg�n la
    // sinuisoide definida por las constantes F, G y H.
    // E: componente constante de la velocidad vertical
    // F: fuerza de la velocidad vertical sinusoidal
    // G: periodo de la velocidad vertical sinusoidal
    // H: desplazamiento en el tiempo de la velocidad vertical sinusoidal
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.y > Game.height ||
       this.x < -this.w ||
       this.x > Game.width) {
	this.board.remove(this);
    }
}


$(function() {
    Game.initialize("game",sprites,startGame);
});

