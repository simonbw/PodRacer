import Drawing from '../util/Drawing';
import Entity from './Entity';
import GameRenderer from '../core/GameRenderer';
import p2 from 'p2';
import {IOManager, IOEvents} from './IO';
import * as Materials from '../physics/Materials'


const METHODS_TO_EVENTS = {
  onButtonDown: IOEvents.BUTTON_DOWN,
  onButtonUp: IOEvents.BUTTON_UP,
  onKeyDown: IOEvents.KEY_DOWN,
  onKeyUp: IOEvents.KEY_UP,
  onMouseDown: IOEvents.MOUSE_DOWN,
  onMouseUp: IOEvents.MOUSE_UP,
  onRightClick: IOEvents.RIGHT_CLICK,
  onRightDown: IOEvents.RIGHT_DOWN,
  onRightUp: IOEvents.RIGHT_UP,
  onClick: IOEvents.CLICK
};

const GAME_EVENTS = [
  'onRender',
  'beforeTick',
  'onTick',
  'afterTick'
];

// Top Level control structure
/**
 * Top level control structure.
 */
export default class Game {
  /**
   * Create a new Game.
   */
  constructor() {
    /**
     * @type {{all: Array.<Entity>, render: Array.<Entity>, tick: Array.<Entity>, beforeTick: Array.<Entity>, afterTick: Array.<Entity>, toRemove: Array.<Entity>}}
     */
    this.entities = {
      afterTick: [],
      all: [],
      beforeTick: [],
      onRender: [],
      onTick: [],
      toRemove: new Set()
    };
    this.renderer = new GameRenderer();
    this.camera = this.renderer.camera;
    this.draw = new Drawing();
    this.io = new IOManager(this.renderer.pixiRenderer.view);

    // Physics
    this.world = new p2.World({
      gravity: [0, 0]
    });
    Materials.CONTACTS.forEach((material) => {
      this.world.addContactMaterial(material);
    });
    this.world.on('beginContact', this.beginContact.bind(this));
    this.world.on('endContact', this.endContact.bind(this));
    this.world.on('impact', this.impact.bind(this));

    /**
     * @type {AudioContext}
     */
    this.audio = new (window.AudioContext || window.webkitAudioContext);
    this.masterGain = this.audio.createGain();
    this.masterGain.connect(this.audio.destination);

    this.paused = false;
    this.framerate = 60;
    this.framenumber = 0;
    this.slowFrameCount = 0;
    this.lastFrameTime = window.performance.now();
    this.tickIterations = 5;
  }

  /**
   * @returns {number} - Number of seconds between renders.
   */
  get renderTimestep() {
    return 1 / this.framerate;
  }

  /**
   * @returns {number} - Number of seconds between ticks.
   */
  get tickTimestep() {
    return this.renderTimestep / this.tickIterations;
  }

  getSlowFrameRatio() {
    return this.slowFrameCount / this.framenumber || 0;
  }

  /**
   * Start the event loop for the game.
   */
  start() {
    this.addEntity(this.camera);
    this.addEntity(this.draw);
    window.requestAnimationFrame(() => this.loop());
  }

  /**
   * The main event loop. Run one frame of the game.
   */
  loop(time) {
    window.requestAnimationFrame((t) => this.loop(t));
    this.framenumber += 1;
    const duration = time - this.lastFrameTime;
    if (duration > this.renderTimestep * 1005) {
      console.warn('slow frame');
      this.slowFrameCount += 1;
    }
    this.lastFrameTime = time;

    for (let i = 0; i < this.tickIterations; i++) {
      this.tick();
      if (!this.paused) {
        this.world.step(this.tickTimestep);
      }
    }
    this.afterTick();

    this.render();
  }

  /**
   * Pause/unpause the game.
   */
  togglePause() {
    this.paused = !this.paused;
  }

  /**
   * Add an entity to the game.
   * @param entity {Entity} - The entity to add.
   * @returns {Entity} - the entity added
   */
  addEntity(entity) {
    entity.game = this;
    if (entity.onAdd) {
      entity.onAdd(this);
    }
    this.entities.all.push(entity);
    if (entity.sprite) {
      this.renderer.add(entity.sprite, entity.layer);
      entity.sprite.owner = entity;
    }
    if (entity.body) {
      this.world.addBody(entity.body);
      entity.body.owner = entity;
    }

    // Attach game event handlers
    GAME_EVENTS.forEach((gameEvent) => {
      if (entity[gameEvent]) {
        this.entities[gameEvent].push(entity);
      }
    });

    // Attach IO handlers
    Object.entries(METHODS_TO_EVENTS).forEach(([method, event]) => {
      if (entity[method]) {
        this.io.on(event, entity[method]);
      }
    });

    if (entity.afterAdded) {
      entity.afterAdded(this);
    }
    return entity;
  }

