// Modulo operator for modular arithmetic
export function mod(a, b) {
  return ((a % b) + b) % b;
}

// Limit a value to be in a range.
export function clamp(value, min = -1, max = 1) {
  return Math.max(min, Math.min(max, value));
}

// The smoothstep function between 0 and 1
export function smoothStep(value) {
  value = clamp(value, 0, 1);
  return value * value * (3 - 2 * value)
}

// Return the difference between two angles
export function angleDelta(a, b) {
  return mod(b - a + Math.PI, Math.PI * 2) - Math.PI;
}

// Return the length of a vector.
export function length([x, y]) {
  return Math.sqrt(x * x + y * y);
}
