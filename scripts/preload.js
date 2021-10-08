// Path: scripts/preload.js

const { setConfig, getConfig } = WebCardinal.preload;
const { define } = WebCardinal.components;

async function initializeWebCardinalConfig() {
    const config = getConfig();
    config.translations = false;
    return config;
}

define('test-input');
define('test-input-with-dashes', 'test-input/test-input-with-dashes');
define('test-squares');

const config = await initializeWebCardinalConfig();
setConfig(config);