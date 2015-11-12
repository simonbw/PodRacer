Pixi = require 'pixi.js'
# Base class for everything in the game.
# You should extend this to make anything.
# 
# All the following methods are meant to be overridden.
# 
# @method #onAdd()
#   Called right before being added to the game
#
# @method #onRender()
#   Called before rendering
#
# @method #onTick()
#   Called right before physics
#
# @method #beforeTick()
#   Called before normal tick
#
# @method #afterTick()
#   Called after updating
#
# @method #onDestroy()
#   Called after being removed from the game
# 
# @method #onClick()
#   IO Event Handler
# 
# @method #onMouseDown()
#   IO Event Handler
# 
# @method #onMouseUp()
#   IO Event Handler
# 
# @method #onRightClick()
#   IO Event Handler
# 
# @method #onRightDown()
#   IO Event Handler
# 
# @method #onRightUp()
#   IO Event Handler
# 
# @method #onKeyDown()
#   IO Event Handler
# 
class Entity
  @hashCount = 0

  # if true, this entity stops doing stuff when the game is paused
  pausable: true

  # Remove this entity from the game it is in
  destroy: () =>
    if @game? then @game.removeEntity(this)

  # Convert local coordinates to world coordinates
  # Requires either a body or a sprite
  localToWorld: (point) =>
    if @body?
      result = [0, 0]
      @body.toWorldFrame(result, point)
      return result
    if @sprite?
      result = @sprite.toGlobal(new Pixi.Point(point[0], point[1]))
      return [result.x, result.y]
    return [0, 0]
  
  # Give an id to every entity that is hashed
  hash: () =>
    if !@_hashcode?
      @_hashcode = Entity.hashCount
      Entity.hashCount++
    return @_hashcode

  # Pixi.DisplayObject] sprite
  #   added to renderer when added to game.
  #   Do NOT change once added to game
  
  # layer [Pixi.DisplayObject]
  #   renderer layer to add sprite to
  #   Do NOT change once added to game
  
  # body [p2.Body]
  #   renderer layer to add sprite to
  #   Do NOT change once added to game


module.exports = Entity
