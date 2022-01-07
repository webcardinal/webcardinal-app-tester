const { setConfig, getConfig } = WebCardinal.preload;

setConfig(
  (() => {
    const config = getConfig();
    config.translations = false;
    return config;
  })()
);
