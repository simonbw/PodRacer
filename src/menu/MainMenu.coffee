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
NewGameMenu = require 'menu/NewGameMenu'
IO = require 'core/IO'

class MainMenu extends ListMenu
  setOptions: (x,y) =>
    @options = [
      new MenuOption("New Game", x, y, => 
        @game.addEntity(new NewGameMenu())
        @destroy())
      new MenuOption("Settings", x, y + 120, => 
        console.log "this should open a settings menu")
      ]

module.exports = MainMenu