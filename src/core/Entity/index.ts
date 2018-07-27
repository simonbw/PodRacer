import * as Pixi from "pixi.js";
import Game from "../Game";
import p2 from "p2";
import PhysicsHandler from "./PhysicsHandler";
import GameEventHandler from "./GameEventHandler";
import IOEventHandler from "./IOEventHandler";
import HasOwner from "../HasOwner";

export default interface Entity
  extends GameEventHandler,
    PhysicsHandler,
    IOEventHandler {
  // The game this entity belongs to.
  game: Game;

  readonly sprite?: Pixi.DisplayObject & HasOwner;

  readonly body?: p2.Body & HasOwner;

  readonly layer: string;

  // True if this entity will stop updating when the game is paused.
  readonly pausable: boolean;

  destroy(): void;
}
