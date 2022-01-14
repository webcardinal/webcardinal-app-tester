const { Controller } = WebCardinal.controllers;

const PATH = "./assets/psk-barcode-codes";
const MAX_DURATION_FOR_A_PICTURE = 1500;
const DELAY_BEFORE_NEXT = 200;
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

async function timeout(time) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      clearTimeout(timeout);
    }, time)
  })
}

export default class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log("BarcodeController");

    // psk-barcode-scanner options
    this.useFrames = true;
    this.useVideo = false;
    this.snapVideo = true;

    this.model = {
      fileIndex: 0,
      scannedData: {},
      isAuto: false,
      input: {
        min: '0',
        value: '0',
        max: `${FILES.length - 1}`
      }
    };

    this.setControls();

    this.model.onChange("data", async () => {
      this.saveResult();
      this.shouldGoNext(true);
      this.triggerClassname(true);

      if (this.model.isAuto && this.model.fileIndex < FILES.length) {
        await timeout(DELAY_BEFORE_NEXT);
        this.buttons.scan.click();
      }
    });

    this.model.onChange("results", async () => {
      // console.log(this.model.results);
    });

    this.model.onChange("fileIndex", () => {
      this.model.input.value = `${this.model.fileIndex}`;
    })

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
      // create a new psk-barcode-scanner element
      this.createScanner();
      this.shouldGoNext(false);

      // set current test code as input for psk-barcode-scanner
      await this.setFrame();

      // store current test code
      const fileIndex = this.model.fileIndex;
      const fileName = FILES[fileIndex];
      const shouldStop = fileIndex >= FILES.length - 1;
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
        if (this.model.isAuto && fileIndex < FILES.length) {
          await timeout(DELAY_BEFORE_NEXT);
          this.buttons.scan.click();
        }
      }

      // when looped over all tests in "auto" mode
      if (shouldDownload) {
        this.shouldGoNext(false);

        this.buttons.manual.disabled = false;
        this.buttons.auto.disabled = false;

        const data = this.injectPercentage(this.model.scannedData);
        console.log(data);
        this.downloadJSON(data);
        this.triggerClassname();
      }
    });
  }

  createScanner = () => {
    this.triggerClassname();
    this.removeScanner();

    this.scanner = this.createElement("psk-barcode-scanner");
    this.scanner.setAttribute("data", "@data");
    this.scanner.setAttribute("results", "@results");
    this.scanner.setAttribute("disable-some-slots", "");
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

  shouldGoNext = (goNext) => {
    if (goNext) {
      this.buttons.scan.disabled = false;
      this.input.disabled = false;
      this.model.fileIndex = this.model.fileIndex < FILES.length - 1 ? this.model.fileIndex + 1 : 0;
      return;
    }

    this.buttons.scan.disabled = true;
    this.input.disabled = true;
  }

  setControls = () => {
    this.buttons = {
      auto: this.getElementByTag("auto"),
      manual: this.getElementByTag("manual"),
      scan: this.getElementByTag("scan"),
    };
    this.buttons.manual.disabled = true;

    this.input = this.querySelector('.buttons-container input');
    this.input.addEventListener('input', (e) => {
      this.model.fileIndex = Number.parseInt(e.target.value);
    })
  };

  setFrame = async () => {
    if (!this.scanner) {
      return;
    }

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
    if (!this.scanner) {
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
      percentage: `${positiveLength}/${totalLength} (${
          (positiveLength * 100) / totalLength
      }%)`,
      data: { ...data },
    };
  };

  saveResult = () => {
    const fileName = FILES[this.model.fileIndex];
    if (!this.model.scannedData[fileName]) {
      this.model.scannedData[fileName] = this.model.data;
    }
  }
}

