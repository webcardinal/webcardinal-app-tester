import { r as registerInstance, e as createEvent, h } from './index-60428ce4.js';
import './mode-2888b3c8.js';
import { H as HOOK_TYPE, af as URLHelper, D as DISABLE_BINDING, V as VIEW_MODEL_KEY, A as ASSETS_PATH, u as ID_CUSTOM_SKIN_CSS, t as ID_DEFAULT_SKIN_CSS, ak as getSkinFromState, al as getSkinPathFromState, B as EVENT_CONFIG_GET_ROUTING, y as EVENT_CONFIG_GET_IDENTITY, z as EVENT_CONFIG_GET_LOG_LEVEL, E as EVENT_CONFIG_GET_CORE_TYPE, x as EVENT_CONFIG_GET_DOCS_SOURCE, L as LOG_LEVEL, v as CP_WEBC_APP_ROOT_MODE, w as CP_WEBC_APP_ROOT_MOBILE_BREAKPOINT, a9 as promisifyEventEmit } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import './index-d3647f32.js';
import './index.esm.js';
import './active-router-3d243f8f.js';
import { i as injectHistory } from './index-1ea33b8d.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';
import { C as Controller, p as proxifyModelProperty, P as PskBindableModel } from './Controller-4824fbca.js';

class WebcController extends Controller {
  constructor(...props) {
    super(...props);
  }

  showModal(content, title, onConfirm, onClose, props = {}) {
    title = title ? title : 'Info';
    return this.createWebcModal({
      ...props,
      modalTitle: title,
      modalContent: content,
      onConfirm,
      onClose,
    });
  }

  showModalFromTemplate(template, onConfirm, onClose, props = {}) {
    return this.createWebcModal({
      ...props,
      template,
      onConfirm,
      onClose,
    });
  }

  showErrorModal(error, title, onConfirm, onClose, props = {}) {
    title = title ? title : 'Error';
    let text;

    if (error instanceof Error) {
      text = error.message;
    } else if (typeof error === 'object') {
      text = error.toString();
    } else {
      text = error;
    }

    return this.createWebcModal({
      disableClosing: true,
      showCancelButton: false,
      ...props,
      modalTitle: title,
      modalContent: text,
      onConfirm,
      onClose,
    });
  }

  showErrorModalAndRedirect(error, title, url, timeout, props = {}) {
    title = title ? title : 'Error';
    let text;

    if (error instanceof Error) {
      text = error.message;
    } else if (typeof error === 'object') {
      text = error.toString();
    } else {
      text = error;
    }

    if (!timeout) {
      timeout = 5000;
    }

    this.createWebcModal({
      disableExpanding: true,
      disableClosing: true,
      disableFooter: true,
      ...props,
      modalTitle: title,
      modalContent: text,
    });

    setTimeout(() => {
      this.hideModal();

      if (typeof url === 'string') {
        this.navigateToUrl(url);
      } else if (typeof url === 'object') {
        const { href, tag, state } = url;
        if (tag) {
          this.navigateToPageTag(tag, state);
        } else {
          this.navigateToUrl(href, state);
        }
      }
    }, timeout);
  }

  createWebcModal({
    template,
    controller,
    model,
    translationModel,
    modalTitle,
    modalDescription,
    modalContent,
    modalFooter,
    confirmButtonText,
    cancelButtonText,
    centered,
    expanded,
    disableCancelButton,
    disableClosing,
    disableBackdropClosing,
    disableExpanding,
    disableFooter,
    autoShow,
    onConfirm,
    onClose,
    ...rest
  }) {
    if (!onClose) {
      onClose = onConfirm;
    }

    if (model) {
      model = proxifyModelProperty(model);
    }

    const modal = this.createAndAddElement('webc-modal', {
      template,
      controller,
      model,
      translationModel,
      modalTitle,
      modalDescription,
      modalContent,
      modalFooter,
      confirmButtonText,
      cancelButtonText,
      centered,
      expanded,
      disableCancelButton,
      disableClosing,
      disableBackdropClosing,
      disableExpanding,
      disableFooter,
      autoShow,
      ...rest
    });

    modal.addEventListener('confirmed', e => {
      onConfirm && onConfirm(e);
      modal.remove();
    });
    modal.addEventListener('closed', e => {
      onClose && onClose(e);
      modal.remove();
    });

    return modal;
  }

  hideModal() {
    if (this.element.hasAttribute('data-modal')) {
      this.element.parentNode.host.remove();
      return;
    }

    this.element.querySelectorAll('webc-modal').forEach(modal => modal.remove());
  }
}

