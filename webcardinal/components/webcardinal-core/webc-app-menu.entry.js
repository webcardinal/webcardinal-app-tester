import { r as registerInstance, e as createEvent, h } from './index-30eb7fef.js';
import { ak as URLHelper, ae as promisifyEventEmit, a8 as convertCSSTimeToMs } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';
import './active-router-f2d7708e.js';
import { i as injectHistory } from './index-e618c187.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';

const webcAppMenuHorizontalCss = "webc-app-menu{display:grid;z-index:var(--z-index)}webc-app-menu .container{max-width:100%;padding:0}webc-app-menu webc-app-menu-item{display:flex}webc-app-menu webc-app-menu-item .item{cursor:pointer}webc-app-menu webc-app-menu-item .item,webc-app-menu webc-app-menu-item .item a{text-decoration:none}webc-app-menu[mode=horizontal]{grid-template-columns:1fr;grid-template-rows:1fr;gap:var(--gap);position:sticky;top:0;left:0;right:0;color:var(--color);height:var(--height);background:var(--background);padding:var(--padding);box-shadow:var(--box-shadow)}webc-app-menu[mode=horizontal].slot-before{grid-template-columns:auto 1fr}webc-app-menu[mode=horizontal].slot-after{grid-template-columns:1fr auto}webc-app-menu[mode=horizontal].slot-before.slot-after{grid-template-columns:auto 1fr auto}webc-app-menu[mode=horizontal] .content{display:flex;align-items:center}webc-app-menu[mode=horizontal] .app-menu{display:flex;gap:var(--gap);justify-content:flex-end;width:100%}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item,webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item a{color:var(--color)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item>.dropdown>.items{display:none;margin:var(--dropdown-margin)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item>.dropdown>.items .item{padding:var(--dropdown-items-padding)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item>.dropdown>.items .item,webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item>.dropdown>.items .item>a{color:var(--dropdown-color)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item>.dropdown[active]>.items{display:grid}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]{position:relative}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.item,webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown>.item{display:flex;align-items:center;height:100%}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown>.item{margin-right:var(--triangle-size);padding-right:calc(3 * var(--triangle-size))}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown>.item:after{position:absolute;left:100%;top:50%;margin-top:calc(-0.5 * var(--triangle-size));margin-left:calc(-2 * var(--triangle-size));content:\"\";display:block;border-left:var(--triangle-size) solid transparent;border-right:var(--triangle-size) solid transparent;border-top:var(--triangle-size) solid var(--color)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown>.items{position:absolute;top:100%;left:0;margin-left:0;padding:var(--dropdown-padding);background:var(--dropdown-background);width:var(--dropdown-width);border-radius:var(--dropdown-radius);box-shadow:var(--dropdown-box-shadow)}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown[active]>.item{font-weight:bold}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown[active]>.items{display:none}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[level=\"0\"]>.dropdown:hover>.items{display:grid}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item[active]{font-weight:bold}webc-app-menu[mode=horizontal] .app-menu webc-app-menu-item:last-child[level=\"0\"] .dropdown>.items{left:initial;right:0}";

