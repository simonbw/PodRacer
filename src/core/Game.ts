import Drawing from "../util/Drawing";
import GameRenderer from "./GameRenderer";
import p2 from "p2";
import { IOManager } from "./IO";
import * as Materials from "../physics/Materials";
import Entity from "./Entity/index";
import Camera from "./Camera";
import FilterList from "../util/FilterList";
import EntityList from "./EntityList";
import HasOwner from "./HasOwner";

// Top Level control structure
export default class Game {
  entities: EntityList;
  entitiesToRemove: Set<Entity>;

  renderer: GameRenderer;
  camera: Camera;
  draw: Drawing;
  io: IOManager;
  world: p2.World;

  audio: AudioContext;
  masterGain: GainNode;

  paused: boolean = false;
  framerate: number = 60;
  framenumber: number = 0;
  ticknumber: number = 0;
  lastFrameTime: number = window.performance.now();
  tickIterations: number = 5; // number of ticks per frame drawn

  /**
   * Create a new Game.
   */
  constructor(audio: AudioContext) {
    this.entities = new EntityList();
    this.entitiesToRemove = new Set();

    this.renderer = new GameRenderer();
    this.camera = this.renderer.camera;
    this.draw = new Drawing();
    this.io = new IOManager(this.renderer.pixiRenderer.view);

    // Physics
    this.world = new p2.World({
      gravity: [0, 0]
    });
    for (const material of Materials.CONTACTS) {
      this.world.addContactMaterial(material);
    }
    this.world.on("beginContact", this.beginContact, null);
    this.world.on("endContact", this.endContact, null);
    this.world.on("impact", this.impact, null);

    this.audio = audio;
    this.masterGain = this.audio.createGain();
    this.masterGain.connect(this.audio.destination);
  }

  // The intended time between renders in seconds
  get renderTimestep(): number {
    return 1 / this.framerate;
  }

  // The intended time between ticks in seconds
  get tickTimestep(): number {
    return this.renderTimestep / this.tickIterations;
  }

  // Total amount of game time elapsed since starting
  get elapsedTime(): number {
    return this.ticknumber / (this.framerate * this.tickIterations);
  }

  // Start the event loop for the game.
  start(): void {
    this.addEntity(this.camera);
    this.addEntity(this.draw);
    window.requestAnimationFrame(() => this.loop(this.lastFrameTime));
  }

  // The main event loop. Run one frame of the game.
  loop(time: number): void {
    window.requestAnimationFrame(t => this.loop(t));
    this.framenumber += 1;
    this.lastFrameTime = time;

    for (let i = 0; i < this.tickIterations; i++) {
      this.tick();
      if (!this.paused) {
        this.world.step(this.tickTimestep);
      }
    }
    this.afterPhysics();

    this.render();
  }

  togglePause() {
    if (this.paused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  pause() {
    this.paused = true;
    for (const entity of this.entities.filtered.onPause) {
      entity.onPause();
    }
  }

  unpause() {
    this.paused = false;
    for (const entity of this.entities.filtered.onUnpause) {
      entity.onUnpause();
    }
  }

  // Add an entity to the game.
  addEntity = <T extends Entity>(entity: T): T => {
    entity.game = this;
    if (entity.onAdd) {
      entity.onAdd(this);
    }

    this.entities.add(entity);
    this.io.addHandler(entity);

    if (entity.sprite) {
      this.renderer.add(entity.sprite, entity.layer);
      entity.sprite.owner = entity;
    }

    if (entity.body) {
      this.world.addBody(entity.body);
      entity.body.owner = entity;
    }

    if (entity.afterAdded) {
      entity.afterAdded(this);
    }

    return entity;
  };

  /**
   * Remove an entity from the game.
   * The entity will actually be removed during the next removal pass.
   *
   * TODO: Why is there a separate pass?
   */
  removeEntity(entity: Entity) {
    this.entitiesToRemove.add(entity);
    return entity;
  }

  // Remove all entities. Very sketchy. Probably should get something better.
  removeAll() {
    for (const entity of this.entities) {
      if (
        entity.game &&
        !this.entitiesToRemove.has(entity) &&
        entity !== this.draw &&
        entity !== this.camera
      ) {
        entity.destroy();
      }
    }
  }

  // Actually remove all the entities slated for removal from the game.
  cleanupEntities() {
    for (const entity of this.entitiesToRemove) {
      this.entities.remove(entity);
      this.io.removeHandler(entity);

      if (entity.sprite) {
        this.renderer.remove(entity.sprite, entity.layer);
      }
      if (entity.body) {
        this.world.removeBody(entity.body);
      }

      if (entity.onDestroy) {
        entity.onDestroy(this);
      }
      entity.game = null;
    }
    this.entitiesToRemove.clear();
  }

  // Called before physics.
  tick() {
    this.ticknumber += 1;
    this.cleanupEntities();
    for (const entity of this.entities.filtered.beforeTick) {
      if (!(this.paused && entity.pausable)) {
        entity.beforeTick();
      }
    }
    this.cleanupEntities();
    for (const entity of this.entities.filtered.onTick) {
      if (!(this.paused && entity.pausable)) {
        entity.onTick();
      }
    }
  }

  // Called after physics.
  afterPhysics() {
    this.cleanupEntities();
    for (const entity of this.entities.filtered.afterPhysics) {
      if (!(this.paused && entity.pausable)) {
        entity.afterPhysics();
      }
    }
  }

  // Called before actually rendering.
  render() {
    this.cleanupEntities();
    for (const entity of this.entities.filtered.onRender) {
      entity.onRender();
    }
    this.renderer.render();
  }

  // Handle beginning of collision between things.
  // Fired during narrowphase.
  beginContact = (e: {
    bodyA: p2.Body & HasOwner;
    bodyB: p2.Body & HasOwner;
    shapeA: p2.Shape & HasOwner;
    shapeB: p2.Shape & HasOwner;
  }) => {
    const ownerA = e.shapeA.owner || e.bodyA.owner;
    const ownerB = e.shapeB.owner || e.bodyB.owner;
    if (ownerA && ownerA.onBeginContact) {
      ownerA.onBeginContact(ownerB);
    }
    if (ownerB && ownerB.onBeginContact) {
      ownerB.onBeginContact(ownerA);
    }
  };

  // Handle end of collision between things.
  // Fired during narrowphase.
  endContact = (e: {
    bodyA: p2.Body & HasOwner;
    bodyB: p2.Body & HasOwner;
    shapeA: p2.Shape & HasOwner;
    shapeB: p2.Shape & HasOwner;
  }) => {
    const ownerA = e.shapeA.owner || e.bodyA.owner;
    const ownerB = e.shapeB.owner || e.bodyB.owner;
    if (ownerA && ownerA.onEndContact) {
      ownerA.onEndContact(ownerB);
    }
    if (ownerB && ownerB.onEndContact) {
      ownerB.onEndContact(ownerA);
    }
  };

  // Handle collision between things.
  // Fired after physics step.
  impact = (e: { bodyA: p2.Body & HasOwner; bodyB: p2.Body & HasOwner }) => {
    const ownerA = e.bodyA.owner;
    const ownerB = e.bodyB.owner;
    if (ownerA && ownerA.onImpact) {
      ownerA.onImpact(ownerB);
    }
    if (ownerB && ownerB.onImpact) {
      ownerB.onImpact(ownerA);
    }
  };
}
