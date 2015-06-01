Entity = require 'core/Entity'

class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    @racer.leftEngine.throttle = -@game.io.getAxis(1)
    @racer.rightEngine.throttle = -@game.io.getAxis(3)


 module.exports = PlayerRacerController