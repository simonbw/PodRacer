ListMenu = require 'menu/ListMenu'
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

class MainMenu extends ListMenu
  setOptions: () =>
    @options = [
      new MenuOption("New Game", 20, 180, =>
        @cameraController.destroy()
        racer = new Racer([0, 0], RacerDefs.test)
        racer2 = new Racer([0, -15])
        racerController = new PlayerRacerController(racer)
        cameraController = new CameraController(racer, @game.camera)

        @game.addEntity(racer)
        @game.addEntity(racer2)
        @game.addEntity(racerController)
        @game.addEntity(cameraController)
        @destroy())
      new MenuOption("Settings", 20, 280, -> console.log "hello")
    ]

module.exports = MainMenu