Entity = require 'core/Entity'
Util = require 'util/Util.coffee'

class PositionSoundFilter extends Entity
  REF_DISTANCE = 100
  PAN_DISTANCE = 100
  MAX_DELAY = 1.0

  onAdd: () =>
    @position = [0, 0]
    @in = @pan = @game.audio.createStereoPanner()
    @gain = @game.audio.createGain()
    @filter = @game.audio.createBiquadFilter()
    @filter.type = 'lowpass'
    @filter.frequency.value = 2 ** 16
    @filter.Q.value = 0.3

    @delay = @game.audio.createDelay(MAX_DELAY)
    @delay.delayTime.value = 0

    @pan.connect(@filter)
    @filter.connect(@gain)
    @gain.connect(@delay)
    @delay.connect(@game.masterGain)

  onTick: () =>
    [dx, dy] = diff = @position.sub(@game.camera.position)
    distance = diff.magnitude
    @gain.gain.value = Util.clamp((REF_DISTANCE / distance) ** 1.2)
    @pan.pan.value = Math.cos(diff.angle) * Util.clamp(distance / PAN_DISTANCE - 0.1)
    @filter.frequency.value = 2 ** 22 / (distance ** 1.4 + 0.1)

    # Doppler effect. Needs work
    #delayTime = Math.min(distance / 800, MAX_DELAY)
    #@delay.delayTime.linearRampToValueAtTime(delayTime, @game.audio.currentTime + @game.timestep)

  onDestroy: () =>


module.exports = PositionSoundFilter