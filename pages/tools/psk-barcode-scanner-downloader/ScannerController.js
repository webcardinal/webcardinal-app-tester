const { Controller } = WebCardinal.controllers;

export default class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log("[ScannerController] Downloader");

    // psk-barcode-scanner options
    this.snapVideo = true;

    this.model = {
      data: {},
      devLogs: {},
      frames: {},
      metadata: "{}",
      mode: "Options",
      downloadOnSuccess: false,
    };

    this.buttons = {
      retry: this.getElementByTag("retry"),
    };

    this.createScanner();

    this.onTagClick("mode", async () => {
      if (this.model.mode === "Options") {
        await this.showOptionsModal();
        return;
      }

      await this.showScannedDataModal();
    });

    this.onTagClick("download", async () => {
      const canvases = this.scanner.shadowRoot.querySelectorAll(
        ":scope > canvas"
      );
      const now = new Date();
      const prefix = now.toISOString()
          .split(".")[0]
          .split('T').join('.')

      if (this.model.frames && this.model.frames.png && this.model.frames.jpg) {
        const name = ["code", prefix, "result"].join(".");
        const { jpg, png } = this.model.frames;
        this.downloadImage(jpg, name, 'jpg');
        this.downloadImage(png, name, 'png');
      } else {
        for (const canvas of canvases) {
          const jpg = canvas.toDataURL("image/jpeg");
          const png = canvas.toDataURL("image/png");
          const name = ["code", prefix, `${canvas.id}`].join(".");
          this.downloadImage(jpg, name, 'jpg');
          this.downloadImage(png, name, 'png');
        }
      }

      const results = JSON.parse(this.model.metadata);
      if (Object.keys(results).length > 0) {
        const name = ["code", prefix, "result"].join(".");
        this.downloadJSON(results, name);
      }
    });

    this.onTagClick("retry", async () => {
      this.createScanner();
    });

    this.model.onChange("data", async () => {
      console.log("[ScannerController] data", this.model.data);

      this.model.mode = "Results";
      this.buttons.retry.hidden = false;

      if (this.model.downloadOnSuccess) {
        this.getElementByTag("download").click();
      }
    });

    this.model.onChange("devLogs", async () => {
      console.log("[ScannerController] logs", this.model.devLogs);

      const metadata = JSON.parse(JSON.stringify(this.model.devLogs));
      delete metadata.frame;
      this.model.frames = metadata.frames;

      delete metadata.frames;

      this.model.metadata = JSON.stringify(metadata, null, 2);

      await this.showScannedDataModal();
    });
  }

  createScanner = () => {
    this.removeScanner();
    this.model.mode = "Options";
    this.model.metadata = "{}";
    this.model.frames = {};
    this.buttons.retry.hidden = true;

    this.scanner = this.createElement("psk-barcode-scanner");
    this.scanner.setAttribute("data", "@data");
    this.scanner.setAttribute("results", "@devLogs");
    this.scanner.setAttribute("dev-disable-some-slots", "");
    this.scanner.setAttribute("dev-activate-internal-canvases", "");
    this.scanner.snapVideo = this.snapVideo;
    this.element.append(this.scanner);
  };

  removeScanner = () => {
    if (this.scanner) {
      this.scanner.remove();
    }
  };

  showOptionsModal = async () => {
    const modalElement = this.createElement("scanner-modal");
    const optionsElement = this.createElement("scanner-downloader-options");

    modalElement.setAttribute("header", "Downloader Options");
    this.element.append(modalElement);

    await modalElement.componentOnReady();

    modalElement.append(optionsElement);
    const closeButton = modalElement.shadowRoot.querySelector("header > button");
    closeButton.onclick = () => modalElement.remove();

    await optionsElement.componentOnReady();

    const cameraButton = optionsElement.querySelector('[data-tag="change-camera"]');
    cameraButton.onclick = async () => await this.scanner.switchCamera()
  };

  showScannedDataModal = async () => {
    const modalElement = this.createElement("scanner-modal");
    modalElement.setAttribute("header", "Results");
    this.element.append(modalElement);
    await modalElement.componentOnReady();
    modalElement.append(this.createElement("scanner-data"));
    const button = modalElement.shadowRoot.querySelector("header > button");
    button.onclick = () => modalElement.remove();
  };

  downloadImage = (data, name, format = 'png') => {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", data);
    anchor.setAttribute("download", `${name}.${format}`);
    anchor.click();
  };

  downloadJSON = (data, name) => {
    const json =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", json);
    anchor.setAttribute("download", `${name}.json`);
    anchor.click();
  };
}
