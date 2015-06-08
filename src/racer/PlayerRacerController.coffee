Entity = require 'core/Entity'
Util = require 'util/Util'

LEFT_THROTTLE = 88
LEFT_FLAP = 90
RIGHT_THROTTLE = 190
RIGHT_FLAP = 191


class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    @racer.leftEngine.setThrottle(-@game.io.getAxis(1) + @game.io.keys[LEFT_THROTTLE])
    @racer.rightEngine.setThrottle(-@game.io.getAxis(3) + @game.io.keys[RIGHT_THROTTLE])

    leftFlap = Util.clamp(@game.io.getButton(6).value + @game.io.keys[LEFT_FLAP], 0, 1)
    rightFlap = Util.clamp(@game.io.getButton(7).value + @game.io.keys[RIGHT_FLAP], 0, 1)
    @racer.setFlaps(leftFlap, rightFlap)


 module.exports = PlayerRacerController