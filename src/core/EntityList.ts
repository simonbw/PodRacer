import FilterList from "../util/FilterList";
import Entity from "./entity/Entity";

export default class EntityList implements Iterable<Entity> {
  all = new Set<Entity>();

  filtered = {
    afterPhysics: new FilterList<Entity>(e => Boolean(e.afterPhysics)),
    beforeTick: new FilterList<Entity>(e => Boolean(e.beforeTick)),
    onRender: new FilterList<Entity>(e => Boolean(e.onRender)),
    onTick: new FilterList<Entity>(e => Boolean(e.onTick)),
    onPause: new FilterList<Entity>(e => Boolean(e.onPause)),
    onUnpause: new FilterList<Entity>(e => Boolean(e.onUnpause)),
    hasSprite: new FilterList<Entity>(e => Boolean(e.sprite)),
    hasBody: new FilterList<Entity>(e => Boolean(e.body))
  };

  add(entity: Entity) {
    this.all.add(entity);
    for (const list of Object.values(this.filtered)) {
      list.addIfValid(entity);
    }
  }

  remove(entity: Entity) {
    this.all.delete(entity);
    for (const list of Object.values(this.filtered)) {
      list.remove(entity);
    }
  }

  [Symbol.iterator]() {
    return this.all[Symbol.iterator]();
  }
}
