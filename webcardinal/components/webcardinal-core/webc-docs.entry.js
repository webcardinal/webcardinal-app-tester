import { r as registerInstance, e as createEvent, h, f as Host } from './index-30eb7fef.js';
import { ae as promisifyEventEmit } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';

const defaultWebcDocsCss = ".psk-card .card-body div{padding:0 !important}.docs-section article{padding-bottom:1.5rem !important}.docs-section article>h3,.docs-section .table>h3{margin:0 0 0.15rem 0 !important;padding:2rem 0.65rem 0.4rem 0.4rem !important;font-size:1.15rem;font-weight:bolder;border-radius:3px;overflow:hidden;background-color:rgba(0, 0, 0, 0.02)}.docs-section .psk-card .card-body .table{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0.4rem 1rem}.docs-section .psk-card .card-body article .table{padding:0 0.4rem !important;gap:0.35rem 1.5rem}.docs-section .table>span{font-size:0.9rem;font-weight:lighter}.docs-section .table>div{font-size:1rem;text-align:left}.docs-section.listeners code,.docs-section .table code{background:whitesmoke;padding:2px 5px;border-radius:3px;color:#212121;font-size:0.9rem}.docs-section .table>span>code,.docs-section .table>div>code{color:#008A64}.docs-section .table.table-with-head{display:grid;grid-template-columns:auto 1fr;gap:1rem}.docs-section.tag{margin-top:0.65rem;display:flex;justify-content:space-between;align-items:center}.docs-section.tag h1{font-size:1.65rem}.docs-section.tag .encapsulation{border:1px solid whitesmoke;padding:0.25rem 0.5rem;border-radius:100px}.docs-section.description p{padding-top:0}.docs-section.styles .table.table-with-head{grid-template-columns:1fr auto}.docs-section.listeners p{display:inline-block;padding-right:0.25rem}.docs-section.listeners code{margin:0 0.25rem}";

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
var __rest = (undefined && undefined.__rest) || function (s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
const WebcContainer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getDocsSourceConfigEvent = createEvent(this, "webcardinal:config:getDocsSource", 7);
    /**
     * If this prop is set to <code>true</code> the source of fetched docs for current webc-docs component must be on your
     * local workspace. Otherwise the source is <small><code>https://raw.githubusercontent.com</code></small>.
     */
    this.local = false;
    this.content = [];
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    try {
      const docsSource = await promisifyEventEmit(this.getDocsSourceConfigEvent);
      if (docsSource === 'local') {
        this.local = true;
      }
    }
    catch (error) {
      console.error(`"docsSource" can not be obtained from "webcardinal.json"!\n`, error);
      return;
    }
    try {
      let cheatsheetPath = new URL('/docs/cheatsheet.json', window.location.origin).href;
      const response = await fetch(cheatsheetPath);
      this.cheatsheet = await response.json();
    }
    catch (error) {
      console.error(`"cheatsheet.json" can not be obtained!\n`, error);
      return;
    }
    let component = this.for;
    if (!this.cheatsheet[component]) {
      console.error(`Component "${component}" does not exist in cheatsheet!`);
      return;
    }
    let library = this.cheatsheet[component].source;
    library = library.substr(1).replace('/', '-');
    this.origin = `https://raw.githubusercontent.com/webcardinal/${library}/master`;
    if (this.local) {
      this.origin = new URL(`.dev/webcardinal/.webcardinal/components/${library}`, window.location.origin).href;
      console.warn(`Local docs is active!`);
    }
    let source = `${this.origin}/docs/custom/components/${component}.json`;
    try {
      let componentDocsPath = new URL(source).href;
      const response = await fetch(componentDocsPath);
      this.docs = await response.json();
    }
    catch (error) {
      console.error(`Docs for component "${component}" can not be fetched!\n`, error);
      return;
    }
  }
  appendTagAndEncapsulation() {
    const { tag, encapsulation } = this.docs;
    this.content.push(h("section", { class: "docs-section tag" }, h("h1", null, h("code", null, `<${tag}/>`)), encapsulation !== 'none' ? h("span", { class: "encapsulation" }, encapsulation) : null));
  }
  appendSlot() {
    if (this.host.childNodes.length > 0) {
      this.content.push(h("slot", null));
    }
  }
  appendSummary() {
    const { docs } = this.docs;
    if (!docs) {
      return;
    }
    this.content.push(h("psk-description", { class: "docs-section description", title: "Summary" }, h("p", { innerHTML: docs })));
  }
  appendProps() {
    const { props } = this.docs;
    if (!props || props.length === 0) {
      return;
    }
    const describeProp = (_a) => {
      var { name, docs, attr, type, required } = _a, rest = __rest(_a, ["name", "docs", "attr", "type", "required"]);
      return (h("article", { class: "property", "data-docs-attribute": attr }, h("h3", null, name), h("div", { class: "table" }, docs ? [h("span", null, "Description"), h("div", { innerHTML: docs })] : null, attr
        ? [
          h("span", null, "Attribute"),
          h("div", null, h("code", null, h("strong", null, attr))),
        ]
        : null, h("span", null, "Type"), h("div", null, h("code", null, type)), rest.default
        ? [
          h("span", null, "Default"),
          h("div", null, h("code", null, rest.default)),
        ]
        : null)));
    };
    this.content.push(h("psk-chapter", { class: "docs-section properties", title: "Properties" }, props.map(prop => describeProp(prop))));
  }
  appendMethods() {
    const { methods } = this.docs;
    if (!methods || methods.length === 0) {
      return;
    }
    const describeMethod = ({ name, docs, signature }) => {
      return (h("article", { class: "method", "data-docs-method": name }, h("h3", null, name), h("div", { class: "table" }, docs ? [h("span", null, "Description"), h("div", { innerHTML: docs })] : null, h("span", null, "Signature"), h("div", null, h("code", null, signature)))));
    };
    this.content.push(h("psk-chapter", { class: "docs-section methods", title: "Methods" }, methods.map(method => describeMethod(method))));
  }
  appendEvents() {
    const { events } = this.docs;
    if (!events || events.length === 0) {
      return;
    }
    const describeEvent = ({ event, docs }) => {
      return (h("article", { class: "event", "data-docs-event": event }, h("h3", null, event), docs ? (h("div", { class: "table" }, h("span", null, "Description"), h("div", { innerHTML: docs }))) : null));
    };
    this.content.push(h("psk-chapter", { class: "docs-section events", title: "Events" }, events.map(event => describeEvent(event))));
  }
  appendListeners() {
    const { listeners } = this.docs;
    if (!listeners || listeners.length === 0) {
      return;
    }
    const describeListener = ({ event }) => {
      return (h("code", { class: "listener", "data-docs-event": event }, event));
    };
    this.content.push(h("psk-chapter", { class: "docs-section listeners", title: "Listeners" }, listeners && listeners.length > 0 ? h("p", null, "To the following events: ") : null, listeners.map(listener => describeListener(listener))));
  }
  appendSlots() {
    const { slots } = this.docs;
    if (!slots || slots.length === 0) {
      return;
    }
    const describeSlots = ({ name, docs }) => {
      return [h("div", { "data-docs-slot": name }, name ? h("code", null, name) : null), h("div", { innerHTML: docs })];
    };
    this.content.push(h("psk-chapter", { class: "docs-section slots", title: "Slots" }, h("div", { class: "table table-with-head" }, h("h3", null, "Name"), h("h3", null, "Description"), slots.map(slot => describeSlots(slot)))));
  }
  appendCSSVariables() {
    const { styles } = this.docs;
    if (!styles || styles.length === 0) {
      return;
    }
    let found = false;
    for (let style of styles) {
      if (style.docs)
        found = true;
    }
    const describeStyle = ({ name, docs }) => {
      const style = { gridColumn: !docs ? '1 / -1' : null };
      return [
        h("div", { "data-docs-style": name, style: style }, h("code", null, name)),
        docs ? h("div", { innerHTML: docs }) : null,
      ];
    };
    this.content.push(h("psk-chapter", { class: "docs-section styles", title: "CSS Variables" }, h("div", { class: "table table-with-head" }, h("h3", null, "Name"), found ? h("h3", null, "Description") : null, styles.map(slot => slot.annotation === 'prop' && describeStyle(slot))), h("p", null, "Check", ' ', h("a", { href: `${this.origin}/src/globals/styles/_variables.css` }, "the list with all ", h("code", { style: { color: 'currentColor' } }, "--webc-custom-properties")), ".")));
  }
  render() {
    if (!this.docs) {
      return;
    }
    this.appendTagAndEncapsulation();
    this.appendSummary();
    this.appendSlot();
    this.appendProps();
    this.appendMethods();
    this.appendEvents();
    this.appendListeners();
    this.appendSlots();
    this.appendCSSVariables();
    return h(Host, { class: "webc-docs" }, " ", this.content);
  }
};
__decorate([
  HostElement()
], WebcContainer.prototype, "host", void 0);
WebcContainer.style = {
  default: defaultWebcDocsCss
};

export { WebcContainer as webc_docs };
