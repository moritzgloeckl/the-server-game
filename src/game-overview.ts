module MyGame {

	export class GameOverView extends Phaser.State {


		create() {
			this.world.setBounds(0,0,800,600);

			var bar = this.game.add.graphics();
			bar.beginFill(0xFFFFFF, 0.2);
			bar.drawRect(0, 100, 800, 100);

			var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

			let text = this.game.add.text(0, 0, "Game over!", style);
			text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text.setTextBounds(0, 100, 800, 100);
			let button = this.game.add.button(this.game.world.centerX, 550, "startbuttons", this.startOver, this, 2, 1, 0)
			button.anchor.set(0.5);
		}

		startOver() {
			location.reload();
		}

		update() {
		}
	}
} 