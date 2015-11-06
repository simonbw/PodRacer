
class MenuStack
  constructor: () ->
    @list = []

  push: (menu) ->
    @list.push(menu)

  pop: () ->
    @list.pop()

  peek: () ->
    return @list[@list.length - 1]

module.exports = MenuStack