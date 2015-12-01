Entity = require 'core/Entity'
Util = require 'util/Util.coffee'
Ground = require 'Ground'
IO = require 'core/IO'

LEFT_THROTTLE = 88 # X
LEFT_FLAP = 90 # Z
RIGHT_THROTTLE = 190 # .
RIGHT_FLAP = 191 # /
LEFT_BOOST = 67 # C
RIGHT_BOOST = 188 # ,


class PlayerRacerController extends Entity
  constructor: (@racer) ->

  beforeTick: () =>
    leftStick = Math.sqrt(Util.clamp(-@game.io.getAxis(IO.GAMEPAD_LY), 0, 1))
    rightStick = Math.sqrt(Util.clamp(-@game.io.getAxis(IO.GAMEPAD_RY), 0, 1))
    if @racer.leftEngine?
      @racer.leftEngine.setThrottle(leftStick + @game.io.keys[LEFT_THROTTLE])
    if @racer.rightEngine?
      @racer.rightEngine.setThrottle(rightStick + @game.io.keys[RIGHT_THROTTLE])

    leftFlap = Util.clamp(@game.io.getButton(IO.GAMEPAD_LT).value + @game.io.keys[LEFT_FLAP], 0, 1)
    rightFlap = Util.clamp(@game.io.getButton(IO.GAMEPAD_RT).value + @game.io.keys[RIGHT_FLAP], 0, 1)
    @racer.setFlaps(leftFlap, rightFlap)

  onButtonDown: (button) =>
    switch button
      when IO.GAMEPAD_L3 then @racer.leftEngine.boostOn()
      when IO.GAMEPAD_R3 then @racer.rightEngine.boostOn()

  onButtonUp: (button) =>
    switch button
      when IO.GAMEPAD_L3 then @racer.leftEngine.boostOff()
      when IO.GAMEPAD_R3 then @racer.rightEngine.boostOff()

  onKeyDown: (key) =>
    switch key
      when LEFT_BOOST then @racer.leftEngine.boostOn()
      when RIGHT_BOOST then @racer.rightEngine.boostOn()

  onKeyUp: (key) =>
    switch key
      when LEFT_BOOST then @racer.leftEngine.boostOff()
      when RIGHT_BOOST then @racer.rightEngine.boostOff()

  # this might cause bugs
  # TODO: remove, restructure
  afterTick: () =>
    if not @racer.pod?
      @game.clearAll()
      @game.addEntity(new Ground())
      MainMenu = require 'menu/MainMenu'
      @game.addEntity(new MainMenu())


 module.exports = PlayerRacerController