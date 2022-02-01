import { r as registerInstance } from './index-30eb7fef.js';
import { H as HostElement } from './index-482a933e.js';

const defaultWebcAppErrorToastCss = "webc-app-error-toast{pointer-events:none;position:fixed;right:0;bottom:0;width:var(--width);max-width:100vw;height:auto}webc-app-error-toast .webc-toast{pointer-events:auto;text-align:left;border-radius:var(--radius);margin:var(--margin);padding:var(--padding);z-index:var(--z-index);right:0;bottom:10px;max-height:var(--max-height);overflow-y:auto;animation:webc-app-error-toast-fadein 0.5s}webc-app-error-toast .webc-toast.closing{animation:webc-app-error-toast-fadeout 0.5s}webc-app-error-toast .webc-toast.error{color:var(--error-color);background-color:var(--error-background)}webc-app-error-toast .webc-toast.warning{background-color:var(--warning-background);color:var(--warning-color)}webc-app-error-toast .webc-toast .title{position:relative}webc-app-error-toast .webc-toast .title .close{position:absolute;top:-10px;right:-10px;padding:2px 4px;background-color:transparent;border:none;cursor:pointer;font-size:28px}webc-app-error-toast .webc-toast .title .close:focus{outline:none}webc-app-error-toast .webc-toast .title .message{font-size:1.1rem;margin-right:20px}webc-app-error-toast .webc-toast .title .message .see-more{cursor:pointer}webc-app-error-toast .webc-toast .see-more-content{display:none;padding:10px 0}webc-app-error-toast .webc-toast .see-more-content.show{display:block}webc-app-error-toast .webc-toast .details{font-size:0.9rem;margin-top:5px}@keyframes webc-app-error-toast-fadein{from{bottom:-30px;opacity:0}to{bottom:10px;opacity:1}}@keyframes webc-app-error-toast-fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}";

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
const WebcAppErrorToast = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  handleAppWarning(event) {
    var _a;
    if ((_a = event.detail) === null || _a === void 0 ? void 0 : _a.length) {
      this.addToast('warning', this.getWarningToastContent([...event.detail]));
    }
  }
  handleAppError(event) {
    this.addToast('error', this.getErrorToastContent(event.detail));
  }
  getErrorToastContent(appError) {
    const { message, url, lineNo, columnNo, error, isScriptError } = appError;
    let detailsSection = '';
    let seeMore = '';
    if (!isScriptError) {
      seeMore = `<span class="see-more">[See more]</span>`;
      detailsSection = `
            <div class="see-more-content">${error ? error.stack.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/ /g, '\u00a0') : ''}</div>
            <div class="details">
                URL: ${url}<br />
                Line: ${lineNo} / Column: ${columnNo}<br />
            </div>
        `;
    }
    return `
        <div class="title">
            <button type="button" class="close">
                <span aria-hidden="true">&times;</span>
            </button>
            <div class="message">${message} ${seeMore}</div>
        </div>
        ${detailsSection}
    `;
  }
  getWarningToastContent(params) {
    return `
        <div class="title">
            <button type="button" class="close">
                <span aria-hidden="true">&times;</span>
            </button>
            <div class="message">${params.join('<br/>')}</div>
        </div>
    `;
  }
  addToast(toastType, content) {
    const toast = document.createElement('div');
    toast.className = `webc-toast ${toastType}`;
    toast.innerHTML = content;
    this.host.append(toast);
    const seeMoreButton = toast.querySelector('.see-more');
    if (seeMoreButton) {
      seeMoreButton.addEventListener('click', () => {
        seeMoreButton.remove();
        const seeMoreContent = toast.querySelector('.see-more-content');
        if (seeMoreContent) {
          seeMoreContent.classList.add('show');
        }
      });
    }
    toast.querySelector('button.close').addEventListener('click', () => {
      toast.classList.add('closing');
      setTimeout(() => toast.remove(), 490);
    });
  }
  render() {
    return null;
  }
};
__decorate([
  HostElement()
], WebcAppErrorToast.prototype, "host", void 0);
WebcAppErrorToast.style = {
  default: defaultWebcAppErrorToastCss
};

export { WebcAppErrorToast as webc_app_error_toast };
