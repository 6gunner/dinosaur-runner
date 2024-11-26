import { Application, Assets, Loader, Rectangle, Sprite, Texture } from 'pixi.js';
import spritePng from '@src/assets/offline-sprite-1x.png';
import { SPRITE_DEFINITIONS_1X as spriteDefinitions } from './constants/sprites1x';
import { GAME_CONSTANTS, } from './constants';
import { getRandomNum } from './utils';

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

  console.log('资源加载完成:', spriteSheet);
  // 确保 spriteSheet 存在
  if (!spriteSheet) {
    throw new Error('Sprite sheet not loaded');
  }

  // 恐龙
  const dinoTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.DINO.IDLE.x, spriteDefinitions.DINO.IDLE.y, spriteDefinitions.DINO.IDLE.width, spriteDefinitions.DINO.IDLE.height) });
  const dino = new Sprite(dinoTexture);
  dino.anchor.set(0.5, 1);
  dino.x = GAME_CONSTANTS.DINO_START_X;
  dino.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;

  app.stage.addChild(dino);


  // 地面
  const groundTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.GROUND.x, spriteDefinitions.GROUND.y, spriteDefinitions.GROUND.width, spriteDefinitions.GROUND.height) });

  const ground = new Sprite(groundTexture);
  ground.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  app.stage.addChild(ground);

  // 添加云
  const cloudTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.CLOUD.x, spriteDefinitions.CLOUD.y, spriteDefinitions.CLOUD.width, spriteDefinitions.CLOUD.height) });
  const cloud = new Sprite(cloudTexture);
  cloud.anchor.set(0, 0);
  cloud.x = GAME_CONSTANTS.Cloud.MAX_CLOUD_GAP;
  const cloudPosition = getRandomNum(GAME_CONSTANTS.Cloud.MIN_SKY_LEVEL, GAME_CONSTANTS.Cloud.MAX_SKY_LEVEL);
  debugger;
  cloud.y = cloudPosition;
  console.log('cloudPosition', cloudPosition);
  app.stage.addChild(cloud);


  // 让恐龙跳起来
  app.ticker.add(() => {
    // 每一帧恐龙的位置
    dino.y = dino.y - ;

  });


}
init()