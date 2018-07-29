import * as Pixi from "pixi.js";
import Game from "../Game";
import p2 from "p2";
import PhysicsHandler from "./PhysicsHandler";
import GameEventHandler from "./GameEventHandler";
import IOEventHandler from "./IOEventHandler";
import { LayerName } from "../Layers";

export default interface Entity
  extends GameEventHandler,
    PhysicsHandler,
    IOEventHandler {
  // The game this entity belongs to.
  game: Game | null;

  readonly sprite?: Pixi.DisplayObject;

  readonly body?: p2.Body;

  readonly layer: LayerName;

  // True if this entity will stop updating when the game is paused.
  readonly pausable: boolean;

  destroy(): void;
}
