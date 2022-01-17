const EVENT_CONFIG_GET_CORE_TYPE = 'webcardinal:config:getCoreType';
const EVENT_CONFIG_GET_DOCS_SOURCE = 'webcardinal:config:getDocsSource';
const EVENT_CONFIG_GET_IDENTITY = 'webcardinal:config:getIdentity';
const EVENT_CONFIG_GET_LOG_LEVEL = 'webcardinal:config:getLogLevel';
const EVENT_CONFIG_GET_ROUTING = 'webcardinal:config:getRouting';
const EVENT_MODEL_GET = 'webcardinal:model:get';
const EVENT_ROUTING_GET = 'webcardinal:routing:get';
const EVENT_TAGS_GET = 'webcardinal:tags:get';
const EVENT_TRANSLATION_MODEL_GET = 'webcardinal:translationModel:get';
const EVENT_PARENT_CHAIN_GET = 'webcardinal:parentChain:get';

// events
// structure
const PAGES_PATH = 'pages';
const SKINS_PATH = 'skins';
const TEMPLATES_PATH = 'templates';
const MODALS_PATH = 'modals';
const SCRIPTS_PATH = 'scripts';
const CUSTOM_ELEMENTS_PATH = 'components';
const ASSETS_PATH = 'assets';
// data-view-model
const MODEL_KEY = 'data-model';
const VIEW_MODEL_KEY = 'data-view-model';
const DISABLE_BINDING = `disable-binding`;
const DEFAULT_CONTROLLER_KEY = 'default-controller';
const HYDRATED = 'hydrated';
const MODEL_CHAIN_PREFIX = '@';
const TRANSLATION_CHAIN_PREFIX = '$';
const SKIP_BINDING_FOR_PROPERTIES = ['_saveElement'];
const SKIP_BINDING_FOR_COMPONENTS = ['webc-template', 'webc-container', 'webc-component', 'webc-datatable'];
const PSK_CARDINAL_PREFIX = 'psk-';
// data-tag
const TAG_ATTRIBUTE = 'data-tag';
const TAG_MODEL_FUNCTION_PROPERTY = 'getDataTagModel';
// data-for
const FOR_ATTRIBUTE = 'data-for';
const FOR_NO_DATA_SLOT_NAME = 'no-data';
const FOR_LOADIBNG_SLOT_NAME = 'loading';
const FOR_OPTIONS = `${FOR_ATTRIBUTE}-options`;
const FOR_EVENTS = 'events';
const FOR_OPTIMISTIC = 'optimistic';
const FOR_WRAPPER_RERENDER = 'rerender';
const FOR_CONTENT_UPDATED_EVENT = 'content-updated';
const FOR_CONTENT_REPLACED_EVENT = 'content-replaced';
const FOR_TEMPLATE_SIZE = 'data-for-template-size';
// data-if
const IF_ATTRIBUTE = 'data-if';
const IF_TRUE_CONDITION_SLOT_NAME = 'true';
const IF_FALSE_CONDITION_SLOT_NAME = 'false';
const IF_NO_DATA_SLOT_NAME = 'no-data';
const IF_LOADIBNG_SLOT_NAME = 'loading';
// skin.css
const ID_DEFAULT_SKIN_CSS = 'webc-skin-default-stylesheet';
const ID_CUSTOM_SKIN_CSS = 'webc-skin-custom-stylesheet';
// others
const LOG_LEVEL = {
  NONE: 'none',
  WARN: 'warn',
  ERROR: 'error',
};
const HOOK_TYPE = {
  BEFORE_APP: 'beforeAppLoads',
  AFTER_APP: 'afterAppLoads',
  BEFORE_PAGE: 'beforePageLoads',
  AFTER_PAGE: 'afterPageLoads',
  CLOSED_PAGE: 'whenPageClose',
};
// custom properties
const CP_WEBC_APP_ROOT_MODE = '--mode';
const CP_WEBC_APP_ROOT_MOBILE_BREAKPOINT = '--mode-mobile-breakpoint';

