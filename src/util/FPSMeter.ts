import * as Pixi from "pixi.js";
import BaseEntity from "../core/BaseEntity";
import { HEADING_FONT } from "../core/fonts";

export default class FPSMeter extends BaseEntity {
  lastUpdate: number;
  averageDuration: number;
  sprite: Pixi.Text;

  constructor() {
    super();
    this.layer = "hud";
    this.sprite = new Pixi.Text("Super Pod Racer", {
      fontFamily: HEADING_FONT,
      fontSize: "12px",
      fill: 0x000000
    });
    this.sprite.x = 10;
    this.sprite.y = 10;
    this.lastUpdate = performance.now();
    this.averageDuration = 60;
  }

  onRender() {
    const now = performance.now();
    this.averageDuration =
      0.9 * this.averageDuration + 0.1 * (now - this.lastUpdate);
    this.lastUpdate = now;
    this.sprite.text = String(Math.round(1000 / this.averageDuration));
  }
}
