module MyGame {

	export class ShootView extends Phaser.State {

		crosshairs: Phaser.Sprite;
		guards: Phaser.Group;
		waves: number[] = [1,2,3,5,8,10,15];
		wave: number = 1;
		health: number = 10;
		shotSound: Phaser.Sound;

		create() {
			this.world.setBounds(0,0,750,550);
			this.add.sprite(0, 0, 'datacentre');

			this.game.input.mouse.capture = true;
			this.guards = this.game.add.group();

			this.waves = [1,2,3,5,8,10,15];
			this.wave = 1;
			this.health = 10;

			this.guards.add(new FacingGuard(this.game, this, this.game.world.centerX, this.game.world.centerY-200));

			this.crosshairs = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "crosshairs");
			this.crosshairs.anchor.setTo(0.5, 0.5);
			this.shotSound = this.game.add.audio("shot");
		}

		gameOver() {
			this.game.state.start('GameOverView', true, false);
		}

		goBack() {
			this.game.state.start('MainView', false, false);
		}

		update() {
			this.crosshairs.x = this.game.input.mousePointer.x;
			this.crosshairs.y = this.game.input.mousePointer.y;

			this.guards.forEachAlive((guard: FacingGuard) => {
				if (this.game.input.activePointer.leftButton.isDown) {
					this.shotSound.play();
					if (Phaser.Rectangle.intersects(<any>this.crosshairs.getBounds(), <any>guard.getBounds())) {
						guard.kill();
						this.game.camera.flash(0xffffff, 250);
					}
				}
			});

			if (this.guards.countLiving() == 0) {
				this.wave++;
				if (this.wave == 8) {
					this.goBack();
				}
				for (var i = 0; i < this.waves[this.wave-1]; i++) {
					this.guards.add(new FacingGuard(this.game, this, this.game.world.randomX, this.game.world.randomY));
				}
			}


		}
	}
} 