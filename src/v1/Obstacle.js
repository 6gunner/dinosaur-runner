import { IS_HIDPI, IS_MOBILE, FPS, getRandomNum } from "./constants.js";
import { CollisionBox } from "./CollisionBox.js";

/**
 * Obstacle class
 */
export class Obstacle {
  // 最大间隙系数
  static MAX_GAP_COEFFICIENT = 1.5;
  // 最大障碍物数量
  static MAX_OBSTACLE_LENGTH = 3;

  /**
   * Obstacle definitions
   */
  static types = [
    {
      type: "CACTUS_SMALL",
      width: 17,
      height: 35,
      yPos: 105,
      multipleSpeed: 4,
      minGap: 120,
      minSpeed: 0,
      collisionBoxes: [
        new CollisionBox(0, 7, 5, 27),
        new CollisionBox(4, 0, 6, 34),
        new CollisionBox(10, 4, 7, 14),
      ],
    },
    {
      type: "CACTUS_LARGE",
      width: 25,
      height: 50,
      yPos: 90,
      multipleSpeed: 7,
      minGap: 120,
      minSpeed: 0,
      collisionBoxes: [
        new CollisionBox(0, 12, 7, 38),
        new CollisionBox(8, 0, 7, 49),
        new CollisionBox(13, 10, 10, 38),
      ],
    },
    {
      type: "PTERODACTYL",
      width: 46,
      height: 40,
      yPos: [100, 75, 50], // Variable height
      yPosMobile: [100, 50], // Variable height mobile
      multipleSpeed: 999,
      minSpeed: 8.5,
      minGap: 150,
      collisionBoxes: [
        new CollisionBox(15, 15, 16, 5),
        new CollisionBox(18, 21, 24, 6),
        new CollisionBox(2, 14, 4, 3),
        new CollisionBox(6, 10, 4, 7),
        new CollisionBox(10, 8, 6, 9),
      ],
      numFrames: 2, // 帧动画数量
      frameRate: 1000 / 6, // 帧率, 166.67ms 更新一次
      speedOffset: 0.8, // 速度加快
    },
  ];

  /**
   * @param {HTMLCanvasCtx} canvasCtx
   * @param {Obstacle.type} type
   * @param {Object} spriteImgPos
   * @param {Object} dimensions
   * @param {number} gapCoefficient
   * @param {number} speed
   * @param {number} opt_xOffset
   */
  constructor(
    canvasCtx,
    type,
    spriteImgPos,
    dimensions,
    gapCoefficient,
    speed,
    opt_xOffset
  ) {
    this.canvasCtx = canvasCtx;
    this.spritePos = spriteImgPos;
    this.typeConfig = type;
    this.gapCoefficient = gapCoefficient;
    this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
    this.dimensions = dimensions;
    this.remove = false;
    this.xPos = dimensions.WIDTH + (opt_xOffset || 0);
    this.yPos = 0;
    this.width = 0;
    this.collisionBoxes = [];
    this.gap = 0;
    this.speedOffset = 0;

    // For animated obstacles
    this.currentFrame = 0;
    this.timer = 0;

    this.init(speed);
  }

  /**
   * Initialize the obstacle
   */
  init(speed) {
    this.cloneCollisionBoxes();

    // Only allow sizing if we're at the right speed
    if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
      this.size = 1;
    }

    this.width = this.typeConfig.width * this.size;

    // Check if obstacle can be positioned at various heights
    if (Array.isArray(this.typeConfig.yPos)) {
      const yPosConfig = IS_MOBILE
        ? this.typeConfig.yPosMobile
        : this.typeConfig.yPos;
      this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
    } else {
      this.yPos = this.typeConfig.yPos;
    }

    this.draw();

    // Make collision box adjustments,
    // Central box is adjusted to the size as one box
    if (this.size > 1) {
      this.collisionBoxes[1].width =
        this.width -
        this.collisionBoxes[0].width -
        this.collisionBoxes[2].width;
      this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width;
    }

    // For obstacles that go at a different speed from the horizon
    if (this.typeConfig.speedOffset) {
      this.speedOffset =
        Math.random() > 0.5
          ? this.typeConfig.speedOffset
          : -this.typeConfig.speedOffset;
    }

    this.gap = this.getGap(this.gapCoefficient, speed);
  }

  /**
   * Draw and crop based on size
   */
  draw() {
    let sourceWidth = this.typeConfig.width;
    let sourceHeight = this.typeConfig.height;

    if (IS_HIDPI) {
      sourceWidth = sourceWidth * 2;
      sourceHeight = sourceHeight * 2;
    }

    // X position in sprite
    let sourceX =
      sourceWidth * this.size * (0.5 * (this.size - 1)) + this.spritePos.x;

    // Animation frames
    if (this.currentFrame > 0) {
      sourceX += sourceWidth * this.currentFrame;
    }

    this.canvasCtx.drawImage(
      Runner.imageSprite,
      sourceX,
      this.spritePos.y,
      sourceWidth * this.size,
      sourceHeight,
      this.xPos,
      this.yPos,
      this.typeConfig.width * this.size,
      this.typeConfig.height
    );
  }

  /**
   * Obstacle frame update
   */
  update(deltaTime, speed) {
    if (!this.remove) {
      if (this.typeConfig.speedOffset) {
        // 速度加快
        speed += this.speedOffset;
      }
      // 根据速度和时间计算他们的位移
      this.xPos -= Math.floor(((speed * FPS) / 1000) * deltaTime);

      // 检查障碍物是否有帧动画，比如翼龙有2帧动画，仙人掌没有帧动画, 有帧动画的必须保证移动频率和帧动画频率一致
      if (this.typeConfig.numFrames) {
        this.timer += deltaTime;
        // 如果时间大于帧率，则更新帧
        if (this.timer >= this.typeConfig.frameRate) {
          this.currentFrame =
            this.currentFrame === this.typeConfig.numFrames - 1
              ? 0
              : this.currentFrame + 1;
          // 重置时间
          this.timer = 0;
        }
      }
      this.draw();

      if (!this.isVisible()) {
        this.remove = true;
      }
    }
  }

  /**
   * Calculate a random gap size
   */
  getGap(gapCoefficient, speed) {
    // 根据速度计算最小间隙
    const minGap = Math.round(
      this.width * speed + this.typeConfig.minGap * gapCoefficient
    );
    // 根据最小间隙计算最大间隙
    const maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
    // 返回一个在最小间隙和最大间隙之间的随机数
    return getRandomNum(minGap, maxGap);
  }

  /**
   * Check if obstacle is visible
   */
  isVisible() {
    return this.xPos + this.width > 0;
  }

  /**
   * Make a copy of the collision boxes
   */
  cloneCollisionBoxes() {
    const collisionBoxes = this.typeConfig.collisionBoxes;

    for (let i = collisionBoxes.length - 1; i >= 0; i--) {
      this.collisionBoxes[i] = new CollisionBox(
        collisionBoxes[i].x,
        collisionBoxes[i].y,
        collisionBoxes[i].width,
        collisionBoxes[i].height
      );
    }
  }
}
