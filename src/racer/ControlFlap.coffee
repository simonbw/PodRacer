Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util.coffee'
Aero = require 'physics/Aerodynamics'

class ControlFlap extends Entity
  @LEFT = false
  @RIGHT = true

  # body to attach to, position vector [x,y], length, default angle, direction to open (0 left, 1 right)
  constructor: (@attachedBody, @flapDef) ->
    @direction = @flapDef.direction
    @position = @flapDef.position
    @control = 0

  setControl: (value) =>
    @control = Util.clamp(value, 0, 1)
  
  getAngle: () =>
    angle = @flapDef.maxAngle * @control
    if @direction == ControlFlap.LEFT
      angle *= -1
    return angle - Math.PI / 2

  onTick: () =>
    angle = @getAngle()
    start = @position
    if @direction == ControlFlap.LEFT
      end = [start[0] - @control, start[1]]
      Aero.applyAerodynamicsToEdge(@attachedBody, end, start, @flapDef.drag, 0)
    else if @direction == ControlFlap.RIGHT
      end = [start[0] + @control, start[1]]
      Aero.applyAerodynamicsToEdge(@attachedBody, start, end, @flapDef.drag, 0)

  onRender: () =>  
    # draw line to indicate flap
    startPoint = [0, 0]
    @attachedBody.toWorldFrame(startPoint, @position)

    angle = @getAngle()
    end = [@position[0] + @flapDef.length * Math.cos(angle), @position[1] + @flapDef.length * Math.sin(angle)]
    @attachedBody.toWorldFrame(end, end)

    width = 0.1
    @game.draw.line(startPoint, end, width, @flapDef.color)

module.exports = ControlFlap
