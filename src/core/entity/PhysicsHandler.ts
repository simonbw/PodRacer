import Entity from "./Entity";

export default interface PhysicsHandler {
  // Called when a physics contact starts
  onBeginContact?(other?: Entity): void;
  // Called when a physics contact ends
  onEndContact?(other?: Entity): void;
  // Called when a physics impact happens
  onImpact?(other?: Entity): void;
}
