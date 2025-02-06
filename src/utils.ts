import { DIRECTION_CHARACTERS } from './common';

export type Vec2 = readonly [number, number];

const eOptions: AddEventListenerOptions = { capture: true, passive: true };

/**
 * Add an event listener with capture and passive.
 */
export function on(name: 'touchstart' | 'touchmove' | 'touchend', handler: (e: TouchEvent) => void): void;
export function on(name: 'keydown' | 'keyup', handler: (e: KeyboardEvent) => void): void;
export function on<T extends () => void>(name: string, handler: T) {
  window.addEventListener(name, handler, eOptions);
}

/**
 * Remove an event listener with capture and passive.
 */
export function off(name: 'touchstart' | 'touchmove' | 'touchend', handler: (e: TouchEvent) => void): void;
export function off(name: 'keydown' | 'keyup', handler: (e: KeyboardEvent) => void): void;
export function off<T extends () => void>(name: string, handler: T) {
  window.removeEventListener(name, handler, eOptions);
}

/**
 * Calculate the length of a vector.
 */
export const len = (v: Vec2) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);

/**
 * Subtract b from a.
 */
export const sub = (a: Vec2, b: Vec2) => [a[0] - b[0], a[1] - b[1]] as const;

/**
 * Calculate the vector direction
 */
export const dir = (v: Vec2) => {
  // NOTE: In the screen coordinate system, the y-axis is reversed, so its negative value is used here.
  // NOTE: The first arg is passed to x, and second arg is passed to y,
  //       so that the atan2 function returns a clockwise angle (upward is 0°).
  //
  let a = Math.atan2(v[0], -v[1]);

  // The range of atan2 is [-π,π], convert it to [-2,2], this means 1 = 90°.
  // NOTE: It's a closed interval, which means it may be equal to -2 or 2.
  //       Because IEEE-754 number supports negative zero, atan2(0, -1) and atan2(-0, -1) are different.
  a = (a / Math.PI) * 2;

  // Get the rounded value, and convert to [0,3], for a total of 4 values.
  a = (Math.round(a) + 4) % 4;

  return DIRECTION_CHARACTERS[a];
};