//by default ionic components keep their model on value property
//sometimes it is possible that you need some other information. E.g on ion-checkbox you want to see if the model is checked

const ionEventsChainMappings = [{
  eventName: "ionChange",
  components: {
    "ion-checkbox": {
      chainTriggered: "checked"
    },
    "ion-toggle": {
      chainTriggered: "checked"
    }
  },
}];

class IonicController extends WebcController {

  constructor(...props) {
    super(...props);
    let constructorElement = props[0];

    ionEventsChainMappings.forEach((ionEventChainMapping) => {
      let eventName = ionEventChainMapping.eventName;

      constructorElement.addEventListener(eventName, (event) => {
        let eventSource = event.target;
        let eventValue = event.target.value;
        let componentName = eventSource.tagName.toLowerCase();
        let chainTriggered = ionEventChainMapping.components[componentName];

        if (typeof chainTriggered === "undefined") {
          chainTriggered = "value";
        } else {
          chainTriggered = ionEventChainMapping.components[componentName].chainTriggered;
          if (typeof eventSource[chainTriggered] !== "undefined") {
            eventValue = eventSource[chainTriggered];
          }
        }

        let attributeValue;
        if (eventSource.hasAttribute("data-view-model")) {
          attributeValue = eventSource.getAttribute("data-view-model");
          let modelChain = attributeValue.split("@").join("");
          if (chainTriggered !== "@") {
            modelChain = `${modelChain}.${chainTriggered}`;
          }
          this.model.setChainValue(modelChain, eventValue);
        } else {
          //chain may be removed from attribute value if boolean e.g. checked, disabled
          //for overcoming this issue we use the observed chains from the webcModelChains object that is populated on binding initialization
          if (eventSource.webcModelChains && eventSource.webcModelChains[chainTriggered]) {
            let modelChain = eventSource.webcModelChains[chainTriggered];
            this.model.setChainValue(modelChain, event.detail[chainTriggered]);
          }
        }
      });
    });
  }
}

const controllers = {
  Controller,
  WebcController,
  WebcIonicController: IonicController
};

class DataSource {
  /**
   * @param {object} [options]
   * @param {number | undefined} [options.recordsNumber]
   * @param {number} [options.pageSize=20]
   * @param {number} [options.pageSizeDelta=2]
   */
  constructor(options) {
    if (!options) {
      options = {};
    }
    if (typeof options.recordsNumber !== 'number') {
      options.recordsNumber = undefined;
    }
    if (typeof options.pageSize !== 'number') {
      options.pageSize = 20;
    }
    if (typeof options.pageSizeDelta !== 'number') {
      options.pageSizeDelta = 2;
    }

    this.options = options;
  }

  // Public methods

  /**
   * @param {number} recordsNumber - count of your entire database, required for pagination
   */
  setRecordsNumber(recordsNumber) {
    if (typeof this.getElement !== 'function') {
      this.options.recordsNumber = recordsNumber;
      return;
    }

    const dataTableElement = this.getElement();
    dataTableElement.dataSize = recordsNumber;
  }

  getRecordsNumber() {
    if (typeof this.getElement !== 'function') {
      return this.options.recordsNumber;
    }

    const dataTableElement = this.getElement();
    return dataTableElement.dataSize;
  }

  /**
   * @param {number} pageSize - how many rows are displayed on a page
   */
  setPageSize(pageSize) {
    if (typeof this.getElement !== 'function') {
      this.options.pageSize = pageSize;
      return;
    }

    const dataTableElement = this.getElement();
    dataTableElement.pageSize = pageSize;
  }

  getPageSize() {
    if (typeof this.getElement !== 'function') {
      return this.options.pageSize;
    }

    const dataTableElement = this.getElement();
    return dataTableElement.pageSize;
  }

  /**
   * @returns {number} pageIndex - current index of pages which is displayed
   */
  getCurrentPageIndex() {
    const dataTableElement = this.getElement();
    return dataTableElement.curentPageIndex;
  }

