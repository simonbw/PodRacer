Pixi = require 'pixi.js'
Game = require 'core/Game'
MenuOption = require 'menu/MenuOption'
RacerDefs = require 'racer/RacerDefs'
Entity = require 'core/Entity'
Racer = require 'racer/Racer'
PlayerRacerController = require 'racer/PlayerRacerController'
MenuCameraController = require 'camera/MenuCameraController'
CameraController = require 'camera/CameraController'
DOWN_THRESHOLD = 250

class MainMenu extends Entity
  constructor: () ->
    @layer = "menu"
    @sprite = new Pixi.Graphics()

  onAdd: () =>
    @text = new Pixi.Text("Super Pod Racer", {
      font: 'bold 50px Arial'
      fill: 0xFFFFFF,
    });
    @sprite.addChild(@text)
    @sprite.x = 20
    @sprite.y = 100

    @cameraController = new MenuCameraController()
    @game.addEntity(@cameraController)
    @lastMoveTime = Date.now()

    optionX = 20
    @options = [
      new MenuOption("New Game", optionX, 180, () =>
        @cameraController.destroy()
        racer = new Racer([0, 0], RacerDefs.test)
        racer2 = new Racer([0, -15])
        racerController = new PlayerRacerController(racer)
        cameraController = new CameraController(racer, @game.camera)
        @game.addEntity(racer)
        @game.addEntity(racer2)
        @game.addEntity(racerController)
        @game.addEntity(cameraController)
        @destroy()),
      new MenuOption("Settings", optionX, 280, -> console.log("why would you do this?"))
    ]
    @game.addEntity(option) for option in @options
    console.log "making menu state with options size " + @options.length

    @currentOption = 0
    @selectOption(0)

  onTick: () ->
    axis = @game.io.getAxis(1)
    if Math.abs(axis) > 0.9
      currentTime = Date.now()
      if currentTime - @lastMoveTime >= DOWN_THRESHOLD
        @lastMoveTime = currentTime
        @selectOption(@currentOption + Math.sign(axis))

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

  activateOption: () =>
    @options[@currentOption].activate()

  onDestroy: () =>
    option.destroy() for option in @options


module.exports = MainMenu