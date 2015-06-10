
# A variety of utility functions
Util = {
  # Convert a set to an array
  setToArray: (s) ->
    a = []
    iter = s.values()
    next = iter.next()
    while not next.done
      a.push(next.value)
      next = iter.next()
    return a

  # Modulo operator for modular arithmetic
  mod: (a, b) ->
    return ((a % b) + b) % b

  # Limit a value to be in a range.
  clamp: (value, min=-1, max=1) ->
    return Math.max(min, Math.min(max, value))

  # The smoothstep function between 0 and 1
  smoothStep: (value) ->
    value = Util.clamp(value, 0, 1)
    return value * value * (3 - 2 * value)
  
  # Return the difference between two angles
  angleDelta: (a, b) ->
    diff = b - a
    return Util.mod(diff + Math.PI, Math.PI * 2) - Math.PI;

}

module.exports = Util
