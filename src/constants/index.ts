


// 游戏常量
export const GAME_CONSTANTS = {

  GAME_HEIGHT: 150,
  GAME_WIDTH: 600,


  GROUND_HEIGHT: 12,  // 地面高度
  GROUND_MARGIN: 25,  // 地面边距
  DINO_START_X: 50,  // 恐龙初始 X 位置


  Trex: {
    DROP_VELOCITY: -5,
    GRAVITY: 0.6,
    HEIGHT: 47,
    HEIGHT_DUCK: 25,
    INIITAL_JUMP_VELOCITY: -10,
    INTRO_DURATION: 1500,
    MAX_JUMP_HEIGHT: 30,
    MIN_JUMP_HEIGHT: 30,
    SPEED_DROP_COEFFICIENT: 3,
    SPRITE_WIDTH: 262,
    START_X_POS: 50,
    WIDTH: 44,
    WIDTH_DUCK: 59

    // collisionBoxes = {
    //   DUCKING: [
    //     new CollisionBox(1, 18, 55, 25)
    //   ],
    //   RUNNING: [
    //     new CollisionBox(22, 0, 17, 16),
    //     new CollisionBox(1, 18, 30, 9),
    //     new CollisionBox(10, 35, 14, 8),
    //     new CollisionBox(1, 24, 29, 5),
    //     new CollisionBox(5, 30, 21, 4),
    //     new CollisionBox(9, 34, 15, 4)
    //   ]
  },


  Cloud: {
    HEIGHT: 14,
    MAX_CLOUD_GAP: 400,
    MAX_SKY_LEVEL: 30,
    MIN_CLOUD_GAP: 100,
    MIN_SKY_LEVEL: 71,
    WIDTH: 46
  }
};
