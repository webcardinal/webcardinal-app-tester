import Scanner, { SCANNER_FORMATS } from "../../libs/zxing-wrapper/scanner.js";

const TAG = "[ScanService]";

const SCANNER_STATUS = {
  INITIALIZING: "Initializing scanner...",
  SETTING: "Pending the access rights for the video cameras + DOM manipulations...",
  ACTIVE: "Video streaming is active, scanning is now available...",
  DONE: "Decoding is done!",
  NO_CAMERAS: "There are no cameras available!",
  PERMISSION_DENIED: "Access to the camera was denied!",
};

function createOverlay(canvasDimensions, scanerArea) {
  const [x, y, w, h] = scanerArea;

  const canvas = document.createElement("canvas");
  canvas.id = "overlay";
  canvas.width = canvasDimensions.width;
  canvas.height = canvasDimensions.height;
  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";

  const context = canvas.getContext("2d");
  context.lineWidth = 6;
  context.strokeStyle = "rgb(255, 255, 255)";
  context.fillStyle = "rgba(0, 0, 0, 0.5)";

  const r = 20;

  const clearBackdrop = (x, y, w, h, r) => {
    context.save();
    context.beginPath();

    context.moveTo(x + r, y);
    context.lineTo(x + w - r, y);
    context.quadraticCurveTo(x + w, y, x + w, y + r);
    context.lineTo(x + w, y + h - r);
    context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    context.lineTo(x + r, y + h);
    context.quadraticCurveTo(x, y + h, x, y + h - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);

    context.clip();
    context.clearRect(x, y, w, h);
    context.restore();
  };

  const drawBackdrop = (x, y, w, h) => {
    context.fillRect(x, y, w, h);
  };

  const drawCorners = (x, y, w, h) => {
    const p = [
      new Path2D("M53 3H19C10.1634 3 3 8.84767 3 16.0612V43"),
      new Path2D("M53 43L53 15.8C53 8.73072 45.6904 3 36.6735 3L3 3"),
      new Path2D("M3 43L37 43C45.8366 43 53 37.1523 53 29.9388L53 3"),
      new Path2D("M3 3L3 30.2C3 37.2693 10.3096 43 19.3265 43L53 43"),
    ];

    // dimensions of Path2D
    const d = {
      l: context.lineWidth,
      w: 50,
      h: 40,
    };

    context.translate(x, y);
    context.stroke(p[0]);

    context.translate(w - d.w - d.l, 0);
    context.stroke(p[1]);

    context.translate(0, h - d.h - d.l);
    context.stroke(p[2]);

    context.translate(d.w + d.l - w, 0);
    context.stroke(p[3]);

    context.resetTransform();
  };

  drawBackdrop(0, 0, canvasDimensions.width, canvasDimensions.height);

  clearBackdrop(x, y, w, h, r);

  drawCorners(x, y, w, h);

  return canvas;
}

function switchFacingMode(facingMode) {
  switch (facingMode) {
    case "environment":
      return "user";
    default:
      return "environment";
  }
}

class ScanService {
  constructor(domElement, options) {
    this._status = SCANNER_STATUS.INITIALIZING;
    this._facingMode = null;

    if (typeof options !== 'object') {
      options = {};
    }

    options = {
      ...options,
      isTestingMode: true
    }

    this.scanner = new Scanner(domElement, options);
    this.scanner.changeWorkerScript("libs/zxing-wrapper/worker/zxing-0.18.6-worker-experimental.js");
    this.scanner.drawOverlay = (canvasDimensions, scanerArea) => createOverlay(canvasDimensions, scanerArea);

    Object.defineProperty(this, "status", {
      get: () => this._status,
      set: (status) => {
        this._status = status;
        this.onStatusChanged(this._status);
      },
    });
  }

  async setup(useBasicSetup) {
    this.status = SCANNER_STATUS.SETTING;
    this._facingMode = switchFacingMode(this._facingMode);

    try {
      await this.scanner.setup({
        facingMode: this._facingMode,
        useBasicSetup: !!useBasicSetup,
      });
    } catch (error) {
      if (error.name === "NotAllowedError") {
        this.status = SCANNER_STATUS.PERMISSION_DENIED;
        return;
      }
      throw error;
    }

    this.status = SCANNER_STATUS.ACTIVE;
  }

  async scan(imageData) {
    this.scanner.scanCounter = 1;
    return await this.scanner.scan(imageData);
  }

  stop() {
    this.scanner.shutDown();
  }

  download() {
    const { lastFrame, lastScanInput } = this.scanner;
    return { lastFrame, lastScanInput }
  }

  onStatusChanged(status) {
    console.log(TAG, `Status has changed to "${status}"`);
  }
}

export default ScanService;
export { SCANNER_STATUS, SCANNER_FORMATS };
