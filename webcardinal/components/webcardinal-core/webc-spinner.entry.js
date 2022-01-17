import { r as registerInstance, h } from './index-30eb7fef.js';
import { H as HostElement } from './index-482a933e.js';

const defaultWebcSpinnerCss = "webc-spinner{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:all;display:flex;justify-content:center;align-items:center;z-index:var(--z-index)}webc-spinner>.circle-fade{position:relative;width:var(--width);height:var(--height);border:var(--border);border-radius:var(--radius);background:var(--background);box-shadow:var(--box-shadow)}webc-spinner>.circle-fade>.circle{position:absolute;top:0;left:0;width:100%;height:100%}webc-spinner>.circle-fade>.circle::after{content:\"\";display:block;margin:0.15em auto;width:var(--dot-size);height:var(--dot-size);background-color:var(--color);border-radius:var(--dot-radius);animation:var(--animation)}webc-spinner>.circle-fade .circle-1{transform:rotate(-40deg)}webc-spinner>.circle-fade .circle-1::after{animation-delay:calc(-0.1 * var(--animation-delay))}webc-spinner>.circle-fade .circle-2{transform:rotate(-80deg)}webc-spinner>.circle-fade .circle-2::after{animation-delay:calc(-0.2 * var(--animation-delay))}webc-spinner>.circle-fade .circle-3{transform:rotate(-120deg)}webc-spinner>.circle-fade .circle-3::after{animation-delay:calc(-0.3 * var(--animation-delay))}webc-spinner>.circle-fade .circle-4{transform:rotate(-160deg)}webc-spinner>.circle-fade .circle-4::after{animation-delay:calc(-0.4 * var(--animation-delay))}webc-spinner>.circle-fade .circle-5{transform:rotate(-200deg)}webc-spinner>.circle-fade .circle-5::after{animation-delay:calc(-0.5 * var(--animation-delay))}webc-spinner>.circle-fade .circle-6{transform:rotate(-240deg)}webc-spinner>.circle-fade .circle-6::after{animation-delay:calc(-0.6 * var(--animation-delay))}webc-spinner>.circle-fade .circle-7{transform:rotate(-280deg)}webc-spinner>.circle-fade .circle-7::after{animation-delay:calc(-0.7 * var(--animation-delay))}webc-spinner>.circle-fade .circle-8{transform:rotate(-320deg)}webc-spinner>.circle-fade .circle-8::after{animation-delay:calc(-0.8 * var(--animation-delay))}webc-spinner>.circle-fade .circle-9{transform:rotate(-360deg)}webc-spinner>.circle-fade .circle-9::after{animation-delay:calc(-0.9 * var(--animation-delay))}@keyframes spinner-default-animation{0%,39%,100%{opacity:0}40%{opacity:1}}[hidden]{display:none !important}";

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
const WebcSpinner = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    this.host.innerHTML = '';
    return (h("div", { class: "circle-fade" }, [...Array(9).keys()].map(index => (h("div", { class: `circle circle-${index}` })))));
  }
};
__decorate([
  HostElement()
], WebcSpinner.prototype, "host", void 0);
WebcSpinner.style = {
  default: defaultWebcSpinnerCss
};

export { WebcSpinner as webc_spinner };
