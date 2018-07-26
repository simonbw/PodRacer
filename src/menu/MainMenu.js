import ListMenu from './ListMenu';
import MenuOption from './MenuOption';
import NewGameMenu from './NewGameMenu';

export default class MainMenu extends ListMenu {
  setOptions() {
    this.options = [
      new MenuOption('New Game', 20, 180, () => {
        this.game.addEntity(new NewGameMenu());
        this.destroy();
      }),
      new MenuOption('Settings', 20, 280, () => {
        console.log('This should open a settings menu!');
      })
    ];
  }
}
