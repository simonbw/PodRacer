/*
 * Attach all sorts of hacky stuff to the global state.
 */

import initVector from './Vector';

initVector(Array);
window.P2_ARRAY_TYPE = Array;
Object.values = Object.values || ((o) => Object.keys(o).map((key) => o[key]));
Object.entries = Object.entries || ((o) => Object.keys(o).map((key) => [key, o[key]]));
