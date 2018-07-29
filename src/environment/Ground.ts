import * as Pixi from "pixi.js";
import BaseEntity from "../core/BaseEntity";
import { imageUrls } from "../images";

const SIZE = 100000;

export default class Ground extends BaseEntity {
  sprite: Pixi.Sprite;
  layer: "world_back" = "world_back";

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
}
