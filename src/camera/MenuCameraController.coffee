Entity = require 'core/Entity'
Util = require 'util/Util'


# Controls the camera
class MenuCameraController extends Entity
  onAdd: () ->
    @zoom = 0.1
    @camera = @game.camera
    @position = [0,0]

  onRender: () ->
    @camera.x += 0.05
    @camera.y += 0.02


module.exports = MenuCameraController