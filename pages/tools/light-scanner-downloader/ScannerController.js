import ScanService, { SCANNER_STATUS } from "../../../scripts/services/ScanService.js";
import { parseGS1Code } from '../../../scripts/services/ScanParser.js';
import {
  createCanvasContextFromImageData,
  createScannerModal,
  downloadImage, downloadJSON,
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
    };

    this.refs = {
      retry: this.getElementByTag("retry"),
      download: this.getElementByTag("download"),
      placeholder: this.querySelector("#scanner-placeholder"),
    };

    this.onTagClick("mode", async () => {
      if (this.model.mode === "Options") {
        await this.showOptionsModal();
        return;
      }

      await this.showResultsModal();
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

  showOptionsModal = async () => {
    await createScannerModal({
      header: "Scanner Downloader",
      subheader: "Options",
      contentTagName: "light-scanner-downloader-options",
      parentElement: this.element,
    });
  };

  showResultsModal = async () => {
    this.model.mode = "Results";
    this.refs.retry.hidden = false;
    await createScannerModal({
      header: "Scanner Downloader",
      subheader: "Results",
      contentTagName: "light-scanner-data",
      parentElement: this.element,
    });
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

        console.log("Scan result:", result);

        this.scanService.stop();
        clearInterval(this.scanInterval);

        const scannedData = result.text;
        const parsedData = parseGS1Code(scannedData);

        this.model.scannedData = scannedData;
        this.model.scannedFields = JSON.stringify(parsedData, null, 2);
        await this.showResultsModal();

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
