
# Manages
class IO
  # Mouse Constants
  @LMB = LMB = 0
  @RMB = RMB = 2
  @MMB = MMB = 1

  # Events
  @MOUSE_MOVE = MOUSE_MOVE = 'mousemove'
  @CLICK = CLICK = 'click'
  @RIGHT_CLICK = RIGHT_CLICK = 'rightclick'
  @RIGHT_UP = RIGHT_UP = 'rightup'
  @RIGHT_DOWN = RIGHT_DOWN = 'rightdown'
  @MOUSE_UP = MOUSE_UP = 'mouseup'
  @MOUSE_DOWN = MOUSE_DOWN = 'mousedown'
  @MOUSE_MOVE = MOUSE_MOVE = 'mousemove'
  @KEY_DOWN = KEY_DOWN = 'keydown'
  @KEY_UP = KEY_UP = 'keyup'
  @BUTTON_DOWN = BUTTON_DOWN = 'buttondown'
  @BUTTON_UP = BUTTON_UP = 'buttonup'

  # Keyboard key constants
  @TAB = 9
  @ENTER = 13
  @ESCAPE = 27
  @SPACE = 32
  @UP_ARROW = 38
  @RIGHT_ARROW = 39
  @DOWN_ARROW = 40
  @LEFT_ARROW = 41
  @ENTER = ENTER = 13

  # Gamepad Button constants
  @GAMEPAD_A = 0
  @GAMEPAD_B = 1
  @GAMEPAD_X = 2
  @GAMEPAD_Y = 3
  @GAMEPAD_LB = 4
  @GAMEPAD_RB = 5
  @GAMEPAD_LT = 6
  @GAMEPAD_RT = 7
  @GAMEPAD_BACK = 8
  @GAMEPAD_START = 9
  @GAMEPAD_L3 = 10
  @GAMEPAD_R3 = 11
  @GAMEPAD_D_UP = 12
  @GAMEPAD_D_DOWN = 13
  @GAMEPAD_D_LEFT = 14
  @GAMEPAD_D_RIGHT = 15
  @GAMEPAD_SPECIAL = 16

  # Gamepad Axes
  @GAMEPAD_LX = 0
  @GAMEPAD_LY = 1
  @GAMEPAD_RX = 2
  @GAMEPAD_RY = 3

  # Other Constants
  @DEADZONE = 0

  constructor: (@view) ->
    @view.onclick = @click
    @view.onmousedown = @mousedown
    @view.onmouseup = @mouseup
    @view.onmousemove = @mousemove
    @view.onmousemove = @mousemove
    document.onkeydown = @keydown
    document.onkeyup = @keyup
    @view.oncontextmenu = (e) =>
      e.preventDefault()
      @click(e)
      false

    @keys = []
    for i in [0..256]
      @keys.push(false)

    @mousePosition = [0, 0]

    @callbacks = {}
    @callbacks[CLICK] = []
    @callbacks[RIGHT_CLICK] = []
    @callbacks[RIGHT_UP] = []
    @callbacks[RIGHT_DOWN] = []
    @callbacks[MOUSE_UP] = []
    @callbacks[MOUSE_DOWN] = []
    @callbacks[MOUSE_MOVE] = []
    @callbacks[KEY_DOWN] = []
    @callbacks[KEY_UP] = []
    @callbacks[BUTTON_DOWN] = []
    @callbacks[BUTTON_UP] = []

    @mouseButtons = [false, false, false, false, false ,false]

    @lastButtons = []
    setInterval(@handleGamepads, 1)

  # Left Mouse Button
  @property 'lmb',
    get: ->
      return @mouseButtons[LMB]

  # Right Mouse Button
  @property 'rmb',
    get: ->
      return @mouseButtons[RMB]

  # Create events for gamepad button presses
  handleGamepads: () =>
    gamepad = navigator.getGamepads()[0]
    if gamepad?
      buttons = (button.pressed for button in gamepad.buttons)
      for button, i in buttons
        if button and !@lastButtons[i]
          for callback in @callbacks[BUTTON_DOWN]
            callback(i)
        else if !button and @lastButtons[i]
          for callback in @callbacks[BUTTON_UP]
            callback(i)

      @lastButtons = buttons
    else
      @lastButtons = []


  # Add an event handler
  on: (e, callback) =>
    @callbacks[e] ?= []
    @callbacks[e].push(callback)

  # Remove an event handler
  off: (e, callback) =>
    @callbacks[e].splice(@callbacks[e].indexOf(callback), 1)

  # Update the position of the mouse
  mousemove: (e) =>
    @mousePosition = [e.clientX, e.clientY]
    for callback in @callbacks[MOUSE_MOVE]
      callback(@mousePosition)

  # Call all click handlers
  click: (e) =>
    @mousePosition = [e.clientX, e.clientY]
    switch e.button
      when LMB
        for callback in @callbacks[CLICK]
          callback(@mousePosition)
      when RMB
        for callback in @callbacks[RIGHT_CLICK]
          callback(@mousePosition)

  # Call all mousedown handlers
  mousedown: (e) =>
    @mousePosition = [e.clientX, e.clientY]
    @mouseButtons[e.button] = true
    switch e.button
      when LMB
        for callback in @callbacks[MOUSE_UP]
          callback(@mousePosition)
      when RMB
        for callback in @callbacks[RIGHT_UP]
          callback(@mousePosition)

  # Call all mouseup handlers
  mouseup: (e) =>
    @mousePosition = [e.clientX, e.clientY]
    @mouseButtons[e.button] = false
    switch e.button
      when LMB
        for callback in @callbacks[MOUSE_DOWN]
          callback(@mousePosition)
      when RMB
        for callback in @callbacks[RIGHT_DOWN]
          callback(@mousePosition)

  shouldPreventDefault: (key) =>
    if key is IO.TAB
      return true
    if key is 83 # s for save
      return true
    return false

  # Handle key down
  keydown: (e) =>
    key = e.which
    wasPressed = @keys[key]
    @keys[key] = true
    if not wasPressed
      for callback in @callbacks[KEY_DOWN]
        callback(key)
    if @shouldPreventDefault(key)
      e.preventDefault()
      return false

  # Handle key up
  keyup: (e) =>
    key = e.which
    @keys[key] = false
    for callback in @callbacks[KEY_UP]
      callback(key)
    if @shouldPreventDefault(key)
      e.preventDefault()
      return false

  getAxis: (axis) =>
    gamepad = navigator.getGamepads()[0]
    if gamepad? #and Math.abs(gamepad.axes[axis]) >= @DEADZONE
      return gamepad.axes[axis]
    return 0

  getButton: (button) =>
    gamepad = navigator.getGamepads()[0]
    if gamepad?
      return gamepad.buttons[button]
    return {'value': 0, 'pressed': false}

module.exports = IO