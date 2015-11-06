
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

  # Return the length of a vector.
  length: ([x, y]) ->
    return Math.sqrt(x * x + y * y)
}

module.exports = Util