# some sort of menu
MenuState = require 'menu/MenuState'
MenuStack = require 'menu/MenuStack'
MenuCameraController = require 'camera/MenuCameraController'
Ground = require 'Ground'
Game = require 'core/Game'


class Menu 
  constructor: (@game)->
    console.log "building new menu object"
    @stack = new MenuStack()
    @menuCameraController = new MenuCameraController(game)
    @game.addEntity(@menuCameraController)
    @game.addEntity(new Ground())
    @game.start()

  begin: (name, options) ->
    console.log "menu begin"
    @stack.push(new MenuState(name, @game, options))


module.exports = Menu