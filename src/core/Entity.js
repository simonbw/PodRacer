import * as Pixi from "pixi.js";

/**
 * Base class for lots of stuff in the game
 */
export default class Entity {
  constructor() {
    /**
     * The game this entity belongs to.
     * @type {Game}
     */
    this.game = null;
    /**
     * @type {Pixi.DisplayObject}
     */
    this.sprite = null;
    /**
     * @type {p2.Body}
     */
    this.body = null;
    /**
     * @type {string}
     */
    this.layer = null;
    /**
     * True if this entity will stop updating when the game is paused.
     * @type {boolean}
     */
    this.pausable = true;

    // TODO: Don't bind. Binding sucks.
    // bind all event handlers
    if (this.onClick) {
      /**
       * Called when the mouse is clicked.
       * @method
       */
      this.onClick = this.onClick.bind(this);
    }
    if (this.onMouseDown) {
      /**
       * Called when a mouse button is pressed.
       * @type {function}
       */
      this.onMouseDown = this.onMouseDown.bind(this);
    }
    if (this.onMouseUp) {
      /**
       * Called when a mouse button is released.
       * @type {function}
       */
      this.onMouseUp = this.onMouseUp.bind(this);
    }
    if (this.onRightClick) {
      /**
       * Called when the right mouse button is clicked.
       * @type {function}
       */
      this.onRightClick = this.onRightClick.bind(this);
    }
    if (this.onRightDown) {
      /**
       * Called when the right mouse button is pressed.
       * @type {function}
       */
      this.onRightDown = this.onRightDown.bind(this);
    }
    if (this.onRightUp) {
      /**
       * Called when the right mouse button is released.
       * @type {function}
       */
      this.onRightUp = this.onRightUp.bind(this);
    }
    if (this.onKeyDown) {
      /**
       * Called when a key is pressed.
       * @type {function}
       */
      this.onKeyDown = this.onKeyDown.bind(this);
    }
    if (this.onKeyUp) {
      /**
       * Called when a key is released.
       * @type {function}
       */
      this.onKeyUp = this.onKeyUp.bind(this);
    }
    if (this.onButtonDown) {
      /**
       * Called when a gamepad button is pressed.
       * @type {function}
       */
      this.onButtonDown = this.onButtonDown.bind(this);
    }
    if (this.onButtonUp) {
      /**
       * Called when a gamepad button is released.
       * @type {function}
       */
      this.onButtonUp = this.onButtonUp.bind(this);
    }
  }

  /**
   * Convert local coordinates to world coordinates.
   * Requires either a body or a sprite.
   */
  localToWorld(point) {
    if (this.body) {
      const result = [0, 0];
      this.body.toWorldFrame(result, point);
      return result;
    }
    if (this.sprite) {
      const result = this.sprite.toGlobal(new Pixi.Point(point[0], point[1]));
      return [result.x, result.y];
    }
    return [0, 0];
  }

  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
    }
  }
}

/**
 * Called when added to the game.
 * @type {function}
 */
Entity.prototype.onAdd = null;
/**
 * Called right after being added to the game.
 * @type {function}
 */
Entity.prototype.afterAdded = null;
/**
 * Called after the tick happens.
 * @type {function}
 */
Entity.prototype.afterTick = null;
/**
 * Called before the tick happens.
 * @type {function}
 */
Entity.prototype.beforeTick = null;
/**
 * Called before rendering
 * @type {function}
 */
Entity.prototype.onRender = null;
/**
 * Called during the game's update tick.
 * @type {function}
 */
Entity.prototype.onTick = null;
/**
 * Called when game is paused.
 * @type {function}
 */
Entity.prototype.onPause = null;
/**
 * Called when game is unpaused.
 * @type {function}
 */
Entity.prototype.onUnpause = null;
/**
 * Called after being destroyed.
 * @type {function}
 */
Entity.prototype.onDestroy = null;
/**
 * @type {function}
 */
Entity.prototype.onBeginContact = null;
/**
 * @type {function}
 */
Entity.prototype.onEndContact = null;
/**
 * @type {function}
 */
Entity.prototype.onImpact = null;
