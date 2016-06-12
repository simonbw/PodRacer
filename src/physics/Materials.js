import p2 from 'p2';


export const RACER = new p2.Material(1);
export const WALL = new p2.Material(2);

export const CONTACTS = [
  new p2.ContactMaterial(RACER, WALL, { "restitution": 1 })
];
