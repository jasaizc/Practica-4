/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
           Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
 Ejemplo:
         [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/
describe("Clase LevelSpec", function () {
    var canvas, ctx;
    beforeEach(function () {
        loadFixtures('index.html');
        canvas = $('#game')[0];
        expect(canvas).toExist();
        ctx = canvas.getContext('2d');
        expect(ctx).toBeDefined();
        oldGame = Game;
        SpriteSheet = {
            map: {
                ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
                missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
                enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
                fireball: { sx: 191, sy: 0, w: 32, h: 25, frames: 1 },
                explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
            },
        };
    });
    it("Nuevo Nivel",function(){ 
         var level1 = [
                         [0, 4000, 500, 'step'],
                         [6000, 13000, 800, 'ltr'],
                         [10000, 16000, 400, 'circle'],
         		]; 
         		var nuevoNivel = new Level(level1, winGame); 
         		expect(nuevoNivel.levelData.length).toEqual(3);
         		expect(nuevoNivel.callback).toBe(winGame);
         	}); 
    it("Pasar Nivel", function () {
        var foo_GameBoard = new GameBoard();
        var level1 = [
                         [0, 4000, 500, 'step'],
                         [6000, 13000, 800, 'ltr'],
                         [10000, 16000, 400, 'circle'],
        ];
        var nuevoNivel = new Level(level1, winGame);
        foo_GameBoard.add(nuevoNivel);
        spyOn(nuevoNivel, "callback");
        nuevoNivel.board.cnt[OBJECT_ENEMY] = 0;
        nuevoNivel.step(26);
        expect(nuevoNivel.callback).toHaveBeenCalled();
    });

})


