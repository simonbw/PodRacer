# This is the entry point of our code.

# Allows defining of properties on classes.
# It is a little sketchy and may disappear soon.
Function::property = (prop, desc) ->
  Object.defineProperty this.prototype, prop, desc

FPSCounter = require 'util/FPSCounter'
Game = require 'core/Game'
Racer = require 'racer/Racer'
PlayerRacerController = require 'racer/PlayerRacerController'
CameraController = require 'CameraController'

# TODO: Preloader
window.onload = ->
  console.log "loaded"
  window.game = game = new Game()
  racer = new Racer([0, 0])
  racer2 = new Racer([0, -15])
  racerController = new PlayerRacerController(racer)
  cameraController = new CameraController(racer, game.camera)
  game.addEntity(racer)
  game.addEntity(racer2)
  game.addEntity(racerController)
  game.addEntity(cameraController)
  game.start()
