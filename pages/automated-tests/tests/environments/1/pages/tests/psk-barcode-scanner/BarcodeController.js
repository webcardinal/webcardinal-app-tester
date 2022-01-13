const { Controller } = WebCardinal.controllers;

const PATH = "./assets/psk-barcode-codes";
const FILES = [
  "datamatrix/0.jpg",
  "datamatrix/1.jpg",
  "datamatrix/2.jpg",
  "datamatrix/3.jpg",
  "datamatrix/4.png",
  "datamatrix/5.jpg",
  "datamatrix/6.jpg",
  "datamatrix/7.jpg",
  "datamatrix/8.jpg",
  "stress-codes/A.Setup-Label.jpg",
  "stress-codes/A.Setup_Label-blur.jpg",
  "stress-codes/A.Setup_Label-complex.jpg",
  "stress-codes/B.Axial-NU.jpg",
  "stress-codes/B.Contrast.jpg",
  "stress-codes/B.Fixed-PD.jpg",
  "stress-codes/B.Grid-NU.jpg",
  "stress-codes/B.Modulation.jpg",
  "stress-codes/B.Unused-EC.jpg",
  "stress-codes/C.Axial-NU.jpg",
  "stress-codes/C.Contrast.jpg",
  "stress-codes/C.Fixed-PD.jpg",
  "stress-codes/C.Grid-NU.jpg",
  "stress-codes/C.Modulation.jpg",
  "stress-codes/C.Unused-EC.jpg",
  "stress-codes/D.Axial-NU.jpg",
  "stress-codes/D.Fixed-PD.jpg",
  "stress-codes/D.Grid-NU.jpg",
  "stress-codes/D.Modulation.jpg",
  "stress-codes/DUnused-EC.jpg",
  "stress-codes/F.Axial-NU.jpg",
  "stress-codes/F.Fixed-PD.jpeg",
  "stress-codes/F.Modulation.jpg",
  "stress-codes/F.Unused-EC.jpg",
];

export default class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log("BarcodeController");

    // psk-barcode-scanner options
    this.useFrames = true;
    this.useVideo = false;
    this.snapVideo = false;

    this.createScanner();

    this.model = {
      fileIndex: 0,
      saveScannedData: false,
      scannedData: {},
    };

    this.model.onChange("data", async () => {
      if (!this.model.saveScannedData) {
        alert(JSON.stringify(this.model.data, null, 2));
        this.removeScanner();
        return;
      }

      const fileName = FILES[this.model.fileIndex];
      if (!this.model.scannedData[fileName]) {
        this.model.scannedData[fileName] = this.model.data;
      }

      this.getElementByTag("next").click();
    });

    this.model.onChange("results", async () => {
      console.log(this.model.results);
    });

    this.onTagEvent("previous", "click", async () => {
      this.createScanner();

      this.model.fileIndex =
        this.model.fileIndex > 0 ? this.model.fileIndex - 1 : 0;

      await this.setFrame();
    });

    this.onTagEvent("next", "click", async () => {
      this.createScanner();

      const length = FILES.length - 1;
      this.model.fileIndex =
        this.model.fileIndex < length ? this.model.fileIndex + 1 : length;

      await this.setFrame();

      if (this.model.saveScannedData) {
        const fileIndex = this.model.fileIndex;
        const fileName = FILES[fileIndex];

        const timeout = setTimeout(() => {
          if (!this.model.scannedData[fileName]) {
            this.model.scannedData[fileName] = "NO DATA";
            this.getElementByTag("next").click();
          }

          if (fileIndex >= length) {
            this.model.saveScannedData = false;

            let positiveLength = 0;
            const totalLength = Object.keys(this.model.scannedData).length;
            for (const key of Object.keys(this.model.scannedData)) {
              if (this.model.scannedData[key] !== "NO DATA") {
                positiveLength++;
              }
            }

            const data = {
              percentage: `${positiveLength}/${totalLength} (${positiveLength * 100 / totalLength}%)`,
              data: {
                ...this.model.scannedData
              }
            }

            this.downloadJSON(data);
            console.log(data);
          }

          clearTimeout(timeout);
        }, 1500);
      }
    });

    this.onTagEvent("generate", "click", async () => {
      this.model.fileIndex = -1;
      this.model.saveScannedData = true;
      this.getElementByTag("next").click();
    });

    setTimeout(async () => {
      await this.setFrame();
    }, 300);
  }

  createScanner = () => {
    this.removeScanner();

    this.scanner = this.createElement("psk-barcode-scanner");
    this.scanner.setAttribute("data", "@data");
    this.scanner.setAttribute("results", "@results");
    this.scanner.useFrames = this.useFrames;
    this.scanner.snapVideo = this.snapVideo;
    this.element.append(this.scanner);
  };

  removeScanner = () => {
    this.scanner = this.querySelector("psk-barcode-scanner");
    if (this.scanner) {
      this.scanner.remove();
    }
  };

  setFrame = async () => {
    if (this.useVideo) {
      const file = await fetch(
        `./pages/tests/psk-barcode-scanner/frames-deny-b.json`
      );
      const frames = await file.json();
      await this.applyVideo(frames);
      return;
    }

    const frame = [PATH, FILES[this.model.fileIndex]].join("/");
    await this.scanner.setFrame(frame);
  };

  applyVideo = async (frames) => {
    let i = 0;
    let increment = true;

    const interval = setInterval(async () => {
      if (i === 0) {
        increment = true;
      }
      if (i === frames.length - 1) {
        increment = false;
      }
      await this.scanner.setFrame(frames[i]);
      increment ? i++ : i--;
    }, 100);

    const clearFrameInterval = () => {
      clearInterval(interval);
      // stencil router does not have a removeListener for history
    };

    this.model.onChange("data", clearFrameInterval);
    this.history.listen(clearFrameInterval);
  };

  downloadJSON = (data) => {
    const json =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", json);
    anchor.setAttribute("download", "psk-barcode-scanner.results.json");
    anchor.click();
  };
}
