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
  private status: DinosaurStatus = "RUNNING";
  public dino: AnimatedSprite;
  private jumpVelocity: number = 0;
  private reachedMinHeight: boolean = false;
  private speedDrop: boolean = false;
  public isDucking: boolean = false;
  public isJumping: boolean = false;

  // 地面的位置
  private groundYPos: number;
  // 最小跳跃高度
  private minJumpHeight: number;
  private maxJumpHeight: number;

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
    dino.y = GAME_CONSTANTS.GAME_HEIGHT;
    this.container.addChild(dino);
    this.dino = dino;

    this.bindEvents();
    this.app.ticker.add(this.update, this);

    this.groundYPos = GAME_CONSTANTS.GAME_HEIGHT;
    this.minJumpHeight = this.groundYPos - GAME_CONSTANTS.Trex.MIN_JUMP_HEIGHT;
    this.maxJumpHeight = this.groundYPos - GAME_CONSTANTS.Trex.MAX_JUMP_HEIGHT;
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
          this.jumpVelocity = 1;
        } else {
          this.duck();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowDown") {
        this.speedDrop = false;
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
    const groundY = GAME_CONSTANTS.GAME_HEIGHT;
    const deltaTime = tick.deltaMS;
    const framesElapsed =
      deltaTime / GAME_CONSTANTS.Trex.animFrames[this.status].msPerFrame;
    if (this.isJumping) {
      // console.log(`this.jumpVelocity: ${this.jumpVelocity}`);
      // console.log(`dino.y: ${this.dino.y}`);
      if (this.speedDrop) {
        this.dino.y += Math.round(this.jumpVelocity * framesElapsed * GAME_CONSTANTS.Trex.SPEED_DROP_COEFFICIENT);
      } else {
        // 先向上：加速度 从-10 到 0
        this.dino.y += Math.round(this.jumpVelocity * framesElapsed);
      }
      this.jumpVelocity += GAME_CONSTANTS.Trex.GRAVITY * framesElapsed;
      // 检查是否达到最小跳跃高度 || 速降
      if (this.dino.y < this.minJumpHeight || this.speedDrop) {
        this.reachedMinHeight = true;
      }

      // 不根据速度判断，这样看起来更自然
      if (
        this.dino.y < this.maxJumpHeight ||
        this.speedDrop
      ) {
        this.endJump();
      }

      // 检查是否落地
      if (this.dino.y > groundY) {
        this.dino.y = groundY;
        // 重置状态
        this.jumpVelocity = 0; // 不再降落
        this.isJumping = false;
        this.reachedMinHeight = false;
        if (this.speedDrop) {
          this.speedDrop = false;
          this.duck();
        } else {
          this.status = "RUNNING";
          const runningDinoTexture = this.createDinoTexture();
          this.dino.textures = runningDinoTexture;
          this.dino.play(); // 重新开始动画
        }
      }
    }
  }

  // 开始跳跃
  startJump() {
    this.status = "JUMPING";
    this.isJumping = true;
    this.jumpVelocity = GAME_CONSTANTS.Trex.INITIAL_JUMP_VELOCITY; // 初始跳跃速度
    this.reachedMinHeight = false;
    this.speedDrop = false;
    const duckDinoTexture = this.createDinoTexture();
    this.dino.textures = duckDinoTexture;
    this.dino.play(); // 重新开始动画
  }

  // 开始降落
  endJump() {
    if (
      this.reachedMinHeight &&
      this.jumpVelocity < GAME_CONSTANTS.Trex.DROP_VELOCITY
    ) {
      this.jumpVelocity = GAME_CONSTANTS.Trex.DROP_VELOCITY;
    }
  }
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
