/**
 * Get random number.
 * @param {number} min
 * @param {number} max
 * @param {number}
 */
export function getRandomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}