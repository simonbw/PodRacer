# This is the entry point of our code.

require 'core/Hacks'
require 'core/Vector'

FPSCounter = require 'util/FPSCounter'
Game = require 'core/Game'
Ground = require 'Ground'
Pixi = require 'pixi.js'
MainMenu = require 'menu/MainMenu'

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
  game.addEntity(new MainMenu())
  game.addEntity(new Ground())
  window.game.start()
  