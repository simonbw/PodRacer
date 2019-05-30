import BaseEntity from "../core/entity/BaseEntity";
import * as Util from "../util/Util";
import { WaypointMarker } from "./Waypoint";
import Racer from "../racer/Racer";
import { Vector } from "../core/Vector";

export default class Race extends BaseEntity {
  laps: number;
  waypoints: WaypointMarker[] = [];
  racers: Racer[] = [];
  // stores the index of the waypoint a racer is currently on
  racerWaypointIndexes = new Map<Racer, number>();
  // stores the index of the waypoint a racer is currently on
  racerLaps = new Map<Racer, number>();

  constructor(laps: number = 3) {
    super();
    this.laps = laps; // total number of laps in the race
  }

  onAdd() {
    for (const waypoint of this.waypoints) {
      this.game.addEntity(waypoint);
    }
  }

  addWaypoint(center: Vector, radius = 20) {
    this.waypoints.push(new WaypointMarker(center, radius));
  }

  addRacer(racer: Racer) {
    this.racers.push(racer);
    this.racerWaypointIndexes.set(racer, 0);
    this.racerLaps.set(racer, 0);
  }

  onTick() {
    for (const racer of this.racers) {
      const waypoint = this.getRacerWaypoint(racer);
      const distance = racer.getWorldCenter().sub(waypoint.center).magnitude;
      if (distance <= waypoint.radius + 1) {
        const current = this.racerWaypointIndexes.get(racer)!;
        this.racerWaypointIndexes.set(
          racer,
          (current + 1) % this.waypoints.length
        );
        console.log("waypoint reached", current);
        if (current === 0) {
          this.racerLaps.set(racer, this.racerLaps.get(racer)! + 1);
          console.log("new lap");
          if (this.racerLaps.get(racer)! > this.laps) {
            console.log("RACE OVER");
            this.destroy();
            break;
          }
        }
      }
    }
  }

  onRender() {
    for (const [i, waypoint] of this.waypoints.entries()) {
      const nextWaypoint = this.waypoints[(i + 1) % this.waypoints.length];
      this.game.draw.line(
        waypoint.center,
        nextWaypoint.center,
        0.1,
        0x0044ff,
        0.5,
        "world"
      );
    }
  }

  getRacerWaypoint(racer: Racer, next: number = 0) {
    return this.waypoints[
      Util.mod(
        this.racerWaypointIndexes.get(racer)! + next,
        this.waypoints.length
      )
    ];
  }

  getRacerLap(racer: Racer) {
    return Math.floor(
      this.racerWaypointIndexes.get(racer)! / this.waypoints.length
    );
  }

  onDestroy() {
    while (this.waypoints.length) {
      this.waypoints.pop()!.destroy();
    }
  }
}
