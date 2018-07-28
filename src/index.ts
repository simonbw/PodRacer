import "./core/Polyfills";
import * as Pixi from "pixi.js";
import FPSMeter from "./util/FPSMeter";
import Game from "./core/Game";
import Ground from "./environment/Ground";
import MainMenu from "./menu/MainMenu";
import { waitForFontsLoaded } from "./core/fonts";
import { loadPixiAssets } from "./images";
import { loadAllSounds } from "./sounds";

declare global {
  interface Window {
    DEBUG: {
      game: Game;
      aeroDebugDrawings: boolean;
    };
  }
}

window.addEventListener("load", () => {
  const audioContext = new AudioContext();

  console.log("window load");
  Promise.all([
    loadPixiAssets(),
    waitForFontsLoaded(),
    loadAllSounds(audioContext)
  ]).then(() => {
    console.log("after await");

    const game = new Game(audioContext);
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
