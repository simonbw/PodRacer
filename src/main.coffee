# This is the entry point of our code.

require 'core/Hacks'
require 'core/Vector'

CameraController = require 'camera/CameraController'
FPSCounter = require 'util/FPSCounter'
Game = require 'core/Game'
Ground = require 'Ground'
Pixi = require 'pixi.js'
PlayerRacerController = require 'racer/PlayerRacerController'
Racer = require 'racer/Racer'
RacerDefs = require 'racer/RacerDefs'
Menu = require 'menu/Menu'

window.onload = ->
  console.log "loading..."
  Pixi.loader.add('images/ground.jpg')
  Pixi.loader.load ->
    console.log 'loader finished'
    start()

start = ->
  console.log "ready to go"
  # here we need to open up a new menu
  window.game = game = new Game()
  window.menu = menu = new Menu(game)
  menu.begin("main", ["option 1", "option 2", "option 3"])
  # racer = new Racer([0, 0], RacerDefs.test)
  # racer2 = new Racer([0, -15])
  # racerController = new PlayerRacerController(racer)
  # cameraController = new CameraController(racer, game.camera)

  # #game.addEntity(new FPSCounter())

  # game.addEntity(racer)
  # game.addEntity(racer2)
  # game.addEntity(racerController)
  # game.addEntity(cameraController)
  # game.addEntity(new Ground())
  # game.start()