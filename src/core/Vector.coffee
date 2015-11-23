# This file contains hacks to the array class so it can act as a vector.

# Return the result of adding two vectors together
Array.prototype.add = (other) ->
  return [this[0] + other[0], this[1] + other[1]]

# In place addition
Array.prototype.iadd = (other) ->
  this[0] += other[0]
  this[1] += other[1]
  return this

# Return the result of subtracting a vector from this one
Array.prototype.sub = (other) ->
  return [this[0] - other[0], this[1] - other[1]]

# In place subtraction
Array.prototype.isub = (other) ->
  this[0] -= other[0]
  this[1] -= other[1]
  return this

# Return a the result of multiplying this vector and a scalar
Array.prototype.mul = (scalar) ->
  return [this[0] * scalar, this[1] * scalar]

# In place scalar multiplication
Array.prototype.imul = (scalar) ->
  this[0] *= scalar
  this[1] *= scalar
  return this

# Return a normalized version of this vector
Array.prototype.normalize = () ->
  if this[0] == this[1] == 0
    return [0, 0]
  magnitude = this.magnitude()
  return [this[0] / magnitude, this[1] / magnitude]

# Normalize this vector in place
Array.prototype.inormalize = () ->
  if this[0] == this[1] == 0
    return this
  magnitude = this.magnitude()
  this[0] /= magnitude
  this[1] /= magnitude
  return this

# Return this vector rotated 90 degrees clockwise
Array.prototype.rotate90cw = () ->
  return [this[1], -this[0]]

# Rotate this vector 90 degrees clockwise in place
Array.prototype.irotate90cw = () ->
  [this[0], this[1]] = [this[1], -this[0]]
  return this

# Return this vector rotated 90 degrees counterclockwise
Array.prototype.rotate90ccw = () ->
  return [-this[1], this[0]]

# Rotate this vector 90 degrees counterclockwise in place
Array.prototype.irotate90ccw = () ->
  [this[0], this[1]] = [-this[1], this[0]]
  return this

# Return the result of rotating this angle by `angle` radians ccw
Array.prototype.rotate = (angle) ->
  cos = Math.cos(angle)
  sin = Math.sin(angle)
  x = this[0]
  y = this[1]
  return [cos * x - sin * y, sin * x + cos * y]

# Rotate this angle in place
Array.prototype.irotate = (angle) ->
  cos = Math.cos(angle)
  sin = Math.sin(angle)
  x = this[0]
  y = this[1]
  this[0] = cos * x - sin * y
  this[1] = sin * x + cos * y
  return this

# Return the dot product of this vector and another vector
Array.prototype.dot = (other) ->
  return this[0] * other[0] + this[1] * other[1]

# Set the components of this vector
Array.prototype.set = (x, y) ->
  if typeof x == "number"
    this[0] = x
    this[1] = y
  else
    this[0] = x[0]
    this[1] = x[1]
  return this


# Alias for [0]
Object.defineProperty(Array.prototype, 'x', {
  'get': () ->
    return this[0]
  'set': (value) ->
    this[0] = value
  })

# Alias for [1]
Object.defineProperty(Array.prototype, 'y', {
  'get': () ->
    return this[1]
  'set': (value) ->
    this[1] = value
  })

# The magnitude (length) of this vector.
# Changing it does not change the angle
Object.defineProperty(Array.prototype, 'magnitude', {
  'get': () ->
    return Math.sqrt(this[0] * this[0] + this[1] * this[1])
  'set': (value) ->
    this.imul(value / this.magnitude)
  })

# The angle in radians ccw from east of this vector.
# Changing it does not change the magnitude
Object.defineProperty(Array.prototype, 'angle', {
  'get': () ->
    return Math.atan2(this[1], this[0])
  'set': (value) ->
    this.irotate(value - this.angle)
  })
