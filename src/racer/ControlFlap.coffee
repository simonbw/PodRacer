Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Util = require 'util/Util'
Aero = require 'physics/Aerodynamics'

class ControlFlap extends Entity
  # body to attach to, position vector [x,y], length, default angle, direction to open (0 left, 1 right)
  constructor: (body, [x, y], length, direction, drag, lift) ->
    console.log "new flippy flappy at #{[x,y]}"
    @attachedBody = body
    @position = [x, y]
    @length = length
    @defaultAngle = -0.5 * Math.PI
    @angle = -0.5 * Math.PI
    @leftControl = 0
    @rightControl = 0
    @direction = direction
    @drag = drag
    @lift = lift

  onTick: () =>
    if @direction == 1
      @angle = @rightControl - 0.5 * Math.PI
    else 
      @angle = 1.5 * Math.PI - @leftControl

    if @rightControl != 0   # flap isn't there if it's not flapping
        end = [@position[0] + @length * @rightControl, @position[1]]# + @length * Math.sin(@angle)]
        Aero.applyAerodynamicsToEdge(@attachedBody, @position, end, @drag, @lift)

    if @leftControl != 0
        end = [@position[0] - @length * @leftControl, @position[1]]# + @length * Math.sin(@angle)]
        Aero.applyAerodynamicsToEdge(@attachedBody, end, @position, @drag, @lift)

  onRender: () =>  
    # draw line to indicate flap
    startPoint = []
    @attachedBody.toWorldFrame(startPoint, @position)
    #TODO change depending on left or right
    end = [@position[0] + @length * Math.cos(@angle), @position[1] + @length * Math.sin(@angle)]
    endPoint = []
    @attachedBody.toWorldFrame(endPoint, end)

    width = 0.1
    color = 0x000000
    @game.draw.line(startPoint, endPoint, width, color)

module.exports = ControlFlap
