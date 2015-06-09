# This is the entry point of our code.

# Allows defining of properties on classes.
# It is a little sketchy and may disappear soon.
Function::property = (prop, desc) ->
  Object.defineProperty this.prototype, prop, desc

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
  racer = new Racer([0, 0], RacerDefs.test)
  racer2 = new Racer([0, -15])
  racerController = new PlayerRacerController(racer)
  cameraController = new CameraController(racer, game.camera)

  game.addEntity(racer)
  game.addEntity(racer2)
  game.addEntity(racerController)
  game.addEntity(cameraController)
  game.addEntity(new Ground())

  race = new Race()
  race.addRacer(racer)
  race.addRacer(racer2)
  race.addWaypoint([0, 0], 10)
  race.addWaypoint([150, -150], 40)
  race.addWaypoint([280, 0], 50)
  race.addWaypoint([150, 150], 40)
  race.addWaypoint([-150, -150], 40)
  race.addWaypoint([-280, 0], 50)
  race.addWaypoint([-150, 150], 40)
  game.addEntity(race)
  
  game.start()