  /**
   * @param startOffset
   * @param dataLengthForCurrentPage
   *
   * @return Array - Items displayed for current page
   */
  async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
    return [];
  }

  // Optional await
  // When some action is required only after the page was changed

  async goToNextPage() {
    await this.goToPageByIndex(this.getCurrentPageIndex() + 1);
  }

  async goToPreviousPage() {
    await this.goToPageByIndex(this.getCurrentPageIndex() - 1);
  }

  async goToPageByIndex(pageIndex = 0) {
    await this._renderPageAsync(pageIndex);
  }

  // TODO

  changeFilter() {}

  // Private methods
  // Those are used for coupling between DataSource and webc-datatable

  _init = getElement => {
    this.getElement = getElement;

    const element = this.getElement();
    element.pageSizeDelta = this.options.pageSizeDelta;

    this.setPageSize(this.options.pageSize);
    this.setRecordsNumber(this.options.recordsNumber);
    return PskBindableModel.setModel({ data: [] });
  };

  _renderPageAsync = async (pageIndex = 0) => {
    const dataTableElement = this.getElement();
    const { pageSize, dataSize } = dataTableElement;

    const startOffset = pageSize * pageIndex;
    const recordsOffset = dataSize ? Math.min(dataSize - startOffset, pageSize) : pageSize;

    await dataTableElement.clearCurrentPage();
    dataTableElement.curentPageIndex = pageIndex;
    const pageData = await this.getPageDataAsync(startOffset, recordsOffset);
    await dataTableElement.fillCurrentPage(pageData);
  };
}

const dataSources = {
  DataSource
};

const defaultConfig = {
  identity: {
    name: 'WebCardinal',
    email: 'webcardinal@axiologic.net',
    avatar: '',
  },
  pagesFallback: {
    name: '404'
  },
  pages: [
    {
      name: 'Homepage',
      path: '/',
      src: 'home.html',
    },
  ],
  logLevel: 'error',
  version: '1.0.0',
  docsSource: 'github',
  translations: true,
  skin: 'default',
};

function getPreloadAPI() {
  return {
    setSkin: async (skin = 'default') => {
      if (!skin || typeof skin !== 'string') {
        console.warn([
          `Function "setSkin(skin: string)" must receive a string as parameter!`
        ].join('\n'));
      }
      if (this.isConfigLoaded) {
        // window.WebCardinal.state.skin = skin;
        await window.WebCardinal.root.componentOnReady();
        window.WebCardinal.state.page.loader.skin = skin;
        return;
      }
      this.config.skin = skin;
    },
    addControllers: (controllers) => {
      if (this.isConfigLoaded) {
        console.warn([
          `Function "addControllers(controllers: object)" must be called only in preload stage of WebCardinal!`,
          `The configuration was already loaded!`,
        ].join('\n'));
        return;
      }
      if (typeof controllers !== 'object' && !Array.isArray(controllers)) {
        console.warn([
          `Function "addControllers(controllers: object)" must receive an object as parameter!`,
          `Form of parameter: "{ <CONTROLLER_NAME>: <CONTROLLER_CLASS>, ... }"`,
        ].join('\n'));
      }
      function isFunction(funcOrClass) {
        const propertyNames = Object.getOwnPropertyNames(funcOrClass);
        return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
      }
      for (let key of Object.keys(controllers)) {
        const controller = controllers[key];
        if (!isFunction(controller)) {
          this.injectedControllers[key] = controller;
        }
        else {
          console.warn([
            `In function "addControllers(controllers: object)", "${key}" is not a valid WebCardinal Controller!`,
            `It will be ignored!`,
          ].join('\n'));
        }
      }
    },
    addHook: (type, tag, hook) => {
      let types = Object.values(HOOK_TYPE);
      if (!types.includes(type)) {
        console.error([`Function "addHook": "${type}" is not a valid HookType (values: "${types.join('", "')}")`].join('\n'));
        return;
      }
      let hooks = this.injectedHooks;
      if (this.isConfigLoaded) {
        hooks = window.WebCardinal.hooks;
      }
      if (typeof tag === 'function') {
        hook = tag;
        hooks[type] = hook;
        return;
      }
      if (!tag || typeof tag !== 'string' || typeof hook !== 'function') {
        console.error([
          `Function "addHook" has the following interface:`,
          `"addHook(type: HookType, hook: Function)"`,
          `"addHook(type: HookType, tag: string, hook: Function)"`,
        ].join('\n'));
        return;
      }
      if (!hooks[type]) {
        hooks[type] = {};
      }
      hooks[type][tag] = hook;
    },
    setConfig: (config) => {
      if (this.isConfigLoaded) {
        console.warn([
          `Function "setConfig(config: object)" must be called only in preload stage of WebCardinal!`,
          `The configuration was already loaded!`,
        ].join('\n'));
        return;
      }
      this.config = config;
    },
    getConfig: () => {
      if (this.isConfigLoaded) {
        console.warn([
          `Function "getConfig()" must be called only in preload stage of WebCardinal!`,
          `The configuration was already loaded!`,
        ].join('\n'));
        return;
      }
      return this.config;
    },
    navigateToUrl: (url, state) => {
      const { WebCardinal } = window;
      WebCardinal.history.push(url, state);
    },
    navigateToPageTag: async (tag, state) => {
      return new Promise((resolve, reject) => {
        const { WebCardinal } = window;
        const router = WebCardinal.root.querySelector("webc-app-router");
        router.dispatchEvent(new CustomEvent("webcardinal:tags:get", {
          detail: {
            tag,
            callback: (error, path) => {
              if (error) {
                console.error(error);
                return reject(error);
              }
              WebCardinal.history.push(path, state);
              resolve(path);
            },
          },
        }));
      });
    }
  };
}
async function applyPreloadMiddleware(preloadPath) {
  if (!preloadPath) {
    return;
  }
  if (!preloadPath.endsWith('.js')) {
    preloadPath += '.js';
  }
  try {
    await import(URLHelper.join(this.basePath, preloadPath).pathname);
    console.log('[WebCardinal] Preload middleware was used!');
    if (typeof this.injectedHooks[HOOK_TYPE.BEFORE_APP] === 'function') {
      await this.injectedHooks[HOOK_TYPE.BEFORE_APP]();
    }
  }
  catch (error) {
    console.error(error);
  }
}

