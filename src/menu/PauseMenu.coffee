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
IO = require 'core/IO'
Ground = require 'Ground'

class PauseMenu extends ListMenu

  pausable: false

  setOptions: () =>
    @options = [
      new MenuOption("Continue", 20, 180, @unPause)
      new MenuOption("Quit", 20, 280, @toMainMenu)
      ]

  unPause: () =>
    @game.togglePause()
    @destroy()

  toMainMenu: () =>
    @game.togglePause()
    @game.clearAll()
    @game.addEntity(new Ground())
    MainMenu = require 'menu/MainMenu'
    @game.addEntity(new MainMenu())
    @destroy()

module.exports = PauseMenu