const modelChangeHandlersRegistry = new Map();
function extractChain(element) {
  let chain = element.hasAttribute(VIEW_MODEL_KEY) ? element.getAttribute(VIEW_MODEL_KEY) : null;
  if (!chain && element.hasAttribute(MODEL_KEY)) {
    console.warn(`Attribute ${MODEL_KEY} is deprecated for binding! Use the ${VIEW_MODEL_KEY} key attribute instead.`, element);
    chain = element.getAttribute(MODEL_KEY);
  }
  if (!chain) {
    return '';
  }
  if (!chain.startsWith(MODEL_CHAIN_PREFIX)) {
    const tagName = element.tagName.toLowerCase();
    console.error([
      `Invalid chain found for ${tagName} (chain: "${chain}")!`,
      `A valid chain must start with "${MODEL_CHAIN_PREFIX}".`,
    ].join('\n'));
    return '';
  }
  return chain;
}
function mergeChains(prefixChain, chain) {
  prefixChain = prefixChain.split("@").join("");
  chain = chain.split("@").join("");
  if (prefixChain && chain) {
    return `@${prefixChain}.${chain}`;
  }
  else {
    if (chain) {
      return `@${chain}`;
    }
  }
  return prefixChain ? `@${prefixChain}` : "@";
}
function setElementChainChangeHandler(element, chain, changeHandler) {
  modelChangeHandlersRegistry.set(element, { chain, changeHandler });
}
function setElementExpressionChangeHandler(element, expression, changeHandler) {
  modelChangeHandlersRegistry.set(element, { expression, changeHandler });
}
function removeChangeHandler(element, model) {
  const seekForElementChainChangeHandlers = (element) => {
    if (element.childNodes.length > 0) {
      for (const child of element.childNodes) {
        if (modelChangeHandlersRegistry.has(child)) {
          const elementChangeChainHandler = modelChangeHandlersRegistry.get(child);
          if (elementChangeChainHandler.chain) {
            model.offChange(elementChangeChainHandler.chain, elementChangeChainHandler.changeHandler);
          }
          else {
            model.offChangeExpressionChain(elementChangeChainHandler.expression, elementChangeChainHandler.changeHandler);
          }
          modelChangeHandlersRegistry.delete(child);
        }
        seekForElementChainChangeHandlers(child);
      }
    }
  };
  seekForElementChainChangeHandlers(element);
}

function getClosestParentElement(element, selector, stopSelector) {
  let closestParent = null;
  while (element) {
    if (element.matches(selector)) {
      closestParent = element;
      break;
    }
    else if (stopSelector && element.matches(stopSelector)) {
      break;
    }
    element = element.parentElement;
  }
  return closestParent;
}
function isNativeProperty(key) {
  // these values are not visible as attributes over the HTMLElement
  return ['value', 'innerText', 'innerHTML'].includes(key);
}
function shortcutToProperty(key) {
  switch (key) {
    case 'model':
      return 'data-view-model';
    case 'tag':
      return 'data-tag';
    case 'text':
      return 'innerText';
    case 'html':
      return 'innerHTML';
    default:
      return key;
  }
}
function setElementValue(element, { key, value }) {
  if (SKIP_BINDING_FOR_PROPERTIES.includes(key)) {
    return;
  }
  if (['innerHTML', 'innerText'].includes(key)) {
    console.warn(`Model property "${key}" can be short handed, try "${key.substr(5).toLowerCase()}" instead!\n`, `target element:`, element);
  }
  if (['data-tag', 'data-view-model'].includes(key)) {
    console.warn(`Model property "${key}" can be shorthanded, try "${key.substr(5)}" instead!\n`, `target model:`, element.getAttribute('data-model'));
  }
  key = shortcutToProperty(key);
  if (isNativeProperty(key)) {
    if (element.tagName === 'INPUT' && element.getAttribute('type') === 'file' && key === 'value') {
      // in case of file input types, we cannot set the value of the input
      return;
    }
    element[key] = value;
    return;
  }
  if (key === 'class') {
    if (value === '') {
      element.className = '';
      return;
    }
    if (typeof value === 'string') {
      element.classList.add(value);
      return;
    }
    if (typeof value === 'object') {
      for (const [className, active] of Object.entries(value)) {
        if (active) {
          element.classList.add(className);
        }
        else {
          element.classList.remove(className);
        }
      }
      return;
    }
    return;
  }
  if (typeof value === 'boolean') {
    if (value) {
      element.setAttribute(key, '');
    }
    else {
      element.removeAttribute(key);
    }
    return;
  }
  if (typeof value === 'string') {
    element.setAttribute(key, value);
    return;
  }
  if (typeof value === 'object') {
    element[key] = value;
    return;
  }
}
function isAttributeForModelChange(element, attribute) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'input' && element.getAttribute('type') === 'checkbox' && attribute === 'checked') {
    return true;
  }
  return attribute === 'value';
}
/**
 * @description - Binds all attributes for an Element
 * @param element
 * @param model - Object in which the specified chain (<attribute>="@chain") is searched
 * @param chainPrefix
 * @param modelChainPrefix
 */
