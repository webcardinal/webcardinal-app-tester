const { Controller } = WebCardinal.controllers;

const PATH = './assets/codes';
const FILES = [
  '0.png',
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  'E2_ELMS_2D_1.jpeg',
  'E2_ELM_1D_2.jpeg',
  'E2_ELS_2D_1.jpeg',
  'E2_EL_2D_2_INV.jpeg',
  'E2_GSEL_2D_13.jpeg',
  'E2_GSEL_2D_13_INV.jpeg',
  'E2_GSEL_2D_15_INV.jpeg',
  'E2_GSEL_2D_20.jpeg',
  'E2_GSEL_2D_31.jpeg',
  'E2_GSEL_2D_56.jpeg',
  'TEST_CN_0.jpg',
  'TEST_CN_1.jpg',
  'TEST_CN_2.jpg',
  'TEST_DataMatrix_1.png',
  'TEST_DataMatrix_2.png',
  'TEST_DataMatrix_3.png',
  'TEST_DataMatrix_3-crop.png',
  'TEST_GS1-128_1.gif',
  'TEST_GS1_COMPOSITE_1.jpg',
  'TEST_RU_1.png',
  'TEST_RU_2.png',
];

export default class _ extends Controller {
  constructor(...props) {
    super(...props);

    console.log('Test');

    this.useFrames = true;
    this.useVideo = false;

    console.log('BarcodeController');
    const barcodeScanner = this.querySelector('psk-barcode-scanner');
    barcodeScanner.useFrames = this.useFrames;

    this.model = {
      currentFileIndex: 0,
    };

    this.model.onChange('data', async () => {
      console.log(this.model.data);
      alert(JSON.stringify(this.model.data, null, '2'));

      let barcodeScanner = this.querySelector('psk-barcode-scanner');
      barcodeScanner.remove();
      barcodeScanner = this.createElement('psk-barcode-scanner');
      barcodeScanner.setAttribute('data', '@data');
      barcodeScanner.useFrames = this.useFrames;
      this.element.append(barcodeScanner);

      // this.model.currentFileIndex++;
      // await this.setFrame();
    });

    this.onTagEvent('previous', 'click', async () => {
      this.model.currentFileIndex = this.model.currentFileIndex > 0 ? --this.model.currentFileIndex : 0;
      await this.setFrame();
    });

    this.onTagEvent('next', 'click', async () => {
      const length = FILES.length - 1;
      this.model.currentFileIndex = this.model.currentFileIndex < length ? ++this.model.currentFileIndex : length;
      await this.setFrame();
    });

    setTimeout(async () => {
      await this.setFrame();
    }, 300);
  }

  setFrame = async () => {
    const barcodeScanner = this.querySelector('psk-barcode-scanner');

    if (this.useVideo) {
      const file = await fetch(`./pages/tests/psk-barcode-scanner/frames-deny-b.json`);
      const frames = await file.json();
      await this.applyVideoFrame(barcodeScanner, frames);
      return;
    }

    const frame = [PATH, FILES[this.model.currentFileIndex]].join('/');
    await barcodeScanner.setFrame(frame);
  };

  async applyVideoFrame(barcodeScanner, frames) {
    let i = 0;
    let increment = true;

    const interval = setInterval(async () => {
      if (i === 0) {
        increment = true;
      }
      if (i === frames.length - 1) {
        increment = false;
      }
      await barcodeScanner.setFrame(frames[i]);
      increment ? i++ : i--;
    }, 100);

    const clearFrameInterval = () => {
      clearInterval(interval);
      // stencil router does not have a removeListener for history
    };

    this.model.onChange('data', clearFrameInterval);
    this.history.listen(clearFrameInterval);
  }
}
