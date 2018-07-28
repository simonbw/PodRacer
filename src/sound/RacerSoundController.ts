import BaseEntity from "../core/BaseEntity";
import PositionSoundFilter from "./PositionSoundFilter";
import Engine from "../racer/Engine";
import { Vector } from "../core/Vector";
import { sounds } from "../sounds";
import { Utils } from "../../node_modules/@types/p2/index";
import { clamp } from "../util/Util";
import { startAtRandomOffset } from "../util/AudioUtils";

export default class RacerSoundController extends BaseEntity {
  engine: Engine;

  out: GainNode;
  chugGain: GainNode;
  chugSource: AudioBufferSourceNode;
  positionFilter: PositionSoundFilter;
  whineGain: GainNode;
  whineSource: AudioBufferSourceNode;
  growlSource: AudioBufferSourceNode;
  growlGain: GainNode;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  onAdd() {
    this.positionFilter = this.game.addEntity(new PositionSoundFilter());

    this.chugSource = this.game.audio.createBufferSource();
    this.chugSource.buffer = sounds.get("engineChug");
    this.chugSource.loop = true;
    startAtRandomOffset(this.chugSource);
    this.chugGain = this.game.audio.createGain();
    this.chugGain.gain.value = 0;
    this.chugSource.connect(this.chugGain);
    this.chugGain.connect(this.positionFilter.in);

    this.whineSource = this.game.audio.createBufferSource();
    this.whineSource.buffer = sounds.get("engineWhine");
    this.whineSource.loop = true;
    startAtRandomOffset(this.whineSource);
    this.whineGain = this.game.audio.createGain();
    this.whineGain.gain.value = 0;
    this.whineSource.connect(this.whineGain);
    this.whineGain.connect(this.positionFilter.in);

    this.growlSource = this.game.audio.createBufferSource();
    this.growlSource.buffer = sounds.get("engineGrowl");
    this.growlSource.loop = true;
    startAtRandomOffset(this.growlSource);
    this.growlGain = this.game.audio.createGain();
    this.growlGain.gain.value = 0;
    this.growlSource.connect(this.growlGain);
    this.growlGain.connect(this.positionFilter.in);

    this.out = this.game.audio.createGain();
    this.positionFilter.out.connect(this.out);
    this.out.connect(this.game.masterGain);
  }

  onTick() {
    this.positionFilter.position.set(this.engine.position);

    const speed = this.engine.velocity.magnitude / 200;
    const throttle = this.engine.throttle;
    const now = this.game.audio.currentTime;

    const whineVolume = clamp(speed ** 1.4 * (0.7 + 0.3 * throttle) * 2.0);
    const whineSpeed = 1.2 + speed ** 2.2 * 4 * (0.8 + 0.2 * throttle);

    const growlVolume = 0.09 * clamp(0.2 + throttle * 0.8) + speed * 0.05;
    const growlSpeed = 1 + speed ** 2 * 0.2;

    const chugVolume = clamp(
      0.1 + throttle / 5 - speed ** 1.5 * 0.35 * (0.15 + 0.85 * throttle),
      0.008,
      1.0
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

  onPause() {
    this.out.gain.cancelScheduledValues(0);
    this.out.gain.setValueAtTime(
      this.out.gain.value,
      this.game.audio.currentTime
    );
    this.out.gain.exponentialRampToValueAtTime(
      0.001,
      this.game.audio.currentTime + 0.7
    );
  }

  onUnpause() {
    this.out.gain.cancelScheduledValues(0);
    this.out.gain.setValueAtTime(
      this.out.gain.value,
      this.game.audio.currentTime
    );
    this.out.gain.exponentialRampToValueAtTime(
      1.0,
      this.game.audio.currentTime + 0.05
    );
  }

  onDestroy() {
    this.chugSource.stop();
    this.whineSource.stop();
    this.positionFilter.destroy();
  }
}
