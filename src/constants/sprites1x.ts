// 1x 精灵图的配置
export const SPRITE_DEFINITIONS_1X = {
  // 恐龙相关
  DINO: {
    // 静止状态
    IDLE: { x: 38, y: 0, width: 44, height: 47 },
    // 跑步动画帧
    RUN: [
      { x: 848, y: 0, width: 44, height: 47 },
      { x: 892, y: 0, width: 44, height: 47 }
    ],
    // 跳跃状态
    JUMP: { x: 848, y: 0, width: 44, height: 47 },
    // 蹲下动画帧
    DUCK: [
      { x: 1112, y: 0, width: 59, height: 47 },
      { x: 1171, y: 0, width: 59, height: 47 }
    ],
    // 撞击状态
    CRASH: { x: 936, y: 0, width: 44, height: 47 }
  },

  // 障碍物
  OBSTACLES: {
    CACTUS_SMALL: { x: 223, y: 0, width: 17, height: 35 },
    CACTUS_LARGE: { x: 326, y: 0, width: 25, height: 50 },
    CACTUS_GROUP: { x: 274, y: 0, width: 51, height: 50 },
    PTERODACTYL: [
      { x: 130, y: 0, width: 46, height: 40 },
      { x: 176, y: 0, width: 46, height: 40 }
    ]
  },

  // 地面
  GROUND: { x: 2, y: 54, width: 1200, height: 12 },

  // 云朵
  CLOUD: { x: 86, y: 0, width: 46, height: 14 },

  // 游戏结束
  GAME_OVER: { x: 647, y: 15, width: 191, height: 11 },

  // 重新开始按钮
  RESTART: { x: 1, y: 1, width: 36, height: 32 },

  // 分数数字 (0-9)
  NUMBERS: {
    x: 647,
    y: 0,
    width: 10,
    height: 12,
    digits: [
      { offset: 0 },   // 0
      { offset: 10 },  // 1
      { offset: 20 },  // 2
      { offset: 30 },  // 3
      { offset: 40 },  // 4
      { offset: 50 },  // 5
      { offset: 60 },  // 6
      { offset: 70 },  // 7
      { offset: 80 },  // 8
      { offset: 90 }   // 9
    ]
  }
};