function bindElementAttributes(element, model, chainPrefix = MODEL_CHAIN_PREFIX, modelChainPrefix = null) {
  // for psk-<components> @BindModel decorator is design for this task
  if (element.tagName.startsWith(PSK_CARDINAL_PREFIX.toUpperCase())) {
    return;
  }
  Array.from(element.attributes).forEach(attribute => {
    const key = attribute.nodeName;
    let chain = attribute.nodeValue;
    if (key === VIEW_MODEL_KEY || key === MODEL_KEY) {
      return;
    }
    if (!chain.startsWith(chainPrefix)) {
      return;
    }
    chain = chain.slice(1);
    if (modelChainPrefix) {
      // prepend the modelChainPrefix
      chain = getCompleteChain(modelChainPrefix, chain);
    }
    if (!element['webcModelChains']) {
      element['webcModelChains'] = {};
    }
    element['webcModelChains'][key] = chain;
    setElementValue(element, { key, value: model.getChainValue(chain) });
    // for some webc-<components> binding is managed by component itself
    if (SKIP_BINDING_FOR_COMPONENTS.includes(element.tagName.toLowerCase())) {
      return;
    }
    if (chainPrefix === MODEL_CHAIN_PREFIX && isAttributeForModelChange(element, key)) {
      bindElementChangeToModelProperty(element, model, chain);
    }
    const chainChangeHandler = () => {
      setElementValue(element, { key, value: model.getChainValue(chain) });
    };
    model.onChange(chain, chainChangeHandler);
    setElementChainChangeHandler(element, chain, chainChangeHandler);
    if (model.hasExpression(chain)) {
      setElementValue(element, { key, value: model.evaluateExpression(chain) });
      if (chainPrefix === MODEL_CHAIN_PREFIX && isAttributeForModelChange(element, key)) {
        bindElementChangeToModelProperty(element, model, chain);
      }
      const expresionChangeHandler = () => {
        setElementValue(element, { key, value: model.evaluateExpression(chain) });
      };
      model.onChangeExpressionChain(chain, expresionChangeHandler);
      setElementExpressionChangeHandler(element, chain, expresionChangeHandler);
    }
  });
}
function removeSlotInfoFromElement(element) {
  // when nesting mutiple components that handle binding, the inner slots will have the hidden property set automatically
  // so we make sure to remove both the slot and hidden attributes
  if (element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }
  element.removeAttribute('slot');
  element.removeAttribute('hidden');
}
function bindElementChangeToModelProperty(element, model, propertyChain) {
  const tagName = element.tagName.toLowerCase();
  if (['input', 'textarea'].includes(tagName)) {
    element.addEventListener('input', e => {
      const target = e.target;
      if (tagName === 'input' && element.getAttribute('type') === 'checkbox') {
        model.setChainValue(propertyChain, target.checked);
        return;
      }
      if (tagName === 'input' && element.getAttribute('type') === 'file') {
        model.setChainValue(propertyChain, Array.from(target.files));
        return;
      }
      const updatedValue = target.value;
      model.setChainValue(propertyChain, updatedValue);
    });
  }
  else if (tagName === 'select') {
    element.addEventListener('change', e => {
      const target = e.target;
      const updatedValue = target.value;
      model.setChainValue(propertyChain, updatedValue);
    });
  }
}
function bindElementChangeToModel(element, model, chain) {
  const targetModel = model.getChainValue(chain);
  if (!targetModel) {
    return;
  }
  const tagName = element.tagName.toLowerCase();
  const propertyChainSuffix = tagName === 'input' && element.getAttribute('type') === 'checkbox' ? 'checked' : 'value';
  const propertyChain = `${chain}.${propertyChainSuffix}`;
  bindElementChangeToModelProperty(element, model, propertyChain);
}
function isAttributePresentOnElement(element, attributeName) {
  return Array.from(element.attributes).some(attribute => attribute.nodeName === attributeName);
}
function getSlots(elements, slotName) {
  return elements.filter(child => {
    return child.getAttribute('slot') === slotName;
  });
}
function getSlotContent(elements, slotName) {
  return getSlots(elements, slotName)
    .map(slotElement => {
    return slotElement.outerHTML;
  })
    .join('');
}
//is this used anymore?
function removeElementChildren(element, model) {
  removeChangeHandler(element, model);
  while (element.children.length > 0) {
    element.children[0].remove();
  }
}
function removeElementChildNodes(element, model) {
  removeChangeHandler(element, model);
  while (element.childNodes.length > 0) {
    element.childNodes[0].remove();
  }
}
function getCompleteChain(...parts) {
  return parts
    .filter(part => part != null)
    .filter(String)
    .join('.');
}

