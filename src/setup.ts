import type { Direction, Command } from './common';
import { DIRECTION_CHARACTERS } from './common';
import { on, off, sub, dir, len, Vec2 } from './utils';

const MINIMAL_DISTANCE = 10;

/**
 * A handler function, which will be called after a sequence of touch events is triggered.
 * A @type {Direction} will be passed, if a one-way trajectory is drawn.
 * Otherwise @type {null} will be passed, which means an invalid trajectory is drawn.
 */
type Handler = (direction: Direction | null) => void;

const watchTouchEvents = (handler: Handler) =>
  on('touchstart', (e: TouchEvent) => {
    const points: Vec2[] = [];
    // Record a coordinate from a touch event object.
    const recordTouchPoint = ({ targetTouches }: TouchEvent) => {
      // Ignore multiple finger touches.
      if (targetTouches.length !== 1) return;
      const { clientX, clientY } = targetTouches[0];
      points.push([clientX, clientY]);
    };

    // Record the start point from the 'touchstart' event object.
    recordTouchPoint(e);
    // Add a temporary 'touchmove' event listener to continuously record all points that pass through.
    on('touchmove', recordTouchPoint);

    const touchend = () => {
      // Remove temporary event listeners.
      off('touchmove', recordTouchPoint);
      off('touchend', touchend);

      // The finger didn't move, just a tapping operation.
      if (points.length < 2) return handler(null);

      // A line from the first point to the last point.
      const line = sub(points[points.length - 1], points[0]);

      // The distance is too short.
      if (len(line) < MINIMAL_DISTANCE) return handler(null);

      const direction = dir(line);

      // Check each edge with enough length and ensure it's in the same direction as the line.
      for (let i = 1; i < points.length; i++) {
        // Calculate the edge by subtracting the previous point from the current point.
        const edge = sub(points[i], points[i - 1]);
        // Skip the edge as there is not enough length.
        if (len(edge) < MINIMAL_DISTANCE) continue;
        // Check the direction, if it's different from the line, handle null and return.
        if (dir(edge) != direction) return handler(null);
      }

      handler(direction);
    };

    // Add a temporary 'touchend' event listener.
    on('touchend', touchend);
  });

const watchKeyboardEvents = (handler: Handler) =>
  on('keydown', (e: KeyboardEvent) => {
    // Convert key name to direction code.
    const a = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(e.key);
    if (a >= 0) {
      handler(DIRECTION_CHARACTERS[a]);
    } else {
      handler(null);
    }
  });

/**
 * Setup a pair of gesture and handler.
 * @param command A gesture described with an ordered direction list.
 * @param handler A handler function which will be called when the user makes the gesture.
 */
export function setup(command: Command, handler: () => void) {
  const { length } = command;
  if (length === 0) throw new TypeError('The `command` must not be an empty array');
  const ring: Direction[] = [];
  let index = 0;

  const onDirection = (direction: Direction | null) => {
    // Clear the ring if an invalid gesture is received.
    if (direction === null) {
      index = 0;
      ring.length = 0;
      return;
    }

    // Put the direction value into the ring.
    // NOTE: The ring size is associated with the command size.
    // When the index is out of bounds, it will be reset to the left.
    ring[index] = direction;
    index = (index + 1) % length;

    // Obviously, the gesture can't be matched when the ring and command have different sizes.
    if (ring.length != length) return;

    // Compare each element in command and ring.
    for (let i = 0; i < length; i++)
      // If there is anything different, indicate that the gesture can't be matched, and return directly.
      if (command[i] !== ring[(index + i) % length]) return;

    // Otherwise, the gesture can be matched, and call the handler.
    handler();
  };

  // Watch touch and keyboard events.
  watchTouchEvents(onDirection);
  watchKeyboardEvents(onDirection);
}
