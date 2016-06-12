import * as Pixi from 'pixi.js';
import Entity from '../core/Entity';
import p2 from 'p2';
import * as Util from '../util/Util';


export default class Race extends Entity {
  constructor(laps = 3, onEnd = null) {
    super();
    this.waypoints = [];
    this.racers = [];
    this.racerWaypointIndexes = new Map(); // stores the index of the waypoint a racer is currently on
    this.racerLaps = new Map(); // stores the index of the waypoint a racer is currently on
  }

  onAdd() {
    this.waypoints.forEach((waypoint) => this.game.addEntity(waypoint));
  }

  addWaypoint(center, radius = 20) {
    this.waypoints.push(new Waypoint(center, radius));
  }

  addRacer(racer) {
    this.racers.push(racer);
    this.racerWaypointIndexes.set(racer, 0);
    this.racerLaps.set(racer, 0);
  }

  onTick() {
    for (const racer of this.racers) {
      const waypoint = this.getRacerWaypoint(racer);
      const distance = racer.getWorldCenter().sub(waypoint.center).magnitude;
      if (distance <= waypoint.radius + 1) {
        const current = this.racerWaypointIndexes.get(racer);
        this.racerWaypointIndexes.set(racer, (current + 1) % this.waypoints.length);
        console.log('waypoint reached', current);
        if (current == 0) {
          this.racerLaps.set(racer, this.racerLaps.get(racer) + 1);
          console.log('new lap');
          if (this.racerLaps.get(racer) > this.laps) {
            console.log('RACE OVER');
            this.destroy();
            break;
          }
        }
      }
    }
  }

  onRender() {
    this.waypoints.forEach((waypoint, i) => {
      const nextWaypoint = this.waypoints[(i + 1) % this.waypoints.length];
      this.game.draw.line(waypoint.center, nextWaypoint.center, 0.1, 0x0044FF, 0.5, 'world');
    });
  }

  getRacerWaypoint(racer, next = 0) {
    return this.waypoints[Util.mod(this.racerWaypointIndexes.get(racer) + next, this.waypoints.length)];
  }

  getRacerLap(racer) {
    return Math.floor(this.racerWaypointIndexes.get(racer) / this.waypoints.length);
  }

  onDestroy(game) {
    while (this.waypoints.length) {
      this.waypoints.pop().destroy();
    }
  }
}

class Waypoint extends Entity {
  constructor(center, radius) {
    super();
    this.center = center;
    this.radius = radius;
    this.sprite = new Pixi.Graphics();
    this.sprite.beginFill(0x00FF00, 0.3);
    this.sprite.drawCircle(0, 0, this.radius);
    this.sprite.endFill();
    [this.sprite.x, this.sprite.y] = this.center;
  }

}