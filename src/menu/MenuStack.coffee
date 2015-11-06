MenuState = require 'menu/MenuState'

class MenuStack
  constructor: ->
    @list = [] # a list of menustates

    # push and pop should add/remove entities
  push: (state) ->
    if @list.size > 0
      peek.removeFromGame()
    @list.push(state)
    state.addToGame()

  pop: () ->
    if @list.size > 1
      state = @list.pop()
      state.removeFromGame()
      peek.addToGame()
      return @list.pop()

  peek: () ->
    return @list[@list.size() - 1]


module.exports = MenuStack