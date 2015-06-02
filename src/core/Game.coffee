GameRenderer = require 'core/GameRenderer'
IO = require 'core/IO'
p2 = require 'p2'
Profiler = require 'util/Profiler'
Drawing = require 'util/Drawing'

# Top Level control structure
class Game
  constructor: ->
    @entities = {
      all: []
      onRender: []
      onTick: []
      beforeTick: []
      afterTick: []
      toRemove: []
    }
    @renderer = new GameRenderer()
    @camera = @renderer.camera
    @world = new p2.World({
      gravity: [0, 0]
    })
    @world.on('beginContact', @beginContact)
    @world.on('endContact', @endContact)
    @world.on('impact', @endContact)
    @io = new IO(@renderer.pixiRenderer.view)
    @draw = new Drawing()

    @framerate = 60

    @profiler = new Profiler()
    @profiler.addPhase('frame')
    @profiler.addPhase('system', 'frame')
    @profiler.addPhase('loop', 'frame')
    @profiler.addPhase('cleanup', 'loop')
    @profiler.addPhase('tick', 'loop')
    @profiler.addPhase('physics', 'loop')
    @profiler.addPhase('afterTick', 'loop')
    @profiler.addPhase('render', 'loop')

  # Length of 1 frame in seconds
  @property 'timestep',
    get: ->
      return 1 / @framerate

  # Begin everything
  start: =>
    @addEntity(@camera)
    @addEntity(@draw)
    console.log "Game Started"
    window.requestAnimationFrame(@loop)
  
  # The main loop. Calls handlers, applies physics, and renders.
  loop: () =>
    @profiler.end('system')
    @profiler.end('frame')
    @profiler.start('frame')

    @profiler.start('loop')
    window.requestAnimationFrame(@loop)

    @profiler.start('tick')
    @tick()
    @profiler.end('tick')

    @profiler.start('physics')
    @world.step(@timestep)
    @profiler.end('physics')

    @profiler.start('afterTick')
    @afterTick()
    @profiler.end('afterTick')

    @profiler.start('render')
    @render()
    @profiler.end('render')

    @profiler.end('loop')
    @profiler.start('system')

  # Add an entity to the game.
  addEntity: (entity) =>
    entity.game = this
    if entity.onAdd? then entity.onAdd(this)
    @entities.all.push(entity)
    
    # Game events
    if entity.onRender? then @entities.onRender.push(entity)
    if entity.beforeTick? then @entities.beforeTick.push(entity)
    if entity.onTick? then @entities.onTick.push(entity)
    if entity.afterTick? then @entities.afterTick.push(entity)
    
    # IO events
    if entity.onClick? then @io.on(IO.CLICK, entity.onClick)
    if entity.onMouseDown? then @io.on(IO.MOUSE_DOWN, entity.onMouseDown)
    if entity.onMouseUp? then @io.on(IO.MOUSE_UP, entity.onMouseUp)
    if entity.onRightClick? then @io.on(IO.RIGHT_CLICK, entity.onRightClick)
    if entity.onRightDown? then @io.on(IO.RIGHT_DOWN, entity.onRightDown)
    if entity.onRightUp? then @io.on(IO.RIGHT_UP, entity.onRightUp)
    if entity.onKeyDown? then @io.on(IO.KEY_DOWN, entity.onKeyDown)
    if entity.onKeyUp? then @io.on(IO.KEY_UP, entity.onKeyUp)
    if entity.onButtonDown? then @io.on(IO.BUTTON_DOWN, entity.onButtonDown)
    if entity.onButtonUp? then @io.on(IO.BUTTON_UP, entity.onButtonUp)

    if entity.sprite? then @renderer.add(entity.sprite, entity.layer)
    if entity.body? then @world.addBody(entity.body)

    return entity

  # Slates an entity for removal.
  # Actually removing an entity at the wrong time can cause some problems, 
  # so we do it when it is next convenient.
  removeEntity: (entity) =>
    @entities.toRemove.push(entity)
    return entity
  
  # Actually removes references to the entities slated for removal
  cleanupEntities: =>
    # TODO: Do we really need a separate removal pass?
    # TODO: I think this can be more efficient.
    @profiler.start('cleanup')
    while @entities.toRemove.length
      entity = @entities.toRemove.pop()
      @entities.all.splice(@entities.all.indexOf(entity), 1)
      if entity.onRender?
        @entities.onRender.splice(@entities.onRender.indexOf(entity), 1)
      if entity.onTick?
        @entities.onTick.splice(@entities.onTick.indexOf(entity), 1)
      if entity.afterTick?
        @entities.afterTick.splice(@entities.afterTick.indexOf(entity), 1)
      
      if entity.sprite?
        @renderer.remove(entity.sprite, entity.layer)
      if entity.body?
        @world.removeBody(entity.body)

      if entity.onClick? then @io.off(IO.CLICK, entity.onClick)
      if entity.onMouseDown? then @io.off(IO.MOUSE_DOWN, entity.onMouseDown)
      if entity.onMouseUp? then @io.off(IO.MOUSE_UP, entity.onMouseUp)
      if entity.onRightClick? then @io.off(IO.RIGHT_CLICK, entity.onRightClick)
      if entity.onRightDown? then @io.off(IO.RIGHT_DOWN, entity.onRightDown)
      if entity.onRightUp? then @io.off(IO.RIGHT_UP, entity.onRightUp)
      if entity.onKeyDown? then @io.off(IO.KEY_DOWN, entity.onKeyDown)
      if entity.onKeyUp? then @io.off(IO.KEY_UP, entity.onKeyUp)
      if entity.onButtonDown? then @io.off(IO.BUTTON_DOWN, entity.onButtonDown)
      if entity.onButtonUp? then @io.off(IO.BUTTON_UP, entity.onButtonUp)
      
      if entity.onDestroy?
        entity.onDestroy(this)
      entity.game = null
    @profiler.end('cleanup')

  # Called before physics
  tick: =>
    @cleanupEntities()
    for entity in @entities.beforeTick
      entity.beforeTick()
    @cleanupEntities()
    for entity in @entities.onTick
      entity.onTick()

  # Called after physics
  afterTick: =>
    @cleanupEntities()
    for entity in @entities.afterTick
      entity.afterTick()

  # Called before rendering
  render: =>
    @cleanupEntities()
    for entity in @entities.onRender
      entity.onRender()
    @renderer.render()

  # Handle collision begin between things.
  # Fired during narrowphase of collision detection.
  beginContact: (e) =>
    if e.bodyA.beginContact?
      e.bodyA.beginContact(e.bodyB)
    if e.bodyB.beginContact?
      e.bodyB.beginContact(e.bodyA)

    if e.shapeA.beginContact?
      e.shapeA.beginContact(e.shapeB)
    if e.shapeB.beginContact?
      e.shapeB.beginContact(e.shapeA)

  # Handle collision end between things.
  # Fired after narrowphase of collision detection.
  endContact: (e) =>
    if e.bodyA.endContact?
      e.bodyA.endContact(e.bodyB)
    if e.bodyB.endContact?
      e.bodyB.endContact(e.bodyA)

    if e.shapeA.endContact?
      e.shapeA.endContact(e.shapeB)
    if e.shapeB.endContact?
      e.shapeB.endContact(e.shapeA)

  # Handle impact (called after physics is done)
  impact: (e) =>
    if e.bodyA.impact?
      e.bodyA.impact(e.bodyB)
    if e.bodyB.impact?
      e.bodyB.impact(e.bodyA)

module.exports = Game