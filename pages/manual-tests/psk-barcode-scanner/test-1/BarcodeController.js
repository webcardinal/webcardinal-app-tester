const { Controller } = WebCardinal.controllers;

async function loadFrame(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.src = src;
    });
}

export default class _ extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            // framesJSON: 'frames-01.json',
            // framesJSON: 'frames-02.json',
            framesJSON: 'frames-03.json',
            // framesJSON: 'frames-deny-w.json',
            // framesJSON: 'frames-deny-b.json'
        }

        this.model.onChange('data', () => {
            console.log(this.model.data);
            alert(JSON.stringify(this.model.data, null, '2'));
        });

        setTimeout(async () => {
            const file = await fetch(`./pages/manual-tests/psk-barcode-scanner/test-1/${this.model.framesJSON}`);
            const frames = await file.json();
            await this.applyFrames(frames);
        });
    }

    async applyFrames(frames) {
        const barcodeScanner = this.querySelector('psk-barcode-scanner');

        let i = 0;
        let increment = true;

        const image = await loadFrame(frames[0]);
        const { width, height } = image;
        const canvas = this.createElement('canvas', { width, height })
        const ctx = canvas.getContext('2d')

        const interval = setInterval(async () => {
            if (i === 0) {
                increment = true;
            }
            if (i === frames.length - 1) {
                increment = false;
            }

            /** Test base64 **/
            // await barcodeScanner.setFrame(frames[i]);

            // @Costin
            // const response = await fetch(frames[i]);
            // const frameBlob = await response.blob();
            // const arrayBuffer = await frameBlob.arrayBuffer();
            // const imageBuffer = new Uint8ClampedArray(arrayBuffer);
            // const imageData = new ImageData(imageBuffer, width, height);
            // await barcodeScanner.setFrame(imageData);

            /** Test image data */
            const image = await loadFrame(frames[i]);
            ctx.drawImage(image, 0, 0, width, height)
            const imageData = ctx.getImageData(0, 0, width, height)
            await barcodeScanner.setFrame(imageData);

            increment ? i++ : i--;
        }, 100);

        const clearFrameInterval = () => {
            clearInterval(interval);
            // stencil router does not have a removeListener for history
        }

        this.model.onChange("data", clearFrameInterval);
        this.history.listen(clearFrameInterval);
    }
}