import interpretScan from "../../pages/tools/light-scanner/GS1/interpret.js";

function parseGS1Code(scannedBarcode) {
    let gs1FormatFields;

    try {
        gs1FormatFields = interpretScan(scannedBarcode);
    } catch (e) {
        parseGS1Fields(e.dlOrderedAIlist);
        return;
    }

    return parseGS1Fields(gs1FormatFields.ol);
}

function parseGS1Fields(orderedList) {
    const gs1Fields = {};
    const fieldsConfig = {
        GTIN: "gtin",
        "BATCH/LOT": "batchNumber",
        SERIAL: "serialNumber",
        "USE BY OR EXPIRY": "expiry",
    };

    orderedList.map((el) => {
        let fieldName = fieldsConfig[el.label];
        gs1Fields[fieldName] = el.value;
    });

    return gs1Fields;
}

export { parseGS1Code }