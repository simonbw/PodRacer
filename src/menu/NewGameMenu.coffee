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
MainMenu = require 'menu/MainMenu'
IO = require 'core/IO'

class NewGameMenu extends ListMenu
  setOptions: (x,y) =>
    @options = [
      new MenuOption("Free Play", x, y, => 
        @cameraController.destroy()
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
      new MenuOption("Race", x, y + 120, => 
        console.log "this should start a race"),
      new MenuOption("Back", x, y + 240, => 
        console.log MainMenu
        @game.addEntity(new MainMenu())
        @destroy())
      ]

module.exports = NewGameMenu