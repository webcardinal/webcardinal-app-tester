import FILES from "../light-scanner/codes/index.js";
import {
  cerateCanvasContextWithImageElement,
  createScannerModal,
  downloadJSON,
  getFileNamePrefix,
  timeout
} from '../light-scanner/utils.js';
import ScanService from "../../../scripts/services/ScanService.js";
import { parseGS1Code } from "../../../scripts/services/ScanParser.js";

const { Controller } = WebCardinal.controllers;

const TAG = '[ScannerController]';
const PATH = "./pages/tools/light-scanner/codes";
const SCAN_FAILED = "SCAN FAILED!";
const SCAN_SUCCEEDED = "SCAN SUCCEEDED!";
const DELAY_AFTER_TEST = 200;

class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log(TAG, "Light Scanner Checker");

    this.files = FILES;
    this.useVideoFrames = false;
    this.delayAfterTest = DELAY_AFTER_TEST;

    this.model = {
      fileIndex: 1,

      scannedData: {},
      scannedHistory: [],

      isAuto: false,

      ignoreFormats: {
        jpg: true,
        png: false,
        gif: false,
      },

      noDelay: true,
      noModal: false,

      input: {
        min: "1",
        value: "1",
        max: `${this.files.length}`,
      },
    };

    this.setControls();
    this.filterCodes();

    this.onTagClick("scan", async () => {
      await this.createScanner();

      let fileIndex = this.model.fileIndex - 1;
      if (fileIndex < 0 || fileIndex >= this.files.length) {
        return;
      }

      const fileName = this.files[this.model.fileIndex - 1];
      let fileSrc = fileName;
      if (!fileSrc.startsWith("http")) {
        fileSrc = [PATH, fileSrc].join("/");
      }

      const result = await this.scanFrame(fileSrc);
      this.triggerClassname(!!result);
      await this.manageResult(fileName, result);

      fileIndex = this.model.fileIndex + 1;
      const shouldStop = fileIndex > this.files.length;

      if (shouldStop) {
        if (this.model.isAuto) {

          const scannedHistory = this.injectPercentage(this.model.scannedHistory)
          downloadJSON(scannedHistory, getFileNamePrefix('checker-results'));
          this.setControls(false);
        }

        this.removeScanner();
        return;
      }

      this.model.fileIndex = fileIndex;

      if (this.model.isAuto) {
        await timeout(this.delayAfterTest);

        this.buttons.scan.click();
        this.triggerClassname();
      }
    });

    this.onTagClick("automatic", async () => {
      if (!this.model.isAuto) {
        this.setControls(true);
      }
    });

    this.onTagClick("options", this.showOptionsModal);

    this.model.onChange("fileIndex", () => {
      this.model.input.value = `${this.model.fileIndex}`;
    });

    this.model.onChange("noDelay", () => {
      this.delayAfterTest = this.model.noDelay ? 0 : DELAY_AFTER_TEST
    })

    this.model.addExpression('automaticStatus', () => {
      return this.model.isAuto ? 'is active' : ''
    }, 'isAuto');

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
        this.scanService.onStatusChanged = (status) => this.onScannerStatusChanged(status);
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

  /**
   * @param {string} [src]
   * @return Promise<Result>
   */
  scanFrame = async (src) => {
    if (!this.scanService) {
      throw Error('Scan service is not correctly set up!');
    }

    console.log(TAG, `Scanning "${src}"...`);

    const context = await cerateCanvasContextWithImageElement(src);
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    return await this.scanService.scan(imageData);
  };

  /**
   * @param {string} fileName
   * @param {Result | undefined} result
   * @return {Promise<void>}
   */
  manageResult = async (fileName, result) => {
    let scannedFields = {};
    let scannedData = undefined;

    if (result && result.text) {
      scannedData = result.text;
      scannedFields = parseGS1Code(result.text)
    }

    // In automatic mode all scanning results are stored in scannedHistory
    if (this.model.isAuto) {
      const history = { fileName }

      if (!scannedData) {
        history.status = SCAN_FAILED;
      } else {
        history.status = SCAN_SUCCEEDED;
        history.scannedData = scannedData;
        history.scannedFields = scannedFields;
      }

      this.model.scannedHistory.push(history);
      return;
    }

    // If manual mode is active
    if (!this.model.noModal && scannedData) {
      this.model.scannedData = scannedData;
      this.model.scannedFields = JSON.stringify(scannedFields, null, 2);
      await this.showResultsModal();
    }
  }

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

    this.model.fileIndex = 1;
    this.model.input.max = `${this.files.length}`;

    console.log(`[ScannerController] now scanning: ${this.files.length} codes`);
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

  setControls = (isAutomatic) => {
    if (isAutomatic === true) {
      this.model.fileIndex = 1;
      this.model.isAuto = true;

      this.input.disabled = true;

      this.buttons.options.hidden = true;
      this.buttons.automatic.disabled = true;
      this.buttons.scan.click();
      return;
    }

    if (isAutomatic === false) {
      this.model.fileIndex = 1;
      this.model.isAuto = false;
      this.model.scannedHistory = [];

      this.input.disabled = false;

      this.buttons.options.hidden = false;
      this.buttons.automatic.disabled = false;
      return;
    }

    this.buttons = {
      scan: this.getElementByTag("scan"),
      options: this.getElementByTag("options"),
      automatic: this.getElementByTag("automatic"),
    };

    this.input = this.querySelector(".buttons-container input");
    this.input.addEventListener("input", (e) => {
      this.model.fileIndex = Number.parseInt(e.target.value);
    });
  };

  showOptionsModal = async () => {
    await createScannerModal({
      header: "Scanner Checker",
      subheader: "Options",
      contentTagName: "light-scanner-checker-options",
      parentElement: this.element
    })
  };

  showResultsModal = async () => {
    await createScannerModal({
      header: "Scanner Auto-Checker",
      subheader: "Results",
      contentTagName: "light-scanner-data",
      parentElement: this.element,
    });
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

  injectPercentage = (tests) => {
    let positiveLength = 0;
    let totalLength = tests.length;

    for (let test of tests) {
      if (test.status === SCAN_SUCCEEDED) {
        positiveLength++;
      }
    }

    return {
      percentage: `${positiveLength}/${totalLength} (${(positiveLength * 100) / totalLength}%)`,
      data: tests,
    };
  };

  // dev-ref:
  // https://github.com/PharmaLedger-IMI/leaflet-ssapp/blob/master/code/scripts/controllers/ScanController.js

  onScannerStatusChanged(status) {
    // ignore default status logging
  }
}

export default ScannerController
