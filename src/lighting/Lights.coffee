Entity = require 'core/Entity'
Pixi = require 'pixi.js'
Util = require 'util/Util'
PointLight = require 'lighting/PointLight'
DirectionalLight = require 'lighting/DirectionalLight'
LineLight = require 'lighting/LineLight'


AMBIENT_COLOR = 0x111111

# Dynamic lighting engine
class Lights extends Entity
  constructor: () ->
    @layer = 'world_lights';

    @lights = []

    @darkGraphics = new Pixi.Graphics()
    @lightContainer = new Pixi.Graphics()
    @lightContainer.blendMode = Pixi.BLEND_MODES.ADD

    @darkGraphics.beginFill(AMBIENT_COLOR)
    @darkGraphics.drawRect(-50000, -50000, 100000, 100000)
    @darkGraphics.endFill()

    # We need an extra container so we can render stuff with transform information
    @lightWrapper = new Pixi.Container()
    @lightWrapper.addChild(@lightContainer)

  onAdd: (game) =>
    renderer = game.renderer.pixiRenderer
    @texture = new Pixi.RenderTexture(renderer, renderer.width, renderer.height)
    @sprite = new Pixi.Sprite(@texture)
    @sprite.anchor.set(0, 0)
    @sprite.blendMode = Pixi.BLEND_MODES.MULTIPLY

  # Create a new point light
  newPointLight: (args...) =>
    light = new PointLight(this, args...)
    @lightContainer.addChild(light)
    @lights.push(light)
    return light

  # Create a new directional light
  newDirectionalLight: (args...) =>
    light = new DirectionalLight(this, args...)
    @lightContainer.addChild(light)
    @lights.push(light)
    return light

  # Create a new line light
  newLineLight: (args...) =>
    light = new LineLight(this, args...)
    @lightContainer.addChild(light)
    @lights.push(light)
    return light

  # Remove a light
  removeLight: (light) =>
    @lightContainer.removeChild(light)
    @lights.splice(@lights.indexOf(light), 1)
    light.lights = null

  #
  onRender: (camera) =>
    # console.log "rendering lights"
    @texture.clear()

    for light in @lights
      light.onRender(camera)

    [@lightContainer.x, @lightContainer.y] = camera.toScreen([0, 0])
    @lightContainer.scale.set(camera.z, camera.z)

    @texture.render(@darkGraphics)
    @texture.render(@lightWrapper)



module.exports = Lights