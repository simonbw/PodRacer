Entity = require 'core/Entity'



class RacerSoundController extends Entity

  constructor: (@engine) ->
    # Do something?

  onAdd: () =>
    @out = @game.audio.destination

    @noise = @game.audio.createBufferSource()
    @noiseFilter = @game.audio.createBiquadFilter()
    @noiseGain = @game.audio.createGain()
    @triangleGain = @game.audio.createGain()
    @sawtoothGain = @game.audio.createGain()
    @oscillatorFilter = @game.audio.createBiquadFilter()
    @triangleOscillator = @game.audio.createOscillator()
    @sawtoothOscillator = @game.audio.createOscillator()
    @compressor = @game.audio.createDynamicsCompressor()

    @noise.buffer = @game.audio.createBuffer(1, 2**16, @game.audio.sampleRate)
    @noise.loop = true

    @noiseFilter.type = 'lowpass'
    @noiseFilter.frequency = 100
    @noiseFilter.Q = 0.5

    noiseData = @noise.buffer.getChannelData(0)
    for i in [0..noiseData.length]
      noiseData[i] = Math.random()

    @noiseGain.gain.value = 0
    @triangleGain.gain.value = 0
    @sawtoothGain.gain.value = 0

    @oscillatorFilter.type = 'lowpass'
    @oscillatorFilter.frequency = 100
    @oscillatorFilter.Q = 0.1

    @triangleOscillator.type = 'triangle'
    @triangleOscillator.start()

    @sawtoothOscillator.type = 'sawtooth'
    @sawtoothOscillator.start()

    @noise.connect(@noiseFilter)
    @noiseFilter.connect(@noiseGain)
    @noiseGain.connect(@compressor)
    @triangleOscillator.connect(@triangleGain)
    @triangleGain.connect(@oscillatorFilter)
    @sawtoothOscillator.connect(@sawtoothGain)
    @sawtoothGain.connect(@oscillatorFilter)
    @oscillatorFilter.connect(@compressor)
    @compressor.connect(@out)

    @noise.start()

  onTick: () =>
    speed = Array.from(@engine.body.velocity).magnitude
    @noiseGain.gain.value = 0 #@engine.throttle
    @triangleGain.gain.value = 0.1 + @engine.throttle / 3
    @sawtoothGain.gain.value = 0.1 + @engine.throttle / 9

    @triangleOscillator.frequency.value = 25 + @engine.throttle * (30 + speed * 3) + Math.random() * 10
    @sawtoothOscillator.frequency.value = 25 + @engine.throttle * (30 + speed * 3) + Math.random() * 10
    @noiseFilter.frequency.value = 100 + 0.5 * speed
    @oscillatorFilter.frequency.value = 600 + @engine.throttle * (30 + speed * 6) + 1000 * Math.random()


module.exports = RacerSoundController