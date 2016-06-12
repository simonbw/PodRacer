import './core/Polyfills';
import * as Pixi from 'pixi.js';
import FPSMeter from './util/FPSMeter';
import Game from './core/Game.js';
import Ground from './environment/Ground';
import MainMenu from './menu/MainMenu';


window.onload = () => {
  console.log('loading...');
  Pixi.loader
    .add('images/ground.jpg')
    .load(() => {
      const game = new Game();
      game.addEntity(new FPSMeter());
      game.addEntity(new MainMenu());
      game.addEntity(new Ground());
      game.start();

      window.DEBUG = {
        game: game
      };
    });
};
