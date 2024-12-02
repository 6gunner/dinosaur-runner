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
import { SPRITE_DEFINITIONS_1X as SPRITE_DEFINITIONS } from "./constants/sprites1x";
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
      SPRITE_DEFINITIONS.DINO.JUMP.x,
      2,
      SPRITE_DEFINITIONS.DINO.JUMP.width,
      SPRITE_DEFINITIONS.DINO.JUMP.height
    ),
  });
  const dino = new Sprite(dinoTexture) as DinoSprite;
  // dino.anchor.set(0.5, 0);
  dino.x = GAME_CONSTANTS.DINO_START_X;
  // dino.y = GAME_CONSTANTS.GAME_HEIGHT - SPRITE_DEFINITIONS.DINO.JUMP.height;
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
      SPRITE_DEFINITIONS.GROUND[0].x,
      SPRITE_DEFINITIONS.GROUND[0].y,
      SPRITE_DEFINITIONS.GROUND[0].width,
      SPRITE_DEFINITIONS.GROUND[0].height
    ),
  });

  const ground = new TilingSprite({
    texture: groundTexture,
    width: app.screen.width,
    height: SPRITE_DEFINITIONS.GROUND[0].height,
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
      SPRITE_DEFINITIONS.CLOUD.x,
      SPRITE_DEFINITIONS.CLOUD.y,
      SPRITE_DEFINITIONS.CLOUD.width,
      SPRITE_DEFINITIONS.CLOUD.height
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
  });
}

init();
