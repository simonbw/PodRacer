Entity = require 'core/Entity'
PositionSoundFilter = require 'sound/PositionSoundFilter'


class RacerSoundController extends Entity

  constructor: (@engine) ->
    @positionFilter = new PositionSoundFilter()
# Do something?

  onAdd: () =>
    @game.addEntity(@positionFilter)
    @out = @positionFilter.in

    @noise = @game.audio.createBufferSource()
    @noiseFilter = @game.audio.createBiquadFilter()
    @noiseGain = @game.audio.createGain()
    @triangleGain = @game.audio.createGain()
    @sawtoothGain = @game.audio.createGain()
    @oscillatorFilter = @game.audio.createBiquadFilter()
    @triangleOscillator = @game.audio.createOscillator()
    @sawtoothOscillator = @game.audio.createOscillator()
    @modulator = @game.audio.createOscillator()
    @modulatorFilter = @game.audio.createBiquadFilter()
    @modulatorGain = @game.audio.createGain()
    @modulatorThrough = @game.audio.createGain()
    @compressor = @game.audio.createDynamicsCompressor()

    @noise.buffer = @game.audio.createBuffer(1, 2**16, @game.audio.sampleRate)
    @noise.loop = true

    @noiseFilter.type = 'lowpass'
    @noiseFilter.frequency.value = 100
    @noiseFilter.Q.value = 0.5

    noiseData = @noise.buffer.getChannelData(0)
    for i in [0..noiseData.length]
      noiseData[i] = Math.random()

    @noiseGain.gain.value = 0
    @triangleGain.gain.value = 0
    @sawtoothGain.gain.value = 0

    @oscillatorFilter.type = 'lowpass'
    @oscillatorFilter.frequency.value = 100
    @oscillatorFilter.Q.value = 0.1

    @triangleOscillator.type = 'triangle'
    @triangleOscillator.frequency.value = 1
    @triangleOscillator.start()

    @sawtoothOscillator.type = 'sawtooth'
    @sawtoothOscillator.frequency.value = 1
    @sawtoothOscillator.start()

    @modulator.type = 'sawtooth'
    @modulator.frequency.value = 5
    @modulator.start()
    @modulatorFilter.type = 'lowpass'
    @modulatorFilter.frequency.value = 400
    @modulatorFilter.Q.value = 0.5
    @modulatorGain.gain.value = -1.0

    @compressor.threshold = -25
    @compressor.attack.value = 0.003
    @compressor.release.value = 0.008

    @noise.connect(@noiseFilter)
    @noiseFilter.connect(@noiseGain)
    @noiseGain.connect(@compressor)
    @triangleOscillator.connect(@triangleGain)
    @triangleGain.connect(@oscillatorFilter)
    @sawtoothOscillator.connect(@sawtoothGain)
    @sawtoothGain.connect(@oscillatorFilter)
    @oscillatorFilter.connect(@compressor)
    @compressor.connect(@modulatorThrough)
    @modulatorThrough.connect(@out)
    @modulator.connect(@modulatorFilter)
    @modulatorFilter.connect(@modulatorGain)
    @modulatorGain.connect(@modulatorThrough.gain)
    @noise.start()

  onTick: () =>
    speed = Array.from(@engine.body.velocity).magnitude
    throttle = @engine.throttle

    @modulator.frequency.value = 6 + throttle + speed / 15
    modulatorGain = -0.9 * (1 - Math.min(throttle * speed * 0.01, 1))
    @modulatorGain.gain.value = modulatorGain

    @noiseGain.gain.value = 0 #@engine.throttle
    @triangleGain.gain.value = 0.15 + throttle / 3
    @sawtoothGain.gain.value = 0.3 * (throttle) * (0.05 + Math.min(speed / 100, 0.9))

    f = 80 + (0.4 * throttle + 0.6) * (30 + speed * 3) + Math.random() * 12
    @triangleOscillator.frequency.value = f
    @sawtoothOscillator.frequency.value = f
    @noiseFilter.frequency.value = 100 + 0.5 * speed
    @oscillatorFilter.frequency.value = 2500 + throttle * (30 + speed * 8) + 500 * Math.random()

    @positionFilter.position.set(@engine.body.position)

  onDestroy: () =>
    @noise.stop()
    @triangleOscillator.stop()
    @sawtoothOscillator.stop()
    @positionFilter.destroy()

module.exports = RacerSoundController