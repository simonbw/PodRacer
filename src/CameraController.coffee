Entity = require 'core/Entity'

# Controlls the camera
class CameraController extends Entity
  constructor: (@racer, @camera) ->


  onRender: () ->
    @camera.center(@racer.getWorldCenter())



module.exports = CameraController