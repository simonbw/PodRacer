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
  setOptions: () =>
    @options = [
      new MenuOption("New Game", 20, 180, => 
        @game.addEntity(new NewGameMenu())
        @destroy())
      new MenuOption("Settings", 20, 280, => 
        console.log "this should open a settings menu")
      ]

module.exports = MainMenu