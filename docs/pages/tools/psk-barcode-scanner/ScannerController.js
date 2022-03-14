const { WebcController } = WebCardinal.controllers;

export default class ScannerController extends WebcController {
    constructor(...props) {
        super(...props);

        console.log('ScannerController');

        // psk-barcode-scanner options
        this.snapVideo = true;

        this.model = {
            scannedData: {}
        };

        this.model.onChange('data', async () => {
            console.log('data', this.model.scannedData);
        });
    }
}
