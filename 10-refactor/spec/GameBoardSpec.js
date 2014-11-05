/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/


describe("GameBoardSpec", function () {


    beforeEach(function () {
        loadFixtures('index.html');
        canvas = $('#game')[0];
        expect(canvas).toExist();
        ctx = canvas.getContext('2d');
        expect(ctx).toBeDefined();
        oldGame = Game;
    });

    afterEach(function () {
        Game = oldGame;
    });

    var foo = new GameBoard();

    it("GameBoard.add", function () {
        var object = {};
        foo.add(object);        //Añadimos el elemento object al GameBoard
        expect(object.board).toBe(foo); //Comprobamos que tenemos el objeto.
    });
    it("GameBoard.overlap", function () {
        var dummy1 = { sx: 0, sy: 0, w: 1, h: 1};
        var dummy2 = { sx: 10, sy: 10, w: 1, h: 1};
        foo.overlap(dummy1, dummy2);            //Comprobamos donde esta el dummy1 respecto al dummy2
        expect(foo.overlap(dummy1, dummy2)).toBe(dummy1.sx < dummy2.sx);    //Confirmamos que el dummy1 esta a la izquierda del dummy2
    });
    it("GameBoard.remove", function ()
    {
        var dummy1 = {};
        foo.add(dummy1);
        expect(foo.objects.indexOf(dummy1)).toBe(1); //Confirmamos que el objeto se a añadido a la lista
        foo.resetRemoved();                         //Inicializamos la lista de borrado
        foo.remove(dummy1);                        //Marcamos el objeto1 para borrarlo.
        expect(foo.objects.indexOf(dummy1)).toBe(1); //Aqui Todavia no hemos borrado el elemento
        foo.finalizeRemoved();                      //Una vez pasamos el finalizeRemove, nos desaparece de la lista el valor.
        expect(foo.objects.indexOf(dummy1)).toBe(-1);  //Comprobamos que la lista no tiene ningun elemento.
    });
    it("GameBoard.iterate", function () {
        var foo = new GameBoard();
        function Dummy() { this.prueba = function () { } };
        var o1 = new Dummy();
        var o2 = new Dummy();
        var o3 = new Dummy();
        spyOn(o1, "prueba");
        spyOn(o2, "prueba");
        spyOn(o3, "prueba");
        foo.add(o1);
        foo.add(o2);
        foo.add(o3);
        foo.iterate("prueba", 1);
        expect(o1.prueba).toHaveBeenCalledWith(1);
        expect(o2.prueba).toHaveBeenCalledWith(1);
        expect(o3.prueba).toHaveBeenCalledWith(1);
    });
   
});