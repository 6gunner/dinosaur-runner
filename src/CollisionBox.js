/**
 * Collision box object.
 */
export class CollisionBox {
  /**
   * @param {number} x X position
   * @param {number} y Y Position
   * @param {number} w Width
   * @param {number} h Height
   */
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
}

/**
 * Compare two collision boxes for a collision.
 */
export function boxCompare(tRexBox, obstacleBox) {
  return (
    tRexBox.x < obstacleBox.x + obstacleBox.width &&
    tRexBox.x + tRexBox.width > obstacleBox.x &&
    tRexBox.y < obstacleBox.y + obstacleBox.height &&
    tRexBox.height + tRexBox.y > obstacleBox.y
  );
}

/**
 * Adjust the collision box.
 */
export function createAdjustedCollisionBox(box, adjustment) {
  return new CollisionBox(
    box.x + adjustment.x,
    box.y + adjustment.y,
    box.width,
    box.height
  );
}
