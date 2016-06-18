import * as Pixi from 'pixi.js';
import Entity from './../core/Entity';

export default class Ground extends Entity {
  constructor() {
    super();
    this.layer = 'world_back';
    this.sprite = new Pixi.Graphics();
    this.sprite = Pixi.extras.TilingSprite.fromImage('images/ground.jpg', 1000000, 1000000);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.scale.x = 0.04;
    this.sprite.scale.y = 0.04;
  }

  onAdd() {
    // TODO: Need layers
    //this.game.addEntity(new Dust(1));
    //this.game.addEntity(new Dust(2));
    //this.game.addEntity(new Dust(3));
  }
}

class Dust extends Entity {
  constructor(level = 1) {
    super();
    this.layer = `dust_${level}`;
    this.sprite = Pixi.extras.TilingSprite.fromImage('images/ground.jpg', 1000000, 1000000);
    this.sprite.anchor.x = Math.random();
    this.sprite.anchor.y = Math.random();

    const scale = 0.14 + level * 0.05;
    this.sprite.scale.x = scale;
    this.sprite.scale.y = scale;

    this.sprite.alpha = 0.3;
    this.sprite.blendMode = Pixi.BLEND_MODES.NORMAL
  }
}