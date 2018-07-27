import * as Pixi from "pixi.js";

// Info about a rendering layer
export default class LayerInfo {
  readonly layer: Pixi.Container;
  readonly name: string;
  readonly scroll: number;

  constructor(name: string, scroll: number) {
    this.name = name;
    this.scroll = scroll;
    this.layer = new Pixi.Container();
  }
}
