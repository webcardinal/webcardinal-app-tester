import { r as registerInstance, e as createEvent, h, f as Host } from './index-30eb7fef.js';
import { H as HYDRATED, ak as URLHelper, z as HOOK_TYPE, aj as resolveRoutingState, S as SKINS_PATH, ap as getSkinFromState, ao as getTranslationsFromState } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';
import { b as ControllerTranslationService } from './index-8a818fc7.js';
import './active-router-f2d7708e.js';
import { i as injectHistory } from './index-e618c187.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';

async function checkPageExistence(pageSrc) {
  try {
    // method 'head' is not supported by APIHUB
    const response = await fetch(pageSrc, { method: 'get' });
    return response.ok === true;
  }
  catch (error) {
    console.log(`Error while checking a page from ${pageSrc}`, error);
    return false;
  }
}
async function loadPageContent(pageSrc) {
  try {
    const response = await fetch(pageSrc);
    const content = await response.text();
    if (!response.ok) {
      throw new Error(content);
    }
    return content;
  }
  catch (error) {
    console.log(`Error while loading a page from ${pageSrc}`, error);
    return null;
  }
}
function emitCompleteEventForSSAPP() {
  if (!window.frameElement) {
    return;
  }
  const iframeIdentity = window.frameElement.getAttribute('identity');
  const isHydrated = window.frameElement.classList.contains(HYDRATED);
  if (iframeIdentity && !isHydrated) {
    window.frameElement.classList.add(HYDRATED);
    window.parent.document.dispatchEvent(new CustomEvent(iframeIdentity, {
      detail: { status: 'completed' }
    }));
  }
}

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
const { join } = URLHelper;
const WebcAppLoader = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getRoutingStateEvent = createEvent(this, "webcardinal:routing:get", 7);
    this.content = '';
    this.watchSkin = false;
    this.hooks = {};
    /**
     * Source path is prefixed with this path.
     */
    this.basePath = '/';
    /**
     * Fetch a HTML file and loads inside as normal children or in a wrapper.
     */
    this.loader = 'default';
    /**
     * If a skin is set for this page, this property will be set according to <code>webcardinal.json</code>.
     */
    this.skin = 'default';
    /**
     * If this property is set, WebCardinal.state.page will be saved for current page session.
     */
    this.saveState = false;
    /**
     * A webc-app-loader for a page or for a fallback page
     * This information is required for translations
     */
    this.isFallbackPage = false;
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    await this.activateHooks();
    window.WebCardinal.history = this.history;
    const initialLocation = this.history.location.pathname;
    await this.callHook(HOOK_TYPE.BEFORE_PAGE);
    if (window.WebCardinal.state.skin !== this.skin) {
      this.skin = window.WebCardinal.state.skin;
    }
    const finalLocation = this.history.location.pathname;
    if (initialLocation !== finalLocation) {
      this.loader = 'none';
      return;
    }
    await this.setSkinContext();
    this.watchSkin = true;
    this.routingState = await resolveRoutingState(this);
    await this.setTranslationsContext();
    await this.setPageContent();
    this.setWebCardinalState();
  }
  async componentDidLoad() {
    emitCompleteEventForSSAPP();
    await this.callHook(HOOK_TYPE.AFTER_PAGE);
  }
  async disconnectedCallback() {
    await this.callHook(HOOK_TYPE.CLOSED_PAGE);
  }
  async skinHandle() {
    if (!this.watchSkin) {
      return;
    }
    this.content = '';
    await this.setSkinContext();
    await this.setTranslationsContext();
    await this.setPageContent();
    this.setWebCardinalState();
  }
  async activateHooks() {
    var _a;
    if (!window.WebCardinal.hooks) {
      return;
    }
    this.hooks = {};
    const { hooks } = window.WebCardinal;
    for (const type of [HOOK_TYPE.BEFORE_PAGE, HOOK_TYPE.AFTER_PAGE, HOOK_TYPE.CLOSED_PAGE]) {
      if ((_a = hooks[type]) === null || _a === void 0 ? void 0 : _a[this.tag]) {
        this.hooks[type] = hooks[type][this.tag];
      }
    }
  }
  async setSkinContext() {
    if (this.src.startsWith('http')) {
      this.activeSrc = this.src;
      return;
    }
    // if a skin is set by the webc-app-router via webcardinal.json for a specific page
    if (this.skin !== 'none') {
      if (this.skin !== 'default') {
        const src = join(this.basePath, SKINS_PATH, this.skin, this.src).pathname;
        if (await checkPageExistence(src)) {
          this.activeSrc = src;
          return;
        }
      }
      this.activeSrc = join(this.basePath, this.src).pathname;
      return;
    }
    // otherwise a preferred skin is loaded
    const preferredSkin = getSkinFromState();
    if (preferredSkin !== 'default') {
      const src = join(this.basePath, SKINS_PATH, preferredSkin, this.src).pathname;
      if (await checkPageExistence(src)) {
        this.activeSrc = src;
        return;
      }
    }
    // otherwise the fallback is "default" skin
    this.activeSrc = join(this.basePath, this.src).pathname;
    return;
  }
  async setPageContent() {
    const src = this.activeSrc;
    const content = await loadPageContent(src);
    if (!content) {
      this.content = `
        <section style="padding: 1rem">
            <h4>Page from <code>${src}</code> could not be loaded!</h4>
            <h5>Current skin is <code>${this.skin}</code></h5>
        </section>
      `;
      return;
    }
    this.content = content;
  }
  async setTranslationsContext() {
    if (getTranslationsFromState()) {
      if (this.isFallbackPage) {
        await ControllerTranslationService.loadAndSetTranslationsForPage(this.routingState, this.src);
        return;
      }
      await ControllerTranslationService.loadAndSetTranslationsForPage(this.routingState);
    }
  }
  setWebCardinalState() {
    if (this.saveState) {
      window.WebCardinal.state.skin = this.skin;
      window.WebCardinal.state.page = { loader: this.host, src: this.activeSrc };
      if (this.tag) {
        window.WebCardinal.state.page.tag = this.tag;
      }
    }
  }
  async callHook(type) {
    if (typeof this.hooks[type] === 'function') {
      await this.hooks[type]();
    }
  }
  render() {
    switch (this.loader) {
      case 'parser': {
        const parser = new DOMParser();
        this.host.append(parser.parseFromString(this.content, 'text/html'));
        const attributes = { style: { width: '100%', height: '100%' } };
        return (h(Host, Object.assign({}, attributes), h("slot", null)));
      }
      case 'iframe': {
        const attributes = {
          frameBorder: 0,
          srcDoc: this.content,
          sandbox: 'allow-scripts',
          style: {
            display: 'block',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          },
        };
        return h("iframe", Object.assign({}, attributes));
      }
      case 'object': {
        const attributes = {
          data: this.activeSrc,
          type: 'text/html',
          style: {
            display: 'block',
            width: '100%',
            height: '100%',
          },
        };
        return h("object", Object.assign({}, attributes));
      }
      case 'none':
        return '';
      default: {
        const attributes = { style: { width: '100%', height: '100%' } };
        this.host.innerHTML = this.content;
        return (h(Host, Object.assign({}, attributes), h("slot", null)));
      }
    }
  }
  static get watchers() { return {
    "skin": ["skinHandle"]
  }; }
};
__decorate([
  HostElement()
], WebcAppLoader.prototype, "host", void 0);
injectHistory(WebcAppLoader);

export { WebcAppLoader as webc_app_loader };
