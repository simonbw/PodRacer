Entity = require 'core/Entity'
IO = require 'core/IO'

class PauseController extends Entity

  pausable: false

  onButtonDown: (button) =>
    if button == 9
      @game.togglePause()

  onKeyDown: (key) =>
    if key == IO.SPACEBAR
      @game.togglePause()

module.exports = PauseController