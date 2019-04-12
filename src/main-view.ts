module MyGame {

	export class MainView extends Phaser.State {

		music: Phaser.Sound;
		player: MyGame.Player;
		map: Phaser.Tilemap;
		layer: Phaser.TilemapLayer;
		guards: Guard[] = [];
		skin = "simon";
		oldX: number;
		oldY: number;
		killGuards: number[] = [];
		shutDownServers: Phaser.Point[] = [];
		shutdownSound: Phaser.Sound;

		create() {
			this.skin = localStorage.getItem("skin");
			this.world.setBounds(0,0,1600,1600);
			this.physics.arcade.gravity.y = 0;
			this.map = this.add.tilemap('mainViewTilemap', 32, 32);
			this.map.addTilesetImage('theserver', 'tiles');
			this.layer = this.map.createLayer('Tile Layer 1');

			this.player = new Player(this.game, 1430, 1430, this.skin);
			
			this.guards = []; 
			this.guards.push(new Guard(this.game, this, 668, 231, 3, 0));
			this.guards.push(new Guard(this.game, this, 319, 954, 2, 1));
			this.guards.push(new Guard(this.game, this, 671, 1140, 2, 2));
			this.guards.push(new Guard(this.game, this, 476, 1460, 2, 3));
			this.guards.push(new Guard(this.game, this, 1092, 313, 3, 4));

			this.map.setCollisionByExclusion([310,311,345,346,380,381,312,347,382]);

			this.camera.follow(this.player);

			this.shutdownSound = this.game.add.audio("shutdown");

			if (this.oldX != null && this.oldY != null) {
				//Came back from ShootView

				this.player.x = this.oldX;
				this.player.y = this.oldY;

				for (let guardNumber of this.killGuards) {
					this.guards[guardNumber].destroy();
				}

				this.reShutdownServers();
			} else if (localStorage.getItem("save")) {
				this.loadFromSaveGame();
			}
		}

		guardTouch(guard: Guard) {
			this.oldX = this.player.x;
			this.oldY = this.player.y;
			if (this.killGuards.indexOf(guard.number) == -1) {
				this.killGuards.push(guard.number);
			}
			this.game.state.start('ShootView', true, false);
		}

		update() {
			this.physics.arcade.collide(this.player, this.layer);
			this.physics.arcade.collide(this.guards, this.layer);
			this.physics.arcade.collide(this.player, this.guards);

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				let where = this.checkForServer();
				if (where != null) {
					this.shutdownServer(where);
					this.saveGame();
				}
			}

			if (this.shutDownServers.length == 14) {
				this.game.state.start('WinGameView', true, false);
			}
		}

		// Checks if player is 1 block away from a server in all 4 directions
		checkForServer(): String {
			let surrounding = new Map<String, Boolean>();

			surrounding.set("top_bottom_left", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y)-1, this.layer).index == 106);
			surrounding.set("top_bottom_right", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y)-1, this.layer).index == 107);
			surrounding.set("left_bottom_left", this.map.getTile(this.layer.getTileX(this.player.x)+1, this.layer.getTileY(this.player.y), this.layer).index == 106);
			surrounding.set("right_bottom_right", this.map.getTile(this.layer.getTileX(this.player.x)-1, this.layer.getTileY(this.player.y), this.layer).index == 107);

			surrounding.set("top_top_left", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y)+1, this.layer).index == 71);
			surrounding.set("top_top_right", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y)+1, this.layer).index == 72);
			surrounding.set("left_top_left", this.map.getTile(this.layer.getTileX(this.player.x)+1, this.layer.getTileY(this.player.y), this.layer).index == 71);
			surrounding.set("right_top_right", this.map.getTile(this.layer.getTileX(this.player.x)-1, this.layer.getTileY(this.player.y), this.layer).index == 72);

			for(let key of Array.from(surrounding.keys())) {
				if (surrounding.get(key)) {
					return key;
				}
			}
			return null;
		}

		reShutdownServers() {
			for (let point of this.shutDownServers) {
				this.map.replace(71,141,point.x,point.y,1,1);
				this.map.replace(72,142,point.x+1,point.y,1,1);
				this.map.replace(106,176,point.x,point.y+1,1,1);
				this.map.replace(107,177,point.x+1,point.y+1,1,1);
			}
		}

		// Flash screen and replace server, increment server counter
		shutdownServer(where: String) {
			// We calculcate the left top tile position regardless of the players x,y
			let x = 0;
			let y = 0;
			
			this.shutdownSound.play();
			this.game.camera.flash(0x7df9ff, 250);

			if (where == "top_bottom_left") {
				x = this.layer.getTileX(this.player.x);
				y = this.layer.getTileY(this.player.y)-2;
			} else if (where == "top_bottom_right") {
				x = this.layer.getTileX(this.player.x)-1;
				y = this.layer.getTileY(this.player.y)-2;
			} else if (where == "left_bottom_left") {
				x = this.layer.getTileX(this.player.x)+1;
				y = this.layer.getTileY(this.player.y)-1;
			} else if (where == "right_bottom_right") {
				x = this.layer.getTileX(this.player.x)-2;
				y = this.layer.getTileY(this.player.y)-1;
			} else if (where == "top_top_left") {
				x = this.layer.getTileX(this.player.x);
				y = this.layer.getTileY(this.player.y)+1;
			} else if (where == "top_top_right") {
				x = this.layer.getTileX(this.player.x)-1;
				y = this.layer.getTileY(this.player.y)+1;
			} else if (where == "left_top_left") {
				x = this.layer.getTileX(this.player.x)+1;
				y = this.layer.getTileY(this.player.y);
			} else if (where == "right_top_right") {
				x = this.layer.getTileX(this.player.x)-2;
				y = this.layer.getTileY(this.player.y);
			}

			this.shutDownServers.push(new Phaser.Point(x,y));
			
			this.map.replace(71,141,x,y,1,1);
			this.map.replace(72,142,x+1,y,1,1);
			this.map.replace(106,176,x,y+1,1,1);
			this.map.replace(107,177,x+1,y+1,1,1);
		}

		private loadFromSaveGame() {
			var save: any = JSON.parse(localStorage.getItem("save"));
			this.skin = <string>save.player.skin;
			this.player.x = <number>save.player.x;
			this.player.y = <number>save.player.y;
			this.player.direction = <number>save.player.direction;
			this.shutDownServers = <Phaser.Point[]>save.servers;
			this.reShutdownServers();

			for (let guard of this.guards) {
				guard.x = save.guards[guard.number].x;
				guard.y = save.guards[guard.number].y;
				guard.direction = save.guards[guard.number].direction;
				if (!save.guards[guard.number].alive) {
					guard.destroy();
					this.killGuards.push(guard.number);
				}
			}
		}

		private saveGame() {
			var save: any = {};
			var saveGuards: any[] = [];
			
			for (let guard of this.guards) {
				saveGuards.push(<any>{x: guard.x, y: guard.y, direction: guard.direction, alive: guard.visible});
			}
			save["guards"] = saveGuards;
			save["player"] = {x: this.player.x, y: this.player.y, skin: this.skin, direction: this.player.direction};
			save["servers"] = this.shutDownServers;

			localStorage.setItem("save", JSON.stringify(save));
		}
	}
} 