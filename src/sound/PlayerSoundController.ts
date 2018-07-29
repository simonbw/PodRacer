import BaseEntity from "../core/entity/BaseEntity";
import PositionSoundFilter from "./PositionSoundFilter";
import { sounds } from "../core/resources/sounds";
import { clamp } from "../util/Util";
import { startAtRandomOffset } from "../util/AudioUtils";
import Racer from "../racer/Racer";
import { MuteOnPause } from "./MuteOnPause";
import WindSoundController from "./WindController";

// Controls relevant sounds for the current player
export default class PlayerSoundController extends BaseEntity {
  racer: Racer;
  windController: WindSoundController;
  out: GainNode;

  constructor(racer: Racer) {
    super();
    this.racer = racer;
  }

  onAdd() {
    this.out = this.game.audio.createGain();
    this.windController = this.game.addEntity(
      new WindSoundController(this.racer)
    );
    this.windController.out.connect(this.out);
    this.out.connect(this.game.masterGain);
  }

  onTick() {}

  onDestroy() {
    this.windController.destroy();
  }
}
