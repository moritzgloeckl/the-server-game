module MyGame {

	export class FacingGuard extends Phaser.Sprite {

		counter: number = 1;
		shootView: ShootView;
		timerEvent: Phaser.TimerEvent;

		constructor(game: Phaser.Game, shootView: ShootView, x: number, y: number) {
			super(game, x, y, 'facingGuard', 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);

			this.game.add.tween(this.scale).to( { x: this.counter+1, y: this.counter+1 }, 2000, Phaser.Easing.Linear.None, true);

			this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, this.updateSize, this);
			this.shootView = shootView;
		}

		updateSize() {
			if (this.alive) {
				this.game.add.tween(this.scale).to( { x: this.counter+1, y: this.counter+1 }, 2000, Phaser.Easing.Linear.None, true);
				this.counter++;
				if (this.counter == 6) {
					this.game.time.events.remove(this.timerEvent);
					this.shootView.gameOver();
				}
			}
		}

		update() {
			
		}
	}
}