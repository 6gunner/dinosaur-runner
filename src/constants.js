// Game constants
export const FPS = 60;
export const IS_HIDPI = window.devicePixelRatio > 1;
export const IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.platform);
export const IS_MOBILE = /Android/.test(window.navigator.userAgent) || IS_IOS;
export const IS_TOUCH_ENABLED = "ontouchstart" in window;
export const DEFAULT_WIDTH = 600;

// Get random number between range
export function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get current timestamp
export function getTimeStamp() {
  return IS_IOS ? new Date().getTime() : performance.now();
}

// Vibrate on mobile devices
export function vibrate(duration) {
  if (IS_MOBILE && window.navigator.vibrate) {
    window.navigator.vibrate(duration);
  }
}

// Create canvas element
export function createCanvas(container, width, height, opt_classname) {
  const canvas = document.createElement("canvas");
  canvas.className = opt_classname || "";
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);
  return canvas;
}

// Decode base64 audio
export function decodeBase64ToArrayBuffer(base64String) {
  const len = (base64String.length / 4) * 3;
  const str = atob(base64String);
  const arrayBuffer = new ArrayBuffer(len);
  const bytes = new Uint8Array(arrayBuffer);

  for (var i = 0; i < len; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes.buffer;
}