let tagNames = new Set();
function getCustomElementsTagNames() {
  return tagNames;
}
function getCustomElementsAPI() {
  return {
    /**
     * @param {string} tagName - the HTML tag of the desired CustomElement
     * @param {string} [template] - path to a HTML template (the root is /components directory)
     */
    define: (tagName, template) => {
      if (!template) {
        template = `${tagName}/${tagName}`;
      }
      tagName = tagName.toLowerCase();
      customElements.define(tagName, class _ extends HTMLElement {
        constructor() {
          super();
          // decides if this CustomElement should have #shadow-root (open)
          if (this.hasAttribute('shadow')) {
            this.attachShadow({ mode: 'open' });
          }
        }
        connectedCallback() {
          // prevents some effects from Stencil (double invocation of connectedCallback)
          let target = this.shadowRoot || this;
          if (target.children.length !== 0) {
            return;
          }
          // creates webc-component witch renders the template, create a constructor if needed and binds the models
          this._element = Object.assign(document.createElement('webc-component'), {
            template,
            element: this,
          });
          this._element.style.display = 'none';
          // disable data-view-model for attributes of this CustomElement
          this.setAttribute(DISABLE_BINDING, '');
          // copy all attributes of this CustomElement to webc-component
          Array.from(this.attributes).forEach(attr => {
            if (['shadow', 'className', DISABLE_BINDING, VIEW_MODEL_KEY].includes(attr.nodeName)) {
              return;
            }
            this._element.setAttribute(attr.nodeName, attr.nodeValue);
          });
          // when webc-component is ready pass the model and the translation model
          // then remove it from DOM, and clear some internal attributes for CustomElement
          this._element.componentOnReady().then(async () => {
            this._model = await this._element.getModel();
            this._translationModel = await this._element.getTranslationModel();
            this._listeners = await this._element.getListeners();
            if (this._listeners) {
              this._listeners.getModel.add();
              this._listeners.getTranslationModel.add();
            }
            this._element.remove();
            this.classList.add('hydrated');
            this.removeAttribute(DISABLE_BINDING);
          });
          // append webc-component in shadow or not
          if (this.shadowRoot) {
            if (!this.hasAttribute('shadow')) {
              this.setAttribute('shadow', '');
            }
            this.shadowRoot.append(this._element);
          }
          else {
            this.append(this._element);
          }
        }
        disconnectedCallback() {
          if (!this._listeners) {
            return;
          }
          this._listeners.getModel.remove();
          this._listeners.getTranslationModel.remove();
        }
        async getModel() {
          return this._model;
        }
        async getTranslationModel() {
          return this._translationModel;
        }
        set controller(controller) {
          this.setAttribute('controller', `${controller}`);
        }
        async componentOnReady() {
          if (this._element) {
            await this._element.componentOnReady();
          }
        }
      });
      tagNames.add(tagName);
    },
  };
}

