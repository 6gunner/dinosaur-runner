import { GAME_CONSTANTS } from "@src/constants";
import { Container, Application, Texture, Rectangle, Sprite, TextureSource } from "pixi.js";
import { SPRITE_DEFINITIONS_1X as SPRITE_DEFINITIONS } from "@src/constants/sprites1x";

const bumpThreshold = 0.5;

function getRandomType() {
  // 如果随机数 > 0.5，返回 WIDTH（使用第二种地面类型）
  // 否则返回 0（使用第一种地面类型）
  return Math.random() > bumpThreshold ? 1 : 0;
}
class Ground {
  private groundContainer: Container;
  private app: Application;
  private spriteSheet: TextureSource;
  private currentSpeed: number;

  constructor(app: Application, spriteSheet: TextureSource, currentSpeed: number) {
    this.app = app;
    this.currentSpeed = currentSpeed;
    this.spriteSheet = spriteSheet;
    const groundContainer = new Container();
    this.groundContainer = groundContainer;
    this.createRandomGround();
    this.app.stage.addChild(this.groundContainer);
    this.app.ticker.add(this.update.bind(this));
  }

  setSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  update() {
    this.groundContainer.children.forEach((child, index) => {
      child.x -= this.currentSpeed; // 负值表示向左滚动，正值表示向右滚动
      if (child.x < -child.width) {
        const rightmostBlock = this.groundContainer.children.reduce((prev, curr) =>
          curr.x > prev.x ? curr : prev
        );
        const type = getRandomType();
        const groundTexture = new Texture({
          source: this.spriteSheet,
          frame: new Rectangle(
            SPRITE_DEFINITIONS.GROUND[type].x,
            SPRITE_DEFINITIONS.GROUND[type].y,
            SPRITE_DEFINITIONS.GROUND[type].width,
            SPRITE_DEFINITIONS.GROUND[type].height
          ),
        });
        // 创建新的texture
        (child as Sprite).texture = groundTexture;
        // 加上speed的距离，免得地面出现裂纹
        child.x = rightmostBlock.x - this.currentSpeed + GAME_CONSTANTS.GROUND_WIDTH;
        console.log('Block index:', index, 'Position:', child.x);
      }
    });
  }

  createRandomGround() {
    // 创建随机地面纹理
    for (
      let i = 0;
      i < 4;
      i++) {
      const type = getRandomType();
      const groundTexture = new Texture({
        source: this.spriteSheet,
        frame: new Rectangle(
          SPRITE_DEFINITIONS.GROUND[type].x,
          SPRITE_DEFINITIONS.GROUND[type].y,
          SPRITE_DEFINITIONS.GROUND[type].width,
          SPRITE_DEFINITIONS.GROUND[type].height
        ),
      });
      const ground = new Sprite(groundTexture);
      ground.anchor.set(0, 1);
      ground.x = i * GAME_CONSTANTS.GROUND_WIDTH;
      ground.y = GAME_CONSTANTS.GAME_HEIGHT;
      this.groundContainer.addChild(ground);
    }
  }
}

export default Ground;