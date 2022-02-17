importScripts("zxing-browser.min.js");
importScripts("scan-filters.js");

const hints = new Map();
hints.set(3, true); // TRY_HARDER

const { BrowserMultiFormatReader } = ZXingBrowser;
const scanner = new BrowserMultiFormatReader(hints);

console.log("Scan Worker!");

addEventListener("message", (e) => {
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
        postMessage({
            message: "failed decoding",
            feedback: { filterId, imageData },
            error: { message: error.message },
        });
    }
});
