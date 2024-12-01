import Obstacle, { ObstacleType } from "./Obstacle";
import { Application, Container, Sprite, TextureSource, Ticker } from "pixi.js";
import { getRandomNum } from "@src/utils";
import { GAME_CONSTANTS } from "@src/constants";

class ObstacleManager {


  private app: Application;
  private spriteSheet: TextureSource;
  private container: Container;

  private currentSpeed: number = 9;
  private obstacles: Obstacle[] = [];
  private obstacleHistory: ObstacleType[] = [];

  // todo 
  private gapCoefficient: number = 0.6;
  private lastObstacleTime: number = 0;

  constructor(app: Application, spriteSheet: any) {

    this.app = app;
    this.spriteSheet = spriteSheet;
    // 创建障碍物容器
    this.container = new Container();
    app.stage.addChild(this.container);
    // 设置更新循环
    this.app.ticker.add(this.updateObstacles.bind(this));
  }

  private getGap(gapCoefficient: number, speed: number): number {
    const minGap = 120;
    const maxGap = 400;
    const speedMultiplier = 1 + (speed / 10);

    return Math.floor(
      Math.random() * (maxGap - minGap + 1) + minGap
    ) * gapCoefficient * speedMultiplier;
  }



  addNewObstacle(currentSpeed: number) {
    // 1. 随机选择障碍物类型
    const obstacleTypeIndex = getRandomNum(0, GAME_CONSTANTS.Obstacle.types.length - 1);
    const obstacleType = GAME_CONSTANTS.Obstacle.types[obstacleTypeIndex];
    // 2. 检查是否可以添加这种类型的障碍物
    if (this.duplicateObstacleCheck(obstacleType.type) ||
      currentSpeed < obstacleType.minSpeed) {
      // 如果不满足条件，递归尝试添加其他类型
      this.addNewObstacle(currentSpeed);
    } else {
      // 3. 创建新障碍物
      this.obstacles.push(
        new Obstacle(
          this.container,
          this.spriteSheet,
          obstacleType.type,
          this.currentSpeed
        )
      );

      // 4. 更新障碍物历史记录
      this.obstacleHistory.unshift(obstacleType.type);
      if (this.obstacleHistory.length > 1) {
        this.obstacleHistory.splice(GAME_CONSTANTS.Obstacle.MAX_OBSTACLE_DUPLICATION);
      }
    }
  }

  /**
   * 检查重复
   * @param nextObstacleType 
   * @returns 
   */
  duplicateObstacleCheck(nextObstacleType: ObstacleType) {
    let duplicateCount = 0;
    // 检查历史记录中连续相同类型的数量
    for (let i = 0; i < this.obstacleHistory.length; i++) {
      duplicateCount = this.obstacleHistory[i] === nextObstacleType ?
        duplicateCount + 1 : 0;
    }
    // 如果超过最大重复次数，返回 true
    return duplicateCount >= GAME_CONSTANTS.Obstacle.MAX_OBSTACLE_DUPLICATION;
  }

  updateObstacles(ticker: Ticker) {
    // 1. 更新和清理现有障碍物
    const updatedObstacles = this.obstacles.slice(0);
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.update(this.currentSpeed);
      if (obstacle.removed) {
        updatedObstacles.shift();  // 移除已标记删除的障碍物
      }
    }
    this.obstacles = updatedObstacles;

    // 2. 检查是否需要添加新障碍物
    if (this.obstacles.length > 0) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];

      //   // 当最后一个障碍物满足以下条件时，创建新障碍物：
      if (lastObstacle &&
        //     !lastObstacle.followingObstacleCreated &&  // 还没有创建跟随的障碍物
        //     lastObstacle.isVisible() &&                // 障碍物可见
        //     // 最后一个障碍物加上其间隔已经进入屏幕
        lastObstacle.sprite.x + lastObstacle.sprite.width + lastObstacle.config.minGap < GAME_CONSTANTS.GAME_WIDTH) {

        this.addNewObstacle(this.currentSpeed);
        //     lastObstacle.followingObstacleCreated = true;
      }
    } else {
      // 没有障碍物时，创建新的
      this.addNewObstacle(this.currentSpeed);
    }
  }

  // 公共方法
  public setSpeed(speed: number) {
    this.currentSpeed = speed;
  }

  public reset() {
    // 清除所有障碍物
    this.obstacles.forEach(obstacle => {
      obstacle.remove();
    });
    this.obstacles = [];
    this.lastObstacleTime = 0;
  }
}


// todo 管理障碍物
// const lastObstacleIndex = this.obstacles.length - 1;
// this.obstacles.forEach((obstacle, index) => {
//   obstacle.x -= speed;
//   // 如果当前障碍物是最后一个障碍物，
//   if (index == lastObstacleIndex) {
//     // 且当前障碍物的坐标 + 宽度 + gap < 1200时，
//     // 则创建一个新的障碍物
//     if (obstacle.x + obstacle.width + this.config.minGap < GAME_CONSTANTS.GAME_WIDTH) {
//       const newObstacle = this.createObstacle();
//       this.obstacles.push(newObstacle);
//     }

//     if (obstacle.x <= -obstacle.width) {
//       this.obstacles.splice(index, 1);
//     }
//   }
// });


export default ObstacleManager;