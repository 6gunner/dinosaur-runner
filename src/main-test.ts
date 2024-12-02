import {
  Application,
  Assets,
  Loader,
  Rectangle,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";
import spritePng from "@src/assets/default_100_percent/100-offline-sprite.png";
import { SPRITE_DEFINITIONS_1X as spriteDefinitions } from "./constants/sprites1x";
import { GAME_CONSTANTS } from "./constants";
import { getRandomNum } from "./utils";


type DinoSprite = Sprite & {
  isJumping: boolean;
  isDucking: boolean;
  jumpVelocity: number;
  groundY: number;
  minJumpHeight: number;
  reachedMinHeight: boolean;
  speedDrop: boolean;
};

// 恐龙配置，参考 Trex.js
const DINO_CONFIG = {
  DROP_VELOCITY: -5,
  GRAVITY: 0.6,
  INITIAL_JUMP_VELOCITY: -12,
  MAX_JUMP_HEIGHT: 60,
  MIN_JUMP_HEIGHT: 50,
  SPEED_DROP_COEFFICIENT: 3,
};

async function init() {
  const app = new Application();
  await app.init({
    width: GAME_CONSTANTS.GAME_WIDTH,
    height: GAME_CONSTANTS.GAME_HEIGHT,
    background: "#fff",
  });
  document.body.appendChild(app.canvas);

  // 资源加载
  const spriteSheet = await Assets.load(spritePng);

  console.log("资源加载完成:", spriteSheet);
  // 确保 spriteSheet 存在
  if (!spriteSheet) {
    throw new Error("Sprite sheet not loaded");
  }

  // 恐龙
  const dinoTexture = new Texture({
    source: spriteSheet,
    frame: new Rectangle(
      spriteDefinitions.DINO.JUMP.x,
      2,
      spriteDefinitions.DINO.JUMP.width,
      spriteDefinitions.DINO.JUMP.height
    ),
  });
  const dino = new Sprite(dinoTexture) as DinoSprite;
  // dino.anchor.set(0.5, 0);
  dino.x = GAME_CONSTANTS.DINO_START_X;
  // dino.y = GAME_CONSTANTS.GAME_HEIGHT - spriteDefinitions.DINO.JUMP.height;
  /// 设置为底部
  dino.anchor.set(0.5, 1);
  dino.y = GAME_CONSTANTS.GAME_HEIGHT;
  app.stage.addChild(dino);

  // 扩展 dino 对象的属性
  dino.isJumping = false;
  dino.isDucking = false;
  dino.jumpVelocity = 10;
  dino.groundY = GAME_CONSTANTS.GAME_HEIGHT;
  dino.minJumpHeight = dino.groundY - DINO_CONFIG.MIN_JUMP_HEIGHT;
  dino.reachedMinHeight = false;
  dino.speedDrop = false;

  // 地面
  const groundTexture = new Texture({
    source: spriteSheet,
    frame: new Rectangle(
      spriteDefinitions.GROUND[0].x,
      spriteDefinitions.GROUND[0].y,
      spriteDefinitions.GROUND[0].width,
      spriteDefinitions.GROUND[0].height
    ),
  });

  const ground = new TilingSprite({
    texture: groundTexture,
    width: app.screen.width,
    height: spriteDefinitions.GROUND[0].height,
  });
  // 对于x轴：0 是左边，1 是右边，0.5 是中间
  // 对于y轴：0 是顶部，1 是底部，0.5 是中间
  ground.anchor.set(0, 1);
  ground.x = 0;
  ground.y = GAME_CONSTANTS.GAME_HEIGHT;
  app.stage.addChild(ground);

  // 趴着的恐龙
  // const duckDinoTexture = new Texture({
  //   source: spriteSheet,
  //   frame: new Rectangle(
  //     spriteDefinitions.DINO.DUCK[0].x,
  //     spriteDefinitions.DINO.DUCK[0].y,
  //     spriteDefinitions.DINO.DUCK[0].width,
  //     spriteDefinitions.DINO.DUCK[0].height
  //   ),
  // });
  // const duckDino = new Sprite(duckDinoTexture);
  // // dino.anchor.set(0.5, 0);
  // duckDino.x = GAME_CONSTANTS.DINO_START_X + 50;
  // // dino.y = GAME_CONSTANTS.GAME_HEIGHT - spriteDefinitions.DINO.JUMP.height;
  // /// 设置为底部
  // duckDino.anchor.set(0.5, 1);
  // duckDino.y = GAME_CONSTANTS.GAME_HEIGHT;
  // app.stage.addChild(duckDino);

  // 云朵的生成，以及不断移动
  // 添加云
  const cloudTexture = new Texture({
    source: spriteSheet,
    frame: new Rectangle(
      spriteDefinitions.CLOUD.x,
      spriteDefinitions.CLOUD.y,
      spriteDefinitions.CLOUD.width,
      spriteDefinitions.CLOUD.height
    ),
  });
  const cloud = new Sprite(cloudTexture);
  cloud.anchor.set(0.5, 1);
  cloud.x = 100;
  const cloudPosition = getRandomNum(
    GAME_CONSTANTS.Cloud.MIN_SKY_LEVEL,
    GAME_CONSTANTS.Cloud.MAX_SKY_LEVEL
  );
  cloud.y = ground.y - dino.height - cloudPosition;
  app.stage.addChild(cloud);

  app.ticker.add((delta) => {
    // 地面滚动
    ground.tilePosition.x -= 1;

    // 更新恐龙跳跃
    if (dino.isJumping) {
      // 向上： 加速度 从-10 到 0
      // 向下： 加速度 从 0 一直增加
      dino.y += dino.jumpVelocity;
      dino.jumpVelocity += DINO_CONFIG.GRAVITY;

      // 检查是否达到最小跳跃高度
      if (dino.y < dino.minJumpHeight || dino.speedDrop) {
        dino.reachedMinHeight = true;
      }

      if (dino.jumpVelocity > 0) {
        dino.jumpVelocity += DINO_CONFIG.GRAVITY * DINO_CONFIG.SPEED_DROP_COEFFICIENT;
      }

      // 检查是否落地
      if (dino.y > dino.groundY) {
        dino.y = dino.groundY;
        dino.jumpVelocity = 0;
        dino.isJumping = false;
        dino.reachedMinHeight = false;
        dino.speedDrop = false;
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" || e.code === "Space") {
      if (!dino.isJumping) {
        dino.isJumping = true;
        dino.jumpVelocity = DINO_CONFIG.INITIAL_JUMP_VELOCITY;
        dino.reachedMinHeight = false;
        dino.speedDrop = false;
      }
    } else if (e.code === "ArrowDown") {
      if (dino.isJumping) {
        dino.speedDrop = true;
      }
      dino.isDucking = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown") {
      dino.isDucking = false;
    }
  });
}
init();
