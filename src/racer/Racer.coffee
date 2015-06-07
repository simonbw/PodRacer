Entity = require 'core/Entity'
Engine = require 'racer/Engine'
Pod = require 'racer/Pod'
p2 = require 'p2'
Pixi = require 'pixi.js'
ControlFlap = require 'racer/ControlFlap'
LinearSpring = p2.LinearSpring
RopeSpring = require 'physics/RopeSpring'

class Racer extends Entity
  constructor: ([x, y]) ->
    console.log "new racer"
    podSize = [1, 1.5]
    engineSize = [0.5, 2]
    @pod = new Pod([x, y], [1, 1.5])
    @leftEngine = new Engine([x - 1, y - 8], engineSize)
    @rightEngine = new Engine([x + 1, y - 8], engineSize)

    #TODO add flaps to engines here?
    @flaps = [] # controlled by right trigger

    # pod flaps TODO change with new RacerDefs
    @flaps.push(new ControlFlap(@pod.body, [0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 1))  # right
    @flaps.push(new ControlFlap(@pod.body, [-0.5*@pod.size[0], 0.5*@pod.size[1]], 1, 0))  # left

    # left engine flaps 
    @flaps.push(new ControlFlap(@leftEngine.body, [0.5*@leftEngine.size[0], -0.5*@leftEngine.size[1]], 1, 1))
    @flaps.push(new ControlFlap(@leftEngine.body, [-0.5*@leftEngine.size[0], -0.5*@leftEngine.size[1]], 1, 0))

    # right engine flaps
    @flaps.push(new ControlFlap(@rightEngine.body, [0.5*@rightEngine.size[0], -0.5*@rightEngine.size[1]], 1, 1)) 
    @flaps.push(new ControlFlap(@rightEngine.body, [-0.5*@rightEngine.size[0], -0.5*@rightEngine.size[1]], 1, 0))



    # Springs
    @springs = []
    # ropes
    for [engine, podPoint] in [[@leftEngine, @pod.leftRopePoint], [@rightEngine, @pod.rightRopePoint]]
      @springs.push(new RopeSpring(@pod.body, engine.body, {
          localAnchorA: podPoint,
          localAnchorB: engine.ropePoint,
          stiffness: 10,
          damping: 1
        }))

    # engine couplings
    for [y1, y2] in [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      @springs.push(new LinearSpring(@leftEngine.body, @rightEngine.body, {
          localAnchorA: [0, engineSize[1] * y1],
          localAnchorB: [0, engineSize[1] * y2],
          stiffness: 20,
          damping: 0.5
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
    width = 0.03 # width in meters of the rope
    color = 0x444444
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