Entity = require 'core/Entity'


LEFT_THROTTLE = 88
LEFT_FLAP = 90
RIGHT_THROTTLE = 190
RIGHT_FLAP = 191


class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    @racer.leftEngine.throttle = -@game.io.getAxis(1) + @game.io.keys[LEFT_THROTTLE]
    @racer.rightEngine.throttle = -@game.io.getAxis(3) + @game.io.keys[RIGHT_THROTTLE]

    for flap in @racer.rightFlaps
      flap.angle = @game.io.getButton(7).value - 0.5 * Math.PI
    for flap in @racer.leftFlaps
      flap.angle = 1.5 * Math.PI - @game.io.getButton(6).value


 module.exports = PlayerRacerController