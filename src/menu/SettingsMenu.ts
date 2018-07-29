import ListMenu from "./ListMenu";
import MenuOption from "./MenuOption";
import NewGameMenu from "./NewGameMenu";
import MainMenu from "./MainMenu";

export default class SettingsMenu extends ListMenu {
  makeOptions() {
    return [
      new MenuOption("I am a setting", 20, 180, () => {
        console.log("You clicked me");
      }),
      new MenuOption("Back", 20, 280, () => {
        this.game.addEntity(new MainMenu());
        this.destroy();
      })
    ];
  }
}
