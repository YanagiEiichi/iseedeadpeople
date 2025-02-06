export const DIRECTION_CHARACTERS = ['U', 'R', 'D', 'L'] as const;
export type Direction = (typeof DIRECTION_CHARACTERS)[number];
export const isDirection = (u: unknown): u is Direction => Array.prototype.indexOf.call(DIRECTION_CHARACTERS, u) >= 0;
export type Command = readonly Direction[];
