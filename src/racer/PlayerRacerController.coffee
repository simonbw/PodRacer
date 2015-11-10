Entity = require 'core/Entity'
Util = require 'util/Util.coffee'
Ground = require 'Ground'

LEFT_THROTTLE = 88
LEFT_FLAP = 90
RIGHT_THROTTLE = 190
RIGHT_FLAP = 191


class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    leftStick = Math.sqrt(Util.clamp(-@game.io.getAxis(1), 0, 1))
    rightStick = Math.sqrt(Util.clamp(-@game.io.getAxis(3), 0, 1))
    if @racer.leftEngine?
      @racer.leftEngine.setThrottle(leftStick + @game.io.keys[LEFT_THROTTLE])
    if @racer.rightEngine?
      @racer.rightEngine.setThrottle(rightStick + @game.io.keys[RIGHT_THROTTLE])

    leftFlap = Util.clamp(@game.io.getButton(6).value + @game.io.keys[LEFT_FLAP], 0, 1)
    rightFlap = Util.clamp(@game.io.getButton(7).value + @game.io.keys[RIGHT_FLAP], 0, 1)
    @racer.setFlaps(leftFlap, rightFlap)

  # no don't do this pls
  # causes literally an infinite number of bugs
  # afterTick: () =>
  #   if not @racer.pod?
  #     game.clearAll()
  #     game.addEntity(new Ground())
  #     MainMenu = require 'menu/MainMenu'
  #     game.addEntity(new MainMenu())


 module.exports = PlayerRacerController