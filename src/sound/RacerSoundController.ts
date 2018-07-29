import { MuteOnPause } from "./MuteOnPause";
import Racer from "../racer/Racer";
import EngineSoundController from "./EngineSoundController";

export class RacerSoundController extends MuteOnPause {
  racer: Racer;
  leftEngineController: EngineSoundController;
  rightEngineController: EngineSoundController;

  constructor(racer: Racer) {
    super();
    this.racer = racer;
  }

  onAdd() {
    super.onAdd();
    const { leftEngine, rightEngine } = this.racer;

    this.out.connect(this.game.masterGain);

    this.leftEngineController = new EngineSoundController(leftEngine);
    this.game.addEntity(this.leftEngineController);
    this.leftEngineController.out.connect(this.out);

    this.rightEngineController = new EngineSoundController(rightEngine);
    this.game.addEntity(this.rightEngineController);
    this.rightEngineController.out.connect(this.out);
  }

  onDestroy() {
    super.onDestroy();
    this.leftEngineController.destroy();
    this.rightEngineController.destroy();
  }
}
