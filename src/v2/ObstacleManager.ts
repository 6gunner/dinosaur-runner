import Obstacle, { ObstacleType } from "./Obstacle";
import { Application, Container, TextureSource, Ticker } from "pixi.js";
import { getRandomNum } from "@src/utils";
import { GAME_CONSTANTS } from "@src/constants";

class ObstacleManager {


  private app: Application;
  private spriteSheet: TextureSource;
  private container: Container;

  private currentSpeed: number = 9;
  public obstacles: Obstacle[] = [];
  private obstacleHistory: ObstacleType[] = [];

  constructor(app: Application, spriteSheet: any) {

    this.app = app;
    this.spriteSheet = spriteSheet;
    // 创建障碍物容器
    this.container = new Container();
    app.stage.addChild(this.container);
    // 设置更新循环
    this.app.ticker.add(this.updateObstacles.bind(this));
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
    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.removed) {
        return false;
      }
      obstacle.update(this.currentSpeed);
      return true;
    });

    // 2. 检查是否需要添加新障碍物
    if (this.obstacles.length > 0) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];

      //  当最后一个障碍物满足以下条件时，创建新障碍物：
      //  最后一个障碍物可见 && 最后一个障碍物加上其间隔已经进入屏幕 && 还没有创建跟随的障碍物
      if (lastObstacle &&
        lastObstacle.isVisible() &&
        lastObstacle.sprite.x + lastObstacle.sprite.width + lastObstacle.gap < GAME_CONSTANTS.GAME_WIDTH &&
        !lastObstacle.followingObstacleCreated
      ) {
        this.addNewObstacle(this.currentSpeed);
        lastObstacle.followingObstacleCreated = true;
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
  }


}

export default ObstacleManager;