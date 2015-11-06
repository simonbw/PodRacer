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
  constructor: () ->
    @layer = "menu"
    @sprite = new Pixi.Graphics()

  onAdd: () =>
    x = @game.camera.getViewportSize()[0]/2
    y = @game.camera.getViewportSize()[1]/2

    @text = new Pixi.Text("Super Pod Racer",{font : '50px Arial', fill : 0xFF0000, align : 'center'});
    @sprite.addChild(@text)
    @sprite.x = x - 200
    @sprite.y = y - 300

    @cameraController = new MenuCameraController()
    @game.addEntity(@cameraController)
    @lastMoveTime = Date.now()
    
    @setOptions(x, y)
    
    @game.addEntity(option) for option in @options
    @currentOption = 0
    @selectOption(0)

  setOptions: (x, y) =>
    @options = []

  onTick: () ->
    axis = @game.io.getAxis(1)
    if Math.abs(axis) > 0.9
      currentTime = Date.now()
      if currentTime - @lastMoveTime >= DOWN_THRESHOLD
        @lastMoveTime = currentTime
        @selectOption(@currentOption + Math.sign(axis))

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
    if button == 0 # A has been pressed
      @activateOption()

  # main menu keyboard support
  onKeyDown: (key) =>
    switch key
      when IO.UP_ARROW then @selectOption(@currentOption - 1)
      when IO.DOWN_ARROW then @selectOption(@currentOption + 1)
      when IO.ENTER then @activateOption()

  # activate the currently selected option
  activateOption: () =>
    @options[@currentOption].activate()

  onDestroy: () =>
    option.destroy() for option in @options




module.exports = ListMenu