import ScanService, { SCANNER_STATUS } from "../../../scripts/services/ScanService.js";
import interpretScan from "./interpret.js";
import { createCanvasContextFromImageData, createScannerModal, downloadImage } from '../light-scanner/utils.js';

const { Controller } = WebCardinal.controllers;

class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log("[ScannerController] Light Scanner Downloader");

    this.model = {
      scannerStatus: null,
      mode: "Options",
      scannedData: "",
      scannedFields: "{}",

      // data: {},
      // devLogs: {},
      // frames: {},
      // metadata: "{}",
      // useWebWorker: true,
      // gs1FieldsJSON: "",
      // downloadOnSuccess: false,
      // zoomLevel: 1,
    };

    this.refs = {
      retry: this.getElementByTag("retry"),
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

      const prefix = [
        "code",
        new Date()
          .toISOString()
          .split(".")[0]
          .replace("T", ".")
          .split(":")
          .join("-"),
      ].join(".");

      downloadImage(centralCanvas.toDataURL("image/png"), [prefix, "full"].join("."), "png");
      downloadImage(fullCanvas.toDataURL("image/png"), prefix, "png");

      // const results = JSON.parse(this.model.metadata);
      // if (Object.keys(results).length > 0) {
      //   const name = ["code", prefix, "result"].join(".");
      //   this.downloadJSON(results, name);
      // }
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

  parseGS1Code(scannedBarcode) {
    let gs1FormatFields;

    try {
      gs1FormatFields = interpretScan(scannedBarcode);
    } catch (e) {
      this.parseGS1Fields(e.dlOrderedAIlist);
      return;
    }

    return this.parseGS1Fields(gs1FormatFields.ol);
  }

  parseGS1Fields(orderedList) {
    const gs1Fields = {};
    const fieldsConfig = {
      GTIN: "gtin",
      "BATCH/LOT": "batchNumber",
      SERIAL: "serialNumber",
      "USE BY OR EXPIRY": "expiry",
    };

    orderedList.map((el) => {
      let fieldName = fieldsConfig[el.label];
      gs1Fields[fieldName] = el.value;
    });

    return gs1Fields;
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
        const parsedData = this.parseGS1Code(scannedData);

        this.model.scannedData = scannedData;
        this.model.scannedFields = JSON.stringify(parsedData, null, 2);
        await this.showResultsModal();
      } catch (error) {
        console.log("[ScannerController] Error while scanning", error);
      }
    }, 100);
  }
}

export default ScannerController;
