import { r as registerInstance, h } from './index-60428ce4.js';
import { H as HostElement } from './index-b92a2e6e.js';

const defaultWebcAppContainerCss = "webc-app-container{width:100%;height:100%;display:grid;grid-template-columns:1fr;grid-template-rows:1fr;gap:var(--gap);overflow-y:auto;background:var(--background)}webc-app-container .container{max-width:100%;padding:0}webc-app-container.slot-before{grid-template-rows:auto 1fr}webc-app-container.slot-after{grid-template-rows:1fr auto}webc-app-container.slot-before.slot-after{grid-template-rows:auto 1fr auto}";

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
const WebcAppContainer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.slots = {
      before: false,
      after: false,
      unnamed: false,
    };
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    // manage slots
    this.slots.unnamed = this.host.children.length > 0;
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
  render() {
    return [
      this.slots.before ? (h("div", { class: "container before" }, h("slot", { name: "before" }))) : null,
      h("div", { class: "container app-container" }, this.slots.unnamed ? h("slot", null) : h("webc-app-router", null)),
      this.slots.after ? (h("div", { class: "container after" }, h("slot", { name: "after" }))) : null,
    ];
  }
};
__decorate([
  HostElement()
], WebcAppContainer.prototype, "host", void 0);
WebcAppContainer.style = {
  default: defaultWebcAppContainerCss
};

export { WebcAppContainer as webc_app_container };
