import BaseEntity from "../core/BaseEntity";

export class MuteOnPause extends BaseEntity {
  out: GainNode;
  fadeInTime: number = 0.1;
  fadeOutTime: number = 0.7;

  onAdd() {
    this.out = this.game.audio.createGain();
  }

  onPause() {
    const now = this.game.audio.currentTime;
    this.out.gain.cancelAndHoldAtTime(now);
    const endTime = this.game.audio.currentTime + this.fadeOutTime;
    this.out.gain.exponentialRampToValueAtTime(0.001, endTime); // we can't exponential ramp to 0
    this.out.gain.linearRampToValueAtTime(0, endTime + 0.001); //  so we get close then linear ramp down
  }

  onUnpause() {
    const now = this.game.audio.currentTime;
    this.out.gain.cancelScheduledValues(0);
    this.out.gain.setValueAtTime(Math.max(this.out.gain.value, 0.00001), now); // can't exponential ramp from 0
    this.out.gain.exponentialRampToValueAtTime(1.0, now + this.fadeInTime);
  }

  onDestroy() {
    this.out.disconnect();
  }
}
