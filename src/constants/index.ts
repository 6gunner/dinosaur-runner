import { CollisionBox } from "@src/v2/CollisionBox";
import { ObstacleConfig, ObstacleType } from "@src/v2/Obstacle";

// 游戏常量
export const GAME_CONSTANTS = {
  GAME_HEIGHT: 150,
  GAME_WIDTH: 600,
  GROUND_WIDTH: 600, // 地面宽度
  GROUND_HEIGHT: 12, // 地面高度
  GROUND_MARGIN: 30, // 地面边距
  DINO_START_X: 50, // 恐龙初始 X 位置

  Trex: {
    DROP_VELOCITY: -5,
    GRAVITY: 0.6,
    HEIGHT: 47,
    HEIGHT_DUCK: 25,
    INITIAL_JUMP_VELOCITY: -10,
    INTRO_DURATION: 1500,
    MAX_JUMP_HEIGHT: 62,
    MIN_JUMP_HEIGHT: 30,
    SPEED_DROP_COEFFICIENT: 3,
    SPRITE_WIDTH: 262,
    START_X_POS: 50,
    WIDTH: 44,
    WIDTH_DUCK: 59,

    collisionBoxes: {
      DUCKING: [
        new CollisionBox(1, 18, 55, 25)
      ],
      RUNNING: [
        new CollisionBox(22, 0, 17, 16),
        new CollisionBox(1, 18, 30, 9),
        new CollisionBox(10, 35, 14, 8),
        new CollisionBox(1, 24, 29, 5),
        new CollisionBox(5, 30, 21, 4),
        new CollisionBox(9, 34, 15, 4)
      ]
    },

    animFrames: {
      IDLE: {
        frames: [44, 0],
        msPerFrame: 1000 / 3,
      },
      RUNNING: {
        frames: [88, 132],
        msPerFrame: 1000 / 12,
      },
      CRASHED: {
        frames: [220],
        msPerFrame: 1000 / 60,
      },
      JUMPING: {
        frames: [0],
        msPerFrame: 1000 / 60,
      },
      DUCKING: {
        frames: [264, 323],
        msPerFrame: 1000 / 8,
      },
    },
  },

  Cloud: {
    HEIGHT: 14,
    MAX_CLOUD_GAP: 400,
    MAX_SKY_LEVEL: 30,
    MIN_CLOUD_GAP: 100,
    MIN_SKY_LEVEL: 71,
    WIDTH: 46,
  },

  Runner: {
    ACCELERATION: 0.001,
    BG_CLOUD_SPEED: 0.2,
    BOTTOM_PAD: 10,
    CLEAR_TIME: 3000,
    CLOUD_FREQUENCY: 0.5,
    GAMEOVER_CLEAR_TIME: 750,
    GRAVITY: 0.6,
    INITIAL_JUMP_VELOCITY: 12,
    INVERT_FADE_DURATION: 12000,
    INVERT_DISTANCE: 700,
    MAX_BLINK_COUNT: 3,
    MAX_CLOUDS: 6,
    MAX_OBSTACLE_LENGTH: 3,
    MAX_SPEED: 13,
    MIN_JUMP_HEIGHT: 35,
    MOBILE_SPEED_COEFFICIENT: 1.2,
    RESOURCE_TEMPLATE_ID: "audio-resources",
    SPEED: 6,
    SPEED_DROP_COEFFICIENT: 3,
    ARCADE_MODE_INITIAL_TOP_POSITION: 35,
    ARCADE_MODE_TOP_POSITION_PERCENT: 0.1,
  },

  Obstacle: {
    GAP_COEFFICIENT: 1.0,
    MAX_GAP_COEFFICIENT: 1.5,
    MAX_OBSTACLE_LENGTH: 3,
    MAX_OBSTACLE_DUPLICATION: 2,
    types: [
      {
        type: "CACTUS_SMALL",
        width: 17,
        height: 35,
        yPos: [105],
        multipleSpeed: 4,
        minGap: 120,
        minSpeed: 0,
        collisionBoxes: [
          new CollisionBox(0, 7, 5, 27),
          new CollisionBox(4, 0, 6, 34),
          new CollisionBox(10, 4, 7, 14),
        ],
      },
      {
        type: "CACTUS_LARGE",
        width: 25,
        height: 50,
        yPos: [90],
        multipleSpeed: 7,
        minGap: 120,
        minSpeed: 0,
        collisionBoxes: [
          new CollisionBox(0, 12, 7, 38),
          new CollisionBox(8, 0, 7, 49),
          new CollisionBox(13, 10, 10, 38),
        ],
      },
      {
        type: "PTERODACTYL",
        width: 46,
        height: 40,
        yPos: [60, 35, 10], // Variable height
        yPosMobile: [100, 50], // Variable height mobile
        multipleSpeed: 999,
        minSpeed: 8.5,
        minGap: 150,
        numFrames: 2, // 帧动画数量
        frameRate: 1000 / 6, // 帧率, 166.67ms 更新一次
        speedOffset: 0.8, // 速度加快
        collisionBoxes: [
          new CollisionBox(15, 15, 16, 5),
          new CollisionBox(18, 21, 24, 6),
          new CollisionBox(2, 14, 4, 3),
          new CollisionBox(6, 10, 4, 7),
          new CollisionBox(10, 8, 6, 9),
        ],
      },
    ] as ObstacleConfig[],
  },
};