function convertCSSTimeToMs(time) {
  const num = parseFloat(time);
  let unit = time.match(/m?s/);
  let milliseconds;
  if (unit) {
    unit = unit[0];
  }
  switch (unit) {
    case 's':
      milliseconds = num * 1000;
      break;
    case 'ms':
      milliseconds = num;
      break;
    default:
      milliseconds = 0;
      break;
  }
  return milliseconds;
}

function promisifyEventEmit(event, args = {}) {
  return new Promise((resolve, reject) => {
    event.emit(Object.assign(Object.assign({}, args), { callback: (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      } }));
  });
}
function promisifyEventDispatch(eventName, host, args = {}) {
  return new Promise((resolve, reject) => {
    host.dispatchEvent(new CustomEvent(eventName, Object.assign({ bubbles: true, composed: true, cancelable: true, detail: {
        callback: (error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        },
      } }, args)));
  });
}

const support = (function () {
  if (!window.DOMParser)
    return false;
  const parser = new DOMParser();
  try {
    parser.parseFromString('x', 'text/html');
  }
  catch (err) {
    return false;
  }
  return true;
})();
/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
const stringToHTML = function (str) {
  // If DOMParser is supported, use it
  if (support) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  }
  // Otherwise, fallback to old-school method
  const dom = document.createElement('div');
  dom.innerHTML = str;
  return dom;
};
/**
 * Create an array of the attributes on an element
 * @param  {NamedNodeMap} attributes The attributes on an element
 * @return {Array}                   The attributes on an element as an array of key/value pairs
 */
