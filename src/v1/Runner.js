import {
  IS_HIDPI,
  IS_IOS,
  IS_MOBILE,
  IS_TOUCH_ENABLED,
  FPS,
  DEFAULT_WIDTH,
  createCanvas,
  getTimeStamp,
  vibrate,
} from "./constants.js";
import { Trex } from "./Trex.js";
import { DistanceMeter } from "./DistanceMeter.js";
import { Horizon } from "./Horizon.js";
import { checkForCollision } from "./collision.js";

/**
 * T-Rex runner.
 * 游戏主控制器
 */
export class Runner {
  static config = {
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
    RESOURCE_TEMPLATE_ID: "audio-resources",
    SPEED: 6,
    SPEED_DROP_COEFFICIENT: 3,
    ARCADE_MODE_INITIAL_TOP_POSITION: 35,
    ARCADE_MODE_TOP_POSITION_PERCENT: 0.1,
  };

  static classes = {
    ARCADE_MODE: "arcade-mode",
    CANVAS: "runner-canvas",
    CONTAINER: "runner-container",
    CRASHED: "crashed",
    ICON: "icon-offline",
    INVERTED: "inverted",
    SNACKBAR: "snackbar",
    SNACKBAR_SHOW: "snackbar-show",
    TOUCH_CONTROLLER: "controller",
  };

  static spriteDefinition = {
    LDPI: {
      CACTUS_LARGE: { x: 332, y: 2 },
      CACTUS_SMALL: { x: 228, y: 2 },
      CLOUD: { x: 86, y: 2 },
      HORIZON: { x: 2, y: 54 },
      MOON: { x: 484, y: 2 },
      PTERODACTYL: { x: 134, y: 2 },
      RESTART: { x: 2, y: 2 },
      TEXT_SPRITE: { x: 655, y: 2 },
      TREX: { x: 848, y: 2 },
      STAR: { x: 645, y: 2 },
    },
    HDPI: {
      CACTUS_LARGE: { x: 652, y: 2 },
      CACTUS_SMALL: { x: 446, y: 2 },
      CLOUD: { x: 166, y: 2 },
      HORIZON: { x: 2, y: 104 },
      MOON: { x: 954, y: 2 },
      PTERODACTYL: { x: 260, y: 2 },
      RESTART: { x: 2, y: 2 },
      TEXT_SPRITE: { x: 1294, y: 2 },
      TREX: { x: 1678, y: 2 },
      STAR: { x: 1276, y: 2 },
    },
  };

  static defaultDimensions = {
    WIDTH: DEFAULT_WIDTH,
    HEIGHT: 150,
  };

  static events = {
    ANIM_END: "webkitAnimationEnd",
    CLICK: "click",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    RESIZE: "resize",
    TOUCHEND: "touchend",
    TOUCHSTART: "touchstart",
    VISIBILITY: "visibilitychange",
    BLUR: "blur",
    FOCUS: "focus",
    LOAD: "load",
  };

  static keycodes = {
    JUMP: { 38: 1, 32: 1 }, // Up, spacebar
    DUCK: { 40: 1 }, // Down
    RESTART: { 13: 1 }, // Enter
  };

  static sounds = {
    BUTTON_PRESS: "offline-sound-press",
    HIT: "offline-sound-hit",
    SCORE: "offline-sound-reached",
  };

