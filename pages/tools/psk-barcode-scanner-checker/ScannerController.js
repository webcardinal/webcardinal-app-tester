import FILES from './codes/index.js';
import { timeout } from './utils.js'

const { Controller } = WebCardinal.controllers;

const PATH = './pages/tools/psk-barcode-scanner-checker/codes';
const MAX_DURATION_FOR_A_PICTURE = 1500;
const DELAY_BEFORE_NEXT = 200;

export default class ScannerController extends Controller {
  constructor(...props) {
    super(...props);

    console.log('ScannerController');

    // psk-barcode-scanner options
    this.useFrames = true;
    this.useVideoFrames = false;
    this.saveFrame = false;
    this.snapVideo = true;
    this.logs = true;

    this.model = {
      fileIndex: 0,
      scannedData: {},
      isAuto: false,
      stopInternalCropping: true,
      input: {
        min: '0',
        value: '0',
        max: `${FILES.length - 1}`
      }
    };

    this.setControls();

    this.model.onChange('data', async () => {
      this.saveResult();
      this.shouldGoNext(true);
      this.triggerClassname(true);

      if (this.model.isAuto && this.model.fileIndex < FILES.length) {
        await timeout(DELAY_BEFORE_NEXT);
        this.buttons.scan.click();
      }
    });

    this.model.onChange('results', async () => {
      if (this.saveFrame) {
        this.screenshot.hidden = false;
        this.screenshot.src = this.model.results.frame;
      }
    });

    this.model.onChange('fileIndex', () => {
      this.model.input.value = `${this.model.fileIndex}`;
    });

    this.onTagEvent('manual', 'click', () => {
      this.model.isAuto = false;
      this.input.disabled = false;
      this.buttons.scan.disabled = false;
      this.buttons.auto.disabled = false;
      this.buttons.manual.disabled = true;
    });

    this.onTagEvent('auto', 'click', async () => {
      this.buttons.manual.disabled = true;
      this.buttons.auto.disabled = true;

      this.model.isAuto = true;
      this.model.fileIndex = 0;

      this.model.scannedData = {};

      this.buttons.scan.click();
    });

    this.onTagEvent('scan', 'click', async () => {
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
      if (!this.model.scannedData[fileName] || this.model.scannedData[fileName] === 'NO DATA') {
        this.shouldGoNext(true);
        this.triggerClassname(false);
        this.model.scannedData[fileName] = 'NO DATA';

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

        const data = this.injectPercentage(this.model.scannedData);
        console.log(data);
        this.downloadJSON(data);
        this.triggerClassname();

        this.buttons.manual.disabled = false;
        this.buttons.auto.disabled = true;
      }
    });

    this.onTagEvent('mode', 'click', async () => {
      await this.showOptionsModal();
    })
  }

  createScanner = () => {
    this.triggerClassname();
    this.removeScanner();

    this.scanner = this.createElement('psk-barcode-scanner');
    this.scanner.setAttribute('data', '@data');
    this.scanner.setAttribute('results', '@results');
    this.scanner.setAttribute('dev-disable-some-slots', '');
    this.scanner.setAttribute('dev-activate-internal-canvases', '');
    this.scanner.noLogs = !this.logs;
    this.scanner.useFrames = this.useFrames;
    this.scanner.snapVideo = this.snapVideo;
    this.scanner.stopInternalCropping = this.model.stopInternalCropping;

    if (this.saveFrame) {
      const active = this.createElement('div', { slot: 'active' });
      const done = this.createElement('div', { slot: 'done' });
      this.scanner.append(active, done);
      this.screenshot = this.createElement('img', { alt: 'saved-frame', hidden: true });
    }

    this.element.append(this.scanner);

    if (this.saveFrame) {
      this.element.append(this.screenshot);
    }
  };

  removeScanner = () => {
    if (this.scanner) {
      this.scanner.remove();
    }

    if (this.screenshot) {
      this.screenshot.remove();
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
  };

  setControls = () => {
    this.element.value = FILES;

    this.buttons = {
      auto: this.getElementByTag('auto'),
      manual: this.getElementByTag('manual'),
      scan: this.getElementByTag('scan')
    };
    this.buttons.manual.disabled = true;

    this.input = this.querySelector('.buttons-container input');
    this.input.addEventListener('input', (e) => {
      this.model.fileIndex = Number.parseInt(e.target.value);
    });
  };

  setFrame = async () => {
    if (!this.scanner) {
      return;
    }

    if (this.useVideoFrames) {
      const file = await fetch(
        `./pages/tests/psk-barcode-scanner/frames-deny-b.json`
      );
      const frames = await file.json();
      await this.applyVideo(frames);
      return;
    }

    let frame = FILES[this.model.fileIndex];
    if (frame.startsWith('http')) {
      console.log(frame);
      await this.scanner.setFrame(frame);
      return;
    }

    frame = [PATH, frame].join('/');
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

    this.model.onChange('data', clearFrameInterval);
    this.history.listen(clearFrameInterval);
  };

  downloadJSON = (data) => {
    const json =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', json);
    anchor.setAttribute('download', 'psk-barcode-scanner.results.json');
    anchor.click();
  };

  triggerClassname = (isSuccessful) => {
    if (isSuccessful === true) {
      this.element.classList.add('success');
      this.element.classList.remove('fail');
      return;
    }

    if (isSuccessful === false) {
      this.element.classList.remove('success');
      this.element.classList.add('fail');
      return;
    }

    this.element.classList.remove('success');
    this.element.classList.remove('fail');
  };

  injectPercentage = (data) => {
    let positiveLength = 0;
    const totalLength = Object.keys(data).length;
    for (const key of Object.keys(data)) {
      if (this.model.scannedData[key] !== 'NO DATA') {
        positiveLength++;
      }
    }

    return {
      percentage: `${positiveLength}/${totalLength} (${
        (positiveLength * 100) / totalLength
      }%)`,
      data: { ...data }
    };
  };

  saveResult = () => {
    const fileName = FILES[this.model.fileIndex];
    const { data } = this.model;

    if (this.element.hasAttribute('is-automatic-processing')) {
      const output = this.getElementByTag('automatic-output');
      output.innerHTML = '';
      output.append(JSON.stringify({ fileName, data }, null, 2));

      this.element.setAttribute('is-automatic-processing', 'true');
    }

    if (!this.model.scannedData[fileName]) {
      this.model.scannedData[fileName] = data;
    }
  };

  showOptionsModal = async () => {
    const modalElement = this.createElement("scanner-modal");
    const optionsElement = this.createElement("scanner-checker-options");

    modalElement.setAttribute("header", "Checker Options");
    this.element.append(modalElement);

    await modalElement.componentOnReady();

    modalElement.append(optionsElement);
    const closeButton = modalElement.shadowRoot.querySelector("header > button");
    closeButton.onclick = () => modalElement.remove();

    await optionsElement.componentOnReady();
  };
}
