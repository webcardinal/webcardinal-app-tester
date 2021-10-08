const { setConfig, getConfig } = WebCardinal.preload;

async function initializeWebCardinalConfig() {
    const config = getConfig();
    config.translations = false;
    return config;
}

const config = await initializeWebCardinalConfig();
setConfig(config);