const { join } = URLHelper;
let skin, skinPath;
function isValidWebCardinalPlacement() {
  const webcardinal = document.body.querySelector('link[href$="webcardinal.css"]') &&
    document.body.querySelector('script[src$="webcardinal.js"]');
  if (webcardinal) {
    console.error([
      `WebCardinal distribution must be added in <head> of index.html`,
      `In the case of current application WebCardinal is added in the <body>`,
      `As a result skin.css can not be applied!`,
    ].join('\n'));
    return false;
  }
  return true;
}
function applyCustomSkin(container) {
  const stylesheet = Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: join(this.basePath, skinPath, ASSETS_PATH, 'skin.css').pathname,
    id: ID_CUSTOM_SKIN_CSS,
  });
  container.insertAdjacentElement('afterend', stylesheet);
  return new Promise(resolve => {
    stylesheet.addEventListener('load', () => resolve());
    stylesheet.addEventListener('error', () => {
      console.error(`"skin.css" of "${skin}" skin must be present in order to style webc-<component>s via Custom Properties!`);
      resolve();
    });
  });
}
function applySkins(container) {
  const stylesheet = Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: join(this.basePath, ASSETS_PATH, 'skin.css').pathname,
    id: ID_DEFAULT_SKIN_CSS,
  });
  container.insertAdjacentElement('afterend', stylesheet);
  return new Promise(resolve => {
    stylesheet.addEventListener('load', async () => {
      if (skin === 'default') {
        return resolve();
      }
      await applyCustomSkin.bind(this)(stylesheet);
      return resolve();
    });
    stylesheet.addEventListener('error', async () => {
      console.error(`"skin.css" of "default" skin must be present in order to style webc-<component>s via Custom Properties!`);
      if (skin === 'default') {
        return resolve();
      }
      await applyCustomSkin.bind(this)(stylesheet);
      return resolve();
    });
  });
}
function getWebCardinalStylesheet() {
  // in order to make local imports of the user with higher priority then skin.css
  let webcardinalStylesheet = document.head.querySelector('link[href$="webcardinal.css"]');
  if (!webcardinalStylesheet) {
    console.error([
      `WebCardinal stylesheet not found!`,
      `Add <link rel="stylesheet" href="webcardinal/webcardinal.css"> in your "index.html"`,
    ].join('\n'));
    // if stylesheet is missing, insert skins after WebCardinal distribution
    webcardinalStylesheet = document.head.querySelector('script[src$="webcardinal.js"]');
  }
  return webcardinalStylesheet;
}
/**
 * Waiting for skin.css is mandatory since some Custom Properties are taken into account by webc-app-root
 * For example if "--mode: mobile" is present webc-app-root will render accordingly
 */
async function applySkinCSS () {
  if (isValidWebCardinalPlacement()) {
    skin = getSkinFromState();
    skinPath = getSkinPathFromState();
    await applySkins.bind(this)(getWebCardinalStylesheet());
  }
}

