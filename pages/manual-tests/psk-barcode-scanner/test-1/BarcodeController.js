const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

export default class _ extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            framesJSON: 'frames-01.json',
            // framesJSON: 'frames-02.json',
            // framesJSON: 'frames-deny-w.json',
            // framesJSON: 'frames-deny-b.json'
        }

        this.model.onChange('data', () => {
            console.log(this.model.data);
            alert(JSON.stringify(this.model.data, null, '2'));
        });

        // setTimeout(async () => {
        //     const file = await fetch(`./pages/manual-tests/psk-barcode-scanner/test-1/${this.model.framesJSON}`);
        //     const frames = await file.json();
        //     await this.applyFrames(frames);
        // });
    }

    async applyFrames(frames) {
        const barcodeScanner = this.querySelector('psk-barcode-scanner');
        barcodeScanner.useFrames = true;

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
        }

        this.model.onChange("data", clearFrameInterval);
        this.history.listen(clearFrameInterval);
    }
}