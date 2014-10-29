/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/


describe("PayerMissileSpec", function () {

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

    it("GameBoard.add(Misiles)", function () {

              Game.initialize("game", sprites, function () { });
              var object = new PlayerShip();
              foo.add(object);        //A�adimos el elemento object al GameBoard
              expect(object.board).toBe(foo); //Comprobamos que tenemos el objeto.          
               Game.keys['fire'] = true; 
               spyOn(foo, 'add');
               Dummy1 = new PlayerMissile(object.x, object.y + object.h / 2);
               Dummy2 = new PlayerMissile(object.x + object.w, object.y + object.h / 2);
               object.step(1);
               expect(foo.add).toHaveBeenCalledWith(Dummy1);
               expect(foo.add).toHaveBeenCalledWith(Dummy2);
                
           }); 
     
 
       it("Avance de Misiles",function(){ 
               Game.initialize("game",sprites,function(){}); 
         
 
              
               Dummy1 = new PlayerMissile(200,400); 
               foo.add(Dummy1);
               foo.resetRemoved();
               Dummy1.step(1);
               expect(Dummy1.x).toBe(199);
               expect(Dummy1.y).toBe(-310);
           }); 
        
       it("Probando el tiro espaciado",function(){ 
         
               Game.initialize("game",sprites,function(){});              
               var object = new PlayerShip();
               foo.add(object);                
               Game.keys['fire'] = true; 
               object.step(1);
               expect(foo.objects.length).toBe(5); 
               object.step(100);
               expect(foo.objects.length).toBe(5);
               Game.keys['fire'] = false; 
               object.step(1);
               Game.keys['fire'] = true; 
               object.step(1);
               expect(foo.objects.length).toBe(7);
           }); 
});

