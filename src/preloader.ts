module MyGame {

	export class Preloader extends Phaser.State {

		preloadBar: Phaser.Sprite;
		background: Phaser.Sprite;
		ready: boolean = false;

		preload() {
			this.preloadBar = this.add.sprite(300, 400, 'preloadBar');
			this.load.setPreloadSprite(this.preloadBar);

			this.load.image('titlepage', 'assets/titlepage.jpg');
			this.load.image('logo', 'assets/logo.png');
			this.load.image('datacentre', 'assets/data_centre.png');
			this.load.image('sphere', 'assets/sphere.png');

			this.load.spritesheet('simon', 'assets/player.png', 64, 64, 36);
			this.load.spritesheet('skeleton', 'assets/skeleton.png', 64, 64, 36);
			this.load.spritesheet('guard', 'assets/guard.png', 64, 64, 36); 
			this.load.spritesheet('crosshairs', 'assets/crosshairs.png', 64, 64, 1); 
			this.load.spritesheet('facingGuard', 'assets/facing_guard.png', 138, 261, 1); 
			this.load.spritesheet('startbuttons', 'assets/startbuttons.png', 193, 71); 

			this.load.tilemap('mainViewTilemap', 'assets/theservermap.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.tilemap('tutorialTilemap', 'assets/tutorialmap.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.image('tiles', 'assets/theservertiles.png');

			this.load.audio('music', 'assets/music.ogg');
			this.load.audio('shutdown', 'assets/shutdown.ogg');
			this.load.audio('shot', 'assets/shot.ogg');
		}

		create() {
			this.game.state.start('MainMenu', true, false);
		}
	}
}