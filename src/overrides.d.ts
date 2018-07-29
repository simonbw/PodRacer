import p2 from "p2";
import * as Pixi from "pixi.js";
import Entity from "./core/Entity/index";

export default interface MaybeHasOwner {
  owner?: Entity;
}

declare module "p2" {
  interface Body extends MaybeHasOwner {}
  interface Shape extends MaybeHasOwner {}
}

declare module "pixi.js" {
  interface DisplayObject extends MaybeHasOwner {}
}