const CONFIG_PATH = 'webcardinal.json';
class ApplicationController {
  constructor(element) {
    this._trimPathname = path => {
      if (path.startsWith('/')) {
        path = path.slice(1);
      }
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      return path;
    };
    this.baseURL = this._initBaseURL();
    this.basePath = this._initBasePath();
    this.configURL = this._initResourceURL(CONFIG_PATH);
    this.config = {};
    this.injectedControllers = {};
    this.injectedHooks = {};
    this.pendingRequests = [];
    this.isConfigLoaded = false;
    // Necessary events for @webcardinal/core
    element.addEventListener(EVENT_CONFIG_GET_ROUTING, this._registerListener('routing'));
    element.addEventListener(EVENT_CONFIG_GET_IDENTITY, this._registerListener('identity'));
    element.addEventListener(EVENT_CONFIG_GET_LOG_LEVEL, this._registerListener('logLevel'));
    element.addEventListener(EVENT_CONFIG_GET_CORE_TYPE, this._registerListener('coreType'));
    element.addEventListener(EVENT_CONFIG_GET_DOCS_SOURCE, this._registerListener('docsSource'));
    // Necessary legacy events implemented only for @cardinal/core
    element.addEventListener('getThemeConfig', this._registerListener('theme'));
    // Other legacy events
    //   'getAppVersion',
    //   'needRoutes',
    //   'needMenuItems',
    //   'getUserInfo',
    //   'getHistoryType',
    //   'getModals',
    //   'getTags',
    //   'getConfiguration',
    //   'validateUrl',
    //   'getCustomLandingPage'
  }
  _initBaseURL() {
    const getBaseElementHref = () => {
      const baseElement = document.querySelector('base');
      if (!baseElement) {
        return null;
      }
      const href = baseElement.getAttribute('href');
      if (!href || href === '/') {
        return null;
      }
      return this._trimPathname(href);
    };
    const getWindowLocation = () => {
      return this._trimPathname(window.location.origin);
    };
    const windowLocation = getWindowLocation();
    const baseHref = getBaseElementHref();
    return baseHref ? new URL(baseHref, windowLocation) : new URL(windowLocation);
  }
  _initBasePath() {
    const basePath = this._trimPathname(this.baseURL.pathname);
    return basePath.length !== 0 ? '/' + basePath : basePath;
  }
  _initResourceURL(resource) {
    return new URL(this._trimPathname(this.baseURL.href) + '/' + this._trimPathname(resource));
  }
  async _readConfiguration() {
    try {
      const response = await fetch(this.configURL.href);
      const config = await response.json();
      return [null, config];
    }
    catch (error) {
      return [error];
    }
  }
  _prepareConfiguration(rawConfig) {
    const getRaw = item => {
      return rawConfig[item] ? rawConfig[item] : defaultConfig[item];
    };
    const getIdentity = () => {
      const rawIdentity = getRaw('identity');
      const result = {};
      for (const key of Object.keys(defaultConfig.identity)) {
        result[key] = rawIdentity[key] || defaultConfig.identity[key];
      }
      return result;
    };
    const getBaseURL = () => {
      return this._trimPathname(this.baseURL.href);
    };
    const getPages = (baseURL = this.baseURL.href, rawPages = getRaw('pages')) => {
      const pages = [];
      for (const rawPage of rawPages) {
        const page = {};
        // page name
        if (typeof rawPage.name !== 'string') {
          console.warn(`An invalid page detected (in "${CONFIG_PATH}")`, rawPage);
          continue;
        }
        if (rawPage.name.includes('/')) {
          console.warn(`Page name must not include '/' (in "${rawPages.name}")`);
          continue;
        }
        page.name = rawPage.name;
        const target = page.name.replace(/\s+/g, '-').toLowerCase();
        // page indexed
        if (typeof rawPage.indexed === 'boolean') {
          page.indexed = rawPage.indexed;
        }
        else {
          page.indexed = true;
        }
        // page path
        if (typeof rawPage.path === 'string') {
          page.path = rawPage.path;
        }
        else {
          const path = '/' + target;
          try {
            page.path = '.' + new URL(path, baseURL).pathname;
          }
          catch (error) {
            console.error(`Pathname "${path}" for "${page.name} can not be converted into a URL!\n`, error);
            continue;
          }
        }
        const hasChildren = Array.isArray(rawPage.children) && rawPage.children.length > 0;
        // page src
        if (typeof rawPage.src === 'string') {
          page.src = rawPage.src;
        }
        else {
          let src = '/' + target;
          if (!hasChildren) {
            src += '.html';
          }
          try {
            page.src = '.' + new URL(src, baseURL).pathname;
          }
          catch (error) {
            console.error(`Source "${src}" for "${page.name} can not be converted into a URL!\n`, error);
            continue;
          }
        }
        // page tag
        if (typeof rawPage.tag === 'string') {
          page.tag = rawPage.tag;
        }
        // page loader
        if (typeof rawPage.loader === 'string') {
          page.loader = rawPage.loader;
        }
        // children recursion
        if (hasChildren) {
          page.children = getPages(baseURL, rawPage.children);
        }
        pages.push(page);
      }
      return pages;
    };
    const getPagesFallback = () => {
      const fallback = getPages(this.baseURL.href, [getRaw('pagesFallback')])[0];
      const { name, src, loader, tag } = fallback;
      const result = { name, src, loader, tag };
      Object.keys(result).forEach(key => result[key] === undefined && delete result[key]);
      return result;
    };
    const getLogLevel = () => {
      const logLevel = getRaw('logLevel');
      return Object.values(LOG_LEVEL).includes(logLevel) ? logLevel : defaultConfig.logLevel;
    };
    /**
     * @deprecated
     */
    const getEnableTranslations = () => {
      const enableTranslations = getRaw('enableTranslations');
      if (typeof enableTranslations === 'boolean') {
        console.warn('"enableTranslations" is deprecated in webcardinal.json, replace with "translations"!');
      }
      return getRaw('enableTranslations') === true;
    };
    const getTranslations = () => getRaw('translations') === true;
    /**
     * @deprecated
     */
    const getSkins = () => {
      let skins = getRaw('skins');
      if (skins) {
        console.warn([
          `"skins" is deprecated in webcardinal.json, replace with "skin"!`,
          `Only the preferred / active skin must be set via "skin" keyword, otherwise the "default" is set`,
          `example: "skin": "advanced"`,
        ].join('\n'));
      }
    };
    getSkins();
    const getSkin = () => {
      const skin = getRaw('skin');
      if (typeof skin !== 'string' || skin.length === 0) {
        console.warn('Type of "skin" must be a non-empty string!');
        return 'default';
      }
      return skin;
    };
    const translations = getTranslations() || getEnableTranslations();
    const skin = getSkin();
    const config = {
      identity: getIdentity(),
      routing: {
        baseURL: getBaseURL(),
        pages: getPages(),
        pagesFallback: getPagesFallback(),
      },
      logLevel: getLogLevel(),
      docsSource: getRaw('docsSource'),
      theme: getRaw('theme'),
      version: getRaw('version'),
      coreType: 'webcardinal',
      translations,
      skin,
    };
    return config;
  }
  _provideConfiguration(key, callback) {
    if (typeof key === 'function' && typeof callback === 'undefined') {
      callback = key;
      key = undefined;
    }
    if (typeof callback !== 'function') {
      return;
    }
    if (typeof key === 'undefined') {
      return callback(undefined, this.config);
    }
    if (!this.config.hasOwnProperty(key)) {
      return callback(`Config "${key}" does not exists!`);
    }
    return callback(undefined, this.config[key]);
  }
  _registerListener(key) {
    return event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      let callback;
      if (typeof event.detail === 'function') {
        callback = event.detail;
      }
      else if (event.detail && typeof event.detail.callback === 'function') {
        callback = event.detail.callback;
      }
      else {
        return;
      }
      if (this.isConfigLoaded) {
        return this._provideConfiguration(key, callback);
      }
      else {
        this.pendingRequests.push({ configKey: key, callback });
      }
    };
  }
  async process(preloadPath) {
    const [error, rawConfig] = await this._readConfiguration();
    if (error) {
      console.error(error);
      return;
    }
    this.config = this._prepareConfiguration(rawConfig);
    window.WebCardinal = {
      controllers,
      hooks: this.injectedHooks,
      preload: getPreloadAPI.bind(this)(),
      components: Object.assign(Object.assign({}, getCustomElementsAPI()), { tags: getCustomElementsTagNames() }),
    };
    await applyPreloadMiddleware.bind(this)(preloadPath);
    console.log('[WebCardinal] Config:', this.config);
    this.isConfigLoaded = true;
    window.WebCardinal = Object.assign(Object.assign({}, window.WebCardinal), { basePath: this.basePath, controllers: Object.assign(Object.assign({}, this.injectedControllers), controllers), dataSources, state: {
        translations: this.config.translations,
        skin: this.config.skin,
      } });
    if (window.localStorage) {
      const savedSkin = localStorage.getItem('webcardinal.skin');
      if (savedSkin) {
        window.WebCardinal.state.skin = savedSkin;
      }
      const savedTranslations = localStorage.getItem('webcardinal.translations');
      if (savedTranslations) {
        window.WebCardinal.state.translations = savedTranslations === 'true';
      }
    }
    await applySkinCSS.bind(this)();
    while (this.pendingRequests.length) {
      const request = this.pendingRequests.pop();
      this._provideConfiguration(request.configKey, request.callback);
    }
  }
}

