Entity = require 'core/Entity'
p2 = require 'p2'
Pixi = require 'pixi.js'
Aero = require 'physics/Aerodynamics'
RacerDefs = require 'racer/RacerDefs'
ControlFlap = require 'racer/ControlFlap'


class Pod extends Entity
  constructor: ([x, y], @podDef) ->
    console.log "new pod at #{[x, y]}"

    [w, h] = @podDef.size
    @size = @podDef.size

    @sprite = new Pixi.Graphics()
    @sprite.beginFill(@podDef.color)
    @sprite.drawRect(-0.5 * w, -0.5 * h, w, h)
    @sprite.endFill()

    @size = [w, h]

    @body = new p2.Body {
      position: [x, y]
      mass: @podDef.mass
      angularDamping: 0.01
      damping: 0.0
    }
    
    shape = new p2.Rectangle(w, h)
    @body.addShape(shape, [0, 0], 0)

    @leftRopePoint = [-0.4 * w, -0.45 * h] # point the left rope connects in local coordinates
    @rightRopePoint = [0.4 * w, -0.45 * h] # point the right rope connects in local coordinates

    @flaps = []
    for flapDef in @podDef.flaps
      leftDef = {}
      rightDef = {}
      for prop in ['color', 'drag', 'length', 'maxAngle']
        leftDef[prop] = rightDef[prop] = flapDef[prop]
      leftDef['direction'] = ControlFlap.LEFT
      rightDef['direction'] = ControlFlap.RIGHT
      leftDef['position'] = [-@size[0] / 2, flapDef.y]
      rightDef['position'] = [@size[0] / 2, flapDef.y]
      @flaps.push(new ControlFlap(@body, leftDef))
      @flaps.push(new ControlFlap(@body, rightDef))

  # Set the control value on all the racer's flaps
  # @param left {number} - between 0 and 1
  # @param right {number} - between 0 and 1
  setFlaps: (left, right) =>
    for flap in @flaps
      if flap.direction == ControlFlap.LEFT
        flap.setControl(left)
      if flap.direction == ControlFlap.RIGHT
        flap.setControl(right)

  onAdd: (game) =>
    console.log "pod added"
    for flap in @flaps
      game.addEntity(flap)

  onRender: () =>
    [@sprite.x, @sprite.y] = @body.position
    @sprite.rotation = @body.angle

  onTick: () =>
    Aero.applyAerodynamics(@body, @podDef.drag, @podDef.drag)

  onDestroy: (game) =>
    for flap in @flaps
      flap.destoy()


module.exports = Pod