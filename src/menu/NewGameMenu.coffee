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
Race = require 'race/Race'
AIRacerController = require 'racer/AIRacerController'
PauseController = require 'core/PauseController'

class NewGameMenu extends ListMenu
  setOptions: () =>
    @options = [
      new MenuOption("Free Play", 20, 180, @startFreePlay),
      new MenuOption("Race", 20, 280, @startRace),
      new MenuOption("Back", 20, 380, =>
        MainMenu = require 'menu/MainMenu'
        @game.addEntity(new MainMenu())
        @destroy())
      ]

  startRace: () =>
    @game.addEntity(new PauseController())
    race = new Race()
    racer = new Racer([5, 0], RacerDefs.test)
    racer2 = new Racer([-5, 0])
    racerController = new PlayerRacerController(racer)
    racerController2 = new AIRacerController(racer2, race)
    cameraController = new CameraController(racer, game.camera)

    game.addEntity(racer)
    game.addEntity(racer2)
    game.addEntity(racerController)
    game.addEntity(racerController2)
    game.addEntity(cameraController)

    race.addRacer(racer)
    race.addRacer(racer2)
    race.addWaypoint([0, 0], 5)
    race.addWaypoint([250, -250], 40)
    race.addWaypoint([400, 0], 50)
    race.addWaypoint([250, 250], 40)
    race.addWaypoint([-250, -250], 40)
    race.addWaypoint([-400, 0], 50)
    race.addWaypoint([-250, 250], 40)
    game.addEntity(race)
    @destroy()

  startFreePlay: () =>
    @game.addEntity(new PauseController())
    racer = new Racer([0, 0], RacerDefs.test)
    racer2 = new Racer([0, -15])
    racerController = new PlayerRacerController(racer)
    cameraController = new CameraController(racer, @game.camera)

    #game.addEntity(new FPSCounter())

    @game.addEntity(racer)
    @game.addEntity(racer2)
    @game.addEntity(racerController)
    @game.addEntity(cameraController)
    @destroy()

module.exports = NewGameMenu