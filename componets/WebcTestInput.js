export default class WebcTestInput extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.elements = {
      stylesheet: Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href: "/assets/css/custom-components/webc-test-input.css",
      }),
      container: document.createElement("div"),
      label: document.createElement("label"),
      input: document.createElement("input")
    };

    this.elements.container.append(this.elements.label, this.elements.input);
    this.shadowRoot.append(this.elements.stylesheet, this.elements.container)
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)

    const { label, input } = this.elements;

    label.innerText = this.getAttribute("label");
    input.type = this.getAttribute("type");
    input.value = this.value;
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return ["label", "type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified

    switch (name) {
      case "label": {
        this.elements.label.innerText = newValue;
        return;
      }
      case "type": {
        this.elements.input.type = newValue;
      }
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  set value(value) {
    this.elements.input.value = value;
  }

  get value() {
    return this.elements.input.value;
  }

  // there can be other element methods and properties
}