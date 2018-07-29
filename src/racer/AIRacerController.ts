import BaseEntity from "../core/entity/BaseEntity";
import p2 from "p2";
import * as Util from "../util/Util";
import Racer from "./Racer";
import Race from "../race/Race";

// Affects how far ahead the AI will look
const PREDICTION_DISTANCE_SPEED_MULTIPLIER = 0.1;
const PREDICTION_EXPONENT = 1.2;
const MAX_THROTTLE = 1.0;
const TURN_FACTOR_LINEAR = 1.5;
const TURN_FACTOR_CUBIC = 1.9;
const TURN_FACTOR_NEAR = 0.005;

export default class PlayerRacerController extends BaseEntity {
  racer: Racer;
  race?: Race;

  constructor(racer: Racer, race: Race) {
    super();
    this.racer = racer;
    this.race = race;
  }

  beforeTick() {
    // TODO: The race should be in charge of destroying things it created
    if (this.race && !this.race.game) {
      this.race = undefined;
    }

    if (this.race) {
      const waypoint = this.race.getRacerWaypoint(this.racer);
      const nextWaypoint = this.race.getRacerWaypoint(this.racer, 1);
      const racerPos = this.racer.getWorldCenter();

      const speed = p2.vec2.length(this.racer.pod.body.velocity);
      const waypointDistance = p2.vec2.length([
        waypoint.center[0] - racerPos[0],
        waypoint.center[1] - racerPos[1]
      ]);
      const predictionDistance =
        speed *
          Math.sqrt(waypoint.radius) *
          PREDICTION_DISTANCE_SPEED_MULTIPLIER +
        waypoint.radius;

      let target;
      if (predictionDistance > waypointDistance) {
        const weight =
          (waypointDistance / predictionDistance) ** PREDICTION_EXPONENT;
        const invWeight = 1 - weight;
        const c1 = waypoint.center;
        const c2 = nextWaypoint.center;
        target = [
          c1[0] * weight + c2[0] * invWeight,
          c1[1] * weight + c2[1] * invWeight
        ];
      } else {
        target = waypoint.center;
      }

      const currentAngle =
        (this.racer.leftEngine.getDirection() +
          this.racer.rightEngine.getDirection()) /
        2;
      const targetAngle = Math.atan2(
        target[1] - racerPos[1],
        target[0] - racerPos[0]
      );

      let turnAmount;
      turnAmount = Util.angleDelta(currentAngle, targetAngle) / Math.PI; // How much turn needed from -1 to 1
      turnAmount =
        turnAmount ** 3 * TURN_FACTOR_LINEAR + turnAmount * TURN_FACTOR_CUBIC; // TODO: Tune this
      turnAmount /=
        1 + TURN_FACTOR_NEAR * Math.sqrt(waypointDistance / (speed + 1));
      turnAmount = Util.clamp(turnAmount, -1, 1);

      this.racer.leftEngine.setThrottle((1.0 + turnAmount) * MAX_THROTTLE);
      this.racer.rightEngine.setThrottle((1.0 - turnAmount) * MAX_THROTTLE);
    }
  }
}