const getAttributes = function (attributes) {
  return Array.prototype.map.call(attributes, function (attribute) {
    return {
      att: attribute.name,
      value: attribute.value,
    };
  });
};
/**
 * Create a DOM Tree Map for an element
 * @param  {Node}    element The element to map
 * @param  {Boolean} isSVG   If true, node is within an SVG
 * @return {Array}           A DOM tree map
 */
const createDomMap = function (element, isSVG = false) {
  return Array.prototype.map.call(element.childNodes, function (node) {
    const details = {
      content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
      atts: node.nodeType !== 1 ? [] : getAttributes(node.attributes),
      type: node.nodeType === 3 ? 'text' : node.nodeType === 8 ? 'comment' : node.tagName.toLowerCase(),
      node: node,
      isSVG: null,
      children: null,
    };
    details.isSVG = isSVG || details.type === 'svg';
    details.children = createDomMap(node, details.isSVG);
    return details;
  });
};
const getStyleMap = function (styles) {
  return styles.split(';').reduce(function (arr, style) {
    if (style.trim().indexOf(':') > 0) {
      const styleArr = style.split(':');
      arr.push({
        name: styleArr[0] ? styleArr[0].trim() : '',
        value: styleArr[1] ? styleArr[1].trim() : '',
      });
    }
    return arr;
  }, []);
};
const removeStyles = function (elem, styles) {
  styles.forEach(function (style) {
    elem.style[style] = '';
  });
};
const changeStyles = function (elem, styles) {
  styles.forEach(function (style) {
    elem.style[style.name] = style.value;
  });
};
const diffStyles = function (elem, styles) {
  // Get style map
  const styleMap = getStyleMap(styles);
  // Get styles to remove
  const remove = Array.prototype.filter.call(elem.style, function (style) {
    const findStyle = styleMap.find(function (newStyle) {
      return newStyle.name === style && newStyle.value === elem.style[style];
    });
    return findStyle === undefined;
  });
  // Add and remove styles
  removeStyles(elem, remove);
  changeStyles(elem, styleMap);
};
const removeAttributes = function (elem, atts) {
  atts.forEach(function (attribute) {
    // If the attribute is a class, use className
    // Else if it's style, remove all styles
    // Otherwise, use removeAttribute()
    if (attribute.att === 'class') {
      elem.className = '';
    }
    else if (attribute.att === 'style') {
      removeStyles(elem, Array.prototype.slice.call(elem.style));
    }
    else {
      elem.removeAttribute(attribute.att);
    }
  });
};
/**
 * Add attributes to an element
 * @param {Node}  elem The element
 * @param {Array} atts The attributes to add
 */
const addAttributes = function (elem, atts) {
  atts.forEach(function (attribute) {
    // If the attribute is a class, use className
    // Else if it's style, diff and update styles
    // Otherwise, set the attribute
    if (attribute.att === 'class') {
      elem.className = attribute.value;
    }
    else if (attribute.att === 'style') {
      diffStyles(elem, attribute.value);
    }
    else {
      elem.setAttribute(attribute.att, attribute.value || true);
    }
  });
};
/**
 * Diff the attributes on an existing element versus the template
 * @param  {Object} template The new template
 * @param  {Object} existing The existing DOM node
 */
const diffAtts = function (template, existing) {
  // Get attributes to remove
  const remove = existing.atts.filter(function (att) {
    const getAtt = template.atts.find(function (newAtt) {
      return att.att === newAtt.att;
    });
    return getAtt === undefined;
  });
  // Get attributes to change
  const change = template.atts.filter(function (att) {
    const getAtt = existing.atts.find(function (existingAtt) {
      return att.att === existingAtt.att;
    });
    return getAtt === undefined || getAtt.value !== att.value;
  });
  // Add/remove any required attributes
  addAttributes(existing.node, change);
  removeAttributes(existing.node, remove);
};
/**
 * Make an HTML element
 * @param  {Object} elem The element details
 * @return {Node}        The HTML element
 */
