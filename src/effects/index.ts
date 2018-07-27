// function drawFlame() {
//   const rand = Math.random();
//   let endPoint;
//   endPoint = this.localToWorld([
//     (left[0] + right[0]) / 2,
//     (2.5 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
//   ] as Vector);
//   this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x0000ff, 0.2);

//   endPoint = this.localToWorld([
//     (left[0] + right[0]) / 2,
//     (1.6 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
//   ] as Vector);
//   this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00aaff, 0.4);

//   endPoint = this.localToWorld([
//     (left[0] + right[0]) / 2,
//     (0.5 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
//   ] as Vector);
//   this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0x00ffff, 0.6);

//   endPoint = this.localToWorld([
//     (left[0] + right[0]) / 2,
//     (0.15 + rand) * this.throttle + 0.5 * this.engineDef.size[1]
//   ] as Vector);
//   this.game.draw.triangle(leftWorld, endPoint, rightWorld, 0xffffff, 0.8);
// }
