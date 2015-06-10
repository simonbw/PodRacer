# Allows defining of properties on classes.
# It is a little sketchy and may disappear soon.
Function::property = (property, descriptor) ->
  Object.defineProperty this.prototype, property, descriptor