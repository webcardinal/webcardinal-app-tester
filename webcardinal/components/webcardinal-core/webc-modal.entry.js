import { r as registerInstance, e as createEvent, h } from './index-60428ce4.js';
import { af as URLHelper, ak as getSkinFromState, ag as loadHTML, al as getSkinPathFromState, M as MODALS_PATH, V as VIEW_MODEL_KEY, d as MODEL_CHAIN_PREFIX, aj as getTranslationsFromState } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import { a as ControllerRegistryService, B as BindingService, C as ComponentsListenerService } from './index-d3647f32.js';
import './active-router-3d243f8f.js';
import { i as injectHistory } from './index-1ea33b8d.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';

const modals = {};
const { join } = URLHelper;
const getModalTemplate = async (templatePath) => {
  const { basePath } = window.WebCardinal;
  const skin = getSkinFromState();
  if (!modals[skin]) {
    modals[skin] = {};
  }
  if (modals[skin][templatePath]) {
    return modals[skin][templatePath];
  }
  // check if there is a modal for current skin
  let [error, modal] = await loadHTML(join(basePath, getSkinPathFromState(), MODALS_PATH, templatePath).pathname);
  if (!error) {
    modals[skin][templatePath] = modal;
    return modal;
  }
  // only one request for default skin
  if (skin === 'default') {
    return '';
  }
  if (!modals['default']) {
    modals['default'] = {};
  }
  if (modals['default'][templatePath]) {
    return modals['default'][templatePath];
  }
  // if there is no modal from skin, fallback is to default skin (root level)
  [error, modal] = await loadHTML(join(basePath, MODALS_PATH, templatePath).pathname);
  if (!error) {
    modals['default'][templatePath] = modal;
    return modal;
  }
  return '';
};

