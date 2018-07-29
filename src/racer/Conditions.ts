export enum Condition {
  BoostFailure = "BoostFailure",
  BoostStuck = "BoostStuck",
  LeftFlapStuck = "LeftFlapStuck",
  NoThrust = "NoThrust",
  RightFlapStuck = "RightFlapStuck",
  Stutter = "Stutter",
  ThrottleStuck = "ThrottleStuck"
}

export class ConditionList {
  conditionTimes = new Map<Condition, number>();

  // Cause all the condition timers to decrement by a given amount
  cooldown(timeStep: number): void {
    for (const [condition, time] of this.conditionTimes.entries()) {
      if (time <= 0) {
        this.conditionTimes.delete(condition);
        console.log(`ending: ${condition}`);
      }
    }
  }

  add(condition: Condition, time: number): void {
    const newTime = this.remaining(condition) + time;
    this.conditionTimes.set(condition, newTime);
  }

  has(condition: Condition): boolean {
    return (
      this.conditionTimes.has(condition) &&
      this.conditionTimes.get(condition)! <= 0
    );
  }

  remaining(condition: Condition): number {
    if (this.has(condition)) {
      return this.conditionTimes.get(condition)!;
    }
    return 0;
  }

  repairAll(): void {
    this.conditionTimes.clear();
  }
}
