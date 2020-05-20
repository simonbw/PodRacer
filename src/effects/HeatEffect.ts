import * as Pixi from "pixi.js";
import BaseEntity from "../core/entity/BaseEntity";
import { imageUrls } from "../core/resources/images";
import Game from "../core/Game";
import { MotionBlurFilter } from "@pixi/filter-motion-blur";
import { Vector } from "../core/Vector";

export default class HeatEffect extends BaseEntity {
  private displacementSprite: Pixi.Sprite;
  private filter: Pixi.filters.DisplacementFilter;

  onAdd(game: Game) {
    this.displacementSprite = Pixi.Sprite.from(imageUrls.displace);
    this.displacementSprite.anchor.set(0.5, 0.5);
    this.displacementSprite.scale.set(0.03);

    this.filter = new Pixi.filters.DisplacementFilter(this.displacementSprite);
    this.filter.scale.x = 40;
    this.filter.scale.y = 40;

    game.renderer.add(this.displacementSprite, "world");
    game.renderer.addFilter(this.filter, "world_back");

    console.log("heat effect added");
  }

  setPosition([x, y]: Vector) {
    this.displacementSprite.position.x = x;
    this.displacementSprite.position.y = y;
  }

  onTick() {
    console.log("heat ticking");
    // this.displacementSprite.position.x += 1;
    // this.displacementSprite.position.y += 1;
    // this.displacementSprite.position.set(, 10);
  }
}