const defaultWebcModalCss = "@charset \"UTF-8\";:host{display:block;visibility:visible}:host button{cursor:pointer}:host .webc-modal{position:fixed;overflow:hidden;top:0;left:0;outline:0;width:100%;height:100%;z-index:var(--z-index);background:var(--backdrop-background);filter:var(--backdrop-filter)}:host .webc-modal .webc-modal-dialog{position:relative;width:var(--width);margin:var(--margin);pointer-events:none}:host .webc-modal .webc-modal-dialog.centered{display:flex;align-items:center;min-height:calc(100% - calc(var(--margin)) * 2)}:host .webc-modal.fade .webc-modal-dialog{transition:transform 0.3s ease-out;transform:translate(0, -50px)}:host .webc-modal.show .webc-modal-dialog{transform:none}:host .webc-modal.modal-static .webc-modal-dialog{transform:scale(1.02)}:host .webc-modal-dialog-scrollable{height:calc(100% - calc(var(--margin)) * 2)}:host .webc-modal-dialog-scrollable .webc-modal-content{max-height:100%;overflow:hidden}:host .webc-modal-dialog-scrollable .webc-modal-body{overflow-y:auto}:host .webc-modal-dialog-centered{display:flex;align-items:center;min-height:calc(100% - calc(var(--margin) * 2))}:host .webc-modal-content{position:relative;display:flex;flex-direction:column;width:100%;color:var(--color);pointer-events:auto;background-color:var(--background);background-clip:padding-box;box-shadow:var(--shadow);outline:0;border-radius:var(--radius)}:host .webc-modal-content .header{display:flex;flex-shrink:0;align-items:center;justify-content:space-between;padding:var(--padding);border-bottom:var(--header-border)}:host .webc-modal-content .header>.header-content{display:flex;flex-direction:column;gap:0.45rem}:host .webc-modal-content .header>.header-actions{display:flex;gap:0.3rem}:host .webc-modal-content .header>.header-actions button{font-size:1.05rem;width:1.8rem;height:1.8rem;display:flex;place-items:center;place-content:center;border:none;border-radius:var(--header-button-radius);color:var(--header-button-color);background:var(--header-button-background)}:host .webc-modal-content .header>.header-actions button.expand:after{content:\"↕\";display:inline-block;transform:rotateZ(45deg)}:host .webc-modal-content .header>.header-actions button.close:after{content:\"✕\";display:inline-block}:host .webc-modal-content .header .modal-title,:host .webc-modal-content .header .modal-description{margin:0;padding:0}:host .webc-modal-content .header .modal-title{color:var(--title-color)}:host .webc-modal-content .header .modal-description{color:var(--description-color)}:host .webc-modal-content .body{position:relative;flex:1 1 auto;padding:var(--padding);min-height:50px;color:var(--color)}:host .webc-modal-content .footer{display:flex;flex-wrap:wrap;flex-shrink:0;align-items:center;justify-content:var(--footer-align);padding:var(--padding);border-top:var(--footer-border);gap:0.75rem}:host .webc-modal-content .footer button{border-radius:var(--footer-button-radius);padding:0.5rem 1.1rem;border:none;font-size:1rem}:host .webc-modal-content .footer button.cancel{color:var(--cancel-button-color);background-color:var(--cancel-button-background)}:host .webc-modal-content .footer button.confirm{color:var(--confirm-button-color);background-color:var(--confirm-button-background)}@media (min-width: 500px){:host .webc-modal-dialog{max-width:var(--max-width);margin:1.75rem auto}}:host([expanded]) .webc-modal-dialog{display:grid !important;max-width:100%}:host([expanded]) .webc-modal-dialog .webc-modal-content{height:100%}";

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
const WebcModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.initialised = createEvent(this, "initialised", 7);
    this.confirmed = createEvent(this, "confirmed", 7);
    this.closed = createEvent(this, "closed", 7);
    this.isLoading = false;
    this.isVisible = false;
    /**
     * The text that will appear on the footer close button, if neither the "footer" slot nor modalFooterContent are provided.
     */
    this.cancelButtonText = 'Close';
    /**
     * The text that will appear on the footer confirm button, if neither the "footer" slot nor modalFooterContent are provided.
     */
    this.confirmButtonText = 'Ok';
    /**
     * Sets if the modal expands to full screen.
     */
    this.expanded = false;
    /**
     * Sets if the popup is centered on the screen or if it appear at the top of the screen.
     */
    this.centered = true;
    /**
     * Sets if the modal will automatically show when the element is constructed.
     */
    this.autoShow = true;
    /**
     * Sets if the modal can be closed
     */
    this.disableClosing = false;
    /**
     * Sets if the modal will automatically close when the user clicks outside of it.
     */
    this.disableBackdropClosing = true;
    /**
     * Decides if expand button should be displayed
     */
    this.disableExpanding = false;
    /**
     * Sets if the modal has the footer displayed.
     */
    this.disableFooter = false;
    /**
     * Sets if the close button will be shown or not.
     */
    this.disableCancelButton = false;
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    if (this.autoShow) {
      this.isVisible = true;
    }
    if (this.template) {
      this.isLoading = true;
      this.host.innerHTML = await getModalTemplate(this.template);
      this.isLoading = false;
    }
    if (this.controller) {
      const Controller = await ControllerRegistryService.getController(this.controller);
      if (Controller) {
        try {
          this.host.setAttribute(VIEW_MODEL_KEY, MODEL_CHAIN_PREFIX);
          this.controllerInstance = new Controller(this.host, this.history, this.model, this.translationModel);
          if (!this.model) {
            this.model = this.controllerInstance.model;
          }
          if (!this.translationModel) {
            this.translationModel = this.controllerInstance.translationModel;
          }
        }
        catch (error) {
          console.error(error);
        }
      }
    }
    BindingService.bindChildNodes(this.host, {
      model: this.model,
      translationModel: this.translationModel,
      recursive: true,
      enableTranslations: getTranslationsFromState(),
    });
    this.listeners = new ComponentsListenerService(this.host, {
      model: this.model,
      translationModel: this.translationModel,
    });
    this.listeners.getModel.add();
    this.listeners.getTranslationModel.add();
    this.addDataListeners();
    this.initialised.emit(this.host);
  }
  async connectedCallback() {
    if (this.listeners) {
      const { getModel, getTranslationModel } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.add();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.add();
    }
  }
  async disconnectedCallback() {
    var _a;
    if (this.listeners) {
      const { getModel, getTranslationModel } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.remove();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.remove();
    }
    (_a = this.controllerInstance) === null || _a === void 0 ? void 0 : _a.disconnectedCallback();
  }
  /**
   * Method that shows the modal.
   */
  async show() {
    this.isVisible = true;
  }
  /**
   * Method that hides the modal.
   */
  async hide() {
    this.isVisible = false;
  }
  /**
   * Method that completely removes the modal from the DOM.
   */
  async destroy() {
    this.host.remove();
  }
  handleBackdropClick(e) {
    if (!this.disableClosing && !this.disableBackdropClosing && e.target === e.currentTarget) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.closed.emit(false);
    }
  }
  handleClose(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.closed.emit(true);
  }
  handleConfirm(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.confirmed.emit({ modal: this.host, event: e });
  }
  handleExpand(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.expanded = !this.expanded;
  }
  hasSlot(slotName) {
    return !!this.host.querySelector(`[slot="${slotName}"]`);
  }
  addDataListeners() {
    const closingItems = this.host.querySelectorAll('[data-close]');
    const confirmingItems = this.host.querySelectorAll('[data-confirm]');
    if (closingItems) {
      closingItems.forEach(item => item.addEventListener('click', this.handleClose.bind(this)));
    }
    if (confirmingItems) {
      confirmingItems.forEach(item => item.addEventListener('click', this.handleConfirm.bind(this)));
    }
  }
  getTitleContent() {
    if (this.hasSlot('header'))
      return h("slot", { name: "header" });
    const content = [];
    if (this.modalTitle)
      content.push(h("h2", { class: "modal-title" }, this.modalTitle));
    if (this.modalDescription)
      content.push(h("p", { class: "modal-description" }, this.modalDescription));
    return content;
  }
  getFooterContent() {
    if (this.hasSlot('footer'))
      return h("slot", { name: "footer" });
    if (this.modalFooter)
      return h("div", { innerHTML: this.modalFooter });
    return [
      !this.disableCancelButton && (h("button", { type: "button", class: "cancel", part: "cancel", onClick: this.handleClose.bind(this) }, this.cancelButtonText)),
      h("button", { type: "button", class: "confirm", part: "confirm", onClick: this.handleConfirm.bind(this) }, this.confirmButtonText),
    ];
  }
  render() {
    if (!this.isVisible) {
      return null;
    }
    return (h("div", { class: "webc-modal fade show", tabindex: "-1", role: "dialog", onClick: this.handleBackdropClick.bind(this) }, h("div", { class: `webc-modal-dialog ${this.centered ? 'centered' : ''} `, role: "document", part: "dialog" }, h("div", { class: "webc-modal-content", part: "content" }, h("section", { class: "header", part: "header" }, h("div", { class: "header-content" }, this.getTitleContent()), h("div", { class: "header-actions" }, !this.disableExpanding && (h("button", { type: "button", class: "expand", part: "expand", "aria-label": "Expand", onClick: this.handleExpand.bind(this) })), !this.disableClosing && (h("button", { type: "button", class: "close", part: "close", "data-dismiss": "modal", "aria-label": "Close", onClick: this.handleClose.bind(this) })))), this.isLoading ? (h("section", { class: "body", part: "main" }, h("webc-spinner", null))) : ([
      h("section", { class: "body", part: "main" }, h("slot", null), this.modalContent ? h("div", { class: "content" }, this.modalContent) : null),
      !this.disableFooter && (h("section", { class: "footer", part: "footer" }, this.getFooterContent())),
    ])))));
  }
};
__decorate([
  HostElement()
], WebcModal.prototype, "host", void 0);
injectHistory(WebcModal);
WebcModal.style = {
  default: defaultWebcModalCss
};

export { WebcModal as webc_modal };
