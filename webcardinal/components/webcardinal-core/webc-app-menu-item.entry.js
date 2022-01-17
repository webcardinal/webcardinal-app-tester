import { r as registerInstance, h, f as Host } from './index-30eb7fef.js';
import { ak as URLHelper } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';

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
const { join } = URLHelper;
const WebcAppMenuItem = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.menuElement = null;
    this.url = null;
    this.basePath = '';
    this.item = {
      path: '',
      children: null,
    };
    this.level = 0;
    this.name = '';
  }
  async activate() {
    if (['vertical', 'horizontal', 'mobile'].includes(this.mode)) {
      if (this.host.getAttribute('url') === window.location.pathname) {
        let element = this.host;
        element.setAttribute('active', '');
        while (element.tagName.toLowerCase() !== 'webc-app-menu') {
          if (element.classList.contains('dropdown')) {
            element.setAttribute('active', '');
          }
          element = element.parentElement;
        }
        // element is webc-app-menu
        if ('mobile' === this.mode) {
          element.removeAttribute('visible');
          element.removeAttribute('active');
        }
      }
      return;
    }
  }
  async deactivate() {
    this.menuElement.querySelectorAll('webc-app-menu-item').forEach(element => {
      element.removeAttribute('active');
      if ('horizontal' === this.mode) {
        if (typeof element['level'] === 'number' && element['level'] === 0) {
          element.firstElementChild.removeAttribute('active');
        }
      }
    });
  }
  async handleDropdownClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ('vertical' === this.mode) {
      const item = e.currentTarget;
      const dropdown = item.parentElement;
      await this.deactivate();
      dropdown.toggleAttribute('active');
      return;
    }
    if ('horizontal' === this.mode) {
      const item = e.currentTarget;
      const dropdown = item.parentElement;
      const element = dropdown.parentElement;
      if (typeof element['level'] === 'number' && element['level'] !== 0) {
        dropdown.toggleAttribute('active');
      }
      return;
    }
    if ('mobile' === this.mode) {
      const item = e.currentTarget;
      const dropdown = item.parentElement;
      await this.deactivate();
      dropdown.toggleAttribute('active');
      return;
    }
  }
  async componentWillLoad() {
    if (!this.url) {
      this.url = join(this.item.path).pathname;
    }
    if (this.url === '') {
      this.url = '/';
    }
    if (this.item.children) {
      this.children = [];
      const props = {
        basePath: this.basePath,
        menuElement: this.menuElement,
        mode: this.mode,
        level: this.level + 1,
      };
      this.item.children.forEach(item => {
        props.name = item.name;
        props.item = {
          path: join('', this.item.path, item.path).pathname,
        };
        if (item.children) {
          props.item.children = item.children;
        }
        this.children.push(h("webc-app-menu-item", Object.assign({}, props)));
      });
    }
  }
  async componentDidLoad() {
    await this.activate();
  }
  render() {
    if (this.children) {
      return (h("div", { class: "dropdown" }, h("div", { class: "item", onClick: this.handleDropdownClick.bind(this) }, this.name), h("div", { class: "items" }, this.children)));
    }
    return (h(Host, { url: this.url }, h("stencil-route-link", { class: "item", url: this.url }, this.name)));
  }
};
__decorate([
  HostElement()
], WebcAppMenuItem.prototype, "host", void 0);

export { WebcAppMenuItem as webc_app_menu_item };
