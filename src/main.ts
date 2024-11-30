import { AnimatedSprite, Application, Assets, Container, Loader, Rectangle, RenderTexture, Sprite, Texture, TilingSprite } from 'pixi.js';
import spritePng from '@src/assets/default_100_percent/100-offline-sprite.png';
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

  const horizonContainer = new Container();
  app.stage.addChild(horizonContainer);

  const dinoContainer = new Container();
  app.stage.addChild(dinoContainer);

  // 资源加载
  const spriteSheet = await Assets.load(spritePng);
  console.log('资源加载完成:', spriteSheet);
  // 确保 spriteSheet 存在
  if (!spriteSheet) {
    throw new Error('Sprite sheet not loaded');
  }

  // 恐龙
  const idleDinoTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.DINO.IDLE.x, spriteDefinitions.DINO.IDLE.y, spriteDefinitions.DINO.IDLE.width, spriteDefinitions.DINO.IDLE.height) });
  const dino = new Sprite(idleDinoTexture);
  dino.anchor.set(0.5, 1);
  dino.x = GAME_CONSTANTS.DINO_START_X;
  dino.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  dinoContainer.addChild(dino);

  const runningDinoTextures = spriteDefinitions.DINO.RUN.map(item => new Texture({
    source: spriteSheet, frame: new Rectangle(item.x, item.y, item.width, item.height)
  }))
  const runningDinoSprite = new AnimatedSprite(runningDinoTextures);
  runningDinoSprite.x = GAME_CONSTANTS.DINO_START_X + 100;
  runningDinoSprite.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  runningDinoSprite.anchor.set(0.5, 1)
  runningDinoSprite.animationSpeed = 0.1;  // 添加动画速度
  runningDinoSprite.play();  // 直接在这里调用一次
  dinoContainer.addChild(runningDinoSprite);

  // 恐龙died
  const diedDinoTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.DINO.CRASH.x, spriteDefinitions.DINO.CRASH.y, spriteDefinitions.DINO.CRASH.width, spriteDefinitions.DINO.CRASH.height) });
  const diedDino = new Sprite(diedDinoTexture);
  diedDino.anchor.set(0.5, 1);
  diedDino.x = GAME_CONSTANTS.DINO_START_X + 200;
  diedDino.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  dinoContainer.addChild(diedDino);

  // 恐龙下蹲
  const duckDinoTextures = spriteDefinitions.DINO.DUCK.map(item => new Texture({ source: spriteSheet, frame: new Rectangle(item.x, item.y, item.width, item.height) }));
  const duckDino = new AnimatedSprite(duckDinoTextures);
  duckDino.anchor.set(0.5, 1);
  duckDino.x = GAME_CONSTANTS.DINO_START_X + 300;
  duckDino.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  duckDino.animationSpeed = 0.1;
  duckDino.play();
  dinoContainer.addChild(duckDino);




  // 添加云
  const cloudTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.CLOUD.x, spriteDefinitions.CLOUD.y, spriteDefinitions.CLOUD.width, spriteDefinitions.CLOUD.height) });
  const cloud = new Sprite(cloudTexture);
  cloud.anchor.set(0, 1);
  cloud.x = GAME_CONSTANTS.Cloud.MAX_CLOUD_GAP;
  const cloudPosition = getRandomNum(GAME_CONSTANTS.Cloud.MIN_SKY_LEVEL, GAME_CONSTANTS.Cloud.MAX_SKY_LEVEL);
  cloud.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN - dino.height - cloudPosition;

  horizonContainer.addChild(cloud);



  // 障碍物 - 小仙人掌
  const cactusSmallTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.OBSTACLES.CACTUS_SMALL.x, spriteDefinitions.OBSTACLES.CACTUS_SMALL.y, spriteDefinitions.OBSTACLES.CACTUS_SMALL.width, spriteDefinitions.OBSTACLES.CACTUS_SMALL.height) });
  const cactusSmall = new Sprite(cactusSmallTexture);
  cactusSmall.anchor.set(0.5, 1);
  cactusSmall.x = 500;
  cactusSmall.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  horizonContainer.addChild(cactusSmall);

  const cactusLargeTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.OBSTACLES.CACTUS_LARGE.x, spriteDefinitions.OBSTACLES.CACTUS_LARGE.y, spriteDefinitions.OBSTACLES.CACTUS_LARGE.width, spriteDefinitions.OBSTACLES.CACTUS_LARGE.height) });
  const cactusLarge = new Sprite(cactusLargeTexture);
  cactusLarge.anchor.set(0.5, 1);
  cactusLarge.x = 550;
  cactusLarge.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  horizonContainer.addChild(cactusLarge);


  // 翼龙
  const pterosaurTextures = spriteDefinitions.OBSTACLES.PTERODACTYL.map(item => new Texture({ source: spriteSheet, frame: new Rectangle(item.x, item.y, item.width, item.height) }));
  const pterosaur = new AnimatedSprite(pterosaurTextures);
  pterosaur.anchor.set(0.5, 1);
  pterosaur.x = GAME_CONSTANTS.DINO_START_X + 300;
  pterosaur.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN - 50;
  pterosaur.animationSpeed = 0.1;
  pterosaur.play();
  horizonContainer.addChild(pterosaur);


  const groundContainer = createRandomGround(spriteSheet);
  app.stage.addChild(groundContainer);

  app.ticker.add(() => {
    // 简单的移动
    horizonContainer.children.forEach(child => {
      child.x -= 1;  // 向左移动的速度
      // 如果移出屏幕左侧，重置到右侧
      if (child.x < -child.width) {
        child.x = GAME_CONSTANTS.GAME_WIDTH + child.width;
      }
    });
    groundContainer.children.forEach(child => {
      child.x -= 1; // 负值表示向左滚动，正值表示向右滚动

    });

  });


}

// 创建随机地面纹理

function createRandomGround(spriteSheet: any) {
  const totalWidth = GAME_CONSTANTS.GROUND_WIDTH * 2;
  const groundContainer = new Container();

  let currentX = 0;

  for (currentX; currentX < totalWidth; currentX += GAME_CONSTANTS.GROUND_WIDTH) {
    const groundTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.GROUND.x, spriteDefinitions.GROUND.y, spriteDefinitions.GROUND.width, spriteDefinitions.GROUND.height) });
    const ground = new Sprite(groundTexture);
    ground.x = currentX;
    groundContainer.addChild(ground);
  }

  return groundContainer;

}

init()