const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

export default class _ extends Controller {
    constructor(...props) {
        super(...props);

        this.model.onChange('data', () => {
            console.log(this.model.data);

            alert(JSON.stringify(this.model.data, null, '2'))
        });

        setTimeout(async () => {
            const file = await fetch('./pages/manual-tests/psk-barcode-scanner/test-1/frames.json');
            const frames = await file.json();
            await this.applyFrames(frames);
        })

        // setInterval(() => {
        //     barcodeScanner.setFrame()
        // }, 30)
    }

    async applyFrames(frames) {
        const barcodeScanner = this.querySelector('psk-barcode-scanner');
        let i = 0;
        let increment = true;

        while (true) {
            if (i === 0) {
                increment = true;
            }
            if (i === frames.length - 1) {
                increment = false;
            }
            await barcodeScanner.setFrame(frames[i]);
            await timeout(100);
            increment ? i++ : i--;
        }
    }
}