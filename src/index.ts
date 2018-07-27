import "./core/Polyfills";
import * as Pixi from "pixi.js";
import FPSMeter from "./util/FPSMeter";
import Game from "./core/Game";
import Ground from "./environment/Ground";
import MainMenu from "./menu/MainMenu";
import { waitForFontsLoaded } from "./core/fonts";
import { loadPixiAssets } from "./images";

declare global {
  interface Window {
    DEBUG: {
      game: Game;
      aeroDebugDrawings: boolean;
    };
  }
}

window.addEventListener("load", () => {
  console.log("window load");
  Promise.all([loadPixiAssets(), waitForFontsLoaded()]).then(() => {
    console.log("after await");

    const game = new Game();
    game.addEntity(new FPSMeter());
    game.addEntity(new MainMenu());
    game.addEntity(new Ground());
    game.start();

    window.DEBUG = {
      game: game,
      aeroDebugDrawings: false
    };
  });
});
