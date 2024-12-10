import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Texture,
} from "pixi.js";
import spritePng from "@src/assets/default_100_percent/100-offline-sprite.png";
import { SPRITE_DEFINITIONS_1X as SPRITE_DEFINITIONS } from "./constants/sprites1x";
import { GAME_CONSTANTS } from "./constants";
import { getRandomNum } from "./utils";
import ObstacleManager from "./v2/ObstacleManager";
import { DinosaurController } from "./v2/Dinosaur";
import { checkForCollision } from "./v2/CollisionBox";
import Ground from "./v2/Ground";

let gameStatus = 0;
let currentSpeed = 1;
let distanceRan = 0;

async function init() {
  // 获取DOM元素
  const loadingContainer = document.getElementById("loading-container");
  const gameContainer = document.getElementById("game-container");
  const loadingAnimation = document.getElementById(
    "loading-animation"
  ) as HTMLVideoElement;

  if (!loadingContainer || !gameContainer || !loadingAnimation) {
    throw new Error("Required DOM elements not found");
  }

  // 确保加载动画显示
  loadingContainer.style.display = "flex";
  gameContainer.style.display = "none";




  try {
    // 资源加载
    const spriteSheet = await Assets.load(spritePng);
    // 确保 spriteSheet 存在
    if (!spriteSheet) {
      throw new Error("Sprite sheet not loaded");
    }
    console.log("资源加载完成:", spriteSheet);
    // 添加一个小延迟确保加载动画播放流畅
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 使用淡出效果
    loadingContainer.style.opacity = "0";

    // 等待淡出动画完成后再隐藏加载容器并显示游戏
    setTimeout(() => {
      loadingContainer.style.display = "none";
      gameContainer.style.opacity = "1";
      gameContainer.style.display = "flex";
    }, 500);

    const app = new Application();
    await app.init({
      width: GAME_CONSTANTS.GAME_WIDTH,
      height: GAME_CONSTANTS.GAME_HEIGHT,
      background: "#fff",
    });
    gameContainer.appendChild(app.canvas);
    const backgroundContainer = new Container();
    app.stage.addChild(backgroundContainer);

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
    cloud.anchor.set(0, 1);
    cloud.x = GAME_CONSTANTS.Cloud.MAX_CLOUD_GAP;
    const cloudPosition = getRandomNum(
      GAME_CONSTANTS.Cloud.MIN_SKY_LEVEL,
      GAME_CONSTANTS.Cloud.MAX_SKY_LEVEL
    );
    cloud.y =
      GAME_CONSTANTS.GAME_HEIGHT -
      GAME_CONSTANTS.GROUND_MARGIN -
      GAME_CONSTANTS.Trex.HEIGHT -
      cloudPosition;

    backgroundContainer.addChild(cloud);

    // // 恐龙控制器
    const dinosaurController = new DinosaurController(app, spriteSheet);
    // // 障碍物的生成
    const obstacleManager = new ObstacleManager(app, spriteSheet, currentSpeed);

    // 地面
    const ground = new Ground(app, spriteSheet, currentSpeed);

    app.ticker.add(() => {
      // 简单的移动
      backgroundContainer.children.forEach((child) => {
        child.x -= currentSpeed; // 向左移动的速度
        // 如果移出屏幕左侧，重置到右侧
        if (child.x < -child.width) {
          child.x = GAME_CONSTANTS.GAME_WIDTH + child.width;
        }
      });


      for (const obstacle of obstacleManager.obstacles) {
        if (checkForCollision(obstacle, dinosaurController)) {
          console.log("碰撞了, 游戏结束");
          gameStatus = -1;
        }
      }
      if (gameStatus === -1) {
        app.stop();
      } else {
        if (currentSpeed < GAME_CONSTANTS.Runner.MAX_SPEED) {
          distanceRan += currentSpeed;
          currentSpeed += GAME_CONSTANTS.Runner.ACCELERATION;
          obstacleManager.setSpeed(currentSpeed);
          ground.setSpeed(currentSpeed);
        }
      }
    });
  } catch (error) {
    console.error("game error:", error);
  }
}



init();
