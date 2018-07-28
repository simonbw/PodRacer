import Game from "./Game";
import p2 from "p2";
import Entity from "./Entity/index";
import Pixi from "pixi.js";
import { Vector } from "./Vector";
import { LayerName } from "./Layers";

/**
 * Base class for lots of stuff in the game
 */
export default abstract class BaseEntity implements Entity {
  game: Game;
  sprite: Pixi.DisplayObject;
  body: p2.Body;
  layer: LayerName;
  pausable: boolean = true;

  // Convert local coordinates to world coordinates.
  // Requires either a body or a sprite.
  localToWorld(point: Vector): Vector {
    if (this.body) {
      const result = [0, 0] as Vector;
      this.body.toWorldFrame(result, point);
      return result;
    }
    if (this.sprite) {
      const result = this.sprite.toGlobal(new Pixi.Point(point[0], point[1]));
      return [result.x, result.y] as Vector;
    }
    return [0, 0] as Vector;
  }

  // Removes this from the game
  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
    }
  }
}
