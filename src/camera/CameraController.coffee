Entity = require 'core/Entity'
Util = require 'util/Util'


# Controlls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  onRender: () ->
    @camera.center(@racer.getWorldCenter())
    speed = Util.length(@racer.getPodVelocity())
    @camera.smoothZoom(20 / (1 + 0.1 * Math.log(speed + 1)))



module.exports = CameraController