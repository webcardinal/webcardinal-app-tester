const { setConfig, getConfig, addHook, navigateToPageTag } = WebCardinal.preload;

// addHook('afterAppLoads', async () => {
//     const params = (new URL(window.top.location)).searchParams;
//     if (params.has('redirect')) {
//         switch (params.get('redirect')) {
//             case "psk-barcode-scanner":
//                 window.top.history.pushState(undefined, "WebCardinal Main Environment", window.top.location.pathname);
//                 await navigateToPageTag('psk-barcode-scanner');
//                 break;
//             default:
//                 break;
//         }
//     }
// });

setConfig(
  (() => {
    const config = getConfig();
    config.translations = false;
    return config;
  })()
);
