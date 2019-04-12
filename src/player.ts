module MyGame {

	export class Player extends Phaser.Sprite {

		// UP = 1
		// RIGHT = 2
		// DOWN = 3
		// LEFT = 4

		public direction: number = 1;

		constructor(game: Phaser.Game, x: number, y: number, skin: string) {
			super(game, x, y, skin, 0);
			this.game.physics.arcade.enable(this);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			this.body.setSize(30,49,17,12);
			this.animations.add('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 25, true);
			this.animations.add('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 25, true);
			this.animations.add('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 25, true);
			this.animations.add('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35], 25, true);
		}

		update() {
			this.body.velocity.set(0);

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
			{
				this.body.velocity.y = -220;
				this.animations.play('walk_up');
				this.direction = 1;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
			{
				this.body.velocity.y = 220;
				this.animations.play('walk_down');
				this.direction = 3;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
			{
				this.body.velocity.x = -220;
				this.animations.play('walk_left');
				this.direction = 4;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
			{
				this.body.velocity.x = 220;
				this.animations.play('walk_right');
				this.direction = 2;
			}
			else {
				if (this.direction == 1) {
					this.animations.frame = 0;
				} else if (this.direction == 2) {
					this.animations.frame = 27;
				} else if (this.direction == 3) {
					this.animations.frame = 18;
				} else if (this.direction == 4)  {
					this.animations.frame = 9;
				}
			}
		}
	}

}