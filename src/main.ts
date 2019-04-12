/// <reference path="../lib/typings/phaser.d.ts"/>

module MyGame {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('MainView', MainView, false);
            this.state.add('ShootView', ShootView, false);
            this.state.add('WinGameView', WinGameView, false);
            this.state.add('GameOverView', GameOverView, false);
            this.state.add('ChooseCharacterView', ChooseCharacterView, false);

            this.state.start('Boot');
        }
    }
}

window.onload = () => {
    const game = new MyGame.Game();
}