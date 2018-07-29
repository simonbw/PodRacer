import ListMenu from "./ListMenu";
import MenuOption from "./MenuOption";
import NewGameMenu from "./NewGameMenu";
import SettingsMenu from "./SettingsMenu";
import { TrackEditMode } from "../trackedit/TrackEditMode";

export default class MainMenu extends ListMenu {
  makeOptions() {
    return [
      new MenuOption("Play", 20, 180, () => {
        this.game.addEntity(new NewGameMenu());
        this.destroy();
      }),
      new MenuOption("Track Editor", 20, 280, () => {
        this.game.addEntity(new TrackEditMode());
        this.destroy();
      }),
      new MenuOption("Settings", 20, 380, () => {
        this.game.addEntity(new SettingsMenu());
        this.destroy();
      })
    ];
  }
}
