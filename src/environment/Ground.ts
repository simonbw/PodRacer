import * as Pixi from "pixi.js";
import BaseEntity from "../core/BaseEntity";
import { imageUrls } from "../images";

const SIZE = 100000;

export default class Ground extends BaseEntity {
  sprite: Pixi.Sprite;
  layer = "world_back";

  constructor() {
    super();
    this.sprite = new Pixi.extras.TilingSprite(
      Pixi.loader.resources[imageUrls.ground].texture,
      SIZE,
      SIZE
    );
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

class Dust extends BaseEntity {
  sprite: Pixi.Sprite;

  constructor(level = 1) {
    super();
    this.layer = `dust_${level}`;

    this.sprite = new Pixi.extras.TilingSprite(
      Pixi.loader.resources[imageUrls.ground].texture,
      SIZE,
      SIZE
    );

    this.sprite.anchor.x = Math.random();
    this.sprite.anchor.y = Math.random();

    const scale = 0.14 + level * 0.05;
    this.sprite.scale.x = scale;
    this.sprite.scale.y = scale;

    this.sprite.alpha = 0.3;
    this.sprite.blendMode = Pixi.BLEND_MODES.NORMAL;
  }
}
