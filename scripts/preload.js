// Path: scripts/preload.js

const { setConfig, getConfig, addHook, setSkin } = WebCardinal.preload;
const { define } = WebCardinal.components;

async function initializeWebCardinalConfig() {
    const config = getConfig();
    // config.translations = false;
    return config;
}

// WebCardinal App Tester components
define('webcat-section');
define('webcat-card');


// Testing components
define('fa-icon');
define('test-input');
define('test-input-with-dashes', 'test-input/test-input-with-dashes');
define('test-squares');
define('test-multiple-bindings-component');


// Testing setSkin
addHook("beforePageLoads", "translations-test-2", () => {
    setSkin("ro");
});

addHook("whenPageClose", "translations-test-2", () => {
    setSkin("default");
});


const config = await initializeWebCardinalConfig();
setConfig(config);