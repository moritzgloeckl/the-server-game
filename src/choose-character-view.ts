module MyGame {

	export class ChooseCharacterView extends Phaser.State {

		map: Phaser.Tilemap;
		layer: Phaser.TilemapLayer;
		player: Phaser.Sprite;
		skeleton: Phaser.Sprite;
		flashlight: Phaser.Sprite;

		create() {
			this.physics.startSystem(Phaser.Physics.ARCADE);
			this.world.setBounds(0,0,800,600);
			this.map = this.add.tilemap('tutorialTilemap', 32, 32);
			this.map.addTilesetImage('theserver', 'tiles');
			this.layer = this.map.createLayer('Tile Layer 1');
			this.player = this.game.add.sprite(this.game.world.centerX,500,"sphere");
			this.physics.enable(this.player, Phaser.Physics.ARCADE);
			this.player.body.collideWorldBounds = true;
			this.physics.arcade.gravity.y = 1000;

			this.skeleton = this.game.add.sprite(650, 105, "skeleton", 18);
			this.flashlight = this.game.add.sprite(95, 97, "simon", 18);

			this.map.setCollision([461,462,463,146,147,181,182,71,72,106,107,143,178,179]);
		}

		update() {
			this.physics.arcade.collide(this.player, this.layer);
			this.physics.arcade.collide(this.player, this.world);

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
				this.player.body.velocity.y = -600;
			} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				this.player.body.velocity.x = -350;
			} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				this.player.body.velocity.x = 350;
			} else {
				this.player.body.velocity.x *= 0.8;
			}

			if (this.player.overlap(this.skeleton)) {
				localStorage.setItem('skin',"skeleton");
				this.game.state.start('MainView', true, false);
			} else if (this.player.overlap(this.flashlight)) {
				localStorage.setItem('skin',"simon");
				this.game.state.start('MainView', true, false);
			}
		}		

	}
}