const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

async function run() {
    const codesPath = path.join(
        process.cwd(),
        "./psk-barcode-codes/stress-codes"
    );

    try {
        const files = await promisify(fs.readdir)(codesPath);
        console.log(files);
    } catch (err) {
        console.error(err);
    }
}

run();