  constructor(containerSelector) {
    // Singleton
    if (Runner.instance_) {
      return Runner.instance_;
    }
    Runner.instance_ = this;

    this.outerContainerEl = document.querySelector(containerSelector);
    this.containerEl = null;
    this.snackbarEl = null;
    this.detailsButton = this.outerContainerEl.querySelector("#details-button");

    this.config = Object.assign({}, Runner.config);
    this.dimensions = Runner.defaultDimensions;

    this.canvas = null;
    this.canvasCtx = null;

    this.tRex = null;
    this.distanceMeter = null;
    this.distanceRan = 0;
    this.highestScore = 0;

    this.time = 0;
    this.runningTime = 0;
    this.msPerFrame = 1000 / FPS;
    this.currentSpeed = this.config.SPEED;

    this.obstacles = [];
    this.activated = false;
    this.playing = false;
    this.crashed = false;
    this.paused = false;
    this.inverted = false;
    this.invertTimer = 0;
    this.resizeTimerId_ = null;
    this.playCount = 0;

    // Sound FX.
    this.audioBuffer = null;
    this.soundFx = {};

    // Global web audio context for playing sounds.
    this.audioContext = null;

    // Images.
    this.images = {};
    this.imagesLoaded = 0;

    // Load the game
    this.loadImages();
  }

  /**
   * 加载游戏所需的图片资源
   */
  async loadImages() {
    // 创建图片对象
    this.images = {
      LDPI: new Image(),
      HDPI: new Image(),
    };

    const runnerImageSrc = IS_HIDPI ? 'images/sprite-2x.png' : 'images/sprite.png';
    
    // 加载图片
    return new Promise((resolve) => {
      this.images[IS_HIDPI ? 'HDPI' : 'LDPI'].addEventListener('load', () => {
        this.init();
        resolve();
      });
      this.images[IS_HIDPI ? 'HDPI' : 'LDPI'].src = runnerImageSrc;
    });
  }

  /**
   * 游戏初始化
   */
  init() {
    // 创建游戏容器
    this.containerEl = document.createElement('div');
    this.containerEl.className = Runner.classes.CONTAINER;
    this.outerContainerEl.appendChild(this.containerEl);

    // 创建画布
    this.canvas = createCanvas(this.containerEl, this.dimensions.WIDTH,
        this.dimensions.HEIGHT, Runner.classes.CANVAS);
    this.canvasCtx = this.canvas.getContext('2d');
    this.canvasCtx.fillStyle = '#f7f7f7';
    this.canvasCtx.fill();

    // 初始化游戏对象
    this.horizon = new Horizon(this.canvas, this.images[IS_HIDPI ? 'HDPI' : 'LDPI'],
        this.dimensions, this.config.GAP_COEFFICIENT);
    this.distanceMeter = new DistanceMeter(this.canvas,
        this.images[IS_HIDPI ? 'HDPI' : 'LDPI'].width, this.dimensions.WIDTH);
    this.tRex = new Trex(this.canvas, this.images[IS_HIDPI ? 'HDPI' : 'LDPI']);

    this.addEventListeners();
    this.update();

    // 初始化声音系统
    this.initializeSound();

    // 添加可见性变化监听
    document.addEventListener(Runner.events.VISIBILITY,
        this.onVisibilityChange.bind(this));
    document.addEventListener(Runner.events.BLUR,
        this.onVisibilityChange.bind(this));
    document.addEventListener(Runner.events.FOCUS,
        this.onVisibilityChange.bind(this));

    // 添加窗口大小变化监听
    window.addEventListener(Runner.events.RESIZE,
        this.onResize.bind(this));
  }

  /**
   * 游戏主循环更新
   */
  update() {
    this.updatePending = false;

    const now = getTimeStamp();
    let deltaTime = now - (this.time || now);
    this.time = now;

    if (this.playing) {
      this.clearCanvas();

      // 更新游戏速度
      if (this.tRex.jumping) {
        this.runningTime += deltaTime;
      } else {
        this.runningTime += deltaTime * this.currentSpeed;
      }

      // 更新游戏对象
      this.horizon.update(deltaTime, this.currentSpeed);
      this.tRex.update(deltaTime);
      this.distanceMeter.update(deltaTime, Math.ceil(this.distanceRan));

      // 检查碰撞
      const collision = checkForCollision(this.horizon.obstacles[0], this.tRex);
      
      if (!collision) {
        this.distanceRan += this.currentSpeed * deltaTime / this.msPerFrame;

        // 加速
        if (this.currentSpeed < this.config.MAX_SPEED) {
          this.currentSpeed += this.config.ACCELERATION;
        }
      } else {
        this.gameOver();
      }
    }

    if (!this.crashed) {
      this.tRex.draw(this.time);
      this.scheduleNextUpdate();
    }
  }

