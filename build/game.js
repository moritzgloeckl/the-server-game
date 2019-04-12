var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyGame;
(function (MyGame) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.init = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
            }
            else {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1024, 768);
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
            }
        };
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            this.game.state.start('Preloader');
        };
        return Boot;
    }(Phaser.State));
    MyGame.Boot = Boot;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var ChooseCharacterView = (function (_super) {
        __extends(ChooseCharacterView, _super);
        function ChooseCharacterView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ChooseCharacterView.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.world.setBounds(0, 0, 800, 600);
            this.map = this.add.tilemap('tutorialTilemap', 32, 32);
            this.map.addTilesetImage('theserver', 'tiles');
            this.layer = this.map.createLayer('Tile Layer 1');
            this.player = this.game.add.sprite(this.game.world.centerX, 500, "sphere");
            this.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.collideWorldBounds = true;
            this.physics.arcade.gravity.y = 1000;
            this.skeleton = this.game.add.sprite(650, 105, "skeleton", 18);
            this.flashlight = this.game.add.sprite(95, 97, "simon", 18);
            this.map.setCollision([461, 462, 463, 146, 147, 181, 182, 71, 72, 106, 107, 143, 178, 179]);
        };
        ChooseCharacterView.prototype.update = function () {
            this.physics.arcade.collide(this.player, this.layer);
            this.physics.arcade.collide(this.player, this.world);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) && this.player.body.onFloor()) {
                this.player.body.velocity.y = -600;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.player.body.velocity.x = -350;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.player.body.velocity.x = 350;
            }
            else {
                this.player.body.velocity.x *= 0.8;
            }
            if (this.player.overlap(this.skeleton)) {
                localStorage.setItem('skin', "skeleton");
                this.game.state.start('MainView', true, false);
            }
            else if (this.player.overlap(this.flashlight)) {
                localStorage.setItem('skin', "simon");
                this.game.state.start('MainView', true, false);
            }
        };
        return ChooseCharacterView;
    }(Phaser.State));
    MyGame.ChooseCharacterView = ChooseCharacterView;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var FacingGuard = (function (_super) {
        __extends(FacingGuard, _super);
        function FacingGuard(game, shootView, x, y) {
            var _this = _super.call(this, game, x, y, 'facingGuard', 0) || this;
            _this.counter = 1;
            _this.anchor.setTo(0.5, 0.5);
            game.add.existing(_this);
            _this.game.add.tween(_this.scale).to({ x: _this.counter + 1, y: _this.counter + 1 }, 2000, Phaser.Easing.Linear.None, true);
            _this.timerEvent = game.time.events.loop(Phaser.Timer.SECOND, _this.updateSize, _this);
            _this.shootView = shootView;
            return _this;
        }
        FacingGuard.prototype.updateSize = function () {
            if (this.alive) {
                this.game.add.tween(this.scale).to({ x: this.counter + 1, y: this.counter + 1 }, 2000, Phaser.Easing.Linear.None, true);
                this.counter++;
                if (this.counter == 6) {
                    this.game.time.events.remove(this.timerEvent);
                    this.shootView.gameOver();
                }
            }
        };
        FacingGuard.prototype.update = function () {
        };
        return FacingGuard;
    }(Phaser.Sprite));
    MyGame.FacingGuard = FacingGuard;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var GameOverView = (function (_super) {
        __extends(GameOverView, _super);
        function GameOverView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameOverView.prototype.create = function () {
            this.world.setBounds(0, 0, 800, 600);
            var bar = this.game.add.graphics();
            bar.beginFill(0xFFFFFF, 0.2);
            bar.drawRect(0, 100, 800, 100);
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            var text = this.game.add.text(0, 0, "Game over!", style);
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text.setTextBounds(0, 100, 800, 100);
            var button = this.game.add.button(this.game.world.centerX, 550, "startbuttons", this.startOver, this, 2, 1, 0);
            button.anchor.set(0.5);
        };
        GameOverView.prototype.startOver = function () {
            location.reload();
        };
        GameOverView.prototype.update = function () {
        };
        return GameOverView;
    }(Phaser.State));
    MyGame.GameOverView = GameOverView;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Guard = (function (_super) {
        __extends(Guard, _super);
        function Guard(game, mainView, x, y, direction, number) {
            var _this = _super.call(this, game, x, y, 'guard', 0) || this;
            _this.walls = [310, 311, 312, 345, 346, 347, 380, 381, 382];
            _this.direction = 1;
            _this.number = number;
            _this.mainView = mainView;
            _this.game.physics.arcade.enable(_this);
            _this.anchor.setTo(0.5, 0.5);
            game.add.existing(_this);
            _this.direction = direction;
            _this.graphics = _this.game.add.graphics();
            _this.graphics.boundsPadding = 0;
            _this.body.setSize(32, 48, 16, 15);
            _this.animations.add('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 25, true);
            _this.animations.add('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 25, true);
            _this.animations.add('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 25, true);
            _this.animations.add('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35], 25, true);
            return _this;
        }
        Guard.prototype.drawFlashlight = function () {
            var lightAngle = 120 * (Math.PI / 180);
            var numberOfRays = 30;
            var rayLength = 70;
            var directionAngle = this.direction * 90 * (Math.PI / 180);
            this.graphics.clear();
            this.graphics.alpha = 0.3;
            this.graphics.lineStyle(2, 0xffffd0, 1);
            this.graphics.beginFill(0xffffd0);
            this.graphics.moveTo(this.x, this.y);
            for (var i = 0; i < numberOfRays; i++) {
                var rayAngle = directionAngle - (lightAngle / 2) + (lightAngle / numberOfRays) * i;
                var lastX = this.x;
                var lastY = this.y;
                for (var j = 1; j <= rayLength; j += 1) {
                    var landingX = Math.round(this.x - (2 * j) * Math.cos(rayAngle));
                    var landingY = Math.round(this.y - (2 * j) * Math.sin(rayAngle));
                    if (this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(landingX), this.mainView.layer.getTileY(landingY), this.mainView.layer).index) != -1) {
                        lastX = landingX;
                        lastY = landingY;
                        var t_playerX = this.mainView.player.x - 16;
                        var t_playerY = this.mainView.player.y - 16;
                        var b_playerX = this.mainView.player.x + 16;
                        var b_playerY = this.mainView.player.y + 16;
                        if (t_playerX <= lastX && lastX <= b_playerX && t_playerY <= lastY && lastY <= b_playerY) {
                            this.mainView.guardTouch(this);
                        }
                    }
                    else {
                        this.graphics.lineTo(lastX, lastY);
                        break;
                    }
                }
                this.graphics.lineTo(lastX, lastY);
            }
            this.graphics.lineTo(this.x, this.y);
            this.graphics.endFill();
        };
        Guard.prototype.update = function () {
            this.drawFlashlight();
            var wall = false;
            if (this.direction == 1 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x), this.mainView.layer.getTileY(this.y) - 1, this.mainView.layer).index) == -1) {
                wall = true;
            }
            else if (this.direction == 3 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x), this.mainView.layer.getTileY(this.y) + 1, this.mainView.layer).index) == -1) {
                wall = true;
            }
            else if (this.direction == 4 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x) - 1, this.mainView.layer.getTileY(this.y), this.mainView.layer).index) == -1) {
                wall = true;
            }
            else if (this.direction == 2 && this.walls.indexOf(this.mainView.map.getTile(this.mainView.layer.getTileX(this.x) + 1, this.mainView.layer.getTileY(this.y), this.mainView.layer).index) == -1) {
                wall = true;
            }
            if (wall) {
                this.body.velocity.set(0);
                var newDirection = this.direction;
                while (newDirection == this.direction) {
                    newDirection = Math.floor(Math.random() * 4) + 1;
                }
                this.direction = newDirection;
            }
            if (this.direction == 1) {
                this.animations.play('walk_up');
                this.body.velocity.y = -60;
                this.body.velocity.x = 0;
            }
            else if (this.direction == 2) {
                this.animations.play('walk_right');
                this.body.velocity.y = 0;
                this.body.velocity.x = 60;
            }
            else if (this.direction == 3) {
                this.animations.play('walk_down');
                this.body.velocity.y = 60;
                this.body.velocity.x = 0;
            }
            else if (this.direction == 4) {
                this.animations.play('walk_left');
                this.body.velocity.y = 0;
                this.body.velocity.x = -60;
            }
        };
        return Guard;
    }(Phaser.Sprite));
    MyGame.Guard = Guard;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('ChooseCharacterView', true, false);
        };
        return MainMenu;
    }(Phaser.State));
    MyGame.MainMenu = MainMenu;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.guards = [];
            _this.skin = "simon";
            _this.killGuards = [];
            _this.shutDownServers = [];
            return _this;
        }
        MainView.prototype.create = function () {
            this.skin = localStorage.getItem("skin");
            this.world.setBounds(0, 0, 1600, 1600);
            this.physics.arcade.gravity.y = 0;
            this.map = this.add.tilemap('mainViewTilemap', 32, 32);
            this.map.addTilesetImage('theserver', 'tiles');
            this.layer = this.map.createLayer('Tile Layer 1');
            this.player = new MyGame.Player(this.game, 1430, 1430, this.skin);
            this.guards = [];
            this.guards.push(new MyGame.Guard(this.game, this, 668, 231, 3, 0));
            this.guards.push(new MyGame.Guard(this.game, this, 319, 954, 2, 1));
            this.guards.push(new MyGame.Guard(this.game, this, 671, 1140, 2, 2));
            this.guards.push(new MyGame.Guard(this.game, this, 476, 1460, 2, 3));
            this.guards.push(new MyGame.Guard(this.game, this, 1092, 313, 3, 4));
            this.map.setCollisionByExclusion([310, 311, 345, 346, 380, 381, 312, 347, 382]);
            this.camera.follow(this.player);
            this.shutdownSound = this.game.add.audio("shutdown");
            if (this.oldX != null && this.oldY != null) {
                this.player.x = this.oldX;
                this.player.y = this.oldY;
                for (var _i = 0, _a = this.killGuards; _i < _a.length; _i++) {
                    var guardNumber = _a[_i];
                    this.guards[guardNumber].destroy();
                }
                this.reShutdownServers();
            }
            else if (localStorage.getItem("save")) {
                this.loadFromSaveGame();
            }
        };
        MainView.prototype.guardTouch = function (guard) {
            this.oldX = this.player.x;
            this.oldY = this.player.y;
            if (this.killGuards.indexOf(guard.number) == -1) {
                this.killGuards.push(guard.number);
            }
            this.game.state.start('ShootView', true, false);
        };
        MainView.prototype.update = function () {
            this.physics.arcade.collide(this.player, this.layer);
            this.physics.arcade.collide(this.guards, this.layer);
            this.physics.arcade.collide(this.player, this.guards);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                var where = this.checkForServer();
                if (where != null) {
                    this.shutdownServer(where);
                    this.saveGame();
                }
            }
            if (this.shutDownServers.length == 14) {
                this.game.state.start('WinGameView', true, false);
            }
        };
        MainView.prototype.checkForServer = function () {
            var surrounding = new Map();
            surrounding.set("top_bottom_left", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y) - 1, this.layer).index == 106);
            surrounding.set("top_bottom_right", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y) - 1, this.layer).index == 107);
            surrounding.set("left_bottom_left", this.map.getTile(this.layer.getTileX(this.player.x) + 1, this.layer.getTileY(this.player.y), this.layer).index == 106);
            surrounding.set("right_bottom_right", this.map.getTile(this.layer.getTileX(this.player.x) - 1, this.layer.getTileY(this.player.y), this.layer).index == 107);
            surrounding.set("top_top_left", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y) + 1, this.layer).index == 71);
            surrounding.set("top_top_right", this.map.getTile(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y) + 1, this.layer).index == 72);
            surrounding.set("left_top_left", this.map.getTile(this.layer.getTileX(this.player.x) + 1, this.layer.getTileY(this.player.y), this.layer).index == 71);
            surrounding.set("right_top_right", this.map.getTile(this.layer.getTileX(this.player.x) - 1, this.layer.getTileY(this.player.y), this.layer).index == 72);
            for (var _i = 0, _a = Array.from(surrounding.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                if (surrounding.get(key)) {
                    return key;
                }
            }
            return null;
        };
        MainView.prototype.reShutdownServers = function () {
            for (var _i = 0, _a = this.shutDownServers; _i < _a.length; _i++) {
                var point = _a[_i];
                this.map.replace(71, 141, point.x, point.y, 1, 1);
                this.map.replace(72, 142, point.x + 1, point.y, 1, 1);
                this.map.replace(106, 176, point.x, point.y + 1, 1, 1);
                this.map.replace(107, 177, point.x + 1, point.y + 1, 1, 1);
            }
        };
        MainView.prototype.shutdownServer = function (where) {
            var x = 0;
            var y = 0;
            this.shutdownSound.play();
            this.game.camera.flash(0x7df9ff, 250);
            if (where == "top_bottom_left") {
                x = this.layer.getTileX(this.player.x);
                y = this.layer.getTileY(this.player.y) - 2;
            }
            else if (where == "top_bottom_right") {
                x = this.layer.getTileX(this.player.x) - 1;
                y = this.layer.getTileY(this.player.y) - 2;
            }
            else if (where == "left_bottom_left") {
                x = this.layer.getTileX(this.player.x) + 1;
                y = this.layer.getTileY(this.player.y) - 1;
            }
            else if (where == "right_bottom_right") {
                x = this.layer.getTileX(this.player.x) - 2;
                y = this.layer.getTileY(this.player.y) - 1;
            }
            else if (where == "top_top_left") {
                x = this.layer.getTileX(this.player.x);
                y = this.layer.getTileY(this.player.y) + 1;
            }
            else if (where == "top_top_right") {
                x = this.layer.getTileX(this.player.x) - 1;
                y = this.layer.getTileY(this.player.y) + 1;
            }
            else if (where == "left_top_left") {
                x = this.layer.getTileX(this.player.x) + 1;
                y = this.layer.getTileY(this.player.y);
            }
            else if (where == "right_top_right") {
                x = this.layer.getTileX(this.player.x) - 2;
                y = this.layer.getTileY(this.player.y);
            }
            this.shutDownServers.push(new Phaser.Point(x, y));
            this.map.replace(71, 141, x, y, 1, 1);
            this.map.replace(72, 142, x + 1, y, 1, 1);
            this.map.replace(106, 176, x, y + 1, 1, 1);
            this.map.replace(107, 177, x + 1, y + 1, 1, 1);
        };
        MainView.prototype.loadFromSaveGame = function () {
            var save = JSON.parse(localStorage.getItem("save"));
            this.skin = save.player.skin;
            this.player.x = save.player.x;
            this.player.y = save.player.y;
            this.player.direction = save.player.direction;
            this.shutDownServers = save.servers;
            this.reShutdownServers();
            for (var _i = 0, _a = this.guards; _i < _a.length; _i++) {
                var guard = _a[_i];
                guard.x = save.guards[guard.number].x;
                guard.y = save.guards[guard.number].y;
                guard.direction = save.guards[guard.number].direction;
                if (!save.guards[guard.number].alive) {
                    guard.destroy();
                    this.killGuards.push(guard.number);
                }
            }
        };
        MainView.prototype.saveGame = function () {
            var save = {};
            var saveGuards = [];
            for (var _i = 0, _a = this.guards; _i < _a.length; _i++) {
                var guard = _a[_i];
                saveGuards.push({ x: guard.x, y: guard.y, direction: guard.direction, alive: guard.visible });
            }
            save["guards"] = saveGuards;
            save["player"] = { x: this.player.x, y: this.player.y, skin: this.skin, direction: this.player.direction };
            save["servers"] = this.shutDownServers;
            localStorage.setItem("save", JSON.stringify(save));
        };
        return MainView;
    }(Phaser.State));
    MyGame.MainView = MainView;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 800, 600, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', MyGame.Boot, false);
            _this.state.add('Preloader', MyGame.Preloader, false);
            _this.state.add('MainMenu', MyGame.MainMenu, false);
            _this.state.add('MainView', MyGame.MainView, false);
            _this.state.add('ShootView', MyGame.ShootView, false);
            _this.state.add('WinGameView', MyGame.WinGameView, false);
            _this.state.add('GameOverView', MyGame.GameOverView, false);
            _this.state.add('ChooseCharacterView', MyGame.ChooseCharacterView, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    MyGame.Game = Game;
})(MyGame || (MyGame = {}));
window.onload = function () {
    var game = new MyGame.Game();
};
var MyGame;
(function (MyGame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, skin) {
            var _this = _super.call(this, game, x, y, skin, 0) || this;
            _this.direction = 1;
            _this.game.physics.arcade.enable(_this);
            _this.anchor.setTo(0.5, 0.5);
            game.add.existing(_this);
            _this.body.setSize(30, 49, 17, 12);
            _this.animations.add('walk_up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 25, true);
            _this.animations.add('walk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 25, true);
            _this.animations.add('walk_down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 25, true);
            _this.animations.add('walk_right', [27, 28, 29, 30, 31, 32, 33, 34, 35], 25, true);
            return _this;
        }
        Player.prototype.update = function () {
            this.body.velocity.set(0);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                this.body.velocity.y = -220;
                this.animations.play('walk_up');
                this.direction = 1;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                this.body.velocity.y = 220;
                this.animations.play('walk_down');
                this.direction = 3;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.body.velocity.x = -220;
                this.animations.play('walk_left');
                this.direction = 4;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.body.velocity.x = 220;
                this.animations.play('walk_right');
                this.direction = 2;
            }
            else {
                if (this.direction == 1) {
                    this.animations.frame = 0;
                }
                else if (this.direction == 2) {
                    this.animations.frame = 27;
                }
                else if (this.direction == 3) {
                    this.animations.frame = 18;
                }
                else if (this.direction == 4) {
                    this.animations.frame = 9;
                }
            }
        };
        return Player;
    }(Phaser.Sprite));
    MyGame.Player = Player;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ready = false;
            return _this;
        }
        Preloader.prototype.preload = function () {
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
        };
        Preloader.prototype.create = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    }(Phaser.State));
    MyGame.Preloader = Preloader;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var ShootView = (function (_super) {
        __extends(ShootView, _super);
        function ShootView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.waves = [1, 2, 3, 5, 8, 10, 15];
            _this.wave = 1;
            _this.health = 10;
            return _this;
        }
        ShootView.prototype.create = function () {
            this.world.setBounds(0, 0, 750, 550);
            this.add.sprite(0, 0, 'datacentre');
            this.game.input.mouse.capture = true;
            this.guards = this.game.add.group();
            this.waves = [1, 2, 3, 5, 8, 10, 15];
            this.wave = 1;
            this.health = 10;
            this.guards.add(new MyGame.FacingGuard(this.game, this, this.game.world.centerX, this.game.world.centerY - 200));
            this.crosshairs = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "crosshairs");
            this.crosshairs.anchor.setTo(0.5, 0.5);
            this.shotSound = this.game.add.audio("shot");
        };
        ShootView.prototype.gameOver = function () {
            this.game.state.start('GameOverView', true, false);
        };
        ShootView.prototype.goBack = function () {
            this.game.state.start('MainView', false, false);
        };
        ShootView.prototype.update = function () {
            var _this = this;
            this.crosshairs.x = this.game.input.mousePointer.x;
            this.crosshairs.y = this.game.input.mousePointer.y;
            this.guards.forEachAlive(function (guard) {
                if (_this.game.input.activePointer.leftButton.isDown) {
                    _this.shotSound.play();
                    if (Phaser.Rectangle.intersects(_this.crosshairs.getBounds(), guard.getBounds())) {
                        guard.kill();
                        _this.game.camera.flash(0xffffff, 250);
                    }
                }
            });
            if (this.guards.countLiving() == 0) {
                this.wave++;
                if (this.wave == 8) {
                    this.goBack();
                }
                for (var i = 0; i < this.waves[this.wave - 1]; i++) {
                    this.guards.add(new MyGame.FacingGuard(this.game, this, this.game.world.randomX, this.game.world.randomY));
                }
            }
        };
        return ShootView;
    }(Phaser.State));
    MyGame.ShootView = ShootView;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var WinGameView = (function (_super) {
        __extends(WinGameView, _super);
        function WinGameView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.timeToComplete = 0;
            return _this;
        }
        WinGameView.prototype.create = function () {
            this.world.setBounds(0, 0, 800, 600);
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
        };
        return WinGameView;
    }(Phaser.State));
    MyGame.WinGameView = WinGameView;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=game.js.map