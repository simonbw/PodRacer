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


 module.exports = PlayerRacerController