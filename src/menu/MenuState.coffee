Pixi = require 'pixi.js'
Game = require 'core/Game'
MenuOption = require 'menu/MenuOption'

class MenuState
  constructor: (@name, @game, options) ->
    @options = [new MenuOption(option) for option in options]
    console.log "making menu state with options size" + @options.length

  addToGame: () ->
    console.log @name + " added to game"
    @game.addEntity(option) for option in @options

  removeFromGame: () ->
    @game.removeEntity(option) for option in @options



module.exports = MenuState