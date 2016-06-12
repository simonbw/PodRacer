import { mod } from './Util';


/**
 * Utility for doing things based on random numbers.
 */
const Random = module.exports;

// just for shorthand
const r = Math.random;

/**
 * Return a random number between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
export function uniform(min, max) {
  if (min == null) {
    return r();
  }
  if (max == null) {
    max = min;
    min = 0;
  }
  return (max - min) * r() + min;
}

/**
 * Return a random integer between min and max.
 *
 * @param min
 * @param max
 * @returns {number}
 */
export function integer(min, max) {
  return Math.floor(uniform(min, max));
}

/**
 *
 * @param mean
 * @param deviation
 * @returns {*}
 */
export function normal(mean, deviation) {
  if (mean == null) {
    mean = 0;
  }
  if (deviation == null) {
    deviation = 1;
  }
  return deviation * (r() + r() + r() + r() + r() + r() - 3) / 3 + mean;
}

/**
 * Return a random element from an array.
 *
 * @returns {*}
 */
export function choose() {
  let options;
  options = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  if (options.length === 1) {
    options = options[0];
  }
  return options[integer(options.length)];
}

/**
 * Remove and return a random element from an array.
 *
 * @returns {*}
 */
export function take(options) {
  return options.splice(integer(options.length), 1)[0];
}

/**
 * Put an array into a random order and return the array.]
 *
 * @param a
 * @returns {*}
 */
export function shuffle(a) {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    j = integer(0, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
}

/**
 * Put an array into a deterministically random order and return the array.
 *
 * @param a
 * @param seed {number} - A random
 * @returns {*}
 */
export function seededShuffle(a, seed) {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    seed = (seed * 1103515245 + 12345) | 0;
    j = mod(seed, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
}

/**
 * Flip a coin.
 *
 * @param chance {number} - Between 0 (always false) and 1 (always true). Defaults to 0.5.
 * @returns {boolean}
 */
export function bool(chance) {
  if (chance == null) {
    chance = 0.5;
  }
  return r() < chance;
}
