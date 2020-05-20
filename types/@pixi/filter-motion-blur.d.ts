import { Filter, PointLike } from "pixi.js";

declare module "@pixi/filter-motion-blur" {
  /**
   * The MotionBlurFilter applies a Motion blur to an object.
   */
  class MotionBlurFilter extends Filter<any> {
    constructor(
      /** Sets the velocity of the motion for blur effect. */
      velocity?: PointLike | [number, number],
      /** The kernelSize of the blur filter. Must be odd number >= 5 */
      kernelSize?: number,
      /** The offset of the blur filter. */
      offset?: number
    );
  }
}
