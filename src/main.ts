import { AnimatedSprite, Application, Assets, Container, Rectangle, Sprite, Texture } from 'pixi.js';
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

  const backgroundContainer = new Container();
  app.stage.addChild(backgroundContainer);

  const obstacleContainer = new Container();
  app.stage.addChild(obstacleContainer);

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

  backgroundContainer.addChild(cloud);



  // 障碍物 - 小仙人掌
  const cactusSmallTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.OBSTACLES.CACTUS_SMALL.x, spriteDefinitions.OBSTACLES.CACTUS_SMALL.y, spriteDefinitions.OBSTACLES.CACTUS_SMALL.width, spriteDefinitions.OBSTACLES.CACTUS_SMALL.height) });
  const cactusSmall = new Sprite(cactusSmallTexture);
  cactusSmall.anchor.set(0.5, 1);
  cactusSmall.x = 500;
  cactusSmall.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  obstacleContainer.addChild(cactusSmall);

  const cactusLargeTexture = new Texture({ source: spriteSheet, frame: new Rectangle(spriteDefinitions.OBSTACLES.CACTUS_LARGE.x, spriteDefinitions.OBSTACLES.CACTUS_LARGE.y, spriteDefinitions.OBSTACLES.CACTUS_LARGE.width, spriteDefinitions.OBSTACLES.CACTUS_LARGE.height) });
  const cactusLarge = new Sprite(cactusLargeTexture);
  cactusLarge.anchor.set(0.5, 1);
  cactusLarge.x = 550;
  cactusLarge.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
  obstacleContainer.addChild(cactusLarge);


  // 翼龙
  const pterosaurConfig = GAME_CONSTANTS.Obstacle.types.find(item => item.type === 'PTERODACTYL');
  if (!pterosaurConfig) {
    throw new Error('Pterosaur config not found');
  }
  const pterosaurYPosIndex = getRandomNum(0, pterosaurConfig.yPos.length - 1);
  const pterosaurYPos = pterosaurConfig.yPos[pterosaurYPosIndex];
  const pterosaurTextures = spriteDefinitions.OBSTACLES.PTERODACTYL.map(item => new Texture({ source: spriteSheet, frame: new Rectangle(item.x, item.y, item.width, item.height) }));
  const pterosaur = new AnimatedSprite(pterosaurTextures);
  pterosaur.anchor.set(0.5, 1);
  pterosaur.x = GAME_CONSTANTS.DINO_START_X + 300;
  pterosaur.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN - pterosaurYPos;
  pterosaur.animationSpeed = 0.1;
  pterosaur.play();
  obstacleContainer.addChild(pterosaur);


  const groundContainer = createRandomGround(spriteSheet);
  app.stage.addChild(groundContainer);

  app.ticker.add(() => {
    // 简单的移动
    backgroundContainer.children.forEach(child => {
      child.x -= 1;  // 向左移动的速度
      // 如果移出屏幕左侧，重置到右侧
      if (child.x < -child.width) {
        child.x = GAME_CONSTANTS.GAME_WIDTH + child.width;
      }
    });

    obstacleContainer.children.forEach(child => {
      child.x -= 1;  // 向左移动的速度
      if (child instanceof AnimatedSprite) {
        child.x -= 2;  // 向左移动的速度

      }
      // 如果移出屏幕左侧，重置到右侧
      if (child.x < -child.width) {
        child.x = GAME_CONSTANTS.GAME_WIDTH + child.width;
        if (child instanceof AnimatedSprite) {
          // 更换他们的高度
          const pterosaurYPos = pterosaurConfig?.yPos[getRandomNum(0, pterosaurConfig?.yPos.length - 1)];
          child.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN - pterosaurYPos;
        }
      }

    });
    groundContainer.children.forEach(child => {
      child.x -= 1; // 负值表示向左滚动，正值表示向右滚动
      if (child.x < -child.width) {
        const rightmostBlock = groundContainer.children.reduce((prev, curr) =>
          curr.x > prev.x ? curr : prev
        );
        const type = getRandomType();
        const groundTexture = new Texture({
          source: spriteSheet,
          frame: new Rectangle(
            spriteDefinitions.GROUND[type].x,
            spriteDefinitions.GROUND[type].y,
            spriteDefinitions.GROUND[type].width,
            spriteDefinitions.GROUND[type].height)
        });
        // 创建新的texture
        (child as Sprite).texture = groundTexture;
        child.x = rightmostBlock.x + rightmostBlock.width;
      }
    });
  });

}

// 创建随机地面纹理
const bumpThreshold = 0.5;
function getRandomType() {
  // 如果随机数 > 0.5，返回 WIDTH（使用第二种地面类型）
  // 否则返回 0（使用第一种地面类型）
  return Math.random() > bumpThreshold ? 1 : 0;
}
function createRandomGround(spriteSheet: any) {
  const totalWidth = GAME_CONSTANTS.GROUND_WIDTH * 2;
  const groundContainer = new Container();

  for (let currentX = 0; currentX < totalWidth + GAME_CONSTANTS.GROUND_WIDTH; currentX += GAME_CONSTANTS.GROUND_WIDTH) {
    const type = getRandomType();
    const groundTexture = new Texture({
      source: spriteSheet, frame: new Rectangle(
        spriteDefinitions.GROUND[type].x,
        spriteDefinitions.GROUND[type].y,
        spriteDefinitions.GROUND[type].width,
        spriteDefinitions.GROUND[type].height)
    });
    const ground = new Sprite(groundTexture);
    ground.x = currentX;
    ground.anchor.set(0, 1);
    ground.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
    groundContainer.addChild(ground);
  }

  return groundContainer;

}

init()