  /**
   * Remove an entity from the game.
   * The entity will actually be removed during the next removal pass.
   *
   * TODO: Why is there a separate pass?
   *
   * @param entity {Entity}
   * @returns {Entity} - The entity removed
   */
  removeEntity(entity) {
    this.entities.toRemove.add(entity);
    return entity;
  }

  /**
   * Remove all entities. Very sketchy.
   */
  removeAll() {
    this.entities.all.forEach((entity) => {
      if (entity.game
        && !this.entities.toRemove.has(entity)
        && entity !== this.draw
        && entity !== this.camera) {
        entity.destroy();
      }
    })
  }

  /**
   * Actually remove all the entities slated for removal from the game.
   */
  cleanupEntities() {
    this.entities.toRemove.forEach((entity) => {
      this.entities.all.splice(this.entities.all.indexOf(entity), 1);

      if (entity.sprite) {
        this.renderer.remove(entity.sprite, entity.layer);
      }
      if (entity.body) {
        this.world.removeBody(entity.body);
      }

      // Detach game event handlers
      GAME_EVENTS.forEach((gameEvent) => {
        if (entity[gameEvent]) {
          const list = this.entities[gameEvent];
          list.splice(list.indexOf(entity), 1); // TODO: This could be slow
        }
      });

      // Detach IO handlers
      Object.entries(METHODS_TO_EVENTS).forEach(([method, event]) => {
        if (entity[method]) {
          this.io.off(event, entity[method]);
        }
      });

      if (entity.onDestroy) {
        entity.onDestroy(this);
      }
      entity.game = null;
    });
    this.entities.toRemove.clear();
  }

  /**
   * Called before physics.
   */
  tick() {
    this.cleanupEntities();
    this.entities.beforeTick.forEach((entity) => {
      if (!(this.paused && entity.pausable)) {
        entity.beforeTick();
      }
    });
    this.cleanupEntities();
    this.entities.onTick.forEach((entity) => {
      if (!(this.paused && entity.pausable)) {
        entity.onTick();
      }
    });
  }

  /**
   * Called after physics.
   */
  afterTick() {
    this.cleanupEntities();
    this.entities.afterTick.forEach((entity) => {
      if (!(this.paused && entity.pausable)) {
        entity.afterTick();
      }
    });
  }

  /**
   * Called before actually rendering.
   */
  render() {
    this.cleanupEntities();
    this.entities.onRender.forEach((entity) => entity.onRender());
    this.renderer.render();
  }

  /**
   * Handle beginning of collision between things.
   * Fired during narrowphase.
   * @param e {{bodyA: p2.Body, bodyB: p2.Body, shapeA: p2.Shape, shapeB: p2.Shape}}
   */
  beginContact(e) {
    /**
     * @type {Entity}
     */
    const ownerA = e.bodyA.owner || e.shapeA.owner;
    /**
     * @type {Entity}
     */
    const ownerB = e.bodyB.owner || e.shapeB.owner;
    if (ownerA && ownerA.onBeginContact) {
      ownerA.onBeginContact(ownerB);
    }
    if (ownerB && ownerB.onBeginContact) {
      ownerB.onBeginContact(ownerA);
    }
  }

  /**
   * Handle end of collision between things.
   * Fired during narrowphase.
   * @param e {{bodyA: p2.Body, bodyB: p2.Body, shapeA: p2.Shape, shapeB: p2.Shape}}
   */
  endContact(e) {
    /**
     * @type {Entity}
     */
    const ownerA = e.bodyA.owner || e.shapeA.owner;
    /**
     * @type {Entity}
     */
    const ownerB = e.bodyB.owner || e.shapeB.owner;
    if (ownerA && ownerA.onEndContact) {
      ownerA.onEndContact(ownerB);
    }
    if (ownerB && ownerB.onEndContact) {
      ownerB.onEndContact(ownerA);
    }
  }

  /**
   * Handle collision between things.
   * Fired after physics step.
   * @param e {{bodyA: p2.Body, bodyB: p2.Body}}
   */
  impact(e) {
    /**
     * @type {Entity}
     */
    const ownerA = e.bodyA.owner;
    /**
     * @type {Entity}
     */
    const ownerB = e.bodyB.owner;
    if (ownerA && ownerA.onImpact) {
      ownerA.onImpact(ownerB);
    }
    if (ownerB && ownerB.onImpact) {
      ownerB.onImpact(ownerA);
    }
  }
}
