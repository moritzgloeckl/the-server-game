module MyGame {

	export class WinGameView extends Phaser.State {

		timeToComplete: number = 0;
		titleText: Phaser.Text;

		create() {
			this.world.setBounds(0,0,800,600);
			
			if (this.timeToComplete == 0) {
				this.timeToComplete = Math.round(this.game.time.totalElapsedSeconds());
			}

			var bar = this.game.add.graphics();
			bar.beginFill(0xFFFFFF, 0.2);
			bar.drawRect(0, 70, 800, 70);

			var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

			this.titleText = this.game.add.text(0, 0, "You won! Score: " + this.timeToComplete, style);
			this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			this.titleText.setTextBounds(0, 70, 800, 70);
		}
	} 
}