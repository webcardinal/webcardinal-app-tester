import ScanService, { SCANNER_STATUS } from "../../../scripts/services/ScanService.js";
import { parseGS1Code } from '../../../scripts/services/ScanParser.js';
import {
  beep,
  createCanvasContextFromImageData,
  createScannerModal,
  createScannerTooltip,
  downloadImage,
  getFileNamePrefix
} from '../light-scanner/utils.js';

const TAG = '[ScannerController]'
const { Controller } = WebCardinal.controllers;

class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log(TAG, "Light Scanner Downloader");

    this.model = {
      scannerStatus: null,
      mode: "Options",
      scannedData: "",
      scannedFields: "{}",
      downloadOnSuccess: false,
      showResultOnModal: false
    };

    this.refs = {
      retry: this.getElementByTag("retry"),
      download: this.getElementByTag("download"),
      placeholder: this.querySelector("#scanner-placeholder"),
    };

    this.onTagClick("mode", async () => {
      if (this.model.mode === "Options") {
        await this.showOptions();
        return;
      }

      await this.showResults();
    });

    this.onTagClick("retry", this.createScanner);

    this.onTagClick("download", async () => {
      const { lastFrame, lastScanInput } = this.scanService.download();

      const fullCanvas = createCanvasContextFromImageData(lastFrame).canvas;
      const centralCanvas = createCanvasContextFromImageData(lastScanInput).canvas;

      const prefix = getFileNamePrefix("code");
      downloadImage(centralCanvas.toDataURL("image/png"), prefix + '.full', "png");
      downloadImage(fullCanvas.toDataURL("image/png"), prefix, "png");
    });

    setTimeout(this.createScanner);
  }

  onDisconnectedCallback() {
    this.removeScanner();
  }

  createScanner = async () => {
    this.removeScanner();

    this.model.mode = "Options";
    this.model.metadata = "{}";
    this.model.frames = {};

    this.refs.retry.hidden = true;

    if (!this.scanService) {
      try {
        this.scanService = new ScanService(this.refs.placeholder);
        this.scanService.onStatusChanged = (status) => this.onScannerStatusChanged(status);
        await this.scanService.setup();
        await this.startScanning();
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

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      delete this.scanInterval;
    }
  };

  showOptions = async () => {
    await createScannerModal({
      header: "Scanner Downloader",
      subheader: "Options",
      contentTagName: "light-scanner-downloader-options",
      parentElement: this.element,
    });
  };

  showResults = async () => {
    if (this.model.showResultOnModal) {
      this.model.mode = "Results";
      this.refs.retry.hidden = false;
      await createScannerModal({
        header: "Scanner Downloader",
        subheader: "Results",
        contentTagName: "light-scanner-data",
        parentElement: this.element,
      });
      return;
    }

    const showTooltip = async (badge, data) => {
      const t = await createScannerTooltip({
        badge, data,
        parentElement: this.refs.tooltips.placeholder
      });
      t.triggerAccentShadow();
      return t;
    }

    const data = this.model.scannedFields;

    if (typeof this.refs.tooltips !== 'object') {
      this.refs.tooltips = {};
    }

    if (!this.refs.tooltips.placeholder) {
      this.refs.tooltips.placeholder = this.getElementByTag('scanner-tooltip-placeholder')
    }

    if (this.refs.tooltips.last && !this.refs.tooltips.last.isConnected) {
      this.refs.tooltips.last = undefined;
    }

    if (!this.refs.tooltips.last) {
      this.refs.tooltips.last = await showTooltip(1, data);
      return;
    }

    if (this.refs.tooltips.last.data === data) {
      this.refs.tooltips.last = await showTooltip(this.refs.tooltips.last.badge + 1, data);
      return;
    }

    const tooltip = await showTooltip(1, data)
    this.refs.tooltips.last.remove();
    this.refs.tooltips.last = tooltip;
  };

  // dev-ref:
  // https://github.com/PharmaLedger-IMI/leaflet-ssapp/blob/master/code/scripts/controllers/ScanController.js

  onScannerStatusChanged(status) {
    switch (status) {
      case SCANNER_STATUS.ACTIVE:
        this.model.scannerStatus = "active";
        return;
      case SCANNER_STATUS.SETTING:
        this.model.scannerStatus = "feedback";
        return;
      case SCANNER_STATUS.NO_CAMERAS:
        this.model.scannerStatus = "no-cameras";
        return;
      case SCANNER_STATUS.PERMISSION_DENIED:
        this.model.scannerStatus = "permission-denied";
        return;
      case SCANNER_STATUS.DONE:
        this.model.scannerStatus = "done";
        return;
      default:
        this.model.scannerStatus = undefined;
    }
  }

  async startScanning() {
    if (this.scanInterval) {
      return;
    }

    this.scanInterval = setInterval(async () => {
      try {
        const result = await this.scanService.scan();
        if (!result) {
          return;
        }

        this.onScannerStatusChanged(SCANNER_STATUS.DONE);

        beep({
          frequency: 850,
          type: 'triangle',
          volume: 0.15,
          duration: 30
        });

        console.log("Scan result:", result);

        const scannedData = result.text;
        const parsedData = parseGS1Code(scannedData);

        if (this.model.showResultOnModal) {
          this.scanService.stop();
          clearInterval(this.scanInterval);
        }

        this.model.scannedData = scannedData;
        this.model.scannedFields = JSON.stringify(parsedData, null, 2);

        await this.showResults();

        if (this.model.downloadOnSuccess) {
          this.refs.download.click();
        }
      } catch (error) {
        console.log(TAG, "Error while scanning", error);
      }
    }, 100);
  }
}

export default ScannerController;
