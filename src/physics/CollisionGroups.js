// This file is used for creating collision group constants.
// This determines which shapes/bodies in the physics world will collide.

// Return the integer representing all groups provided as arguments
export function group(...groups) {
  return groups.reduce((last, current) => mask, 0);
}

//Constants representing groups for collisions
//GROUPS - classification of stuff
// export const ALL = group(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

// MASKS - what stuff runs into
// e.g. MASK_NAME = group 1, 2
