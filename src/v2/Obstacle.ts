import { GAME_CONSTANTS } from "@src/constants";
import {
  AnimatedSprite,
  Application,
  Container,
  Rectangle,
  Sprite,
  Texture,
  TextureSource,
  Ticker,
} from "pixi.js";
import { SPRITE_DEFINITIONS_1X as SPRITE_DEFINITIONS } from "@src/constants/sprites1x";
import { getRandomNum } from "@src/utils";

export type ObstacleType = "CACTUS_SMALL" | "CACTUS_LARGE" | "PTERODACTYL";
export type ObstacleConfig = {
  type: ObstacleType;
  width: number;
  height: number;
  yPos: number[];
  multipleSpeed: number;
  minGap: number;
  minSpeed: number;
  yPosMobile?: number[];
  numFrames?: number;
  frameRate?: number;
  speedOffset?: number;
};

class Obstacle {
  private container: Container;
  private spriteSheet: TextureSource;
  private type: ObstacleType;
  public config: ObstacleConfig;
  public sprite: Sprite | AnimatedSprite;
  public removed: boolean = false;
  public followingObstacleCreated: boolean = false;
  public gap: number = 0;

  constructor(
    container: Container,
    spriteSheet: TextureSource,
    type: ObstacleType,
    currentSpeed: number
  ) {
    this.container = container;
    this.spriteSheet = spriteSheet;
    this.type = type;
    const config = GAME_CONSTANTS.Obstacle.types.find(
      (item) => item.type === type
    );
    if (!config) {
      throw new Error(`Obstacle config not found for type: ${type}`);
    }
    this.config = config;
    this.init(currentSpeed);
  }

  private init(speed: number) {
    let size = getRandomNum(1, GAME_CONSTANTS.Obstacle.MAX_OBSTACLE_LENGTH);

    // 2. 检查速度是否允许
    if (size > 1 && this.config.multipleSpeed > speed) {
      size = 1;
    }
    const offsetX = this.config.width * size * (0.5 * (size - 1));
    let obstacleSprite: Sprite | AnimatedSprite;
    switch (this.type) {
      case "CACTUS_SMALL":
        const cactusSmallTexture = new Texture({
          source: this.spriteSheet,
          frame: new Rectangle(
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_SMALL.x + offsetX,
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_SMALL.y,
            size * SPRITE_DEFINITIONS.OBSTACLES.CACTUS_SMALL.width,
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_SMALL.height
          ),
        });
        const cactusSmall = new Sprite(cactusSmallTexture);
        cactusSmall.anchor.set(0.5, 1);
        cactusSmall.x = GAME_CONSTANTS.GAME_WIDTH;
        cactusSmall.y =
          GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
        obstacleSprite = cactusSmall;
        break;
      case "CACTUS_LARGE":
        const cactusLargeTexture = new Texture({
          source: this.spriteSheet,
          frame: new Rectangle(
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_LARGE.x + offsetX,
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_LARGE.y,
            size * SPRITE_DEFINITIONS.OBSTACLES.CACTUS_LARGE.width,
            SPRITE_DEFINITIONS.OBSTACLES.CACTUS_LARGE.height
          ),
        });
        const cactusLarge = new Sprite(cactusLargeTexture);
        cactusLarge.anchor.set(0.5, 1);
        cactusLarge.x = GAME_CONSTANTS.GAME_WIDTH;
        cactusLarge.y =
          GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
        obstacleSprite = cactusLarge;
        break;
      case "PTERODACTYL":
        const pterosaurYPosIndex = getRandomNum(0, this.config.yPos.length - 1);
        const pterosaurYPos = this.config.yPos[pterosaurYPosIndex];
        const pterosaurTextures = SPRITE_DEFINITIONS.OBSTACLES.PTERODACTYL.map(
          (item) =>
            new Texture({
              source: this.spriteSheet,
              frame: new Rectangle(item.x, item.y, item.width, item.height),
            })
        );
        const pterosaur = new AnimatedSprite(pterosaurTextures);
        pterosaur.anchor.set(0.5, 1);
        pterosaur.x = GAME_CONSTANTS.GAME_WIDTH;
        pterosaur.y =
          GAME_CONSTANTS.GAME_HEIGHT -
          GAME_CONSTANTS.GROUND_MARGIN -
          pterosaurYPos;
        pterosaur.animationSpeed = 0.1;
        pterosaur.play();
        obstacleSprite = pterosaur;
        break;
    }

    this.sprite = obstacleSprite;
    this.container.addChild(obstacleSprite);
    this.gap = this.initGap(speed);
  }

  update(speed: number) {
    if (this.removed) {
      return;
    }
    if (this.type === "PTERODACTYL") {
      this.sprite.x -= 2; // 向左移动的速度
    } else {
      this.sprite.x -= 1; // 向左移动的速度
    }
    // 如果移出屏幕左侧，重置到右侧
    if (this.sprite.x < -this.sprite.width) {
      // 移除障碍物，重新创建一个新的
      this.remove();
      return;
    }
  }

  public remove() {
    // this.sprite.destroy();
    this.removed = true;
    this.container.removeChild(this.sprite);
  }

  /**
   * Check if obstacle is visible
   */
  isVisible() {
    return this.sprite && this.sprite.x + this.sprite.width > 0;
  }

  private initGap(speed: number): number {
    // 速度*障碍物宽度+最小间隙*间隙系数
    const minGap = Math.round(
      this.sprite.width * speed +
        this.config.minGap * GAME_CONSTANTS.Obstacle.GAP_COEFFICIENT
    );
    // 最小间隙*最大间隙系数
    const maxGap = Math.round(
      minGap * GAME_CONSTANTS.Obstacle.MAX_GAP_COEFFICIENT
    );
    // 返回一个在最小间隙和最大间隙之间的随机数
    return getRandomNum(minGap, maxGap);
  }
}

export default Obstacle;
