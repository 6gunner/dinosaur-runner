import { GAME_CONSTANTS } from "@src/constants";
import { SPRITE_DEFINITIONS_1X as SPRITE_DEFINITIONS } from "@src/constants/sprites1x";
import {
  Application,
  Texture,
  Rectangle,
  AnimatedSprite,
  Container,
  Sprite,
  Ticker,
  TextureSource,
} from "pixi.js";

type DinosaurStatus = "IDLE" | "RUNNING" | "DUCKING" | "CRASHED" | "JUMPING";
// 恐龙控制器
export class DinosaurController {
  private app: Application;
  private container: Container;
  private spriteSheet: TextureSource;
  private status: DinosaurStatus = "IDLE";
  private dino: AnimatedSprite;
  private jumpVelocity: number = 0;
  private reachedMinHeight: boolean = false;
  private speedDrop: boolean = false;
  private isDucking: boolean = false;
  private isJumping: boolean = false;
  private normalHeight: number;

  constructor(app: Application, spriteSheet: TextureSource) {
    this.app = app;
    this.spriteSheet = spriteSheet;
    this.container = new Container();
    this.app.stage.addChild(this.container);
    const dinoTexture = this.createDinoTexture();
    const dino = new AnimatedSprite(dinoTexture);
    dino.animationSpeed = 0.1; // 添加动画速度
    dino.play(); // 直接在这里调用一次
    dino.anchor.set(0.5, 1);
    dino.x = GAME_CONSTANTS.DINO_START_X;
    dino.y = GAME_CONSTANTS.GAME_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
    this.container.addChild(dino);
    this.dino = dino;
    this.normalHeight = this.dino.height;

    this.bindEvents();
    this.app.ticker.add(this.update, this);
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        if (this.status !== "JUMPING") {
          this.startJump();
        }
      } else if (e.code === "ArrowDown") {
        if (this.status == "JUMPING") {
          // 速降
          this.speedDrop = true;
        }
        this.duck();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowDown") {
        this.unduck();
      }
    });
  }

  createDinoTexture() {
    switch (this.status) {
      case "IDLE":
      case "JUMPING":
        // 恐龙
        const idleDinoTexture = new Texture({
          source: this.spriteSheet,
          frame: new Rectangle(
            SPRITE_DEFINITIONS.DINO.IDLE.x,
            SPRITE_DEFINITIONS.DINO.IDLE.y,
            SPRITE_DEFINITIONS.DINO.IDLE.width,
            SPRITE_DEFINITIONS.DINO.IDLE.height
          ),
        });
        return [idleDinoTexture];

      case "RUNNING":
        const runningDinoTextures = SPRITE_DEFINITIONS.DINO.RUN.map(
          (item) =>
            new Texture({
              source: this.spriteSheet,
              frame: new Rectangle(item.x, item.y, item.width, item.height),
            })
        );
        return runningDinoTextures;

      case "DUCKING":
        // 恐龙下蹲
        const duckDinoTextures = SPRITE_DEFINITIONS.DINO.DUCK.map(
          (item) =>
            new Texture({
              source: this.spriteSheet,
              frame: new Rectangle(item.x, item.y, item.width, item.height),
            })
        );
        return duckDinoTextures;
      case "CRASHED":
        // 恐龙died
        const diedDinoTexture = new Texture({
          source: this.spriteSheet,
          frame: new Rectangle(
            SPRITE_DEFINITIONS.DINO.CRASH.x,
            SPRITE_DEFINITIONS.DINO.CRASH.y,
            SPRITE_DEFINITIONS.DINO.CRASH.width,
            SPRITE_DEFINITIONS.DINO.CRASH.height
          ),
        });
        return [diedDinoTexture];
    }
  }

  update(tick: Ticker) {
    const groundY = GAME_CONSTANTS.GROUND_HEIGHT - GAME_CONSTANTS.GROUND_MARGIN;
    if (this.isJumping) {
      // 先向上：加速度 从-10 到 0
      this.dino.y += this.jumpVelocity;
      this.jumpVelocity +=
        GAME_CONSTANTS.Trex.GRAVITY *
        GAME_CONSTANTS.Trex.SPEED_DROP_COEFFICIENT;

      // 检查是否达到最小跳跃高度 || 速降
      if (this.dino.y < GAME_CONSTANTS.Trex.MIN_JUMP_HEIGHT || this.speedDrop) {
        this.reachedMinHeight = true;
      }

      // 加速度大于0，代表开始降落了
      if (this.jumpVelocity > 0) {
        this.endJump();
        this.jumpVelocity +=
          GAME_CONSTANTS.Trex.GRAVITY *
          GAME_CONSTANTS.Trex.SPEED_DROP_COEFFICIENT;
      }

      // 检查是否落地
      if (this.dino.y > groundY) {
        this.dino.y = groundY;
        // 重置状态
        this.jumpVelocity = 0; // 不再降落
        this.isJumping = false;
        this.reachedMinHeight = false;
        this.speedDrop = false;
      }
    }
  }

  // 跳跃
  startJump() {
    this.status = "JUMPING";
    this.isJumping = true;
    this.jumpVelocity = GAME_CONSTANTS.Trex.INITIAL_JUMP_VELOCITY; // 初始跳跃速度
    this.reachedMinHeight = false;
    this.speedDrop = false;
  }

  endJump() {}
  // 下蹲
  duck() {
    if (!this.isDucking) {
      this.isDucking = true;
      this.status = "DUCKING";
      const duckDinoTexture = this.createDinoTexture();
      this.dino.textures = duckDinoTexture;
      this.dino.play(); // 重新开始动画
    }
  }

  unduck() {
    if (this.isDucking) {
      this.isDucking = false;
      this.status = "RUNNING";
      const duckDinoTexture = this.createDinoTexture();
      this.dino.textures = duckDinoTexture;
      this.dino.play(); // 重新开始动画
    }
  }
}
