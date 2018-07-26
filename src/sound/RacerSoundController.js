import Entity from "../core/Entity";
import PositionSoundFilter from "./PositionSoundFilter";

export default class RacerSoundController extends Entity {
  constructor(engine) {
    super();
    this.engine = engine;
    this.positionFilter = new PositionSoundFilter();
  }

  onAdd() {
    this.game.addEntity(this.positionFilter);
    this.out = this.game.audio.createGain();
    this.out.connect(this.positionFilter.in);

    this.noise = this.game.audio.createBufferSource();
    this.noiseFilter = this.game.audio.createBiquadFilter();
    this.noiseGain = this.game.audio.createGain();
    this.triangleGain = this.game.audio.createGain();
    this.sawtoothGain = this.game.audio.createGain();
    this.oscillatorFilter = this.game.audio.createBiquadFilter();
    this.triangleOscillator = this.game.audio.createOscillator();
    this.sawtoothOscillator = this.game.audio.createOscillator();
    this.modulatorOscillator = this.game.audio.createOscillator();
    this.modulatorFilter = this.game.audio.createBiquadFilter();
    this.modulatorGain = this.game.audio.createGain();
    this.modulatorThrough = this.game.audio.createGain();
    this.compressor = this.game.audio.createDynamicsCompressor();

    this.noise.buffer = this.game.audio.createBuffer(
      1,
      2 ** 16,
      this.game.audio.sampleRate
    );
    this.noise.loop = true;

    this.noiseFilter.type = "lowpass";
    this.noiseFilter.frequency.value = 100;
    this.noiseFilter.Q.value = 0.5;

    const noiseData = this.noise.buffer.getChannelData(0).map(Math.random);

    this.noiseGain.gain.value = 0;
    this.triangleGain.gain.value = 0;
    this.sawtoothGain.gain.value = 0;

    this.oscillatorFilter.type = "lowpass";
    this.oscillatorFilter.frequency.value = 100;
    this.oscillatorFilter.Q.value = 0.1;

    this.triangleOscillator.type = "triangle";
    this.triangleOscillator.frequency.value = 1;
    this.triangleOscillator.start();

    this.sawtoothOscillator.type = "sawtooth";
    this.sawtoothOscillator.frequency.value = 1;
    this.sawtoothOscillator.start();

    this.modulatorOscillator.type = "sawtooth";
    this.modulatorOscillator.frequency.value = 5;
    this.modulatorOscillator.start();
    this.modulatorFilter.type = "lowpass";
    this.modulatorFilter.frequency.value = 400;
    this.modulatorFilter.Q.value = 0.5;
    this.modulatorGain.gain.value = -1.0;

    this.compressor.threshold.value = -25;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.008;

    this.noise.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.out);
    this.triangleOscillator.connect(this.triangleGain);
    this.triangleGain.connect(this.oscillatorFilter);
    this.sawtoothOscillator.connect(this.sawtoothGain);
    this.sawtoothGain.connect(this.oscillatorFilter);
    this.oscillatorFilter.connect(this.compressor);
    this.compressor.connect(this.modulatorThrough);
    this.modulatorThrough.connect(this.out);
    this.modulatorOscillator.connect(this.modulatorFilter);
    this.modulatorFilter.connect(this.modulatorGain);
    this.modulatorGain.connect(this.modulatorThrough.gain);
    this.noise.start();
  }

  onTick() {
    const speed = this.engine.body.velocity.magnitude;
    const throttle = this.engine.throttle;
    this.positionFilter.position.set(this.engine.body.position);

    this.modulatorOscillator.frequency.value = 6 + throttle + speed / 15;
    this.modulatorGain.gain.value =
      -0.9 * (1 - Math.min(throttle * speed * 0.01, 1));

    this.noiseGain.gain.value = this.engine.boosting ? 5 : 0;
    this.triangleGain.gain.value = 0.15 + throttle / 3;
    this.sawtoothGain.gain.value =
      0.1 * throttle * (0.05 + Math.min(speed / 100, 0.9));

    const f =
      80 + (0.4 * throttle + 0.6) * (30 + speed * 3) + Math.random() * 12;
    this.triangleOscillator.frequency.value = f;
    this.sawtoothOscillator.frequency.value = f;
    this.noiseFilter.frequency.value = 100 + 1.5 * speed;
    this.oscillatorFilter.frequency.value =
      2500 + throttle * (30 + speed * 8) + 500 * Math.random();
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
    this.noise.stop();
    this.triangleOscillator.stop();
    this.sawtoothOscillator.stop();
    this.positionFilter.destroy();
  }
}
