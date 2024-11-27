import { IS_HIDPI } from "./constants.js";

/**
 * Distance meter class
 * 处理显示距离计数器
 */
export class DistanceMeter {
  // 尺寸配置
  static dimensions = {
    WIDTH: 10,
    HEIGHT: 13,
    DEST_WIDTH: 11,
  };

  // Y轴位置配置，X位置始终为0
  static yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120];

  // 距离计数器配置
  static config = {
    // 数字位数
    MAX_DISTANCE_UNITS: 5,
    // 触发成就动画的距离
    ACHIEVEMENT_DISTANCE: 100,
    // 用于将像素距离转换为缩放单位
    COEFFICIENT: 0.025,
    // 闪烁持续时间（毫秒）
    FLASH_DURATION: 1000 / 4,
    // 成就动画的闪烁次数
    FLASH_ITERATIONS: 3,
  };

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} spritePos Image position in sprite
   * @param {number} canvasWidth
   */
  constructor(canvas, spritePos, canvasWidth) {
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext("2d");
    this.image = Runner.imageSprite;
    this.spritePos = spritePos;
    this.x = 0;
    this.y = 5;

    this.currentDistance = 0;
    this.maxScore = 0;
    this.highScore = 0;
    this.container = null;

    this.digits = [];
    this.achievement = false;
    this.defaultString = "";
    this.flashTimer = 0;
    this.flashIterations = 0;
    this.invertTrigger = false;

    this.config = DistanceMeter.config;
    this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
    this.init(canvasWidth);
  }

  /**
   * 初始化距离计数器为'00000'
   */
  init(width) {
    let maxDistanceStr = "";

    this.calcXPos(width);
    this.maxScore = this.maxScoreUnits;

    for (let i = 0; i < this.maxScoreUnits; i++) {
      this.draw(i, 0);
      this.defaultString += "0";
      maxDistanceStr += "9";
    }

    this.maxScore = parseInt(maxDistanceStr);
  }

  /**
   * 计算画布中的X位置
   */
  calcXPos(canvasWidth) {
    this.x =
      canvasWidth -
      DistanceMeter.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1);
  }

  /**
   * 在画布上绘制数字
   */
  draw(digitPos, value, opt_highScore) {
    let sourceWidth = DistanceMeter.dimensions.WIDTH;
    let sourceHeight = DistanceMeter.dimensions.HEIGHT;
    let sourceX = DistanceMeter.dimensions.WIDTH * value;
    let sourceY = 0;

    const targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
    const targetY = this.y;
    const targetWidth = DistanceMeter.dimensions.WIDTH;
    const targetHeight = DistanceMeter.dimensions.HEIGHT;

    // 高DPI设备需要2倍源值
    if (IS_HIDPI) {
      sourceWidth *= 2;
      sourceHeight *= 2;
      sourceX *= 2;
    }

    sourceX += this.spritePos.x;
    sourceY += this.spritePos.y;

    this.canvasCtx.save();

    if (opt_highScore) {
      // 当前分数的左侧
      const highScoreX =
        this.x - this.maxScoreUnits * 2 * DistanceMeter.dimensions.WIDTH;
      this.canvasCtx.translate(highScoreX, this.y);
    } else {
      this.canvasCtx.translate(this.x, this.y);
    }

    this.canvasCtx.drawImage(
      this.image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      targetX,
      targetY,
      targetWidth,
      targetHeight
    );

    this.canvasCtx.restore();
  }

  /**
   * 将像素距离转换为实际距离
   */
  getActualDistance(distance) {
    return distance ? Math.round(distance * this.config.COEFFICIENT) : 0;
  }

  /**
   * 更新距离计数器
   */
  update(deltaTime, distance) {
    let paint = true;
    let playSound = false;

    if (!this.achievement) {
      distance = this.getActualDistance(distance);

      // 分数超过初始数字计数
      if (
        distance > this.maxScore &&
        this.maxScoreUnits === this.config.MAX_DISTANCE_UNITS
      ) {
        this.maxScoreUnits++;
        this.maxScore = parseInt(this.maxScore + "9");
      } else {
        this.distance = 0;
      }

      if (distance > 0) {
        // 解锁成就
        if (distance % this.config.ACHIEVEMENT_DISTANCE === 0) {
          // 闪烁分数并播放声音
          this.achievement = true;
          this.flashTimer = 0;
          playSound = true;
        }

        // 创建带前导0的距离字符串
        const distanceStr = (this.defaultString + distance).substr(
          -this.maxScoreUnits
        );
        this.digits = distanceStr.split("");
      } else {
        this.digits = this.defaultString.split("");
      }
    } else {
      // 控制达到成就时分数的闪烁
      if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
        this.flashTimer += deltaTime;

        if (this.flashTimer < this.config.FLASH_DURATION) {
          paint = false;
        } else if (this.flashTimer > this.config.FLASH_DURATION * 2) {
          this.flashTimer = 0;
          this.flashIterations++;
        }
      } else {
        this.achievement = false;
        this.flashIterations = 0;
        this.flashTimer = 0;
      }
    }

    // 如果不是闪烁状态就绘制数字
    if (paint) {
      for (let i = this.digits.length - 1; i >= 0; i--) {
        this.draw(i, parseInt(this.digits[i]));
      }
    }

    this.drawHighScore();
    return playSound;
  }

  /**
   * 绘制最高分
   */
  drawHighScore() {
    this.canvasCtx.save();
    this.canvasCtx.globalAlpha = 0.8;
    for (let i = this.highScore.length - 1; i >= 0; i--) {
      this.draw(i, parseInt(this.highScore[i], 10), true);
    }
    this.canvasCtx.restore();
  }

  /**
   * 设置最高分为数组字符串
   */
  setHighScore(distance) {
    distance = this.getActualDistance(distance);
    const highScoreStr = (this.defaultString + distance).substr(
      -this.maxScoreUnits
    );
    this.highScore = ["10", "11", ""].concat(highScoreStr.split(""));
  }

  /**
   * 重置距离计数器回到'00000'
   */
  reset() {
    this.update(0);
    this.achievement = false;
  }
}
