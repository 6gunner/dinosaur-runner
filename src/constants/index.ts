


// 游戏常量
export const GAME_CONSTANTS = {

  GAME_HEIGHT: 150,
  GAME_WIDTH: 600,
  GROUND_HEIGHT: 12,  // 地面高度
  GROUND_MARGIN: 30,  // 地面边距
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
  },


  Runner: {
    ACCELERATION: 0.001,
    BG_CLOUD_SPEED: 0.2,
    BOTTOM_PAD: 10,
    CLEAR_TIME: 3000,
    CLOUD_FREQUENCY: 0.5,
    GAMEOVER_CLEAR_TIME: 750,
    GAP_COEFFICIENT: 0.6,
    GRAVITY: 0.6,
    INITIAL_JUMP_VELOCITY: 12,
    INVERT_FADE_DURATION: 12000,
    INVERT_DISTANCE: 700,
    MAX_BLINK_COUNT: 3,
    MAX_CLOUDS: 6,
    MAX_OBSTACLE_LENGTH: 3,
    MAX_OBSTACLE_DUPLICATION: 2,
    MAX_SPEED: 13,
    MIN_JUMP_HEIGHT: 35,
    MOBILE_SPEED_COEFFICIENT: 1.2,
    RESOURCE_TEMPLATE_ID: 'audio-resources',
    SPEED: 6,
    SPEED_DROP_COEFFICIENT: 3,
    ARCADE_MODE_INITIAL_TOP_POSITION: 35,
    ARCADE_MODE_TOP_POSITION_PERCENT: 0.1
  }
};