const makeElem = function (elem) {
  // Create the element
  let node;
  if (elem.type === 'text') {
    node = document.createTextNode(elem.content);
  }
  else if (elem.type === 'comment') {
    node = document.createComment(elem.content);
  }
  else if (elem.isSVG) {
    node = document.createElementNS('http://www.w3.org/2000/svg', elem.type);
  }
  else {
    node = document.createElement(elem.type);
  }
  // Add attributes
  addAttributes(node, elem.atts);
  // If the element has child nodes, create them
  // Otherwise, add textContent
  if (elem.children.length > 0) {
    elem.children.forEach(function (childElem) {
      node.appendChild(makeElem(childElem));
    });
  }
  else if (elem.type !== 'text') {
    node.textContent = elem.content;
  }
  return node;
};
/**
 * Diff the existing DOM node versus the template
 * @param  {Array} templateMap A DOM tree map of the template content
 * @param  {Array} domMap      A DOM tree map of the existing DOM node
 * @param  {Node}  elem        The element to render content into
 */
const diffDomMap = function (templateMap, domMap, elem) {
  // If extra elements in domMap, remove them
  let count = domMap.length - templateMap.length;
  if (count > 0) {
    for (; count > 0; count--) {
      domMap[domMap.length - count].node.parentNode.removeChild(domMap[domMap.length - count].node);
    }
  }
  // Diff each item in the templateMap
  templateMap.forEach(function (node, index) {
    // If element doesn't exist, create it
    if (!domMap[index]) {
      elem.appendChild(makeElem(templateMap[index]));
      return;
    }
    // If element is not the same type, replace it with new element
    if (templateMap[index].type !== domMap[index].type) {
      domMap[index].node.parentNode.replaceChild(makeElem(templateMap[index]), domMap[index].node);
      return;
    }
    // If attributes are different, update them
    diffAtts(templateMap[index], domMap[index]);
    // If content is different, update it
    if (templateMap[index].content !== domMap[index].content) {
      domMap[index].node.textContent = templateMap[index].content;
    }
    // If target element should be empty, wipe it
    if (domMap[index].children.length > 0 && node.children.length < 1) {
      domMap[index].node.innerHTML = '';
      return;
    }
    // If element is empty and shouldn't be, build it up
    // This uses a document fragment to minimize reflows
    if (domMap[index].children.length < 1 && node.children.length > 0) {
      const fragment = document.createDocumentFragment();
      diffDomMap(node.children, domMap[index].children, fragment);
      elem.appendChild(fragment);
      return;
    }
    // If there are existing child elements that need to be modified, diff them
    if (node.children.length > 0) {
      diffDomMap(node.children, domMap[index].children, domMap[index].node);
    }
  });
};

// WebCardinal State
async function resolveRoutingState(self) {
  // /**
  //  * Routing configuration received from <code>webc-app-router</code>.
  //  */
  // @Event({
  //   eventName: 'webcardinal:routing:get',
  //   bubbles: true,
  //   cancelable: true,
  //   composed: true,
  // })
  // getRoutingStateEvent: EventEmitter<RoutingState>;
  try {
    return await promisifyEventEmit(self.getRoutingStateEvent);
  }
  catch (error) {
    console.error('Routing configuration can not be obtained from "webc-app-loader"!\n', error);
    return null;
  }
}

