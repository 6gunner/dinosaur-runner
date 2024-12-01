import { GAME_CONSTANTS } from "@src/constants";
import { AnimatedSprite, Application, Container, Rectangle, Sprite, Texture, TextureSource, Ticker } from "pixi.js";
import { SPRITE_DEFINITIONS_1X as spriteDefinitions } from "@src/constants/sprites1x";
import { getRandomNum } from "@src/utils";

export type ObstacleType = "CACTUS_SMALL" | "CACTUS_LARGE" | "PTERODACTYL";
export type ObstacleConfig = {
  type: ObstacleType; width: number; height: number; yPos: number[]; multipleSpeed: number; minGap: number; minSpeed: number; yPosMobile?: number[]; numFrames?: number; frameRate?: number; speedOffset?: number;
}

class Obstacle {

  private container: Container;
  private spriteSheet: TextureSource;
  private type: ObstacleType;
  public config: ObstacleConfig;
  public sprite: Sprite | AnimatedSprite;
  public removed: boolean = false;

  constructor(container: Container, spriteSheet: TextureSource, type: ObstacleType, currentSpeed: number) {
    this.container = container;
    this.spriteSheet = spriteSheet;
    this.type = type;
    const config = GAME_CONSTANTS.Obstacle.types.find(item => item.type === type);
    if (!config) {
      throw new Error(`Obstacle config not found for type: ${type}`);
    }
    this.config = config;
    this.sprite = this.createObstacle(currentSpeed);
  }

  private createObstacle(speed: number) {
    let size = getRandomNum(1, GAME_CONSTANTS.Obstacle.MAX_OBSTACLE_LENGTH);

    // 2. 检查速度是否允许
    if (size > 1 && this.config.multipleSpeed > speed) {
      size = 1;
    }
    const offsetX = this.config.width * size * (0.5 * (size - 1));

    let obstacle: Sprite;
    switch (this.type) {
      case "CACTUS_SMALL":
        const cactusSmallTexture = new Texture({
          source: this.spriteSheet, frame: new Rectangle(
            spriteDefinitions.OBSTACLES.CACTUS_SMALL.x + offsetX, spriteDefinitions.OBSTACLES.CACTUS_SMALL.y,
            size * spriteDefinitions.OBSTACLES.CACTUS_SMALL.width, spriteDefinitions.OBSTACLES.CACTUS_SMALL.height)
        });
        const cactusSmall = new Sprite(cactusSmallTexture);
        cactusSmall.anchor.set(0.5, 1);
        cactusSmall.x = GAME_CONSTANTS.GAME_WIDTH;
        cactusSmall.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
        obstacle = cactusSmall;
        break;
      case "CACTUS_LARGE":
        const cactusLargeTexture = new Texture({
          source: this.spriteSheet, frame: new Rectangle(spriteDefinitions.OBSTACLES.CACTUS_LARGE.x + offsetX, spriteDefinitions.OBSTACLES.CACTUS_LARGE.y,
            size * spriteDefinitions.OBSTACLES.CACTUS_LARGE.width,
            spriteDefinitions.OBSTACLES.CACTUS_LARGE.height)
        });
        const cactusLarge = new Sprite(cactusLargeTexture);
        cactusLarge.anchor.set(0.5, 1);
        cactusLarge.x = GAME_CONSTANTS.GAME_WIDTH;
        cactusLarge.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
        obstacle = cactusLarge;
        break;
      case "PTERODACTYL":
        const pterosaurYPosIndex = getRandomNum(0, this.config.yPos.length - 1);
        const pterosaurYPos = this.config.yPos[pterosaurYPosIndex];
        const pterosaurTextures = spriteDefinitions.OBSTACLES.PTERODACTYL.map(item => new Texture({ source: this.spriteSheet, frame: new Rectangle(item.x, item.y, item.width, item.height) }));
        const pterosaur = new AnimatedSprite(pterosaurTextures);
        pterosaur.anchor.set(0.5, 1);
        pterosaur.x = GAME_CONSTANTS.GAME_WIDTH;
        pterosaur.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN - pterosaurYPos;
        pterosaur.animationSpeed = 0.1;
        pterosaur.play();
        obstacle = pterosaur;
        break;
    }
    this.container.addChild(obstacle)

    return obstacle;
  }

  update(speed: number) {
    if (this.type === 'PTERODACTYL') {
      this.sprite.x -= 1.5;  // 向左移动的速度
    } else {
      this.sprite.x -= 1;  // 向左移动的速度
    }
    // 如果移出屏幕左侧，重置到右侧
    if (this.sprite.x < -this.sprite.width) {
      // 移除障碍物，重新创建一个新的
      this.remove();
    }
  }

  public remove() {
    this.sprite.destroy();
    this.removed = true;
  }

}

export default Obstacle;