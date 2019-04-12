module MyGame {

	export class Guard extends Phaser.Sprite {

		// UP = 1
		// RIGHT = 2
		// DOWN = 3
		// LEFT = 4

		mainView: MainView;
		walls: number[] = [310,311,312,345,346,347,380,381,382];
		direction: number = 1;
		graphics: Phaser.Graphics;
		number: number;

		constructor(game: Phaser.Game, mainView: MainView, x: number, y: number, direction: number, number: number) {
			super(game, x, y, 'guard', 0);
			this.number = number;
			this.mainView = mainView;
			this.game.physics.arcade.enable(this);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);

			this.direction = direction;
			this.graphics = this.game.add.graphics();
			this.graphics.boundsPadding = 0;

			this.body.setSize(32,48,16,15);
			this.animations.add('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 25, true);
			this.animations.add('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 25, true);
			this.animations.add('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 25, true);
			this.animations.add('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35], 25, true);
		}

		drawFlashlight() {
			var lightAngle = 120 * (Math.PI / 180);
			var numberOfRays = 30;
			var rayLength = 70;

			var directionAngle = this.direction * 90 * (Math.PI / 180);//Math.atan2(this.y-this.game.input.y,this.x-this.game.input.x);

			this.graphics.clear();
			this.graphics.alpha = 0.3;
			this.graphics.lineStyle(2, 0xffffd0, 1);
			this.graphics.beginFill(0xffffd0);
			this.graphics.moveTo(this.x, this.y);
			for(var i = 0; i<numberOfRays; i++){	
				var rayAngle = directionAngle-(lightAngle/2)+(lightAngle/numberOfRays)*i
				var lastX = this.x;
				var lastY = this.y;
				for(var j = 1; j<=rayLength; j+=1){
					var landingX = Math.round(this.x-(2*j)*Math.cos(rayAngle));
					var landingY = Math.round(this.y-(2*j)*Math.sin(rayAngle));

					if(this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(landingX), this.mainView.layer.getTileY(landingY), this.mainView.layer).index) != -1){
						lastX = landingX;
						lastY = landingY;

						let t_playerX = this.mainView.player.x-16;
						let t_playerY = this.mainView.player.y-16;
						let b_playerX = this.mainView.player.x+16;
						let b_playerY = this.mainView.player.y+16;

						if (t_playerX <= lastX && lastX <= b_playerX && t_playerY <= lastY && lastY <= b_playerY) {
							this.mainView.guardTouch(this);
						}

					} else {
						this.graphics.lineTo(lastX,lastY);
						break;
					}
				}

				this.graphics.lineTo(lastX,lastY);
			}
			this.graphics.lineTo(this.x, this.y); 
			this.graphics.endFill();	
		}

		update() {
			this.drawFlashlight();

			let wall = false;

			if (this.direction == 1 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x), this.mainView.layer.getTileY(this.y)-1, this.mainView.layer).index) == -1) {
				wall = true;
			} else if (this.direction == 3 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x), this.mainView.layer.getTileY(this.y)+1, this.mainView.layer).index) == -1) {
				wall = true;
			} else if (this.direction == 4 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x)-1, this.mainView.layer.getTileY(this.y), this.mainView.layer).index) == -1) {
				wall = true;
			} else if (this.direction == 2 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x)+1, this.mainView.layer.getTileY(this.y), this.mainView.layer).index) == -1) {
				wall = true;
			}

			if (wall) {
				this.body.velocity.set(0);
				let newDirection = this.direction;
				while (newDirection == this.direction) {
					newDirection = Math.floor(Math.random() * 4) + 1;
				}
				this.direction = newDirection;
			}

			if (this.direction == 1) { //UP
				this.animations.play('walk_up');
				this.body.velocity.y = -60;
				this.body.velocity.x = 0;
			} else if (this.direction == 2) { //RIGHT
				this.animations.play('walk_right');
				this.body.velocity.y = 0;
				this.body.velocity.x = 60;
			} else if (this.direction == 3) { //DOWN
				this.animations.play('walk_down');
				this.body.velocity.y = 60;
				this.body.velocity.x = 0;
			} else if (this.direction == 4) { //LEFT
				this.animations.play('walk_left');
				this.body.velocity.y = 0;
				this.body.velocity.x = -60;
			}
		}
	}
}