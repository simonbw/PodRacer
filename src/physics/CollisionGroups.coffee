# This file is used for creating collision group constants.
# This determines which shapes/bodies in the physics world will collide.

# Return the integer representing all groups provided as arguments
group = (groups...) ->
  mask = 0
  for n in groups
    mask |= Math.pow(2, n)
  return mask

# Constants representing groups for collisions
class CollisionGroups
  @ALL = group [0...16]...

  # GROUPS - classification of stuff
  # e.g. @GROUP_NAME = group 0

  # MASKS - what stuff runs into
  # e.g. @MASK_NAME = group 1, 2


module.exports = CollisionGroups