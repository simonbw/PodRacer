Entity = require 'core/Entity'
Util = require 'util/Util'


# Controlls the camera
class MenuCameraController extends Entity
  constructor: (@game) ->
    @zoom = 0.1
    @camera = @game.camera
    @position = [0,0]

  onRender: () ->
    @position[0] += 2 * @game.io.getAxis(2)
    @position[1] += 2 * @game.io.getAxis(3)
    @camera.center(@position)
    @zoom -= @game.io.getAxis(1)
    if @zoom <= 0.5
      @zoom = 0.5
    @camera.smoothZoom(@zoom)



module.exports = MenuCameraController