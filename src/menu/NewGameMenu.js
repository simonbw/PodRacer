import * as Pixi from 'pixi.js';
import * as RacerDefs from '../racer/RacerDefs';
import AIRacerController from '../racer/AIRacerController';
import Entity from '../core/Entity';
import Game from '../core/Game';
import IO from '../core/IO';
import ListMenu from './ListMenu';
import MainMenu from './MainMenu';
import MenuCameraController from '../MenuCameraController';
import MenuOption from './MenuOption';
import PauseController from '../core/PauseController';
import PlayerRacerController from '../racer/PlayerRacerController';
import Race from '../race/Race';
import RaceCameraController from '../RaceCameraController';
import Racer from '../racer/Racer';
import Wall from '../environment/Wall';


export default class NewGameMenu extends ListMenu {
  setOptions() {
    this.options = [
      new MenuOption('Free Play', 20, 180, () => this.startFreePlay()),
      new MenuOption('Race', 20, 280, () => this.startRace()),
      new MenuOption('Back', 20, 380, () => {
        this.game.addEntity(new MainMenu());
        this.destroy();
      })
    ];
  }

  startRace() {
    this.game.addEntity(new PauseController());
    const race = new Race();
    const racer = new Racer([5, 5]);
    const racer2 = new Racer([0, 5]);
    const racer3 = new Racer([-5, 5]);

    this.game.addEntity(racer);
    this.game.addEntity(racer2);
    this.game.addEntity(racer3);
    this.game.addEntity(new PlayerRacerController(racer));
    this.game.addEntity(new AIRacerController(racer2, race));
    this.game.addEntity(new AIRacerController(racer3, race));
    this.game.addEntity(new RaceCameraController(racer, this.game.camera));

    race.addRacer(racer);
    race.addRacer(racer2);
    race.addRacer(racer3);
    race.addWaypoint([0, 0], 5);
    race.addWaypoint([250, -250], 40);
    race.addWaypoint([400, 0], 50);
    race.addWaypoint([250, 250], 40);
    race.addWaypoint([-250, -250], 40);
    race.addWaypoint([-400, 0], 50);
    race.addWaypoint([-250, 250], 40);
    this.game.addEntity(race);

    this.destroy();
  }

  startFreePlay() {
    this.game.addEntity(new PauseController());
    const racer = new Racer([0, -4], RacerDefs.ANAKIN);

    this.game.addEntity(racer);
    this.game.addEntity(new PlayerRacerController(racer));
    this.game.addEntity(new RaceCameraController(racer, this.game.camera));

    this.destroy();
  }
}
