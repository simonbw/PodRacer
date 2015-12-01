Pixi = require 'pixi.js'
Game = require 'core/Game'
MenuOption = require 'menu/MenuOption'
RacerDefs = require 'racer/RacerDefs'
Entity = require 'core/Entity'
Racer = require 'racer/Racer'
PlayerRacerController = require 'racer/PlayerRacerController'
MenuCameraController = require 'camera/MenuCameraController'
CameraController = require 'camera/CameraController'
IO = require 'core/IO'
DOWN_THRESHOLD = 250

class ListMenu extends Entity

  # menu will still react when the game is paused
  pausable: false

  constructor: () ->
    @layer = "menu"
    @sprite = new Pixi.Graphics()

  onAdd: () =>
    @text = new Pixi.Text("Super Pod Racer", {
      font : 'bold 50px Arial'
      fill : 0xFFFFFF
    });
    @sprite.x = 20
    @sprite.y = 100
    @sprite.addChild(@text)

    @cameraController = new MenuCameraController()
    @game.addEntity(@cameraController)
    @lastMoveTime = Date.now()

    @setOptions()

    @game.addEntity(option) for option in @options
    @currentOption = 0
    @selectOption(0)

  setOptions: () =>
    @options = []

  onTick: () ->
    axis = @game.io.getAxis(1)
    if Math.abs(axis) > 0.3
      currentTime = Date.now()
      if currentTime - @lastMoveTime >= DOWN_THRESHOLD
        @lastMoveTime = currentTime
        @selectOption(@currentOption + Math.sign(axis))
    else if Math.abs(axis) < 0.2
      @lastMoveTime = 0

  # select the option at index in the options list
  selectOption: (index) =>
    if index >= @options.length
      index = @options.length - 1
    if index < 0
      index = 0
    @options[@currentOption].unSelect()
    @options[index].select()
    @currentOption = index

  onButtonDown: (button) =>
    switch button
      when IO.GAMEPAD_A then @activateOption()
      when IO.GAMEPAD_D_UP then @selectOption(@currentOption - 1)
      when IO.GAMEPAD_D_DOWN then @selectOption(@currentOption + 1)

  # main menu keyboard support
  onKeyDown: (key) =>
    switch key
      when IO.UP_ARROW then @selectOption(@currentOption - 1)
      when IO.DOWN_ARROW then @selectOption(@currentOption + 1)
      when IO.ENTER then @activateOption()
      when IO.SPACEBAR then @activateOption()

  # activate the currently selected option
  activateOption: () =>
    @options[@currentOption].activate()

  onDestroy: () =>
    @cameraController.destroy()
    option.destroy() for option in @options




module.exports = ListMenu