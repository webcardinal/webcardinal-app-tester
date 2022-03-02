import FILES from "../light-scanner/codes/index.js";
import {
  cerateCanvasContextWithImageElement,
  createScannerModal,
  downloadJSON,
  timeout
} from '../light-scanner/utils.js';
import ScanService from '../../../scripts/services/ScanService.js';

const { Controller } = WebCardinal.controllers;

const PATH = "./pages/tools/light-scanner/codes";
const MAX_DURATION_FOR_A_PICTURE = 1500;
const DELAY_BEFORE_NEXT = 200;

class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log("[ScannerController] Light Scanner Checker");

    this.files = FILES;
    this.useVideoFrames = false;

    this.model = {
      fileIndex: 0,
      scannedData: {},
      isAuto: false,

      ignoreFormats: {
        jpg: true,
        png: false,
        gif: false,
      },
      input: {
        min: "0",
        value: "0",
        max: `${this.files.length - 1}`,
      },
    };

    this.setControls();
    this.filterCodes();

    this.model.onChange("data", async () => {
      this.saveResult();
      this.shouldGoNext(true);
      this.triggerClassname(true);

      if (this.model.isAuto && this.model.fileIndex < this.files.length) {
        await timeout(DELAY_BEFORE_NEXT);
        this.buttons.scan.click();
      }
    });

    this.model.onChange("fileIndex", () => {
      this.model.input.value = `${this.model.fileIndex}`;
    });

    this.onTagEvent("manual", "click", () => {
      this.model.isAuto = false;
      this.input.disabled = false;
      this.buttons.scan.disabled = false;
      this.buttons.auto.disabled = false;
      this.buttons.manual.disabled = true;
    });

    this.onTagEvent("auto", "click", async () => {
      this.buttons.manual.disabled = true;
      this.buttons.auto.disabled = true;

      this.model.isAuto = true;
      this.model.fileIndex = 0;

      this.model.scannedData = {};

      this.buttons.scan.click();
    });

    this.onTagEvent("scan", "click", async () => {
      await this.createScanner();
      this.shouldGoNext(false);

      // set current test code as input for psk-barcode-scanner
      await this.scanFrame();

      // store current test code
      const fileIndex = this.model.fileIndex;
      const fileName = this.files[fileIndex];
      const shouldStop = fileIndex >= this.files.length - 1;
      let shouldDownload = false;

      if (shouldStop) {
        this.model.isAuto = false;
        shouldDownload = true;
      }

      await timeout(MAX_DURATION_FOR_A_PICTURE);

      // if there is no code saved, scanning produced has already failed
      if (!this.model.scannedData[fileName] || this.model.scannedData[fileName] === "NO DATA") {
        this.shouldGoNext(true);
        this.triggerClassname(false);
        this.model.scannedData[fileName] = "NO DATA";

        // if failed, go to the following test
        // otherwise see the code from on "data"
        if (this.model.isAuto && fileIndex < this.files.length) {
          await timeout(DELAY_BEFORE_NEXT);
          this.buttons.scan.click();
        }
      }

      // when looped over all tests in "auto" mode
      if (shouldDownload) {
        this.shouldGoNext(false);
        this.triggerClassname();

        const data = this.injectPercentage(this.model.scannedData);
        console.log(data);
        downloadJSON(data, 'results');

        this.buttons.manual.disabled = false;
        this.buttons.auto.disabled = true;
      }
    });

    this.onTagEvent("mode", "click", async () => {
      await this.showOptionsModal();
    });

    for (const format of Object.keys(this.model.ignoreFormats)) {
      this.model.onChange(`ignoreFormats.${format}`, this.filterCodes);
    }
  }

  onDisconnectedCallback() {
    this.removeScanner();
  }

  createScanner = async () => {
    this.triggerClassname();
    this.removeScanner();

    if (!this.scanService) {
      try {
        this.scanService = new ScanService(this.querySelector("#scanner-placeholder"));
        await this.scanService.setup(true);
      } catch (error) {
        throw error;
      }
    }
  };

  removeScanner = () => {
    if (this.scanService) {
      this.scanService.stop();
      delete this.scanService;
    }
  };

  shouldGoNext = (goNext) => {
    if (goNext) {
      this.buttons.scan.disabled = false;
      this.input.disabled = false;
      this.model.fileIndex = this.model.fileIndex < this.files.length - 1 ? this.model.fileIndex + 1 : 0;
      return;
    }

    this.buttons.scan.disabled = true;
    this.input.disabled = true;
  };

  setControls = () => {
    this.buttons = {
      auto: this.getElementByTag("auto"),
      manual: this.getElementByTag("manual"),
      scan: this.getElementByTag("scan"),
    };
    this.buttons.manual.disabled = true;

    this.input = this.querySelector(".buttons-container input");
    this.input.addEventListener("input", (e) => {
      this.model.fileIndex = Number.parseInt(e.target.value);
    });
  };

  scanFrame = async () => {
    if (!this.scanService) {
      return;
    }

    if (this.useVideoFrames) {
      const file = await fetch(`./pages/manual-tests/psk-barcode-scanner/test-1/frames-deny-b.json`);
      const frames = await file.json();
      await this.applyVideo(frames);
      return;
    }

    let fileSrc = this.files[this.model.fileIndex];
    if (!fileSrc.startsWith("http")) {
      fileSrc = [PATH, fileSrc].join("/");
    }

    const context = await cerateCanvasContextWithImageElement(fileSrc);
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)

    const result = await this.scanService.scan(imageData);
    console.log(result);
  };

  applyVideo = async (frames) => {
    if (!this.scanService) {
      return;
    }

    let i = 0;
    let increment = true;

    const interval = setInterval(async () => {
      if (i === 0) {
        increment = true;
      }
      if (i === frames.length - 1) {
        increment = false;
      }

      const context = await cerateCanvasContextWithImageElement(frames[i]);
      const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)

      const result = await this.scanService.scan(imageData);
      console.log(result);

      increment ? i++ : i--;
    }, 100);

    const clearFrameInterval = () => {
      clearInterval(interval);
      // stencil router does not have a removeListener for history
    };

    this.model.onChange("data", clearFrameInterval);
    this.history.listen(clearFrameInterval);
  };

  triggerClassname = (isSuccessful) => {
    if (isSuccessful === true) {
      this.element.classList.add("success");
      this.element.classList.remove("fail");
      return;
    }

    if (isSuccessful === false) {
      this.element.classList.remove("success");
      this.element.classList.add("fail");
      return;
    }

    this.element.classList.remove("success");
    this.element.classList.remove("fail");
  };

  injectPercentage = (data) => {
    let positiveLength = 0;
    const totalLength = Object.keys(data).length;
    for (const key of Object.keys(data)) {
      if (this.model.scannedData[key] !== "NO DATA") {
        positiveLength++;
      }
    }

    return {
      percentage: `${positiveLength}/${totalLength} (${(positiveLength * 100) / totalLength}%)`,
      data: { ...data },
    };
  };

  saveResult = () => {
    const fileName = this.files[this.model.fileIndex];
    const { data } = this.model;

    if (this.element.hasAttribute("is-automatic-processing")) {
      const output = this.getElementByTag("automatic-output");
      output.innerHTML = "";
      output.append(JSON.stringify({ fileName, data }, null, 2));

      this.element.setAttribute("is-automatic-processing", "true");
    }

    if (!this.model.scannedData[fileName]) {
      this.model.scannedData[fileName] = data;
    }
  };

  showOptionsModal = async () => {
    await createScannerModal({
      header: "Scanner Checker",
      subheader: "Options",
      contentTagName: "light-scanner-checker-options",
      parentElement: this.element
    })
  };

  filterCodes = () => {
    this.files = FILES;

    if (this.model.ignoreFormats.jpg) {
      this.files = this.files.filter((file) => {
        file = file.toLowerCase();
        return !file.endsWith("jpg") && !file.endsWith("jpeg");
      });
    }

    if (this.model.ignoreFormats.png) {
      this.files = this.files.filter(
        (file) => !file.toLowerCase().endsWith("png")
      );
    }

    if (this.model.ignoreFormats.gif) {
      this.files = this.files.filter(
        (file) => !file.toLowerCase().endsWith("gif")
      );
    }

    this.model.fileIndex = 0;
    this.model.input.max = `${this.files.length - 1}`;
    
    console.log(`[ScannerController] now scanning: ${this.files.length} codes`);
  };

  // dev-ref:
  // https://github.com/PharmaLedger-IMI/leaflet-ssapp/blob/master/code/scripts/controllers/ScanController.js
}

export default ScannerController
