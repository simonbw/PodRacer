import BaseEntity from "../core/entity/BaseEntity";
import PositionSoundFilter from "./PositionSoundFilter";
import { sounds } from "../core/resources/sounds";
import { clamp } from "../util/Util";
import { startAtRandomOffset, createLoopingSource } from "../util/AudioUtils";
import Racer from "../racer/Racer";
import { MuteOnPause } from "./MuteOnPause";

export default class WindSoundController extends MuteOnPause {
  racer: Racer;
  windSource: AudioBufferSourceNode;
  windGain: GainNode;

  constructor(racer: Racer) {
    super();
    this.racer = racer;
  }

  onAdd() {
    super.onAdd();

    this.windSource = createLoopingSource(this.game.audio, "wind");
    this.windGain = this.game.audio.createGain();
    this.windSource.connect(this.windGain);
    this.windGain.connect(this.out);
  }

  onTick() {
    const now = this.game.audio.currentTime;
    const speed = this.racer.pod.velocity.magnitude / 200;
    const volume = clamp((speed - 0.7) * 2);
    this.windGain.gain.setTargetAtTime(volume, now, 0.01);
  }

  onDestroy() {}
}
