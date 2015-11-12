Entity = require 'core/Entity'

class PauseController extends Entity

  pausable: false

  onButtonDown: (button) =>
    console.log "pause is being pushed"
    if button == 9
      @game.togglePause()

module.exports = PauseController