import * as GamepadAxes from "./constants/GamepadAxes";
import * as Keys from "./constants/Keys";
import * as MouseButtons from "./constants/MouseButtons";
import { Vector } from "./Vector";
import IOEventHandler from "./Entity/IOEventHandler";
import IOHandlerList from "./IOHandlerList";

const GAMEPAD_MINIMUM = 0.2; // TODO: allow user configuration
const GAMEPAD_MAXIMUM = 0.95; // TODO: allow user configuration

// Manages IO
export class IOManager {
  handlers = new IOHandlerList();

  keys: boolean[];
  lastButtons: any[];
  mouseButtons = [false, false, false, false, false, false];
  mousePosition = [0, 0] as Vector;
  usingGamepad: boolean = false; // True if the gamepad is the main input device
  view: HTMLCanvasElement;

  constructor(view: any) {
    this.view = view;

    this.view.onclick = e => this.onClick(e);
    this.view.onmousedown = e => this.onMouseDown(e);
    this.view.onmouseup = e => this.onMouseUp(e);
    this.view.onmousemove = e => this.onMouseMove(e);
    this.view.oncontextmenu = e => {
      e.preventDefault();
      this.onClick(e);
      return false;
    };

    document.onkeydown = e => {
      this.onKeyDown(e);
    };
    document.onkeyup = e => this.onKeyUp(e);

    this.keys = [];
    for (let i = 0; i <= 256; i++) {
      this.keys.push(false);
    }

    this.lastButtons = []; // buttons pressed last frame. Used for checking differences in state.

    // Because this is a polling not pushing interface
    window.setInterval(() => this.handleGamepads(), 1);
  }

  // True if the left mouse button is down.
  get lmb(): boolean {
    return this.mouseButtons[MouseButtons.LEFT];
  }

  // True if the middle mouse button is down.
  get mmb(): boolean {
    return this.mouseButtons[MouseButtons.MIDDLE];
  }

  // True if the right mouse button is down.
  get rmb(): boolean {
    return this.mouseButtons[MouseButtons.RIGHT];
  }

  // Fire events for gamepad button presses.
  handleGamepads(): void {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      const buttons = gamepad.buttons.map(button => button.pressed);

      for (const [buttonIndex, button] of buttons.entries()) {
        if (button && !this.lastButtons[buttonIndex]) {
          this.usingGamepad = true;
          for (const handler of this.handlers.filtered.onButtonDown) {
            handler.onButtonDown(buttonIndex);
          }
        } else if (!button && this.lastButtons[buttonIndex]) {
          for (const handler of this.handlers.filtered.onButtonUp) {
            handler.onButtonUp(buttonIndex);
          }
        }
      }
      this.lastButtons = buttons;
    } else {
      this.lastButtons = [];
    }
  }

  addHandler(handler: IOEventHandler): void {
    this.handlers.add(handler);
  }

  removeHandler(handler: IOEventHandler): void {
    this.handlers.remove(handler);
  }

  // Update the position of the mouse.
  onMouseMove(event: MouseEvent) {
    this.usingGamepad = false;
    this.mousePosition = [event.clientX, event.clientY] as Vector;
  }

  // Fire all click handlers.
  onClick(event: MouseEvent) {
    this.usingGamepad = false;
    this.mousePosition = [event.clientX, event.clientY] as Vector;
    switch (event.button) {
      case MouseButtons.LEFT:
        for (const handler of this.handlers.filtered.onClick) {
          handler.onClick();
        }
        break;
      case MouseButtons.RIGHT:
        for (const handler of this.handlers.filtered.onRightClick) {
          handler.onRightClick();
        }
        break;
    }
  }

  // Fire all mouse down handlers.
  onMouseDown(event: MouseEvent) {
    this.usingGamepad = false;
    this.mousePosition = [event.clientX, event.clientY] as Vector;
    this.mouseButtons[event.button] = true;
    switch (event.button) {
      case MouseButtons.LEFT:
        for (const handler of this.handlers.filtered.onMouseDown) {
          handler.onMouseDown();
        }
        break;
      case MouseButtons.RIGHT:
        for (const handler of this.handlers.filtered.onRightDown) {
          handler.onRightDown();
        }
        break;
    }
  }

  // Fire all mouse up handlers
  onMouseUp(event: MouseEvent) {
    this.usingGamepad = false;
    this.mousePosition = [event.clientX, event.clientY] as Vector;
    this.mouseButtons[event.button] = false;
    switch (event.button) {
      case MouseButtons.LEFT:
        for (const handler of this.handlers.filtered.onMouseUp) {
          handler.onMouseUp();
        }
        break;
      case MouseButtons.RIGHT:
        for (const handler of this.handlers.filtered.onRightUp) {
          handler.onRightUp();
        }
        break;
    }
  }

  // Determine whether or not to prevent the default action of a key press.
  shouldPreventDefault(key: number): boolean {
    if (key === Keys.TAB) {
      return true;
    }
    if (key === 83) {
      // s for save
      return true;
    }
    return false;
  }

  // Fire all key down handlers.
  onKeyDown(event: KeyboardEvent) {
    const key = event.which;
    const wasPressed = this.keys[key]; // for filtering out auto-repeat stuff
    this.keys[key] = true;
    if (!wasPressed) {
      for (const handler of this.handlers.filtered.onKeyDown) {
        handler.onKeyDown(key);
      }
    }
    if (this.shouldPreventDefault(key)) {
      event.preventDefault();
      return false;
    }
  }

  // Fire all key up handlers.
  onKeyUp(event: KeyboardEvent) {
    const key = event.which;
    this.keys[key] = false;
    for (const handler of this.handlers.filtered.onKeyUp) {
      handler.onKeyUp(key);
    }
    if (this.shouldPreventDefault(key)) {
      event.preventDefault();
      return false;
    }
  }

  // Return the value of a gamepad axis.
  getAxis(axis: number): number {
    switch (axis) {
      case GamepadAxes.LEFT_X:
        return this.getStick(GamepadAxes.LEFT).x;
      case GamepadAxes.LEFT_Y:
        return this.getStick(GamepadAxes.LEFT).y;
      case GamepadAxes.RIGHT_X:
        return this.getStick(GamepadAxes.RIGHT).x;
      case GamepadAxes.RIGHT_Y:
        return this.getStick(GamepadAxes.RIGHT).y;
    }
  }

  getStick(stick: "left" | "right") {
    const axes = [0, 0] as Vector;
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      if (stick === GamepadAxes.LEFT) {
        axes.x = gamepad.axes[GamepadAxes.LEFT_X];
        axes.y = gamepad.axes[GamepadAxes.LEFT_Y];
      } else {
        axes.x = gamepad.axes[GamepadAxes.RIGHT_X];
        axes.y = gamepad.axes[GamepadAxes.RIGHT_Y];
      }
      const gamepadRange = GAMEPAD_MAXIMUM - GAMEPAD_MINIMUM;
      axes.magnitude = Math.max(
        (axes.magnitude - GAMEPAD_MINIMUM) / gamepadRange,
        0
      );
      axes.x = Math.min(1, axes.x);
      axes.y = Math.min(1, axes.y);
    }
    return axes;
  }

  //  Return the value of a button.
  getButton(button: number): number {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      return gamepad.buttons[button].value; // TODO: Value or nothing?
    }
    return 0;
  }
}
