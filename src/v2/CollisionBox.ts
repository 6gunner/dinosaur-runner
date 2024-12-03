import { DinosaurController } from "./Dinosaur";
import Obstacle from "./Obstacle";

/**
 * Collision box object.
 */
export class CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * @param {number} x X position
   * @param {number} y Y Position
   * @param {number} w Width
   * @param {number} h Height
   */
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
}

/**
 * Compare two collision boxes for a collision.
 */
export function boxCompare(tRexBox: CollisionBox, obstacleBox: CollisionBox) {
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
export function createAdjustedCollisionBox(box: CollisionBox, adjustment: CollisionBox) {
  return new CollisionBox(
    box.x + adjustment.x,
    box.y + adjustment.y,
    box.width,
    box.height
  );
}


/**
 * Check for a collision.
 * @param {Obstacle} obstacle
 * @param {Trex} tRex T-rex object
 * @return {Array<CollisionBox>}
 */
export function checkForCollision(obstacle: Obstacle, tRex: DinosaurController) {

  // Adjustments are made to the bounding box as there is a 1 pixel white
  // border around the t-rex and obstacles.
  const tRexBox = new CollisionBox(
    tRex.dino.x + 1,
    tRex.dino.y + 1,
    tRex.dino.width - 2,
    tRex.dino.height - 2
  );

  const obstacleBox = new CollisionBox(
    obstacle.sprite.x + 1,
    obstacle.sprite.y + 1,
    obstacle.sprite.width - 2,
    obstacle.sprite.height - 2
  );

  // Debug outer box
  if (opt_canvasCtx) {
    drawCollisionBoxes(opt_canvasCtx, tRexBox, obstacleBox);
  }

  // Simple outer bounds check.
  if (boxCompare(tRexBox, obstacleBox)) {
    const collisionBoxes = obstacle.collisionBoxes;
    const tRexCollisionBoxes = tRex.ducking
      ? Trex.collisionBoxes.DUCKING
      : Trex.collisionBoxes.RUNNING;

    // Detailed axis aligned box check.
    for (let t = 0; t < tRexCollisionBoxes.length; t++) {
      for (let i = 0; i < collisionBoxes.length; i++) {
        // Adjust the box to actual positions.
        const adjTrexBox = createAdjustedCollisionBox(
          tRexCollisionBoxes[t],
          tRexBox
        );
        const adjObstacleBox = createAdjustedCollisionBox(
          collisionBoxes[i],
          obstacleBox
        );
        const crashed = boxCompare(adjTrexBox, adjObstacleBox);

        // Draw boxes for debug.
        if (opt_canvasCtx) {
          drawCollisionBoxes(opt_canvasCtx, adjTrexBox, adjObstacleBox);
        }

        if (crashed) {
          return [adjTrexBox, adjObstacleBox];
        }
      }
    }
  }
  return false;
}

/**
 * Draw the collision boxes for debug.
 */
export function drawCollisionBoxes(canvasCtx: CanvasRenderingContext2D, tRexBox: CollisionBox, obstacleBox: CollisionBox) {
  canvasCtx.save();
  canvasCtx.strokeStyle = "#f00";
  canvasCtx.strokeRect(tRexBox.x, tRexBox.y, tRexBox.width, tRexBox.height);

  canvasCtx.strokeStyle = "#0f0";
  canvasCtx.strokeRect(
    obstacleBox.x,
    obstacleBox.y,
    obstacleBox.width,
    obstacleBox.height
  );
  canvasCtx.restore();
}
