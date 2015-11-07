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

class NewGameMenu extends ListMenu
  setOptions: () =>
    @options = [
      new MenuOption("Free Play", 20, 180, => 
        racer = new Racer([0, 0], RacerDefs.test)
        racer2 = new Racer([0, -15])
        racerController = new PlayerRacerController(racer)
        cameraController = new CameraController(racer, @game.camera)

        #game.addEntity(new FPSCounter())

        @game.addEntity(racer)
        @game.addEntity(racer2)
        @game.addEntity(racerController)
        @game.addEntity(cameraController)
        @destroy())
      new MenuOption("Race", 20, 280, => 
        console.log "this should start a race"),
      new MenuOption("Back", 20, 380, => 
        MainMenu = require 'menu/MainMenu'
        @game.addEntity(new MainMenu())
        @destroy())
      ]

module.exports = NewGameMenu