import { r as registerInstance, e as createEvent, h } from './index-30eb7fef.js';
import './mode-53878029.js';
import { ak as URLHelper, P as PAGES_PATH, z as HOOK_TYPE, ae as promisifyEventEmit } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';
import { C as ComponentsListenerService } from './index-8a818fc7.js';
import './index.esm.js';
import { p as proxifyModelProperty } from './Controller-d54a5fef.js';

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
const { join, trimEnd } = URLHelper;
function isSSAppContext() {
  return (window.$$ && window.$$.SSAPP_CONTEXT && window.$$.SSAPP_CONTEXT.BASE_URL
  // && window.$$.SSAPP_CONTEXT.SEED
  // It is not always received
  );
}
const WebcAppRouter = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getRoutingConfigEvent = createEvent(this, "webcardinal:config:getRouting", 7);
    this.landingPage = null;
    /**
     * This Array is received from <code>ApplicationController</code>.
     */
    this.routes = [];
    /**
     * There is the possibility to change the base path of your application, using <code>base</code> HTML Element:
     * <psk-example>
     *   <psk-code>
     *    <base href="/my-custom-base/sub-path/">
     *   </psk-code>
     * </psk-example>
     *
     * Both <code>webc-app-router</code> and <code>webc-app-menu</code> must share the same <code>basePath</code>.
     */
    this.basePath = '';
    this.tags = {};
    this.content = [];
    this.mapping = {};
    this._renderRoute = ({ path, src, loader, skin, tag }) => {
      const props = {
        url: join(this.basePath, path).pathname,
        exact: true,
        component: 'webc-app-loader',
        componentProps: { src, loader, skin, basePath: this.basePath, saveState: true },
      };
      if (tag) {
        props.componentProps.tag = tag;
      }
      // fix regarding WebCardinal in a non-updated location context of an iframe
      if (props.url === '/' && isSSAppContext()) {
        const propsClone = Object.assign(Object.assign({}, props), { url: window.location.pathname, componentProps: { url: '/' } });
        propsClone.component = 'webc-app-redirect';
        this.content.push(h("stencil-route", Object.assign({ "data-path": propsClone.url, "data-redirect": "" }, propsClone)));
      }
      return h("stencil-route", Object.assign({ "data-path": props.url, "data-src": src }, props));
    };
    this._renderRoutes = (routes = [], { path, src } = { path: '', src: '' }, routeRenderer = this._renderRoute) => {
      if (!Array.isArray(routes) || routes.length === 0)
        return null;
      return routes.map(route => {
        const payload = {
          path: join('', path, route.path).pathname,
          src: join('', src, route.src).pathname,
          skin: 'none',
        };
        if (route.children) {
          return this._renderRoutes(route.children, payload);
        }
        else {
          if (payload.path === '')
            payload.path = '/';
          if (route.src.startsWith('http')) {
            payload.src = route.src;
          }
          else {
            payload.src = '.' + join(PAGES_PATH, payload.src).pathname;
          }
          const joinedPath = join(this.basePath, payload.path).pathname;
          this.mapping[joinedPath] = payload.src.replace(this.pagesPathRegExp, '');
          if (route.tag) {
            this.tags[route.tag] = payload.path;
            payload.tag = route.tag;
          }
          if (route.loader) {
            payload.loader = route.loader;
          }
          return routeRenderer(payload);
        }
      });
    };
    this._renderFallback = fallback => {
      if (!fallback || !fallback.src)
        return null;
      const src = '.' + join(PAGES_PATH, fallback.src).pathname;
      const loader = fallback.loader || 'default';
      const props = {
        component: 'webc-app-loader',
        componentProps: {
          src,
          loader,
          skin: 'none',
          basePath: this.basePath,
          saveState: true,
          isFallbackPage: true,
        },
      };
      if (fallback.tag) {
        this.tags[fallback.tag] = '#';
        props.componentProps.tag = fallback.tag;
      }
      return h("stencil-route", Object.assign({ "data-src": src }, props));
    };
    this.manageLandingPage = () => {
      // fix regarding WebCardinal in a non-updated location context of an psk-ssapp
      if (window && window.frameElement && window.frameElement.hasAttribute('landing-page')) {
        this.landingPage = window.frameElement.getAttribute('landing-page');
      }
      if (this.landingPage) {
        if (isSSAppContext()) {
          // if we have a BASE_URL then we prefix the redirectPath url with BASE_URL
          const baseUrlPathname = new URL(window.$$.SSAPP_CONTEXT.BASE_URL).pathname;
          this.landingPage = `${baseUrlPathname}${this.landingPage.indexOf('/') === 0 ? this.landingPage.substring(1) : this.landingPage}`;
        }
        const props = {
          url: window.location.pathname,
          exact: true,
          component: 'webc-app-redirect',
          componentProps: { url: this.landingPage },
        };
        this.content.push(h("stencil-route", Object.assign({ "data-path": props.url, "data-redirect": "" }, props)));
      }
    };
  }
  manageHooks() {
    if (!window.WebCardinal.hooks) {
      return;
    }
    const hooks = window.WebCardinal.hooks;
    for (const type of [HOOK_TYPE.BEFORE_PAGE, HOOK_TYPE.AFTER_PAGE]) {
      for (const tag of Object.keys(hooks[type] || [])) {
        if (!this.tags[tag]) {
          console.warn([
            `"addHook(tag: string, when: whenType, hook: Function)": tag "${tag}" does not belong to any page`,
            `The hook can not be called for any page, the hook is removed!`,
          ].join('\n'));
          delete hooks[tag];
        }
      }
    }
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    try {
      const routing = await promisifyEventEmit(this.getRoutingConfigEvent);
      this.routes = routing.pages;
      this.fallbackPage = routing.pagesFallback;
      this.basePath = trimEnd(new URL(routing.baseURL).pathname);
      this.pagesPathRegExp = new RegExp(`^(${PAGES_PATH.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\)`);
      this.manageLandingPage();
      this.content.push(this._renderRoutes(this.routes), this._renderFallback(this.fallbackPage));
      this.manageHooks();
      this.listeners = new ComponentsListenerService(this.host, {
        tags: this.tags,
        routing: { basePath: this.basePath, mapping: this.mapping },
        model: proxifyModelProperty({}),
        translationModel: proxifyModelProperty({}),
        chain: '',
      });
      const { getModel, getTranslationModel, getTags, getRouting, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.add();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.add();
      getTags === null || getTags === void 0 ? void 0 : getTags.add();
      getRouting === null || getRouting === void 0 ? void 0 : getRouting.add();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.add();
    }
    catch (error) {
      console.error(error);
    }
  }
  async connectedCallback() {
    if (this.listeners) {
      const { getModel, getTranslationModel, getTags, getRouting, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.add();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.add();
      getTags === null || getTags === void 0 ? void 0 : getTags.add();
      getRouting === null || getRouting === void 0 ? void 0 : getRouting.add();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.add();
    }
  }
  async disconnectedCallback() {
    if (this.listeners) {
      const { getModel, getTranslationModel, getTags, getRouting, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.remove();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.remove();
      getTags === null || getTags === void 0 ? void 0 : getTags.remove();
      getRouting === null || getRouting === void 0 ? void 0 : getRouting.remove();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.remove();
    }
  }
  render() {
    return (h("stencil-router", { root: '/' }, h("stencil-route-switch", { scrollTopOffset: 0 }, this.content)));
  }
};
__decorate([
  HostElement()
], WebcAppRouter.prototype, "host", void 0);

export { WebcAppRouter as webc_app_router };
