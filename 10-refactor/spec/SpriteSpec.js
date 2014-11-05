describe("Clase SpriteSpec", function(){ 
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
                     enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
                     enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
                     enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
                     explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
                 }, 
                 draw: function(){}, 
                 merge: function(){}, 
                 setup: function(){}, 
             }; 
         });
         it("Dibujar", function () {

             var foo= new Sprite(); 
             spyOn(SpriteSheet, "draw"); 
             foo.draw(ctx);
             expect(SpriteSheet.draw).toHaveBeenCalled(); 
        	 
     });  
         it("Proceso", function () {
     	 basic={ x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2 , E: 100 } 
         enemigo= new Enemy(basic);          
 	     spyOn(enemigo, "merge"); 
         enemigo.setup(basic.sprite) 
         expect(enemigo.merge).toHaveBeenCalled();   
     }); 
 }); 