function subscribeToErrors() {
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const string = typeof msg === 'string' ? msg.toLowerCase() : '';
    const substring = 'script error';
    let appError;
    if (string.indexOf(substring) > -1) {
      appError = {
        message: 'script error',
        isScriptError: true,
      };
    }
    else {
      appError = {
        message: typeof msg === 'string' ? msg : JSON.stringify(msg),
        url,
        lineNo,
        columnNo,
        error,
      };
    }
    window.dispatchEvent(new CustomEvent('webcAppError', { detail: appError }));
    return false;
  };
  const originalError = console.error;
  console.error = function (...args) {
    const appError = {
      message: args[0],
      isScriptError: true
    };
    window.dispatchEvent(new CustomEvent('webcAppError', { detail: appError }));
    return originalError.apply(console, args);
  };
}
function subscribeToWarnings() {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    window.dispatchEvent(new CustomEvent('webcAppWarning', {
      detail: {},
    }));
    return originalWarn.apply(console, args);
  };
}
function subscribeToLogs(logLevel) {
  const { ERROR, WARN } = LOG_LEVEL;
  switch (logLevel) {
    case ERROR: {
      subscribeToErrors();
      return;
    }
    case WARN: {
      subscribeToErrors();
      subscribeToWarnings();
      return;
    }
  }
}

