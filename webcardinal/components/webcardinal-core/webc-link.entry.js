import { r as registerInstance, e as createEvent, h } from './index-30eb7fef.js';
import { ae as promisifyEventEmit } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';

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
const WebcLink = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getTagsEvent = createEvent(this, "webcardinal:tags:get", 7);
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    // navigate by tag
    if (!this.href) {
      try {
        this.href = await promisifyEventEmit(this.getTagsEvent, {
          tag: this.tag,
        });
        this.content = (h("stencil-route-link", { url: this.href }, h("slot", null)));
        return;
      }
      catch (error) {
        console.error(error);
        return;
      }
    }
    try {
      let hrefURL;
      if (this.href.startsWith('/')) {
        hrefURL = new URL(this.href, window.location.href);
      }
      else {
        hrefURL = new URL(this.href);
      }
      if (window.location.origin === hrefURL.origin) {
        this.href = hrefURL.pathname;
        this.content = (h("stencil-route-link", { url: this.href }, h("slot", null)));
      }
      else {
        this.content = (h("a", { href: this.href }, h("slot", null)));
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  render() {
    return this.content;
  }
};
__decorate([
  HostElement()
], WebcLink.prototype, "host", void 0);

export { WebcLink as webc_link };
