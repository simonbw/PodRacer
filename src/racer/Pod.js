import * as Materials from '../physics/Materials';
import * as Pixi from 'pixi.js';
import { applyAerodynamics } from '../physics/Aerodynamics';
import ControlFlap from './ControlFlap';
import Entity from '../core/Entity';
import p2 from 'p2';

export default class Pod extends Entity {
  constructor([x, y], podDef) {
    super();
    this.podDef = podDef;
    this.size = podDef.size;
    const [w, h] = this.size;
    
    this.sprite = new Pixi.Graphics();
    this.sprite.beginFill(this.podDef.color);
    this.sprite.drawRect(-0.5 * w, -0.5 * h, w, h);
    this.sprite.endFill();
    
    this.size = [w, h];
    
    this.health = this.podDef.health;
    this.fragility = this.podDef.fragility;
    
    this.body = new p2.Body({
      angularDamping: 0.15,
      damping: 0.001,
      mass: 1, //this.podDef.mass,
      material: Materials.RACER,
      position: [x, y]
    });
    
    const shape = new p2.Box({ width: w, height: h });
    shape.aerodynamics = true;
    this.body.addShape(shape, [0, 0], 0);
    
    this.leftRopePoint = [-0.4 * w, -0.45 * h]; // point the left rope connects in local coordinates
    this.rightRopePoint = [0.4 * w, -0.45 * h]; // point the right rope connects in local coordinates
    
    this.flaps = [];
    this.podDef.flaps.forEach((flapDef) => {
      const leftDef = {
        color: flapDef.color,
        drag: flapDef.drag,
        length: flapDef.length,
        maxAngle: flapDef.maxAngle
      };
      const rightDef = {
        color: flapDef.color,
        drag: flapDef.drag,
        length: flapDef.length,
        maxAngle: flapDef.maxAngle
      };
      leftDef['direction'] = ControlFlap.LEFT;
      rightDef['direction'] = ControlFlap.RIGHT;
      leftDef['position'] = [-this.size[0] / 2, flapDef.y];
      rightDef['position'] = [this.size[0] / 2, flapDef.y];
      this.flaps.push(new ControlFlap(this.body, leftDef));
      this.flaps.push(new ControlFlap(this.body, rightDef))
    });
  }
  
  // Set the control value on all the racer's flaps
  setFlaps(left, right) {
    this.flaps.forEach((flap) => {
      if (flap.direction === ControlFlap.LEFT) {
        flap.setControl(left);
      }
      if (flap.direction === ControlFlap.RIGHT) {
        flap.setControl(right);
      }
    })
  }
  
  onAdd(game) {
    this.flaps.forEach((flap) => {
      game.addEntity(flap);
    });
  }
  
  onRender() {
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
    this.sprite.rotation = this.body.angle;
  }
  
  onTick() {
    applyAerodynamics(this.body, this.podDef.drag, this.podDef.drag);
  }
  
  onDestroy(game) {
    this.flaps.forEach((flap) => {
      flap.destroy();
    })
  }
  
  onImpact(other) {
    // TODO: Do we really want this? I don't think so
    this.health -= this.fragility;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
