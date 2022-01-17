import { r as registerInstance, h } from './index-30eb7fef.js';
import './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';
import { S as StylingService } from './index-8a818fc7.js';

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
const WebcSkin = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  async componentDidLoad() {
    if (!this.host.parentElement) {
      return;
    }
    let isValid = false;
    this.stylingService = new StylingService(this.host.parentElement, this.host);
    if (this.href) {
      await this.stylingService.applyFromHref(this.href);
      isValid = true;
    }
    // let styleElement = this.host.querySelector('style');
    // if (styleElement) {
    //   await this.stylingService.applyFromStyleText(styleElement.innerText);
    //   isValid = true;
    // }
    if (!isValid) {
      console.warn(`${this.host.tagName.toLowerCase()} is not used properly\n`, `You must set attribute "href"!\n`, `target element:`, this.host);
    }
  }
  render() {
    return h("slot", null);
  }
};
__decorate([
  HostElement()
], WebcSkin.prototype, "host", void 0);

export { WebcSkin as webc_skin };
