# This is the entry point of our code.

# Allows defining of properties on classes.
# It is a little sketchy and may disappear soon.
Function::property = (prop, desc) ->
  Object.defineProperty this.prototype, prop, desc

FPSCounter = require 'util/FPSCounter'
Game = require 'core/Game'

# TODO: Preloader
window.onload = ->
  console.log "loaded"
  window.game = game = new Game()
  # game.addEntity(new FPSCounter())
  game.start()
