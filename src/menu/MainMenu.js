import ListMenu from './ListMenu';
import * as Pixi from 'pixi.js';
import Game from '../core/Game';
import MenuOption from './MenuOption';
import RacerDefs from '../racer/RacerDefs';
import Entity from '../core/Entity';
import Racer from '../racer/Racer';
import PlayerRacerController from '../racer/PlayerRacerController';
import MenuCameraController from '../MenuCameraController';
import RaceCameraController from '../RaceCameraController';
import NewGameMenu from './NewGameMenu';
import IO from '../core/IO';

export default class MainMenu extends ListMenu {
  setOptions() {
    this.options = [
      new MenuOption('New Game', 20, 180, () => {
        this.game.addEntity(new NewGameMenu());
        this.destroy();
      }),
      new MenuOption('Settings', 20, 280, () => {
        console.log('This should open a settings menu!');
      })
    ];
  }
}
