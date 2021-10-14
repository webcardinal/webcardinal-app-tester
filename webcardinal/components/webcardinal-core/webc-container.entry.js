import { r as registerInstance, e as createEvent, h } from './index-60428ce4.js';
import './mode-2888b3c8.js';
import { a4 as extractChain, d as MODEL_CHAIN_PREFIX, a9 as promisifyEventEmit, a5 as mergeChains, c as DEFAULT_CONTROLLER_KEY, V as VIEW_MODEL_KEY, aj as getTranslationsFromState } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import { B as BindingService, C as ComponentsListenerService, a as ControllerRegistryService } from './index-d3647f32.js';
import './index.esm.js';
import './active-router-3d243f8f.js';
import { i as injectHistory } from './index-1ea33b8d.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';
import { C as Controller } from './Controller-4824fbca.js';

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
const WebcContainer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getModelEvent = createEvent(this, "webcardinal:model:get", 7);
    this.getTranslationModelEvent = createEvent(this, "webcardinal:translationModel:get", 7);
    this.getChainPrefix = createEvent(this, "webcardinal:parentChain:get", 7);
    /**
     * This property is a string that will permit the developer to choose his own controller.
     * If no value is set then the null default value will be taken and the component will use the basic Controller.
     */
    this.controller = '';
    /**
     *  If it is not specified, all the innerHTML will be placed inside the unnamed slot.
     *  Otherwise the content will replace the <code>webc-container</code> element form DOM.
     */
    this.disableContainer = false;
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    const [controllerElement, bindingElement] = this.resolveControllerElement();
    this.controllerElement = controllerElement;
    let model, translationModel, history = this.history;
    this.chain = extractChain(this.host);
    const hasInheritedModel = this.chain.indexOf(MODEL_CHAIN_PREFIX) !== -1;
    if (hasInheritedModel) {
      const chainPrefix = await promisifyEventEmit(this.getChainPrefix);
      this.chain = mergeChains(chainPrefix, this.chain);
      try {
        model = await promisifyEventEmit(this.getModelEvent);
        translationModel = await promisifyEventEmit(this.getTranslationModelEvent);
        this.controllerInstance = await this.loadController(controllerElement, history, model, translationModel);
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      this.controllerInstance = await this.loadController(controllerElement, history);
      model = this.controllerInstance.model;
      translationModel = this.controllerInstance.translationModel;
    }
    // "default-controller" is set when container does binding of undefined models or when controller is not found
    // but if 'data-view-model="@"' is present binding is supported
    // (if there is a global model upper in the DOM, otherwise the webc-container can not hydrate)
    if (this.host.hasAttribute(DEFAULT_CONTROLLER_KEY) && !this.host.hasAttribute(VIEW_MODEL_KEY)) {
      return;
    }
    BindingService.bindChildNodes(bindingElement, {
      model,
      translationModel,
      recursive: true,
      chainPrefix: this.chain ? this.chain.slice(1) : null,
      enableTranslations: getTranslationsFromState(),
    });
    this.listeners = new ComponentsListenerService(bindingElement, {
      model,
      translationModel,
      chain: this.chain,
    });
    this.listeners.getModel.add();
    this.listeners.getTranslationModel.add();
    this.listeners.getParentChain.add();
  }
  async connectedCallback() {
    if (this.listeners) {
      const { getModel, getTranslationModel, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.add();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.add();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.add();
    }
  }
  async disconnectedCallback() {
    if (this.listeners) {
      const { getModel, getTranslationModel, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.remove();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.remove();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.remove();
    }
    // disconnectedCallback can be called multiple times
    // there is no way to listen to a "onDestroy" like event so we check if the host is still attached to the DOM
    setTimeout(() => {
      var _a, _b, _c;
      if (!document.body.contains(this.controllerElement)) {
        (_a = this.controllerInstance) === null || _a === void 0 ? void 0 : _a.disconnectedCallback();
        //prevent cleaning models change callbacks that are shared with current controller instance
        if (!this.chain) {
          (_c = (_b = this.controllerInstance) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.cleanReferencedChangeCallbacks();
        }
      }
    }, 100);
  }
  async componentDidLoad() {
    if (this.disableContainer) {
      Array.from(this.host.childNodes).forEach(node => this.host.parentNode.insertBefore(node, this.host));
      this.host.remove();
    }
  }
  /**
   * The model from controller is exposed by this method.
   */
  async getModel() {
    if (this.controllerInstance) {
      return this.controllerInstance.model;
    }
    return undefined;
  }
  /**
   * The translation model from controller is exposed by this method.
   */
  async getTranslationModel() {
    if (this.controllerInstance) {
      return this.controllerInstance.translationModel;
    }
    return undefined;
  }
  // It resolves "this.element" from any type of WebCardinal Controller
  resolveControllerElement() {
    let target = this.host;
    if (this.disableContainer) {
      return [target.parentElement, target];
    }
    return [target, target];
  }
  // It loads the controller specified as property or a default controller
  async loadController(element, history, model, translationModel) {
    const loadDefaultController = () => {
      this.host.setAttribute(DEFAULT_CONTROLLER_KEY, '');
      return new Controller(element, history, model, translationModel);
    };
    if (this.host.hasAttribute('controller-name') && !this.controller) {
      console.warn([`Attribute "controller-name" is deprecated!`, `Use "controller" instead!`].join('\n'), `target:`, this.host);
      this.controller = this.host.getAttribute('controller-name');
    }
    if (typeof this.controller !== 'string') {
      console.error('"controller" must be a string!');
      return loadDefaultController();
    }
    if (this.controller.length === 0) {
      return loadDefaultController();
    }
    try {
      const Controller = await ControllerRegistryService.getController(this.controller);
      try {
        return new Controller(element, history, model, translationModel);
      }
      catch (error) {
        console.error(`Controller "${this.controller}" has runtime errors!`, error.message !== 'Controller is not a constructor' ? error : '');
        return loadDefaultController();
      }
    }
    catch (error) {
      console.error(`Error while loading controller "${this.controller}"`, error);
      return loadDefaultController();
    }
  }
  render() {
    return this.disableContainer ? null : h("slot", null);
  }
};
__decorate([
  HostElement()
], WebcContainer.prototype, "host", void 0);
injectHistory(WebcContainer);

export { WebcContainer as webc_container };
