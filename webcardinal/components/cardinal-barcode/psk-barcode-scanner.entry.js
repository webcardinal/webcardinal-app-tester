import { r as registerInstance, h, g as getElement, f as BindModel, T as TableOfContentProperty } from './index-a07c6edd.js';

const audio = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const INTERVAL_ZXING_LOADED = 300;
const INTERVAL_BETWEEN_SCANS = 2000;
const INTERVAL_BETWEEN_INVERTED_SCANS = 50;
const DELAY_AFTER_RESULT = 500;
var STATUS;
(function (STATUS) {
  STATUS["INIT"] = "Initializing component...";
  STATUS["LOAD_CAMERAS"] = "Detecting your cameras...";
  STATUS["IN_PROGRESS"] = "Camera detection in progress...";
  STATUS["DONE"] = "Scan done.";
  STATUS["NO_DETECTION"] = "No camera detected.";
  STATUS["ACCESS_DENIED"] = "Access denied";
  STATUS["CHANGE_CAMERA"] = "Change camera";
})(STATUS || (STATUS = {}));
const style = {
  base: {
    display: 'grid', gridTemplateRows: '1fr',
    width: '100%', height: '100%'
  },
  container: {
    position: 'relative',
    display: 'grid', gridTemplateRows: '1fr',
    overflow: 'hidden',
    minHeight: '350px',
    padding: '0', margin: '0'
  },
  video: {
    height: '100%', width: '100%',
    objectFit: 'cover'
  },
  invertedVideo: {
    height: '100%', width: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: '0'
  },
  input: {
    display: 'none'
  },
  button: {
    position: 'absolute', zIndex: '1',
    padding: '0.3em 0.6em',
    bottom: '1em', left: '50%', transform: 'translateX(-50%)',
    color: '#FFFFFF', background: 'transparent',
    borderRadius: '2px', border: '2px solid rgba(255, 255, 255, 0.75)',
    fontSize: '15px',
    textAlign: 'center',
  }
};
const src = "webcardinal/extended/cardinal-barcode/libs/zxing.js";
const templates = {
  init: createElement('div', { style: style.button, text: 'Booting camera...' }),
  active: createElement('button', { style: style.button, text: 'Change camera' }),
  done: createElement('div', { style: style.button, text: 'Scan complete!' }),
  error: createElement('div', { style: style.button, text: 'No camera device found!' }),
  feedback: createElement('div', { style: style.button, text: 'Checking permissions...' }),
  access_denied: createElement('div', { style: style.button, text: 'Access denied...' })
};
templates.active.setAttribute('change-camera', '');
function createElement(name, props) {
  if (!props) {
    props = {};
  }
  if (!props.style) {
    props.style = {};
  }
  if (!props.text) {
    props.text = '';
  }
  const { style, text } = props;
  delete props.style;
  delete props.text;
  const element = Object.assign(document.createElement(name), props);
  Object.keys(style).forEach(rule => element.style[rule] = style[rule]);
  element.innerHTML = text;
  return element;
}
const PskBarcodeScanner = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.status = STATUS.INIT;
    this.devices = [];
    this.framesElements = {
      canvas: undefined,
      context: undefined,
      stream: undefined
    };
    window.addEventListener('resize', _ => {
      window.requestAnimationFrame(async () => {
        this.cleanupOverlays();
        await this.drawOverlays();
      });
    });
  }
  createCustomizedElement(name) {
    if (this.host.querySelector(`[slot=${name}]`)) {
      return createElement('slot', { name });
    }
    templates[name].part = name;
    return templates[name];
  }
  renderContent() {
    if (!this.noLogs) {
      console.log('Status:', this.status);
    }
    let element;
    switch (this.status) {
      case STATUS.INIT:
        element = this.createCustomizedElement('init');
        break;
      case STATUS.NO_DETECTION:
        element = this.createCustomizedElement('error');
        break;
      case STATUS.DONE:
        element = this.createCustomizedElement('done');
        break;
      case STATUS.LOAD_CAMERAS:
        element = this.createCustomizedElement('feedback');
        break;
      case STATUS.ACCESS_DENIED:
        element = this.createCustomizedElement('access_denied');
        break;
      default:
        element = this.createCustomizedElement('active');
    }
    const t = createElement('div');
    t.append(element);
    return t.innerHTML;
  }
  async drawOverlays() {
    if (!this.host || !this.host.shadowRoot || this.host.querySelector('[slot=active]')) {
      return;
    }
    const { shadowRoot } = this.host;
    const videoElement = shadowRoot.querySelector('#video');
    const scannerContainer = shadowRoot.querySelector('#container');
    const { VideoOverlay } = await import('./index-db222da2.js');
    this.overlay = new VideoOverlay(scannerContainer, videoElement);
    const success = this.overlay.createOverlaysCanvases('lensCanvas', 'overlayCanvas');
    if (success) {
      this.overlay.drawLensCanvas();
    }
  }
  cleanupOverlays() {
    if (this.overlay) {
      this.overlay.removeOverlays();
    }
  }
  getInvertedCanvas() {
    if (!this.host || !this.host.shadowRoot) {
      return;
    }
    const { shadowRoot } = this.host;
    const scannerContainer = shadowRoot.querySelector('#container');
    const { offsetWidth: width, offsetHeight: height } = scannerContainer;
    const invertedCanvasElement = createElement('canvas', {
      id: "invertedCanvas",
      width, height,
      style: { position: 'absolute', width: '100%', top: 0, left: 0 }
    });
    const invertedStream = invertedCanvasElement.captureStream(INTERVAL_BETWEEN_INVERTED_SCANS);
    return [invertedCanvasElement, invertedStream];
  }
  drawInvertedFrame(videoElement, canvasElement) {
    const screen = {
      width: canvasElement.width,
      height: canvasElement.height
    };
    const video = {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight
    };
    const canvasContext = canvasElement.getContext('2d');
    // scale video according to screen dimensions
    {
      let x, y, w, h;
      if (video.height <= video.width) {
        const r = screen.height / video.height;
        w = video.width * r;
        h = screen.height;
        x = (screen.width - w) * 0.5;
        y = 0;
      }
      else {
        const r = screen.width / video.width;
        w = screen.width;
        h = video.height * r;
        x = 0;
        y = (screen.height - h) * 0.5;
      }
      canvasContext.drawImage(videoElement, x, y, w, h);
    }
    // invert colors of the current frame
    const image = canvasContext.getImageData(0, 0, screen.width, screen.height);
    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = image.data[i] ^ 255;
      image.data[i + 1] = image.data[i + 1] ^ 255;
      image.data[i + 2] = image.data[i + 2] ^ 255;
    }
    canvasContext.putImageData(image, 0, 0);
    setTimeout(() => {
      this.drawInvertedFrame(videoElement, canvasElement);
    }, INTERVAL_BETWEEN_INVERTED_SCANS);
  }
  startScanning(deviceId) {
    const videoElement = this.host.shadowRoot.querySelector('#video');
    const invertedVideoElement = this.host.shadowRoot.querySelector('#invertedVideo');
    const constraints = {
      video: {
        facingMode: 'environment'
      }
    };
    if (deviceId && deviceId !== 'no-camera') {
      delete constraints.video.facingMode;
      constraints.video['deviceId'] = {
        exact: deviceId
      };
    }
    if (this.status === STATUS.LOAD_CAMERAS) {
      this.codeReader.playVideoOnLoad(videoElement, async () => {
        this.status = STATUS.IN_PROGRESS;
        this.cleanupOverlays();
        await this.drawOverlays();
        videoElement.removeAttribute('hidden');
      });
    }
    if (this.status === STATUS.CHANGE_CAMERA) {
      this.codeReader.reset();
      this.invertedCodeReader.reset();
    }
    if (this.host.hasAttribute('override-frames')) {
      // @ts-ignore
      this.codeReader.decodeFromStream(videoElement.captureStream(30), videoElement, decodeCallback);
    }
    else {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(() => {
        const decodeCallback = (result, err) => {
          if (result && this.status === STATUS.IN_PROGRESS) {
            if (!this.noLogs) {
              console.log('Scanned data:', result);
            }
            if (this.modelHandler) {
              this.modelHandler.updateModel('data', result.text);
              this.status = STATUS.DONE;
              audio.play();
              if (this.overlay) {
                this.overlay.drawOverlay(result.resultPoints);
              }
              setTimeout(() => {
                if (this.snapVideo) {
                  const video = this.host.shadowRoot.querySelector('video');
                  const h = video.videoHeight;
                  const w = video.videoWidth;
                  const canvas = document.createElement("canvas");
                  canvas.width = w;
                  canvas.height = h;
                  const context = canvas.getContext("2d");
                  canvas.style.width = '100%';
                  canvas.style.height = '100%';
                  canvas.style.objectFit = 'cover';
                  context.drawImage(video, 0, 0, w, h);
                  video.parentElement.insertBefore(canvas, video);
                }
                this.codeReader.reset();
                this.invertedCodeReader.reset();
                if (this.overlay) {
                  this.overlay.removeOverlays();
                }
              }, DELAY_AFTER_RESULT);
            }
          }
          if (err && !(err instanceof this.ZXing.NotFoundException)) {
            console.error(err);
          }
        };
        const [invertedCanvasElement, invertedStream] = this.getInvertedCanvas();
        this.drawInvertedFrame(videoElement, invertedCanvasElement);
        this.codeReader.decodeFromConstraints(constraints, videoElement, decodeCallback);
        this.invertedCodeReader.decodeFromStream(invertedStream, invertedVideoElement, decodeCallback);
      })
        .catch(err => {
        this.status = STATUS.ACCESS_DENIED;
        console.log('getUserMedia', err);
      });
    }
  }
  tryScanning(deviceId) {
    switch (this.status) {
      case STATUS.LOAD_CAMERAS:
      case STATUS.CHANGE_CAMERA: {
        this.startScanning(deviceId);
        break;
      }
    }
  }
  async switchCamera() {
    let devices = [undefined];
    for (const device of this.devices) {
      devices.push(device.deviceId);
    }
    let currentIndex = devices.indexOf(this.activeDeviceId);
    if (currentIndex === devices.length - 1) {
      currentIndex = -1;
    }
    currentIndex++;
    this.activeDeviceId = devices[currentIndex];
    this.status = STATUS.CHANGE_CAMERA;
  }
  async setFrame(src) {
    if (!this.host || !this.host.shadowRoot) {
      return;
    }
    if (!this.framesElements.canvas || !this.framesElements.stream) {
      const { shadowRoot } = this.host;
      const scannerContainer = shadowRoot.querySelector('#container');
      const { offsetWidth: width, offsetHeight: height } = scannerContainer;
      const canvas = createElement('canvas', {
        id: "frameCanvas",
        width, height,
        style: { position: 'absolute', width: '100%', top: 0, left: 0 }
      });
      const stream = canvas.captureStream(30);
      this.framesElements.canvas = canvas;
      this.framesElements.context = canvas.getContext('2d');
      this.framesElements.stream = stream;
      const videoElement = this.host.shadowRoot.querySelector('#video');
      videoElement.srcObject = this.framesElements.stream;
    }
    const image = new Image();
    image.onload = () => {
      const screen = {
        width: this.framesElements.canvas.width,
        height: this.framesElements.canvas.height
      };
      let x, y, w, h;
      if (image.height <= image.width) {
        const r = screen.height / image.height;
        w = image.width * r;
        h = screen.height;
        x = (screen.width - w) * 0.5;
        y = 0;
      }
      else {
        const r = screen.width / image.width;
        w = screen.width;
        h = image.height * r;
        x = 0;
        y = (image.height - h) * 0.5;
      }
      this.framesElements.context.drawImage(image, x, y, w, h);
    };
    image.src = src;
  }
  async componentWillLoad() {
    const tick = () => {
      if (window['ZXing'] && !this.ZXing && !this.codeReader) {
        this.ZXing = window['ZXing'];
        this.codeReader = new this.ZXing.BrowserMultiFormatReader(null, INTERVAL_BETWEEN_SCANS);
        this.invertedCodeReader = new this.ZXing.BrowserMultiFormatReader(null, INTERVAL_BETWEEN_INVERTED_SCANS);
        this.status = STATUS.LOAD_CAMERAS;
        if ((!this.host || !this.host.isConnected) && this.codeReader && this.invertedCodeReader) {
          this.status = STATUS.INIT;
          this.codeReader.reset();
          this.invertedCodeReader.reset();
        }
      }
      else {
        setTimeout(tick, INTERVAL_ZXING_LOADED);
      }
    };
    tick();
  }
  async componentWillRender() {
    // ZXing unloaded
    if (!this.ZXing) {
      return;
    }
    // No devices yet
    if (this.devices.length === 0 || !this.activeDeviceId) {
      try {
        this.devices = await this.codeReader.listVideoInputDevices();
        // this.status = STATUS.IN_PROGRESS;
      }
      catch (error) {
        // console.error(error);
      }
      if (this.devices.length === 0) {
        this.status = STATUS.NO_DETECTION;
      }
    }
  }
  async componentDidRender() {
    if (!this.host.isConnected) {
      return;
    }
    this.tryScanning(this.activeDeviceId);
    const toggle = this.host.shadowRoot.querySelector('[change-camera]');
    if (toggle) {
      toggle.onclick = async () => await this.switchCamera();
    }
  }
  async disconnectedCallback() {
    if (this.codeReader) {
      this.codeReader.reset();
    }
    if (this.invertedCodeReader) {
      this.invertedCodeReader.reset();
    }
  }
  render() {
    return [
      h("script", { async: true, src: src }),
      h("div", { title: this.host.getAttribute('title'), part: "base", style: style.base }, h("div", { id: "container", part: "container", style: style.container }, h("input", { type: "file", accept: "video/*", capture: "environment", style: style.input }), h("video", { id: "video", part: "video", muted: true, autoplay: true, playsinline: true, hidden: true, style: style.video }), h("video", { id: "invertedVideo", muted: true, autoplay: true, playsinline: true, hidden: true, style: style.invertedVideo }), h("div", { id: "content", part: "content", innerHTML: this.renderContent() })))
    ];
  }
  get host() { return getElement(this); }
};
__decorate([
  BindModel()
], PskBarcodeScanner.prototype, "modelHandler", void 0);
__decorate([
  TableOfContentProperty({
    description: `The data-model that will be updated with the retrieved data from the scanner.`,
    isMandatory: true,
    propertyType: `string`
  })
], PskBarcodeScanner.prototype, "data", void 0);
__decorate([
  TableOfContentProperty({
    description: `Decides if a screenshot is made after scanning.`,
    isMandatory: false,
    propertyType: `boolean`
  })
], PskBarcodeScanner.prototype, "snapVideo", void 0);
__decorate([
  TableOfContentProperty({
    description: `Decides if internal status of component is logged.`,
    isMandatory: false,
    propertyType: `boolean`
  })
], PskBarcodeScanner.prototype, "noLogs", void 0);

export { PskBarcodeScanner as psk_barcode_scanner };
