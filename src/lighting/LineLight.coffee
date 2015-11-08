Pixi = require 'pixi.js'
fs = require 'fs'
Util = require 'util/Util'
AbstractLightFilter = require 'lighting/AbstractLightFilter'


# The shader used to render the light
FRAGMENT_SHADER = fs.readFileSync(__dirname + '/line_light.frag', 'utf8')


# A light all along a line
# TODO: This shouldn't have to extend Pixi.Graphics if I could figure out the filterArea thing
class LineLight extends Pixi.Graphics
  constructor: (@lights, @startPoint = [0, 0], @endPoint = [1, 1], @radius = 5, @color = 0xFFFFFF, @intensity = 1) ->
    super()
    @blendMode = Pixi.BLEND_MODES.ADD
    @lightFilter = new LineLightFilter()
    @filters = [@lightFilter]

    @redraw()

  redraw: () =>
    @clear()
    @beginFill(@color)
    center = @startPoint.add(@endPoint).imul(0.5)
    r = @radius + @startPoint.sub(@endPoint).magnitude / 2
    @drawCircle(center[0], center[1], r)
    @endFill()

#    @lineStyle(@radius, @color)
#    @moveTo(@startPoint.sub([0.5, 0.5])...)
#    @lineTo(@endPoint.sub([0.5, 0.5])...)

  onRender: (camera) =>
    @redraw()
    @lightFilter.uniforms.startPoint.value = camera.toScreen(@startPoint)
    @lightFilter.uniforms.endPoint.value = camera.toScreen(@endPoint)
    @lightFilter.uniforms.color.value = Util.Color.intToRgb(@color)
    @lightFilter.uniforms.intensity.value = @intensity
    @lightFilter.uniforms.radius.value = @radius
    @lightFilter.uniforms.scale.value = camera.z

  destroy: () =>
    @lights.removeLight(this);


#
class LineLightFilter extends AbstractLightFilter
  constructor: (radius) ->
    super FRAGMENT_SHADER, {
      startPoint: {type: '2f', value: [0, 0]}
      endPoint: {type: '2f', value: [0, 0]}
      color: {type: '3f', value: 1.0}
      intensity: {type: '1f', value: 1.0}
      radius: {type: '1f', value: radius}
      scale: {type: '1f', value: 1.0}
    }


module.exports = LineLight