function trim(path) {
  return trimEnd(trimStart(path));
}
function trimStart(path = '') {
  return path.startsWith('/') ? path.slice(1) : path;
}
function trimEnd(path = '') {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
const URLHelper = {
  trim,
  trimEnd,
  trimStart,
  join: (base, ...paths) => {
    let result = new URL(trimEnd(window.location.origin) + '/');
    for (let path of paths) {
      path = trimEnd(path);
      if (path === '')
        continue;
      result = new URL(path + '/', result);
    }
    base = trim(base);
    if (base !== '') {
      result = new URL(base + '/' + trim(result.pathname), trim(result.origin));
    }
    return {
      href: trimEnd(result.href),
      pathname: trimEnd(result.pathname) || '/',
    };
  },
};
async function loadHTML(path) {
  try {
    const response = await fetch(`${path}.html`);
    const content = await response.text();
    if (!response.ok) {
      throw new Error(content);
    }
    return [null, content];
  }
  catch (error) {
    return [error];
  }
}
async function loadJS(path) {
  try {
    const script = await import(`${path}.js`);
    return script.default || script;
  }
  catch (error) {
    // console.error(error);
    return;
  }
}
async function loadJSON(path) {
  try {
    const response = await fetch(`${path}.json`);
    if (!response.ok) {
      const content = await response.text();
      throw new Error(content);
    }
    const json = await response.json();
    return [null, json];
  }
  catch (error) {
    return [error];
  }
}
function getTranslationsFromState() {
  var _a, _b, _c;
  if (!((_a = window.WebCardinal) === null || _a === void 0 ? void 0 : _a.state) || typeof ((_c = (_b = window.WebCardinal) === null || _b === void 0 ? void 0 : _b.state) === null || _c === void 0 ? void 0 : _c.translations) !== 'boolean') {
    console.warn([
      `Preferred "translations" can not be found in WebCardinal.state!`,
      `The fallback for translations is "true".`
    ].join('\n'), window.WebCardinal);
    return true;
  }
  return window.WebCardinal.state.translations;
}
function getSkinFromState() {
  var _a, _b, _c, _d;
  if (!((_b = (_a = window.WebCardinal) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.skin) || typeof ((_d = (_c = window.WebCardinal) === null || _c === void 0 ? void 0 : _c.state) === null || _d === void 0 ? void 0 : _d.skin) !== 'string') {
    console.warn([
      `Preferred "skin" can not be found in WebCardinal.state!`,
      `The fallback for skin is "default".`
    ].join('\n'), window.WebCardinal);
    return 'default';
  }
  return window.WebCardinal.state.skin;
}
function getSkinPathFromState() {
  const skin = getSkinFromState();
  return skin !== 'default' ? `${SKINS_PATH}/${skin}` : '';
}
function getPathname() {
  let { pathname } = window.location;
  if (pathname.endsWith('/') && pathname !== '/') {
    // trim pathname if ends with "/", except for the corner case when pathname === "/"
    pathname = pathname.slice(0, -1);
  }
  if (window.parent !== window) {
    // presumption that current WebCardinal app is in a SSAPP
    return URLHelper.join(window.WebCardinal.basePath, pathname).pathname;
  }
  return pathname;
}

function extractCallback(event) {
  let callback;
  if (typeof event.detail === 'function') {
    callback = event.detail;
  }
  else if (event.detail && typeof event.detail.callback === 'function') {
    callback = event.detail.callback;
  }
  if (!callback) {
    console.warn(`Invalid callback for event`, event);
    return;
  }
  return callback;
}
function listenForPrefixChainEvents(element, completeChain) {
  if (!element.hasAttribute(FOR_TEMPLATE_SIZE)) {
    element.setAttribute(FOR_TEMPLATE_SIZE, `${element.children.length}`);
  }
  element.addEventListener(EVENT_PARENT_CHAIN_GET, (evt) => {
    evt.stopImmediatePropagation();
    const callback = extractCallback(evt);
    if (!callback) {
      return;
    }
    if (evt.target && typeof evt.target['tagName'] !== 'string') {
      return callback(undefined, completeChain);
    }
    let node = evt.target;
    if (evt.target['tagName'].toLowerCase() === 'webc-component') {
      node = node.parentElement;
    }
    let curentIterationNode = node;
    while (curentIterationNode.parentElement && !curentIterationNode.parentElement.hasAttribute(FOR_ATTRIBUTE)) {
      curentIterationNode = curentIterationNode.parentElement;
    }
    if (!curentIterationNode) {
      return callback(undefined, completeChain);
    }
    let index = Array.from(element.children).indexOf(curentIterationNode);
    if (index < 0) {
      return callback(undefined, completeChain);
    }
    let stepper = Number.parseInt(element.getAttribute(FOR_TEMPLATE_SIZE));
    if (Number.isNaN(stepper) || stepper <= 0) {
      stepper = 1;
    }
    index = Math.floor(index / stepper);
    const chain = getCompleteChain(completeChain, index);
    return callback(undefined, chain);
  });
}

export { removeSlotInfoFromElement as $, ASSETS_PATH as A, CP_WEBC_APP_ROOT_MODE as B, CUSTOM_ELEMENTS_PATH as C, DISABLE_BINDING as D, CP_WEBC_APP_ROOT_MOBILE_BREAKPOINT as E, FOR_ATTRIBUTE as F, EVENT_CONFIG_GET_CORE_TYPE as G, HYDRATED as H, IF_ATTRIBUTE as I, EVENT_CONFIG_GET_DOCS_SOURCE as J, EVENT_CONFIG_GET_IDENTITY as K, LOG_LEVEL as L, MODALS_PATH as M, EVENT_CONFIG_GET_LOG_LEVEL as N, EVENT_CONFIG_GET_ROUTING as O, PAGES_PATH as P, EVENT_MODEL_GET as Q, EVENT_ROUTING_GET as R, SKINS_PATH as S, TEMPLATES_PATH as T, EVENT_TAGS_GET as U, VIEW_MODEL_KEY as V, EVENT_TRANSLATION_MODEL_GET as W, EVENT_PARENT_CHAIN_GET as X, getClosestParentElement as Y, setElementValue as Z, bindElementAttributes as _, SCRIPTS_PATH as a, bindElementChangeToModelProperty as a0, bindElementChangeToModel as a1, isAttributePresentOnElement as a2, getSlots as a3, getSlotContent as a4, removeElementChildren as a5, removeElementChildNodes as a6, getCompleteChain as a7, convertCSSTimeToMs as a8, extractChain as a9, mergeChains as aa, setElementChainChangeHandler as ab, setElementExpressionChangeHandler as ac, removeChangeHandler as ad, promisifyEventEmit as ae, promisifyEventDispatch as af, createDomMap as ag, diffDomMap as ah, stringToHTML as ai, resolveRoutingState as aj, URLHelper as ak, loadHTML as al, loadJS as am, loadJSON as an, getTranslationsFromState as ao, getSkinFromState as ap, getSkinPathFromState as aq, getPathname as ar, extractCallback as as, listenForPrefixChainEvents as at, MODEL_KEY as b, DEFAULT_CONTROLLER_KEY as c, MODEL_CHAIN_PREFIX as d, TRANSLATION_CHAIN_PREFIX as e, SKIP_BINDING_FOR_PROPERTIES as f, SKIP_BINDING_FOR_COMPONENTS as g, PSK_CARDINAL_PREFIX as h, TAG_ATTRIBUTE as i, TAG_MODEL_FUNCTION_PROPERTY as j, FOR_NO_DATA_SLOT_NAME as k, FOR_LOADIBNG_SLOT_NAME as l, FOR_OPTIONS as m, FOR_EVENTS as n, FOR_OPTIMISTIC as o, FOR_WRAPPER_RERENDER as p, FOR_CONTENT_UPDATED_EVENT as q, FOR_CONTENT_REPLACED_EVENT as r, FOR_TEMPLATE_SIZE as s, IF_TRUE_CONDITION_SLOT_NAME as t, IF_FALSE_CONDITION_SLOT_NAME as u, IF_NO_DATA_SLOT_NAME as v, IF_LOADIBNG_SLOT_NAME as w, ID_DEFAULT_SKIN_CSS as x, ID_CUSTOM_SKIN_CSS as y, HOOK_TYPE as z };
