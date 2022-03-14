const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const constants = require('./constants');
const jsdom = require('jsdom');

function filterPaths(document, reportsJSON) {
    const keyword = '.dev/webcardinal/.webcardinal/components/webcardinal-core/test';

    reportsJSON.testResults = reportsJSON.testResults.map(testResult => {
        const index = testResult.testFilePath.indexOf(keyword);
        if (index < 0) {
            return;
        }

        testResult.testFilePath = testResult.testFilePath.slice(index + keyword.length);
        return testResult;
    });

    let rawTestResults = JSON.stringify(reportsJSON, null, 2);
    rawTestResults = rawTestResults.replace(/"/g, '&quot;');
    rawTestResults = rawTestResults.replace(/\//g, '&#x2F;');

    const testResultsElement = document.getElementById('test-results');
    testResultsElement.innerHTML = rawTestResults;
}

function injectVisualAdjustments(document) {
    const [liHome, liCoverage] = document.querySelectorAll('#navbarCollapse .nav-item');
    liHome.remove();
    liCoverage.remove();

    const hr = document.querySelector('body > hr');
    const footer = document.querySelector('body > footer');
    hr.remove();
    footer.remove();
}

async function run() {
    const pathToHTML = path.join(process.cwd(), constants.TEST_REPORTS_PATH, 'reports.html');
    const pathToJSON = path.join(process.cwd(), constants.TEST_REPORTS_PATH, 'reports.json');

    let reportsJSON;
    let rawHTML;

    console.log('[WebCardinal] [testing-workflow] Looking in...', path.join(process.cwd(), constants.TEST_REPORTS_PATH));

    try {
        reportsJSON = require(pathToJSON);
    } catch (error) {
        console.error('[WebCardinal] [testing-workflow] can no read reports.html!', error);
        return;
    }

    try {
        rawHTML = await promisify(fs.readFile)(pathToHTML, { encoding: 'UTF-8' });
        rawHTML = rawHTML.replace(/<!--(.*?)-->/gs, '');
    } catch (error) {
        console.error('[WebCardinal] [testing-workflow] can no read reports.html!', error);
        return;
    }

    const dom = new jsdom.JSDOM(rawHTML);
    const { document } = dom.window;

    try {
        filterPaths(document, reportsJSON);
    } catch (error) {
        console.error('[WebCardinal] [testing-workflow] can not be modify testResults!', error);
        return;
    }

    try {
        injectVisualAdjustments(document, reportsJSON);
    } catch (error) {
        console.warn('[WebCardinal] [testing-workflow] can not apply visual adjustments', error);
        // do not return
    }

    try {
        const pathToHTML = path.join(constants.TEST_REPORTS_PATH, 'reports.html');
        await promisify(fs.writeFile)(pathToHTML, dom.serialize(), { encoding: 'UTF-8' });
    } catch (error) {
        console.error('[WebCardinal] [testing-workflow] can not write in reports.html!', error);
    }
}

module.exports = {
    run
};