// export default class ScannerController extends Controller {
//   constructor(...props) {
//     super(...props);
//
//     console.log("BarcodeController");
//
//     // psk-barcode-scanner options
//     this.useFrames = true;
//     this.useVideo = false;
//     this.snapVideo = true;
//
//     this.model = {
//       fileIndex: 0,
//       saveScannedData: false,
//       scannedData: {},
//       isAuto: false,
//     };
//
//     this.setButtons();
//
//     this.model.onChange("data", async () => {
//       this.triggerClassname(true);
//
//       if (!this.model.saveScannedData) {
//         return;
//       }
//
//       const fileName = FILES[this.model.fileIndex];
//       if (!this.model.scannedData[fileName]) {
//         this.model.scannedData[fileName] = this.model.data;
//       }
//
//       await timeout(DELAY_BEFORE_NEXT);
//       this.buttons.next.click();
//     });
//
//     this.model.onChange("results", async () => {
//       console.log(this.model.results);
//     });
//
//     this.onTagEvent("manual", "click", () => {
//       this.model.isAuto = false;
//       this.buttons.manual.disabled = true;
//       this.buttons.auto.disabled = false;
//     });
//
//     this.onTagEvent("auto", "click", async () => {
//       this.buttons.manual.disabled = true;
//       this.buttons.auto.disabled = true;
//       this.model.isAuto = true;
//       this.model.fileIndex = -1;
//       this.model.saveScannedData = true;
//       this.buttons.next.click();
//     });
//
//     this.onTagEvent("previous", "click", async () => {
//       this.createScanner();
//
//       this.model.fileIndex = this.model.fileIndex > 0 ? this.model.fileIndex - 1 : 0;
//
//       await this.setFrame();
//     });
//
//     this.onTagEvent("next", "click", async () => {
//       this.createScanner();
//
//       const length = FILES.length - 1;
//       this.model.fileIndex = this.model.fileIndex < length ? this.model.fileIndex + 1 : length;
//
//       await this.setFrame();
//
//       if (this.model.saveScannedData) {
//         const fileIndex = this.model.fileIndex;
//         const fileName = FILES[fileIndex];
//
//         await timeout(MAX_DURATION_FOR_A_PICTURE);
//         if (!this.model.scannedData[fileName]) {
//           this.triggerClassname(false);
//           this.model.scannedData[fileName] = "NO DATA";
//           await timeout(DELAY_BEFORE_NEXT);
//           this.buttons.next.click();
//         }
//
//         // when looped over all tests
//         if (fileIndex >= length) {
//           this.model.saveScannedData = false;
//           this.buttons.manual.disabled = false;
//           this.buttons.auto.disabled = false;
//
//           const data = this.injectPercentage(this.model.scannedData);
//           console.log(data);
//           this.downloadJSON(data);
//         }
//       }
//     });
//
//     setTimeout(this.setFrame, DELAY_BEFORE_NEXT);
//   }
//
//   createScanner = () => {
//     this.triggerClassname();
//     this.removeScanner();
//
//     this.scanner = this.createElement("psk-barcode-scanner");
//     this.scanner.setAttribute("data", "@data");
//     this.scanner.setAttribute("results", "@results");
//     this.scanner.setAttribute("disable-some-slots", "");
//     this.scanner.useFrames = this.useFrames;
//     this.scanner.snapVideo = this.snapVideo;
//     this.element.append(this.scanner);
//   };
//
//   removeScanner = () => {
//     this.scanner = this.querySelector("psk-barcode-scanner");
//     if (this.scanner) {
//       this.scanner.remove();
//     }
//   };
//
//   setButtons = () => {
//     this.buttons = {
//       auto: this.getElementByTag("auto"),
//       manual: this.getElementByTag("manual"),
//       next: this.getElementByTag("next"),
//       previous: this.getElementByTag("previous"),
//     };
//     this.buttons.manual.disabled = true;
//   };
//
//   setFrame = async () => {
//     if (!this.scanner) {
//       return;
//     }
//
//     if (this.useVideo) {
//       const file = await fetch(
//         `./pages/tests/psk-barcode-scanner/frames-deny-b.json`
//       );
//       const frames = await file.json();
//       await this.applyVideo(frames);
//       return;
//     }
//
//     const frame = [PATH, FILES[this.model.fileIndex]].join("/");
//     await this.scanner.setFrame(frame);
//   };
//
//   applyVideo = async (frames) => {
//     if (!this.scanner) {
//       return;
//     }
//
//     let i = 0;
//     let increment = true;
//
//     const interval = setInterval(async () => {
//       if (i === 0) {
//         increment = true;
//       }
//       if (i === frames.length - 1) {
//         increment = false;
//       }
//       await this.scanner.setFrame(frames[i]);
//       increment ? i++ : i--;
//     }, 100);
//
//     const clearFrameInterval = () => {
//       clearInterval(interval);
//       // stencil router does not have a removeListener for history
//     };
//
//     this.model.onChange("data", clearFrameInterval);
//     this.history.listen(clearFrameInterval);
//   };
//
//   downloadJSON = (data) => {
//     const json =
//       "data:text/json;charset=utf-8," +
//       encodeURIComponent(JSON.stringify(data, null, 2));
//     const anchor = document.createElement("a");
//     anchor.setAttribute("href", json);
//     anchor.setAttribute("download", "psk-barcode-scanner.results.json");
//     anchor.click();
//   };
//
//   triggerClassname = (isSuccessful) => {
//     if (isSuccessful === true) {
//       this.element.classList.add("success");
//       this.element.classList.remove("fail");
//       return;
//     }
//
//     if (isSuccessful === false) {
//       this.element.classList.remove("success");
//       this.element.classList.add("fail");
//       return;
//     }
//
//     this.element.classList.remove("success");
//     this.element.classList.remove("fail");
//   };
//
//   injectPercentage = (data) => {
//     let positiveLength = 0;
//     const totalLength = Object.keys(data).length;
//     for (const key of Object.keys(data)) {
//       if (this.model.scannedData[key] !== "NO DATA") {
//         positiveLength++;
//       }
//     }
//
//     return {
//       percentage: `${positiveLength}/${totalLength} (${
//         (positiveLength * 100) / totalLength
//       }%)`,
//       data: { ...data },
//     };
//   };
// }