const defaultWebcAppRootCss = ":host{display:block;width:100%;height:100%}:host([layout=vertical]){display:grid;grid-template-columns:auto 1fr}:host([layout=mobile]),:host([layout=horizontal]){display:grid;grid-template-rows:auto 1fr}";

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const WebcAppRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getLogLevelEvent = createEvent(this, "webcardinal:config:getLogLevel", 7);
    /**
     * Component tag name for a UI loader.
     */
    this.loader = 'webc-spinner';
    /**
     * It decides if the header is disabled or not.
     */
    this.disableHeader = false;
    /**
     * It decides if the spinner of application should be automatically hidden
     */
    this.disableLoaderHiding = false;
    this.callHook = async (type) => {
      if (!window.WebCardinal.hooks) {
        return;
      }
      const hooks = window.WebCardinal.hooks;
      if (typeof hooks[type] === 'function') {
        await hooks[type]();
      }
    };
  }
  disableHeaderHandler(isDisabled) {
    const menu = this.host.querySelector('webc-app-menu');
    if (isDisabled) {
      if (menu) {
        menu.remove();
        this.host.style.setProperty(CP_WEBC_APP_ROOT_MODE, ` none`);
        this.host.setAttribute('layout', 'container');
        this.menuRef = menu;
        return;
      }
    }
    else if (this.menuRef) {
      this.host.style.setProperty(CP_WEBC_APP_ROOT_MODE, ` ${this.menuRef.mode}`);
      this.host.setAttribute('layout', this.menuRef.mode);
      this.host.prepend(this.menuRef);
    }
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    if (this.host.parentElement && this.loader) {
      this._loaderElement = document.createElement(this.loader);
      this.host.parentElement.appendChild(this._loaderElement);
    }
    const controller = new ApplicationController(this.host);
    await controller.process(this.preload);
    window.WebCardinal.root = this.host;
    window.WebCardinal.loader = this._loaderElement;
    if (this.host.children.length !== 0) {
      await this.registerAppErrorComponentAndListeners();
      return;
    }
    await this.renderDefault();
  }
  async componentDidLoad() {
    if (this._loaderElement) {
      if (!this.disableLoaderHiding) {
        this._loaderElement.hidden = true;
      }
    }
    await this.callHook(HOOK_TYPE.AFTER_APP);
  }
  renderOnlyContainer() {
    this.host.setAttribute('layout', 'container');
    this.host.append(document.createElement('webc-app-container'));
  }
  async renderDefault() {
    const computedStyles = window.getComputedStyle(this.host);
    const initialMode = computedStyles.getPropertyValue(CP_WEBC_APP_ROOT_MODE).trim().toLowerCase();
    await this.registerAppErrorComponentAndListeners();
    if (this.disableHeader) {
      this.renderOnlyContainer();
      return;
    }
    switch (initialMode) {
      case 'vertical':
      case 'mobile':
      case 'horizontal': {
        const breakpoint = computedStyles.getPropertyValue(CP_WEBC_APP_ROOT_MOBILE_BREAKPOINT).trim();
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint})`);
        const mode = initialMode;
        const mobileMode = 'mobile';
        const elements = {
          menu: Object.assign(document.createElement('webc-app-menu'), {
            mode: initialMode,
          }),
          container: document.createElement('webc-app-container'),
        };
        const mobileElements = {
          menu: Object.assign(document.createElement('webc-app-menu'), {
            mode: mobileMode,
          }),
        };
        if (mediaQuery.matches) {
          this.host.setAttribute('layout', mobileMode);
          this.host.append(mobileElements.menu, elements.container);
        }
        else {
          this.host.setAttribute('layout', mode);
          this.host.append(elements.menu, elements.container);
        }
        if (mode !== mobileMode) {
          mediaQuery.addEventListener('change', e => {
            if (e.matches) {
              this.menuRef = mobileElements.menu;
              if (!this.disableHeader) {
                this.host.style.setProperty(CP_WEBC_APP_ROOT_MODE, ` ${mobileMode}`);
                this.host.setAttribute('layout', mobileMode);
                elements.menu.remove();
                this.host.insertBefore(mobileElements.menu, elements.container);
              }
            }
            else {
              this.menuRef = elements.menu;
              if (!this.disableHeader) {
                this.host.style.setProperty(CP_WEBC_APP_ROOT_MODE, ` ${initialMode}`);
                this.host.setAttribute('layout', initialMode);
                mobileElements.menu.remove();
                this.host.insertBefore(elements.menu, elements.container);
              }
            }
          });
        }
        break;
      }
      case 'none':
      default: {
        this.renderOnlyContainer();
        break;
      }
    }
  }
  async registerAppErrorComponentAndListeners() {
    this.host.appendChild(document.createElement('webc-app-error-toast'));
    try {
      const logLevel = await promisifyEventEmit(this.getLogLevelEvent);
      subscribeToLogs(logLevel);
    }
    catch (error) {
      console.error(error);
    }
  }
  render() {
    return h("slot", null);
  }
  static get watchers() { return {
    "disableHeader": ["disableHeaderHandler"]
  }; }
};
__decorate([
  HostElement()
], WebcAppRoot.prototype, "host", void 0);
injectHistory(WebcAppRoot);
WebcAppRoot.style = {
  default: defaultWebcAppRootCss
};

export { WebcAppRoot as webc_app_root };
