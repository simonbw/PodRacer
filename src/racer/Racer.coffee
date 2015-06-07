Entity = require 'core/Entity'
Engine = require 'racer/Engine'
Pod = require 'racer/Pod'
p2 = require 'p2'
Pixi = require 'pixi.js'
ControlFlap = require 'racer/ControlFlap'
LinearSpring = p2.LinearSpring
RopeSpring = require 'physics/RopeSpring'
RacerDefs = require 'racer/RacerDefs'

# 
class Racer extends Entity
  constructor: ([x, y], @racerDef=RacerDefs.default) ->
    console.log "new racer"

    @pod = new Pod([x, y], @racerDef.pod)
    @leftEngine = new Engine([x - 1, y - 8], @racerDef.engine)
    @rightEngine = new Engine([x + 1, y - 8], @racerDef.engine)
    #TODO add flaps to engines here?
    @flaps = [] # controlled by right trigger

    # pod flaps TODO change with new RacerDefs
    @flaps.push(new ControlFlap(@pod.body, [0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 1, 1.3, 0))  # right
    @flaps.push(new ControlFlap(@pod.body, [-0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 0, 1.3, 0))  # left

    # left engine flaps 
    @flaps.push(new ControlFlap(@leftEngine.body, [0.5*@leftEngine.size[0], -0.5*@leftEngine.size[1]], 1, 1, 0.7, 0))
    @flaps.push(new ControlFlap(@leftEngine.body, [-0.5*@leftEngine.size[0], -0.5*@leftEngine.size[1]], 1, 0, 0.7, 0))

    # right engine flaps
    @flaps.push(new ControlFlap(@rightEngine.body, [0.5*@rightEngine.size[0], -0.5*@rightEngine.size[1]], 1, 1, 0.7, 0)) 
    @flaps.push(new ControlFlap(@rightEngine.body, [-0.5*@rightEngine.size[0], -0.5*@rightEngine.size[1]], 1, 0, 0.7, 0))

    # Springs
    @springs = []
    # ropes
    for [engine, podPoint] in [[@leftEngine, @pod.leftRopePoint], [@rightEngine, @pod.rightRopePoint]]
      @springs.push(new RopeSpring(@pod.body, engine.body, {
          localAnchorA: podPoint,
          localAnchorB: engine.ropePoint,
          stiffness: @racerDef.rope.stiffness,
          damping: @racerDef.rope.damping
        }))

    # engine couplings
    for [y1, y2] in [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      @springs.push(new LinearSpring(@leftEngine.body, @rightEngine.body, {
          localAnchorA: [0, @racerDef.engine.size[1] * y1],
          localAnchorB: [0, @racerDef.engine.size[1] * y2],
          stiffness: @racerDef.coupling.stiffness,
          damping: @racerDef.coupling.damping
        }))

  onAdd: (game) =>
    console.log "racer added"
    game.addEntity(@pod)
    game.addEntity(@leftEngine)
    game.addEntity(@rightEngine)

    for flap in @flaps
      game.addEntity(flap)

    for spring in @springs
      game.world.addSpring(spring)

  onRender: () =>
    width = @racerDef.rope.size # width in meters of the rope
    color = @racerDef.rope.color
    podLeftPoint = @pod.localToWorld(@pod.leftRopePoint)
    podRightPoint = @pod.localToWorld(@pod.rightRopePoint)
    leftEnginePoint = @leftEngine.localToWorld(@leftEngine.ropePoint)
    rightEnginePoint = @rightEngine.localToWorld(@rightEngine.ropePoint)
    @game.draw.line(podLeftPoint, leftEnginePoint, width, color)
    @game.draw.line(podRightPoint, rightEnginePoint, width, color)

  getWorldCenter: () =>
    x = (@leftEngine.body.position[0] + @rightEngine.body.position[0] + @pod.body.position[0]) / 3.0
    y = (@leftEngine.body.position[1] + @rightEngine.body.position[1] + @pod.body.position[1]) / 3.0
    return [x, y]

  onDestroy: (game) =>
    for spring in @springs
      game.world.removeSpring(spring)

module.exports = Racer