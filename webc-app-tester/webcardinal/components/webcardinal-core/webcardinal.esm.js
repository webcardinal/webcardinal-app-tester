import { B as BUILD, c as consoleDevInfo, p as plt, w as win, H, d as doc, N as NAMESPACE, a as promiseResolve, b as bootstrapLazy } from './index-60428ce4.js';
import './mode-2888b3c8.js';
import { g as globalScripts } from './app-globals-a1ec4a23.js';

/*
 Stencil Client Patch Browser v2.3.0 | MIT Licensed | https://stenciljs.com
 */
const getDynamicImportFunction = (namespace) => `__sc_import_${namespace.replace(/\s|-/g, '_')}`;
const patchBrowser = () => {
    // NOTE!! This fn cannot use async/await!
    if (BUILD.isDev && !BUILD.isTesting) {
        consoleDevInfo('Running in development mode.');
    }
    if (BUILD.cssVarShim) {
        // shim css vars
        plt.$cssShim$ = win.__cssshim;
    }
    if (BUILD.cloneNodeFix) {
        // opted-in to polyfill cloneNode() for slot polyfilled components
        patchCloneNodeFix(H.prototype);
    }
    if (BUILD.profile && !performance.mark) {
        // not all browsers support performance.mark/measure (Safari 10)
        performance.mark = performance.measure = () => {
            /*noop*/
        };
        performance.getEntriesByName = () => [];
    }
    // @ts-ignore
    const scriptElm = BUILD.scriptDataOpts || BUILD.safari10 || BUILD.dynamicImportShim
        ? Array.from(doc.querySelectorAll('script')).find(s => new RegExp(`\/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute('data-stencil-namespace') === NAMESPACE)
        : null;
    const importMeta = import.meta.url;
    const opts = BUILD.scriptDataOpts ? scriptElm['data-opts'] || {} : {};
    if (BUILD.safari10 && 'onbeforeload' in scriptElm && !history.scrollRestoration /* IS_ESM_BUILD */) {
        // Safari < v11 support: This IF is true if it's Safari below v11.
        // This fn cannot use async/await since Safari didn't support it until v11,
        // however, Safari 10 did support modules. Safari 10 also didn't support "nomodule",
        // so both the ESM file and nomodule file would get downloaded. Only Safari
        // has 'onbeforeload' in the script, and "history.scrollRestoration" was added
        // to Safari in v11. Return a noop then() so the async/await ESM code doesn't continue.
        // IS_ESM_BUILD is replaced at build time so this check doesn't happen in systemjs builds.
        return {
            then() {
                /* promise noop */
            },
        };
    }
    if (!BUILD.safari10 && importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    else if (BUILD.dynamicImportShim || BUILD.safari10) {
        opts.resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href)).href;
        if (BUILD.dynamicImportShim) {
            patchDynamicImport(opts.resourcesUrl, scriptElm);
        }
        if (BUILD.dynamicImportShim && !win.customElements) {
            // module support, but no custom elements support (Old Edge)
            // @ts-ignore
            return import(/* webpackChunkName: "polyfills-dom" */ './dom-424264d0.js').then(() => opts);
        }
    }
    return promiseResolve(opts);
};
const patchDynamicImport = (base, orgScriptElm) => {
    const importFunctionName = getDynamicImportFunction(NAMESPACE);
    try {
        // test if this browser supports dynamic imports
        // There is a caching issue in V8, that breaks using import() in Function
        // By generating a random string, we can workaround it
        // Check https://bugs.chromium.org/p/chromium/issues/detail?id=990810 for more info
        win[importFunctionName] = new Function('w', `return import(w);//${Math.random()}`);
    }
    catch (e) {
        // this shim is specifically for browsers that do support "esm" imports
        // however, they do NOT support "dynamic" imports
        // basically this code is for old Edge, v18 and below
        const moduleMap = new Map();
        win[importFunctionName] = (src) => {
            const url = new URL(src, base).href;
            let mod = moduleMap.get(url);
            if (!mod) {
                const script = doc.createElement('script');
                script.type = 'module';
                script.crossOrigin = orgScriptElm.crossOrigin;
                script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window.${importFunctionName}.m = m;`], { type: 'application/javascript' }));
                mod = new Promise(resolve => {
                    script.onload = () => {
                        resolve(win[importFunctionName].m);
                        script.remove();
                    };
                });
                moduleMap.set(url, mod);
                doc.head.appendChild(script);
            }
            return mod;
        };
    }
};
const patchCloneNodeFix = (HTMLElementPrototype) => {
    const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
    HTMLElementPrototype.cloneNode = function (deep) {
        if (this.nodeName === 'TEMPLATE') {
            return nativeCloneNodeFn.call(this, deep);
        }
        const clonedNode = nativeCloneNodeFn.call(this, false);
        const srcChildNodes = this.childNodes;
        if (deep) {
            for (let i = 0; i < srcChildNodes.length; i++) {
                // Node.ATTRIBUTE_NODE === 2, and checking because IE11
                if (srcChildNodes[i].nodeType !== 2) {
                    clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
                }
            }
        }
        return clonedNode;
    };
};

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["webc-app-root",[[33,"webc-app-root",{"loader":[1],"preload":[1],"disableHeader":[516,"disable-header"],"disableLoaderHiding":[516,"disable-loader-hiding"],"history":[32]}]]],["webc-link",[[4,"webc-link",{"href":[1025],"tag":[1]}]]],["webc-modal",[[33,"webc-modal",{"model":[8],"translationModel":[8,"translation-model"],"controller":[513],"template":[513],"modalTitle":[513,"modal-title"],"modalDescription":[513,"modal-description"],"modalContent":[513,"modal-content"],"modalFooter":[513,"modal-footer"],"cancelButtonText":[1,"cancel-button-text"],"confirmButtonText":[1,"confirm-button-text"],"expanded":[516],"centered":[516],"autoShow":[1540,"auto-show"],"disableClosing":[516,"disable-closing"],"disableBackdropClosing":[516,"disable-backdrop-closing"],"disableExpanding":[516,"disable-expanding"],"disableFooter":[516,"disable-footer"],"disableCancelButton":[516,"disable-cancel-button"],"history":[32],"isLoading":[32],"isVisible":[32],"show":[64],"hide":[64],"destroy":[64]}]]],["context-consumer",[[0,"context-consumer",{"context":[16],"renderer":[16],"subscribe":[16],"unsubscribe":[32]}]]],["stencil-async-content",[[0,"stencil-async-content",{"documentLocation":[1,"document-location"],"content":[32]}]]],["stencil-route-title",[[0,"stencil-route-title",{"titleSuffix":[1,"title-suffix"],"pageTitle":[1,"page-title"]}]]],["stencil-router-prompt",[[0,"stencil-router-prompt",{"when":[4],"message":[1],"history":[16],"unblock":[32]}]]],["stencil-router-redirect",[[0,"stencil-router-redirect",{"history":[16],"root":[1],"url":[1]}]]],["webc-app-loader",[[1,"webc-app-loader",{"src":[1537],"basePath":[1025,"base-path"],"loader":[1],"skin":[1537],"tag":[513],"saveState":[516,"save-state"],"history":[32],"content":[32]}]]],["webc-app-redirect",[[0,"webc-app-redirect",{"url":[1],"history":[32]}]]],["webc-container",[[4,"webc-container",{"controller":[1],"disableContainer":[516,"disable-container"],"history":[32],"getModel":[64],"getTranslationModel":[64]}]]],["webc-datatable",[[33,"webc-datatable",{"chain":[1,"datasource"],"dataSize":[2,"data-size"],"pageSize":[2,"page-size"],"pageSizeDelta":[2,"page-size-delta"],"curentPageIndex":[2,"curent-page-index"],"hidePagination":[4,"hide-pagination"],"templateChildrenCount":[1026,"template-children-count"],"fillCurrentPage":[64],"clearCurrentPage":[64]}]]],["webc-docs",[[36,"webc-docs",{"for":[1],"local":[4]}]]],["webc-skin",[[4,"webc-skin",{"href":[1]}]]],["webc-template",[[1,"webc-template",{"template":[513],"disableContainer":[516,"disable-container"],"getModel":[64],"getTranslationModel":[64]}]]],["webc-app-container",[[36,"webc-app-container"]]],["webc-app-menu",[[36,"webc-app-menu",{"items":[1040],"basePath":[1025,"base-path"],"disableIdentity":[1540,"disable-identity"],"mode":[1537],"history":[32]}]]],["webc-app-error-toast",[[32,"webc-app-error-toast",null,[[8,"webcAppWarning","handleAppWarning"],[8,"webcAppError","handleAppError"]]]]],["webc-component",[[0,"webc-component",{"controller":[1],"template":[513],"element":[16],"history":[32],"getModel":[64],"getTranslationModel":[64],"getListeners":[64]}]]],["webc-spinner",[[32,"webc-spinner"]]],["stencil-route",[[0,"stencil-route",{"group":[513],"componentUpdated":[16],"match":[1040],"url":[1],"component":[1],"componentProps":[16],"exact":[4],"routeRender":[16],"scrollTopOffset":[2,"scroll-top-offset"],"routeViewsUpdated":[16],"location":[16],"history":[16],"historyType":[1,"history-type"]}]]],["stencil-router",[[4,"stencil-router",{"root":[1],"historyType":[1,"history-type"],"titleSuffix":[1,"title-suffix"],"scrollTopOffset":[2,"scroll-top-offset"],"location":[32],"history":[32]}]]],["webc-app-router",[[0,"webc-app-router",{"routes":[1040],"fallbackPage":[1032,"fallback-page"],"basePath":[1025,"base-path"],"landingPage":[32]}]]],["webc-app-identity",[[33,"webc-app-identity",{"avatar":[1025],"email":[1025],"name":[1025]}]]],["webc-app-menu-item",[[0,"webc-app-menu-item",{"menuElement":[16],"url":[1025],"basePath":[1,"base-path"],"item":[16],"level":[514],"name":[1],"mode":[1],"activate":[64],"deactivate":[64]}]]],["stencil-route-switch",[[4,"stencil-route-switch",{"group":[513],"scrollTopOffset":[2,"scroll-top-offset"],"location":[16],"routeViewsUpdated":[16]}]]],["stencil-route-link",[[4,"stencil-route-link",{"url":[1],"urlMatch":[1,"url-match"],"activeClass":[1,"active-class"],"exact":[4],"strict":[4],"custom":[1],"anchorClass":[1,"anchor-class"],"anchorRole":[1,"anchor-role"],"anchorTitle":[1,"anchor-title"],"anchorTabIndex":[1,"anchor-tab-index"],"anchorId":[1,"anchor-id"],"history":[16],"location":[16],"root":[1],"ariaHaspopup":[1,"aria-haspopup"],"ariaPosinset":[1,"aria-posinset"],"ariaSetsize":[2,"aria-setsize"],"ariaLabel":[1,"aria-label"],"match":[32]}]]]], options);
});
