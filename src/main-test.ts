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
  const dino = new Sprite(dinoTexture);
  // dino.anchor.set(0.5, 0);
  dino.x = GAME_CONSTANTS.DINO_START_X;
  // dino.y = GAME_CONSTANTS.GAME_HEIGHT - spriteDefinitions.DINO.JUMP.height;
  /// 设置为底部
  dino.anchor.set(0.5, 1);
  dino.y = GAME_CONSTANTS.GAME_HEIGHT;

  app.stage.addChild(dino);

  // 地面
  const groundTexture = new Texture({
    source: spriteSheet,
    frame: new Rectangle(
      spriteDefinitions.GROUND.x,
      spriteDefinitions.GROUND.y,
      spriteDefinitions.GROUND.width,
      spriteDefinitions.GROUND.height
    ),
  });

  const ground = new TilingSprite({
    texture: groundTexture,
    width: app.screen.width,
    height: spriteDefinitions.GROUND.height,
  });
  // 对于x轴：0 是左边，1 是右边，0.5 是中间
  // 对于y轴：0 是顶部，1 是底部，0.5 是中间
  ground.anchor.set(0, 1);
  ground.x = 0;
  ground.y = GAME_CONSTANTS.GAME_HEIGHT;
  app.stage.addChild(ground);

  // 趴着的恐龙
  const duckDinoTexture = new Texture({
    source: spriteSheet,
    frame: new Rectangle(
      spriteDefinitions.DINO.DUCK[0].x,
      spriteDefinitions.DINO.DUCK[0].y,
      spriteDefinitions.DINO.DUCK[0].width,
      spriteDefinitions.DINO.DUCK[0].height
    ),
  });
  const duckDino = new Sprite(duckDinoTexture);
  // dino.anchor.set(0.5, 0);
  duckDino.x = GAME_CONSTANTS.DINO_START_X + 50;
  // dino.y = GAME_CONSTANTS.GAME_HEIGHT - spriteDefinitions.DINO.JUMP.height;
  /// 设置为底部
  duckDino.anchor.set(0.5, 1);
  duckDino.y = GAME_CONSTANTS.GAME_HEIGHT;
  app.stage.addChild(duckDino);

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

  app.ticker.add(() => {
    // 让地面一直向左移动
    ground.tilePosition.x -= 1; // 负值表示向左滚动，正值表示向右滚动
  });
}
init();
