import { IS_HIDPI } from "./constants.js";

/**
 * Horizon Line.
 * 地平线类，由两条连接的线组成。随机分配平坦或起伏的地平线。
 */
export class HorizonLine {
  /**
   * Horizon line dimensions.
   */
  static dimensions = {
    WIDTH: 600,
    HEIGHT: 12,
    YPOS: 127,
  };

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} spritePos Horizon position in sprite
   */
  constructor(canvas, spritePos) {
    this.spritePos = spritePos;
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext("2d");
    this.sourceDimensions = {};
    this.dimensions = HorizonLine.dimensions;
    this.sourceXPos = [
      this.spritePos.x,
      this.spritePos.x + this.dimensions.WIDTH,
    ];
    this.xPos = [];
    this.yPos = 0;
    this.bumpThreshold = 0.5;

    this.setSourceDimensions();
    this.draw();
  }

  /**
   * Set the source dimensions of the horizon line.
   */
  setSourceDimensions() {
    for (const dimension in HorizonLine.dimensions) {
      if (IS_HIDPI) {
        if (dimension !== "YPOS") {
          this.sourceDimensions[dimension] =
            HorizonLine.dimensions[dimension] * 2;
        }
      } else {
        this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension];
      }
      this.dimensions[dimension] = HorizonLine.dimensions[dimension];
    }

    this.xPos = [0, HorizonLine.dimensions.WIDTH];
    this.yPos = HorizonLine.dimensions.YPOS;
  }

  /**
   * Return the crop x position of a type.
   */
  getRandomType() {
    // 如果随机数 > 0.5，返回 WIDTH（使用第二种地面类型）
    // 否则返回 0（使用第一种地面类型）
    return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
  }

  /**
   * Draw the horizon line.
   */
  draw() {
    this.canvasCtx.drawImage(
      Runner.imageSprite,
      this.sourceXPos[0],
      this.spritePos.y,
      this.sourceDimensions.WIDTH,
      this.sourceDimensions.HEIGHT,
      this.xPos[0],
      this.yPos,
      this.dimensions.WIDTH,
      this.dimensions.HEIGHT
    );

    this.canvasCtx.drawImage(
      Runner.imageSprite,
      this.sourceXPos[1],
      this.spritePos.y,
      this.sourceDimensions.WIDTH,
      this.sourceDimensions.HEIGHT,
      this.xPos[1],
      this.yPos,
      this.dimensions.WIDTH,
      this.dimensions.HEIGHT
    );
  }

  /**
   * Update the x position of an individual piece of the line.
   * @param {number} pos Line position
   * @param {number} increment
   */
  updateXPos(pos, increment) {
    const line1 = pos;
    const line2 = pos === 0 ? 1 : 0;

      // 移动当前地面块
    this.xPos[line1] -= increment;

    // 移动下一个地面块
    this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;

    // 如果当前地面块移出屏幕左侧，
    if (this.xPos[line1] <= -this.dimensions.WIDTH) {

      // 重置到右侧
      this.xPos[line1] += this.dimensions.WIDTH * 2;
      // 将下一个地面块接上来
      this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
        // 为移动回来的地面块随机选择一个新的地面类型
      this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
    }
  }

  /**
   * Update the horizon line.
   * @param {number} deltaTime
   * @param {number} speed
   */
  update(deltaTime, speed) {
    const increment = Math.floor(speed * (FPS / 1000) * deltaTime);

    if (this.xPos[0] <= 0) {
      this.updateXPos(0, increment);
    } else {
      this.updateXPos(1, increment);
    }
    this.draw();
  }

  /**
   * Reset horizon to the starting position.
   */
  reset() {
    this.xPos[0] = 0;
    this.xPos[1] = HorizonLine.dimensions.WIDTH;
  }
}
