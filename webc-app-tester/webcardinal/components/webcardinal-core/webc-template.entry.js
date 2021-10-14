import { r as registerInstance, e as createEvent, h } from './index-60428ce4.js';
import { af as URLHelper, ak as getSkinFromState, ag as loadHTML, al as getSkinPathFromState, T as TEMPLATES_PATH, a4 as extractChain, a9 as promisifyEventEmit, a5 as mergeChains, aj as getTranslationsFromState } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import { B as BindingService, C as ComponentsListenerService } from './index-d3647f32.js';

const { join } = URLHelper;
const templates = {};
const getTemplate = async (templatePath) => {
  const { basePath } = window.WebCardinal;
  const skin = getSkinFromState();
  if (!templates[skin]) {
    templates[skin] = {};
  }
  if (templates[skin][templatePath]) {
    return templates[skin][templatePath];
  }
  // check if there is a template for current skin
  let [error, template] = await loadHTML(join(basePath, getSkinPathFromState(), TEMPLATES_PATH, templatePath).pathname);
  if (!error) {
    templates[skin][templatePath] = template;
    return template;
  }
  // only one request for default skin
  if (skin === 'default') {
    return '';
  }
  if (!templates['default']) {
    templates['default'] = {};
  }
  if (templates['default'][templatePath]) {
    return templates['default'][templatePath];
  }
  // if there is no template from skin, fallback is to default skin (root level)
  [error, template] = await loadHTML(join(basePath, TEMPLATES_PATH, templatePath).pathname);
  if (!error) {
    templates['default'][templatePath] = template;
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
const WebcTemplate = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getModelEvent = createEvent(this, "webcardinal:model:get", 7);
    this.getTranslationModelEvent = createEvent(this, "webcardinal:translationModel:get", 7);
    this.getChainPrefix = createEvent(this, "webcardinal:parentChain:get", 7);
    /**
     *  If it is not specified, all the markup coming <code>template</code> attribute will be placed inside innerHTML after the unnamed slot.
     *  Otherwise the content will replace the <code>webc-template</code> element form DOM.
     */
    this.disableContainer = false;
    this.chain = '';
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    if (this.host.hasAttribute('template-name') && !this.template) {
      console.warn([`Attribute "template-name" is deprecated!`, `Use "template" instead!`].join('\n'), `target:`, this.host);
      this.template = this.host.getAttribute('template-name');
    }
    this.host.innerHTML = await getTemplate(this.template);
    this.chain = extractChain(this.host);
    const hasInheritedModel = this.chain.indexOf("@") !== -1;
    if (hasInheritedModel) {
      const chainPrefix = await promisifyEventEmit(this.getChainPrefix);
      this.chain = mergeChains(chainPrefix, this.chain);
      try {
        this.model = await promisifyEventEmit(this.getModelEvent);
        this.translationModel = await promisifyEventEmit(this.getTranslationModelEvent);
      }
      catch (error) {
        console.error(error);
      }
      BindingService.bindChildNodes(this.host, {
        model: this.model,
        translationModel: this.translationModel,
        recursive: true,
        chainPrefix: this.chain ? this.chain.slice(1) : null,
        enableTranslations: getTranslationsFromState(),
      });
      this.listeners = new ComponentsListenerService(this.host, {
        chain: this.chain
      });
      this.listeners.getParentChain.add();
    }
  }
  async componentDidLoad() {
    if (this.disableContainer) {
      Array.from(this.host.childNodes).forEach(node => this.host.parentNode.insertBefore(node, this.host));
      this.host.remove();
    }
  }
  async connectedCallback() {
    if (this.listeners) {
      const { getParentChain } = this.listeners;
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.add();
    }
  }
  async disconnectedCallback() {
    if (this.listeners) {
      const { getParentChain } = this.listeners;
      getParentChain === null || getParentChain === void 0 ? void 0 : getParentChain.remove();
    }
  }
  /**
 * The model from controller is exposed by this method.
 */
  async getModel() {
    if (this.model) {
      return this.model;
    }
    return undefined;
  }
  /**
   * The translation model from controller is exposed by this method.
   */
  async getTranslationModel() {
    if (this.translationModel) {
      return this.translationModel;
    }
    return undefined;
  }
  render() {
    if (this.disableContainer) {
      return;
    }
    return h("slot", null);
  }
};
__decorate([
  HostElement()
], WebcTemplate.prototype, "host", void 0);

export { WebcTemplate as webc_template };
