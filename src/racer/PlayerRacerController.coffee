Entity = require 'core/Entity'

class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    @racer.leftEngine.throttle = -@game.io.getAxis(1)
    @racer.rightEngine.throttle = -@game.io.getAxis(3)

    for flap in @racer.rightFlaps
      flap.angle = @game.io.getButton(7).value - 0.5 * Math.PI
    for flap in @racer.leftFlaps
      flap.angle = 1.5 * Math.PI - @game.io.getButton(6).value


 module.exports = PlayerRacerController