  /**
   * 开始游戏
   */
  startGame() {
    if (this.crashed) {
      this.restart();
    } else {
      this.playing = true;
      this.activated = true;
      this.tRex.startJump();
      this.time = getTimeStamp();
      this.update();
    }
  }

  /**
   * 游戏结束
   */
  gameOver() {
    this.crashed = true;
    this.playing = false;

    if (this.distanceRan > this.highestScore) {
      this.highestScore = Math.ceil(this.distanceRan);
      this.distanceMeter.setHighScore(this.highestScore);
    }

    this.tRex.update(100, Trex.status.CRASHED);
  }

  /**
   * 重启游戏
   */
  restart() {
    this.playing = false;
    this.crashed = false;
    this.currentSpeed = this.config.SPEED;
    this.distanceRan = 0;
    this.time = getTimeStamp();

    this.horizon.reset();
    this.tRex.reset();
    this.update();
  }

  /**
   * 清除画布
   */
  clearCanvas() {
    this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH,
        this.dimensions.HEIGHT);
  }

  /**
   * 计划下一帧更新
   */
  scheduleNextUpdate() {
    if (!this.updatePending) {
      this.updatePending = true;
      requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    document.addEventListener(Runner.events.KEYDOWN, (e) => {
      if (Runner.keycodes.JUMP[e.keyCode] && !this.crashed) {
        e.preventDefault();
        if (!this.playing) {
          this.startGame();
        }
        this.tRex.startJump();
      }
      
      if (Runner.keycodes.DUCK[e.keyCode]) {
        e.preventDefault();
        if (this.tRex.jumping) {
          this.tRex.setSpeedDrop();
        } else if (!this.crashed) {
          this.tRex.setDuck(true);
        }
      }

      if (Runner.keycodes.RESTART[e.keyCode] && this.crashed) {
        this.restart();
      }
    });

    document.addEventListener(Runner.events.KEYUP, (e) => {
      if (Runner.keycodes.DUCK[e.keyCode]) {
        this.tRex.setDuck(false);
      }
    });

    if (IS_MOBILE) {
      this.addTouchListeners();
    }
  }

  /**
   * 添加触摸事件监听器
   */
  addTouchListeners() {
    this.containerEl.addEventListener(Runner.events.TOUCHSTART, (e) => {
      e.preventDefault();
      if (!this.playing) {
        this.startGame();
      }
      this.tRex.startJump();
    });

    this.containerEl.addEventListener(Runner.events.TOUCHEND, (e) => {
      e.preventDefault();
      if (this.tRex.jumping) {
        this.tRex.setSpeedDrop();
      }
    });
  }

  /**
   * 设置游戏默认值
   */
  setArcadeMode() {
    this.dimensions.WIDTH = DEFAULT_WIDTH;
    this.dimensions.HEIGHT = 150;
    this.config.GAP_COEFFICIENT = 0.6;
    this.config.MOBILE_SPEED_COEFFICIENT = 1.2;
  }

  /**
   * 播放声音
   * @param {string} soundName 声音名称
   */
  playSound(soundName) {
    if (this.audioContext) {
      const soundSource = this.audioContext.createBufferSource();
      soundSource.buffer = this.soundFx[soundName];
      soundSource.connect(this.audioContext.destination);
      soundSource.start(0);
    }
  }

  /**
   * 初始化游戏音频
   */
  initializeSound() {
    if (!this.audioContext && window.AudioContext) {
      // 创建音频上下文
      this.audioContext = new AudioContext();

      // 解码音频数据
      const audioTemplate = document.getElementById(this.config.RESOURCE_TEMPLATE_ID);
      if (audioTemplate) {
        this.soundFx = {
          BUTTON_PRESS: this.createSound(audioTemplate.querySelector('#offline-sound-press')),
          HIT: this.createSound(audioTemplate.querySelector('#offline-sound-hit')),
          SCORE: this.createSound(audioTemplate.querySelector('#offline-sound-reached'))
        };
      }
    }
  }

  /**
   * 创建音频对象
   * @param {HTMLAudioElement} sourceNode 
   */
  createSound(sourceNode) {
    if (this.audioContext && sourceNode) {
      const source = this.audioContext.createBufferSource();
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      return source;
    }
    return null;
  }

  /**
   * 切换夜间模式
   * @param {boolean} enabled 
   */
  toggleNightMode(enabled) {
    if (this.dimensions.WIDTH > DEFAULT_WIDTH) {
      // 仅在宽屏模式下启用夜间模式
      const now = getTimeStamp();
      this.inverted = enabled;
      
      if (this.inverted) {
        this.invertTimer = now + this.config.INVERT_FADE_DURATION;
        document.body.classList.add(Runner.classes.INVERTED);
      } else {
        document.body.classList.remove(Runner.classes.INVERTED);
      }
    }
  }

  /**
   * 更新游戏区域尺寸
   */
  updateDimensions() {
    this.containerEl.style.width = `${this.dimensions.WIDTH}px`;
    this.containerEl.style.height = `${this.dimensions.HEIGHT}px`;
    this.canvas.width = this.dimensions.WIDTH;
    this.canvas.height = this.dimensions.HEIGHT;
  }

  /**
   * 处理游戏暂停
   */
  onVisibilityChange(e) {
    if (document.hidden || document.webkitHidden || e.type === 'blur' ||
        document.visibilityState !== 'visible') {
      this.stop();
    } else if (!this.crashed) {
      this.play();
    }
  }

  /**
   * 暂停游戏
   */
  stop() {
    this.playing = false;
    this.paused = true;
    cancelAnimationFrame(this.raqId);
    this.time = getTimeStamp();
  }

  /**
   * 继续游戏
   */
  play() {
    if (!this.crashed) {
      this.playing = true;
      this.paused = false;
      this.time = getTimeStamp();
      this.update();
    }
  }

  /**
   * 处理游戏区域大小调整
   */
  onResize() {
    if (IS_MOBILE) {
      this.setArcadeMode();
    } else {
      this.dimensions.WIDTH = Math.min(DEFAULT_WIDTH,
          window.innerWidth - Runner.config.CANVAS_IN_VIEW_OFFSET);
    }
    this.updateDimensions();
  }

  /**
   * 绘制游戏结束画面
   */
  drawGameOverScreen() {
    const textSprite = IS_HIDPI ? 
        Runner.spriteDefinition.HDPI.TEXT_SPRITE : 
        Runner.spriteDefinition.LDPI.TEXT_SPRITE;
    const restartSprite = IS_HIDPI ? 
        Runner.spriteDefinition.HDPI.RESTART : 
        Runner.spriteDefinition.LDPI.RESTART;

    this.canvasCtx.save();
    this.canvasCtx.drawImage(this.images[IS_HIDPI ? 'HDPI' : 'LDPI'],
        textSprite.x, textSprite.y, textSprite.width, textSprite.height,
        this.dimensions.WIDTH / 2 - textSprite.width / 2,
        this.dimensions.HEIGHT / 2 - textSprite.height / 2,
        textSprite.width, textSprite.height);

    this.canvasCtx.drawImage(this.images[IS_HIDPI ? 'HDPI' : 'LDPI'],
        restartSprite.x, restartSprite.y, restartSprite.width, restartSprite.height,
        this.dimensions.WIDTH / 2 - restartSprite.width / 2,
        this.dimensions.HEIGHT / 2 + restartSprite.height,
        restartSprite.width, restartSprite.height);
    this.canvasCtx.restore();
  }

  
}
