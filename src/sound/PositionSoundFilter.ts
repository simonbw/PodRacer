import BaseEntity from "../core/BaseEntity";
import { Vector } from "../core/Vector";
import { clamp } from "../util/Util";

const MAX_DELAY = 1.0;
const PAN_DISTANCE = 100;
const MAX_FREQUENCY = 22050;

export default class PositionSoundFilter extends BaseEntity {
  position: Vector;
  pan: StereoPannerNode;
  in: AudioNode;
  out: AudioNode;
  gain: GainNode;
  filter: BiquadFilterNode;
  delay: DelayNode;

  onAdd() {
    this.position = [0, 0] as Vector;
    this.in = this.pan = this.game.audio.createStereoPanner();
    this.gain = this.game.audio.createGain();
    this.out = this.game.audio.createGain();
    this.filter = this.game.audio.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = MAX_FREQUENCY;
    this.filter.Q.value = 0.3;

    this.delay = this.game.audio.createDelay(MAX_DELAY);
    this.delay.delayTime.value = 0;

    this.pan.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.delay);
    this.delay.connect(this.out);
  }

  onTick() {
    const now = this.game.audio.currentTime;
    const diff = this.position.sub(this.game.camera.position);
    const distance = diff.magnitude;

    const targetGain = clamp((160 / distance ** 1.2) ** 1.2);
    const targetPan =
      Math.cos(diff.angle) * clamp(distance / PAN_DISTANCE - 0.1);
    const targetFrequency = clamp(1 / (0.01 * distance + 1)) * MAX_FREQUENCY;
    this.gain.gain.setTargetAtTime(targetGain, now, 0.01);
    this.pan.pan.setTargetAtTime(targetPan, now, 0.01);
    this.filter.frequency.setTargetAtTime(targetFrequency, now, 0.01);

    // TODO: Doppler effect.
  }
}
