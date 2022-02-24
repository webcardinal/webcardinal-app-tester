importScripts("zxing-browser.js");
importScripts("scan-filters.js");


const { BrowserMultiFormatReader, MultiFormatReader, HTMLCanvasElementLuminanceSource, HybridBinarizer, BinaryBitmap, BarcodeFormat, DecodeHintType } = ZXingBrowser;

const hints = new Map();
const formats = [BarcodeFormat.DATA_MATRIX];

hints.set(2, formats);
hints.set(3, true);


console.log("Scan Worker!");

addEventListener("message", async (e) => {
    const { filterId, sendImageData } = e.data;
    let { imageData } = e.data;

    const filter = getFilter(filterId);
    if (typeof filter === "function") {
        imageData = filter({ imageData });
    }

    const canvasMock = {
        width: imageData.width,
        height: imageData.height,
        getContext: () => ({ getImageData: () => imageData }),
    };

    try {
        const bitmap = BrowserMultiFormatReader.createBinaryBitmapFromCanvas(canvasMock);
        const scanner = new BrowserMultiFormatReader(hints, 10);
        const result = scanner.decodeBitmap(bitmap);

        if (!sendImageData) {
            imageData = [];
        }

        postMessage({
            message: "successful decoding",
            feedback: { filterId, imageData },
            data: { result },
        });
    } catch (error) {
        if(error.name === "NotFoundException"){
            //console.log("failed decoding")
            postMessage({
                message: "failed decoding",
                feedback: { filterId, imageData },
                error: { message: error.message },
            });
        }else{
            console.log(error);
        }
    }
});
