import { r as registerInstance, e as createEvent } from './index-60428ce4.js';
import { af as URLHelper, ak as getSkinFromState, ag as loadHTML, al as getSkinPathFromState, C as CUSTOM_ELEMENTS_PATH, a9 as promisifyEventEmit, a4 as extractChain, a5 as mergeChains, aj as getTranslationsFromState, d as MODEL_CHAIN_PREFIX, e as TRANSLATION_CHAIN_PREFIX, V as VIEW_MODEL_KEY } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import { a as ControllerRegistryService, B as BindingService, C as ComponentsListenerService } from './index-d3647f32.js';
import './active-router-3d243f8f.js';
import { i as injectHistory } from './index-1ea33b8d.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';

const { join } = URLHelper;
const components = {};
const getTemplate = async (templatePath) => {
  const { basePath } = window.WebCardinal;
  const skin = getSkinFromState();
  if (!components[skin]) {
    components[skin] = {};
  }
  if (components[skin][templatePath]) {
    return components[skin][templatePath];
  }
  // check if there is a template for current skin
  let [error, template] = await loadHTML(join(basePath, getSkinPathFromState(), CUSTOM_ELEMENTS_PATH, templatePath).pathname);
  if (!error) {
    components[skin][templatePath] = template;
    return template;
  }
  // only one request for default skin
  if (skin === 'default') {
    return '';
  }
  if (!components['default']) {
    components['default'] = {};
  }
  if (components['default'][templatePath]) {
    return components['default'][templatePath];
  }
  // if there is no template from skin, fallback is to default skin (root level)
  [error, template] = await loadHTML(join(basePath, CUSTOM_ELEMENTS_PATH, templatePath).pathname);
  if (!error) {
    components['default'][templatePath] = template;
    return template;
  }
  return '';
};

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
const WebcComponent = class {
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
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    this.html = this.replaceWithActualChain(await getTemplate(this.template));
    if (!this.html) {
      return;
    }
    try {
      this.model = await promisifyEventEmit(this.getModelEvent);
      this.translationModel = await promisifyEventEmit(this.getTranslationModelEvent);
    }
    catch (error) {
      console.error(error);
    }
    if (this.controller) {
      const Controller = await ControllerRegistryService.getController(this.controller);
      if (Controller) {
        try {
          this.controllerInstance = new Controller(this.element, this.history, this.model, this.translationModel);
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
    this.host.insertAdjacentHTML('afterend', this.html);
    this.chain = extractChain(this.element);
    const chainPrefix = await promisifyEventEmit(this.getChainPrefix);
    this.chain = mergeChains(chainPrefix, this.chain);
    const model = this.model;
    const translationModel = this.translationModel;
    const recursive = true;
    const chain = this.chain ? this.chain.slice(1) : null;
    const enableTranslations = getTranslationsFromState();
    if (this.element.shadowRoot) {
      BindingService.bindChildNodes(this.element.shadowRoot, {
        model,
        translationModel,
        recursive,
        chainPrefix: chain,
        enableTranslations,
      });
    }
    BindingService.bindChildNodes(this.element, {
      model,
      translationModel,
      recursive,
      chainPrefix: chain,
      enableTranslations,
    });
    this.listeners = new ComponentsListenerService(this.element, {
      model,
      translationModel: translationModel,
      chain
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
    var _a, _b, _c;
    if (this.listeners) {
      const { getModel, getTranslationModel, getParentChain } = this.listeners;
      getModel === null || getModel === void 0 ? void 0 : getModel.remove();
      getTranslationModel === null || getTranslationModel === void 0 ? void 0 : getTranslationModel.remove();
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.remove();
    }
    (_a = this.controllerInstance) === null || _a === void 0 ? void 0 : _a.disconnectedCallback();
    // prevent cleaning models change callbacks that are shared with current controller instance
    if (!this.chain) {
      (_c = (_b = this.controllerInstance) === null || _b === void 0 ? void 0 : _b.model) === null || _c === void 0 ? void 0 : _c.cleanReferencedChangeCallbacks();
    }
  }
  /**
   * The model is exposed by this method.
   */
  async getModel() {
    if (this.model) {
      return this.model;
    }
    return undefined;
  }
  /**
   * The translation model is exposed by this method.
   */
  async getTranslationModel() {
    if (this.translationModel) {
      return this.translationModel;
    }
    return undefined;
  }
  /**
   * The listeners are exposed by this method.
   */
  async getListeners() {
    return this.listeners;
  }
  replaceWithActualChain(plainHTML) {
    const replaceAttributes = plainHTML => {
      let documentHTML;
      try {
        const parser = new DOMParser();
        documentHTML = parser.parseFromString(plainHTML, 'text/html');
      }
      catch (error) {
        console.error(error);
      }
      if (!documentHTML || !documentHTML.body)
        return;
      const replaceInElementWithActualChain = (element) => {
        for (const attr of Array.from(element.attributes)) {
          if (attr.nodeValue.startsWith(MODEL_CHAIN_PREFIX) || attr.nodeValue.startsWith(TRANSLATION_CHAIN_PREFIX)) {
            const key = attr.nodeValue.slice(1);
            if (this.host.hasAttribute(key)) {
              element.setAttribute(attr.nodeName, this.host.getAttribute(key));
            }
          }
        }
        for (let child of Array.from(element.children)) {
          replaceInElementWithActualChain(child);
        }
      };
      replaceInElementWithActualChain(documentHTML.body);
      return [documentHTML.head.innerHTML, documentHTML.body.innerHTML].join('');
    };
    const replaceInnerSyntax = plainHTML => {
      Array.from(this.host.attributes).forEach(attr => {
        if (attr.nodeName === VIEW_MODEL_KEY)
          return;
        const innerSyntaxRegEx = new RegExp(`{{\\s*[${MODEL_CHAIN_PREFIX}${TRANSLATION_CHAIN_PREFIX}](${attr.nodeName})\\s*}}`, 'gm');
        if ([MODEL_CHAIN_PREFIX, TRANSLATION_CHAIN_PREFIX].includes(attr.nodeValue[0])) {
          plainHTML = plainHTML.replace(innerSyntaxRegEx, `{{ ${attr.nodeValue} }}`);
          return;
        }
        plainHTML = plainHTML.replace(innerSyntaxRegEx, attr.nodeValue);
      });
      return plainHTML;
    };
    return replaceInnerSyntax(replaceAttributes(plainHTML));
  }
  render() {
    return;
  }
};
__decorate([
  HostElement()
], WebcComponent.prototype, "host", void 0);
injectHistory(WebcComponent);

export { WebcComponent as webc_component };
