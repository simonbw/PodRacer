Entity = require 'core/Entity'
IO = require 'core/IO'
PauseMenu = require 'menu/PauseMenu'

class PauseController extends Entity

  pausable: false

  onButtonDown: (button) =>
    if button == 9 and not @game.paused
      @game.togglePause()
      @game.addEntity(new PauseMenu())

  onKeyDown: (key) =>
    if key == IO.SPACE and not @game.paused
      @game.togglePause()
      @game.addEntity(new PauseMenu())


module.exports = PauseController