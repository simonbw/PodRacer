# This is the entry point of our code.

require 'core/Hacks'
require 'core/Vector'

AIRacerController = require 'racer/AIRacerController'
CameraController = require 'CameraController'
FPSCounter = require 'util/FPSCounter'
Game = require 'core/Game'
Ground = require 'Ground'
Pixi = require 'pixi.js'
PlayerRacerController = require 'racer/PlayerRacerController'
Race = require 'race/Race'
Racer = require 'racer/Racer'
RacerDefs = require 'racer/RacerDefs'

window.onload = ->
  console.log "loading..."
  Pixi.loader.add('images/ground.jpg')
  Pixi.loader.load ->
    console.log 'loader finished'
    start()

start = ->
  console.log "ready to go"
  window.game = game = new Game()
  race = new Race()
  racer = new Racer([5, 0], RacerDefs.test)
  racer2 = new Racer([-5, 0])
  racerController = new PlayerRacerController(racer)
  racerController2 = new AIRacerController(racer2, race)
  cameraController = new CameraController(racer2, game.camera)

  game.addEntity(racer)
  game.addEntity(racer2)
  game.addEntity(racerController)
  game.addEntity(racerController2)
  game.addEntity(cameraController)
  game.addEntity(new Ground())

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
  
  game.start()