const webcAppMenuMobileCss = "webc-app-menu{display:grid;z-index:var(--z-index)}webc-app-menu .container{max-width:100%;padding:0}webc-app-menu webc-app-menu-item{display:flex}webc-app-menu webc-app-menu-item .item{cursor:pointer}webc-app-menu webc-app-menu-item .item,webc-app-menu webc-app-menu-item .item a{text-decoration:none}webc-app-menu[mode=mobile]{grid-template-columns:1fr;grid-template-rows:1fr;gap:var(--gap);position:sticky;top:0;left:0;right:0;color:var(--color);height:var(--height);background:var(--background);padding:var(--padding);box-shadow:var(--box-shadow)}webc-app-menu[mode=mobile].slot-before{grid-template-columns:auto 1fr}webc-app-menu[mode=mobile].slot-after{grid-template-columns:1fr auto}webc-app-menu[mode=mobile].slot-before.slot-after{grid-template-columns:auto 1fr auto}webc-app-menu[mode=mobile] header{display:flex;justify-content:space-between;align-items:center;background:transparent}webc-app-menu[mode=mobile] header .app-menu-toggle .burger{position:relative;background:transparent;border:0.5rem solid transparent;width:2.5rem;height:2rem}webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line,webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line:before,webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line:after{position:absolute;content:\"\";left:0;right:0;height:2px;overflow:hidden;margin-top:-1px;border-radius:2px;background:var(--burger-color);transition:all var(--burger-transition-duration) ease-in-out}webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line{top:50%}webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line:first-child{top:0}webc-app-menu[mode=mobile] header .app-menu-toggle .burger .line:last-child{top:100%}webc-app-menu[mode=mobile] .app-menu-backdrop{display:none;position:fixed;left:0;top:var(--height);right:0;bottom:0;z-index:calc(var(--z-index) - 1)}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{display:grid;gap:var(--gap);overflow-y:auto;width:100%;height:100%;padding:1rem;align-content:start}@media screen and (min-width: 320px){webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{grid-template-columns:repeat(1, 1fr)}}@media screen and (min-width: 640px){webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{grid-template-columns:repeat(2, 1fr)}}@media screen and (min-width: 960px){webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{grid-template-columns:repeat(3, 1fr)}}@media screen and (min-width: 1280px){webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{grid-template-columns:repeat(4, 1fr)}}@media screen and (min-width: 1600px){webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu{grid-template-columns:repeat(5, 1fr)}}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item,webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item a{color:var(--color)}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item>.dropdown>.items{display:none;margin:var(--dropdown-margin);row-gap:var(--dropdown-gap);padding:var(--dropdown-items-padding)}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item>.dropdown[active]>.items{display:grid}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item[level=\"0\"]{padding:var(--items-padding);border-bottom:1px solid var(--items-border-color)}webc-app-menu[mode=mobile] .app-menu-backdrop .app-menu webc-app-menu-item[active]{font-weight:bold}webc-app-menu[mode=mobile] .app-menu-backdrop:after{position:fixed;display:block;content:\"\";left:0;top:var(--height);right:0;bottom:0;background:var(--backdrop-background);backdrop-filter:var(--backdrop-filter);z-index:-1}webc-app-menu[mode=mobile] .app-menu-backdrop,webc-app-menu[mode=mobile] .app-menu-backdrop:after{opacity:0;pointer-events:none;transition:all var(--backdrop-transition-duration) ease-in-out}webc-app-menu[mode=mobile][active] .app-menu-backdrop{display:flex}webc-app-menu[mode=mobile][active][visible] .app-menu-backdrop,webc-app-menu[mode=mobile][active][visible] .app-menu-backdrop:after{opacity:1;pointer-events:all}webc-app-menu[mode=mobile][active][visible] .app-menu-toggle .burger .line:first-child,webc-app-menu[mode=mobile][active][visible] .app-menu-toggle .burger .line:last-child{top:50%}webc-app-menu[mode=mobile][active][visible] .app-menu-toggle .burger .line:first-child{transform:rotateZ(-45deg)}webc-app-menu[mode=mobile][active][visible] .app-menu-toggle .burger .line:nth-child(2){height:0}webc-app-menu[mode=mobile][active][visible] .app-menu-toggle .burger .line:last-child{transform:rotateZ(45deg)}";

