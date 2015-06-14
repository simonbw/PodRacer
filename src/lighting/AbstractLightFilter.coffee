Pixi = require 'pixi.js'


# Base class for light filters
class AbstractLightFilter extends Pixi.AbstractFilter
  constructor: (shader, uniforms) ->
    super(null, shader, uniforms)

module.exports = AbstractLightFilter