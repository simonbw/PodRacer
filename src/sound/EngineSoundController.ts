import BaseEntity from "../core/entity/BaseEntity";
import PositionSoundFilter from "./PositionSoundFilter";
import Engine from "../racer/Engine";
import { sounds } from "../core/resources/sounds";
import { clamp } from "../util/Util";
import { startAtRandomOffset, createLoopingSource } from "../util/AudioUtils";

export default class EngineSoundController extends BaseEntity {
  engine: Engine;

  chugGain: GainNode;
  chugSource: AudioBufferSourceNode;
  growlGain: GainNode;
  growlSource: AudioBufferSourceNode;
  out: AudioNode;
  positionFilter: PositionSoundFilter;
  whineGain: GainNode;
  whineSource: AudioBufferSourceNode;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  onAdd() {
    const audio = this.game.audio;

    this.out = audio.createGain();
    this.positionFilter = this.game.addEntity(new PositionSoundFilter());

    this.chugSource = createLoopingSource(audio, "engineChug");
    this.chugGain = audio.createGain();
    this.chugGain.gain.value = 0;
    this.chugSource.connect(this.chugGain);
    this.chugGain.connect(this.positionFilter.in);

    this.whineSource = createLoopingSource(audio, "engineWhine");
    this.whineGain = audio.createGain();
    this.whineGain.gain.value = 0;
    this.whineSource.connect(this.whineGain);
    this.whineGain.connect(this.positionFilter.in);

    this.growlSource = createLoopingSource(audio, "engineGrowl");
    this.growlGain = audio.createGain();
    this.growlGain.gain.value = 0;
    this.growlSource.connect(this.growlGain);
    this.growlGain.connect(this.positionFilter.in);

    this.positionFilter.out.connect(this.out);
  }

  onTick() {
    this.positionFilter.position.set(this.engine.position);

    const speed = this.engine.velocity.magnitude / 200;
    const throttle = this.engine.throttle;
    const now = this.game.audio.currentTime;

    const whineVolume = clamp(
      speed ** 1.2 * (0.7 + 0.3 * throttle) * 2.0 + 0.1 * throttle
    );
    const whineSpeed = 1.2 + speed ** 2.2 * 4 * (0.8 + 0.2 * throttle);

    const growlVolume = 0.09 * clamp(0.2 + throttle * 0.8) + speed * 0.05;
    const growlSpeed = 1 + speed ** 2 * 0.2;

    const chugVolume = clamp(
      0.1 + throttle / 5 - speed ** 1.5 * 0.35 * (0.15 + 0.85 * throttle)
    );
    const chugSpeed =
      1.5 +
      25 * speed ** 1.5 * (0.9 + 0.1 * throttle) +
      throttle * 0.3 +
      Math.random() * 0.05;

    this.whineSource.playbackRate.setTargetAtTime(whineSpeed, now, 0.02);
    this.whineGain.gain.setTargetAtTime(whineVolume, now, 0.05);
    this.chugSource.playbackRate.setTargetAtTime(chugSpeed, now, 0.02);
    this.chugGain.gain.setTargetAtTime(chugVolume, now, 0.1);
    this.growlSource.playbackRate.setTargetAtTime(growlSpeed, now, 0.02);
    this.growlGain.gain.setTargetAtTime(growlVolume, now, 0.1);
  }

  onDestroy() {
    this.chugSource.stop();
    this.whineSource.stop();
    this.positionFilter.destroy();
  }
}