const webcAppMenuVerticalCss = "webc-app-menu{display:grid;z-index:var(--z-index)}webc-app-menu .container{max-width:100%;padding:0}webc-app-menu webc-app-menu-item{display:flex}webc-app-menu webc-app-menu-item .item{cursor:pointer}webc-app-menu webc-app-menu-item .item,webc-app-menu webc-app-menu-item .item a{text-decoration:none}webc-app-menu[mode=vertical]{grid-template-columns:1fr;grid-template-rows:1fr;gap:var(--gap);overflow-y:auto;min-width:var(--min-width);max-width:var(--max-width);color:var(--color);background:var(--background, var(--webc-primary-background));padding:var(--padding)}webc-app-menu[mode=vertical]::-webkit-scrollbar{width:8px;height:8px}webc-app-menu[mode=vertical]::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb-background);border:var(--scrollbar-thumb-border);border-radius:0}webc-app-menu[mode=vertical]::-webkit-scrollbar-thumb:hover{background:var(--scrollbar-thumb-hover-background)}webc-app-menu[mode=vertical]::-webkit-scrollbar-track{background:var(--scrollbar-track-background);border-radius:0}webc-app-menu[mode=vertical].slot-before{grid-template-rows:auto 1fr}webc-app-menu[mode=vertical].slot-after{grid-template-rows:1fr auto}webc-app-menu[mode=vertical].slot-before.slot-after{grid-template-rows:auto 1fr auto}webc-app-menu[mode=vertical] .content{display:grid;row-gap:var(--gap);grid-template-rows:auto 1fr}webc-app-menu[mode=vertical] .app-menu{margin-top:1rem}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item>.dropdown>.items{display:none;margin:var(--dropdown-margin);row-gap:var(--dropdown-gap);padding:var(--dropdown-items-padding)}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item>.dropdown[active]>.items{display:grid}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item[level=\"0\"]{padding:var(--items-padding);border-top:1px solid var(--border-color)}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item[level=\"0\"]:last-child{border-bottom:1px solid var(--border-color)}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item[active]{font-weight:bold}webc-app-menu[mode=vertical] .app-menu webc-app-menu-item,webc-app-menu[mode=vertical] .app-menu webc-app-menu-item a{color:var(--color)}webc-app-menu[mode=vertical][disable-identity] .content{grid-template-rows:1fr}";

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
const { trimEnd } = URLHelper;
const WebcAppMenu = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getRoutingConfigEvent = createEvent(this, "webcardinal:config:getRouting", 7);
    /**
     * This Array is received from <code>ApplicationController</code>.
     */
    this.items = [];
    /**
     * There is the possibility to change the base path of your application, using <code>base</code> HTML Element:
     * <psk-example>
     *   <psk-code>
     *    <base href="/my-custom-base">
     *   </psk-code>
     * </psk-example>
     *
     * Both <code>webc-app-menu</code> and <code>webc-app-router</code> must share the same <code>basePath</code>.
     */
    this.basePath = '';
    /**
     * Decides if <code>webc-app-identity</code> is rendered.<br>
     * This property is set by Custom Variable <code>--disable-identity</code>.
     */
    this.disableIdentity = false;
    this.slots = {
      before: false,
      after: false,
    };
    this.modes = Object.keys(this._menu);
    this.defaultMode = this.modes[0];
    this.mode = this.defaultMode;
    this._extractItems = items => {
      const indexedItems = [];
      for (const item of items) {
        if (!item.indexed)
          continue;
        const indexedItem = {
          name: item.name,
          path: item.path,
        };
        if (item.children && item.children.length > 0) {
          indexedItem.children = this._extractItems(item.children);
        }
        indexedItems.push(indexedItem);
      }
      return indexedItems;
    };
    this._renderItem = item => {
      const props = {
        basePath: this.basePath,
        item: {
          path: item.path,
          children: item.children,
        },
        menuElement: this.host,
        mode: this.mode,
        name: item.name,
      };
      return h("webc-app-menu-item", Object.assign({}, props));
    };
  }
  _toggleActiveItem() {
    const selector = `webc-app-menu-item[url="${window.location.pathname}"]`;
    const item = this.host.querySelector(selector);
    if (item) {
      item.deactivate().then(item.activate());
    }
  }
  _renderItems(items = [], itemRenderer = this._renderItem) {
    if (!Array.isArray(items) || items.length === 0)
      return null;
    return items.map(item => itemRenderer(item));
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    // disable flag for webc-app-identity
    this.computedStyles = window.getComputedStyle(this.host);
    this.disableIdentity = this.computedStyles.getPropertyValue('--disable-identity').trim() === 'true';
    // get routing data
    if (this.items.length === 0) {
      try {
        const routing = await promisifyEventEmit(this.getRoutingConfigEvent);
        this.items = this._extractItems(routing.pages);
        this.basePath = trimEnd(new URL(routing.baseURL).pathname);
      }
      catch (error) {
        console.error(error);
      }
    }
    // manage modes
    if (!this.modes.includes(this.mode)) {
      console.warn(`You must use one of the following modes: ${this.modes.join(', ')}\n`, `target element:`, this.host);
      this.mode = this.defaultMode;
    }
    // manage slots
    for (const key of Object.keys(this.slots)) {
      if (this.host.querySelector(`[slot=${key}]`)) {
        this.slots[key] = true;
        this.host.classList.add(`slot-${key}`);
      }
      else {
        this.host.classList.remove(`slot-${key}`);
      }
    }
  }
  get _menu() {
    const renderMenu = () => {
      return [
        this.slots.before ? (h("div", { class: "container before" }, h("slot", { name: "before" }))) : null,
        h("div", { class: "container content" }, this.disableIdentity ? null : h("webc-app-identity", null), h("div", { class: "app-menu items" }, this._renderItems(this.items))),
        this.slots.after ? (h("div", { class: "container after" }, h("slot", { name: "after" }))) : null,
      ];
    };
    const renderMobileMenu = () => {
      const burgerClicked = () => {
        if (this.host.hasAttribute('active')) {
          this.host.removeAttribute('visible');
          setTimeout(() => {
            this.host.removeAttribute('active');
          }, convertCSSTimeToMs(this.computedStyles.getPropertyValue('--backdrop-transition-delay')) || 200);
        }
        else {
          this.host.setAttribute('active', '');
          setTimeout(() => {
            this.host.setAttribute('visible', '');
          }, 5);
        }
      };
      return [
        this.slots.before ? (h("div", { class: "container before" }, h("slot", { name: "before" }))) : null,
        h("header", null, this.disableIdentity ? null : h("webc-app-identity", null), h("div", { class: "app-menu-toggle" }, h("button", { class: "burger", onClick: burgerClicked.bind(this) }, h("span", { class: "line" }), h("span", { class: "line" }), h("span", { class: "line" })))),
        this.slots.after ? (h("div", { class: "container after" }, h("slot", { name: "after" }))) : null,
        h("div", { class: "app-menu-backdrop" }, h("aside", { class: "app-menu items" }, this._renderItems(this.items))),
      ];
    };
    return {
      vertical: renderMenu(),
      horizontal: renderMenu(),
      mobile: renderMobileMenu(),
    };
  }
  render() {
    if (!this.history)
      return null;
    this.history.listen(this._toggleActiveItem.bind(this));
    return this._menu[this.mode];
  }
};
__decorate([
  HostElement()
], WebcAppMenu.prototype, "host", void 0);
injectHistory(WebcAppMenu);
WebcAppMenu.style = {
  horizontal: webcAppMenuHorizontalCss,
  mobile: webcAppMenuMobileCss,
  vertical: webcAppMenuVerticalCss
};

export { WebcAppMenu as webc_app_menu };
