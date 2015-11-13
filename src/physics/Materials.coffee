p2 = require 'p2'

Materials = {
  "RACER": new p2.Material(1)
  "WALL": new p2.Material(2)
}

Materials.contacts = [
  new p2.ContactMaterial(Materials.RACER, Materials.WALL, { "restitution": 99999 })
]

module.exports = Materials