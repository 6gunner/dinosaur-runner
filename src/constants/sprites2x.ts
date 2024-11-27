// 2x 精灵图的配置
export const SPRITE_DEFINITIONS_2X = {
  // 恐龙相关
  DINO: {
    // 静止状态
    IDLE: { x: 76, y: 0, width: 88, height: 94 },
    // 跑步动画帧
    RUN: [
      { x: 1696, y: 0, width: 88, height: 94 },
      { x: 1784, y: 0, width: 88, height: 94 }
    ],
    // 跳跃状态
    JUMP: { x: 1696, y: 0, width: 88, height: 94 },
    // 蹲下动画帧
    DUCK: [
      { x: 2203, y: 0, width: 118, height: 94 },
      { x: 2321, y: 0, width: 118, height: 94 }
    ],
    // 撞击状态
    CRASH: { x: 1872, y: 0, width: 88, height: 94 }
  },

  // 障碍物
  OBSTACLES: {
    CACTUS_SMALL: { x: 446, y: 0, width: 34, height: 70 },
    CACTUS_LARGE: { x: 652, y: 0, width: 50, height: 100 },
    // 翼龙
    PTERODACTYL: [
      { x: 260, y: 0, width: 92, height: 80 },
      { x: 352, y: 0, width: 92, height: 80 }
    ]
  },

  // 地面
  GROUND: { x: 4, y: 108, width: 2400, height: 24 },

  // 云朵
  CLOUD: { x: 172, y: 0, width: 92, height: 28 },

  // 游戏结束
  GAME_OVER: { x: 1294, y: 29, width: 382, height: 22 },

  // 重新开始按钮
  RESTART: { x: 2, y: 2, width: 72, height: 64 },

  // 分数数字 (0-9)
  NUMBERS: {
    x: 1294,
    y: 0,
    width: 20,
    height: 24,
    digits: [
      { offset: 0 },   // 0
      { offset: 20 },  // 1
      { offset: 40 },  // 2
      { offset: 60 },  // 3
      { offset: 80 },  // 4
      { offset: 100 }, // 5
      { offset: 120 }, // 6
      { offset: 140 }, // 7
      { offset: 160 }, // 8
      { offset: 180 }  // 9
    ]
  }
};

