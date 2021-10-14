import { r as registerInstance, e as createEvent, h, f as Host } from './index-60428ce4.js';
import { d as MODEL_CHAIN_PREFIX, a9 as promisifyEventEmit, F as FOR_ATTRIBUTE, l as FOR_OPTIONS, m as FOR_EVENTS, q as FOR_CONTENT_REPLACED_EVENT, p as FOR_CONTENT_UPDATED_EVENT } from './index-8ae4b65b.js';
import { H as HostElement } from './index-b92a2e6e.js';
import { i as isTextNode, c as isElementNode, B as BindingService, C as ComponentsListenerService } from './index-d3647f32.js';

function getPagination(currentPage, numberOfPages, delta = 2) {
  const range = [];
  const rangeWithDots = [];
  if (numberOfPages <= 1) {
    return range;
  }
  range.push(1);
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i < numberOfPages && i > 1) {
      range.push(i);
    }
  }
  range.push(numberOfPages);
  let l;
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      }
      else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

const defaultWebcDatatableCss = ":host .pagination{display:flex;gap:var(--pagination-gap);justify-content:center}:host .pagination>button{font-size:inherit;border:var(--pagination-button-border);background:var(--pagination-button-background)}:host .pagination>button:not([disabled]){cursor:pointer}:host .pagination>button[active]{color:inherit;font-weight:bold}";

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
const DATA_SORTABLE_STYLES = `
[data-sortable] {
    --header-arrow-size: 0.25rem;
    --header-arrow-color: #BBBBBB;

    cursor: pointer;
    position: relative;
    padding-right: calc(5 * var(--header-arrow-size));
}

[data-sortable]::before,
[data-sortable]::after {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    right: 4px;
    border-left: var(--header-arrow-size) solid transparent;
    border-right: var(--header-arrow-size) solid transparent;
    opacity: 1;
}

[data-sortable]::before {
    border-bottom: var(--header-arrow-size) solid var(--header-arrow-color);
    border-top: var(--header-arrow-size) solid transparent;
    bottom: 55%;
}

[data-sortable]::after {
    border-top: var(--header-arrow-size) solid var(--header-arrow-color);
    top: 55%;
}
`;
const DATA_INTERNAL_CHAIN = `data`;
const WebcDatatable = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getModelEvent = createEvent(this, "webcardinal:model:get", 7);
    this.pageSize = 20;
    this.pageSizeDelta = 2;
    this.curentPageIndex = 0;
    this.hidePagination = false;
    this.templateChildrenCount = 0;
    this.childrenCount = 0;
    this.getTemplatesFromDOM = () => {
      const templates = {
        header: [],
        data: [],
      };
      const slots = Object.keys(templates);
      for (const childNode of Array.from(this.host.childNodes)) {
        if (isTextNode(childNode)) {
          templates['data'].push(childNode);
          continue;
        }
        if (isElementNode(childNode)) {
          const child = childNode;
          if (!child.hasAttribute('slot')) {
            templates['data'].push(child);
            this.childrenCount++;
            continue;
          }
          if (slots.includes(child.slot)) {
            const { slot } = child;
            child.removeAttribute('slot');
            child.classList.add(`webc-datatable--${slot}`);
            templates[slot].push(child);
            this.childrenCount++;
          }
        }
      }
      return templates;
    };
    this.getDataSourceFromModel = async () => {
      let { chain } = this;
      if (chain.startsWith(MODEL_CHAIN_PREFIX)) {
        chain = chain.substring(1);
      }
      const model = await promisifyEventEmit(this.getModelEvent);
      return model.getChainValue(chain);
    };
    // private storeDataSourceToWindow = () => {
    //   const { page } = window.WebCardinal.state;
    //   if (!page.dataSources) {
    //     page.dataSources = {};
    //   }
    //   if (!page.dataSources[this.datasource]) {
    //     page.dataSources[this.datasource] = this.dataSource;
    //   }
    // };
    this.renderPagination = () => {
      const pageIndex = this.curentPageIndex + 1;
      const numberOfPages = this.dataSize ? Math.ceil(this.dataSize / this.pageSize) : 1;
      const result = [];
      const pagination = getPagination(pageIndex, numberOfPages, this.pageSizeDelta);
      for (const i of pagination) {
        if (typeof i === 'number') {
          if (i === pageIndex) {
            result.push(
            // @ts-ignore
            h("button", { active: true, part: "pagination-button pagination-button--active", disabled: true }, i));
            continue;
          }
          result.push(h("button", { part: "pagination-button", onClick: () => this.dataSource.goToPageByIndex(i - 1) }, i));
          continue;
        }
        if (typeof i === 'string') {
          result.push(i);
        }
      }
      if (numberOfPages !== 1) {
        result.unshift(h("button", { part: "pagination-button pagination-button--previous", disabled: pageIndex === 1, onClick: () => this.dataSource.goToPreviousPage() }, '‹'));
        result.push(h("button", { part: "pagination-button pagination-button--next", disabled: pageIndex === numberOfPages, onClick: () => this.dataSource.goToNextPage() }, '›'));
      }
      return result;
    };
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    this.dataSource = await this.getDataSourceFromModel();
    const { DataSource } = window.WebCardinal.dataSources;
    if (!this.dataSource || typeof this.dataSource !== 'object' || !(this.dataSource instanceof DataSource)) {
      console.error(`An invalid WebCardinal DataSource instance received: "${this.chain}"! [1]`, this.dataSource);
      return;
    }
    try {
      this.model = await this.dataSource._init(() => this.host);
    }
    catch (error) {
      console.error(`An invalid WebCardinal DataSource instance received: "${this.chain}"! [2]`, this.dataSource);
      this.dataSource = undefined;
      return;
    }
    const { header, data } = this.getTemplatesFromDOM();
    this.host.classList.add('webc-datatable');
    const dataSortableStyles = document.createElement('style');
    dataSortableStyles.innerHTML = DATA_SORTABLE_STYLES;
    const dataTable = document.createElement('div');
    dataTable.setAttribute('slot', 'data');
    dataTable.classList.add('webc-datatable--container');
    dataTable.setAttribute('data-for-children-count', `${this.childrenCount}`);
    dataTable.setAttribute(FOR_ATTRIBUTE, `${MODEL_CHAIN_PREFIX}${DATA_INTERNAL_CHAIN}`);
    dataTable.setAttribute(FOR_OPTIONS, `${FOR_EVENTS}`);
    dataTable.append(...data);
    dataTable.addEventListener(FOR_CONTENT_REPLACED_EVENT, event => {
      event.stopImmediatePropagation();
      dataTable.prepend(...header);
    });
    dataTable.addEventListener(FOR_CONTENT_UPDATED_EVENT, event => {
      event.stopImmediatePropagation();
    });
    this.host.append(dataSortableStyles, dataTable);
    BindingService.bindChildNodes(this.host, {
      model: this.model,
      translationModel: {},
      recursive: true,
      enableTranslations: false,
    });
    this.listeners = new ComponentsListenerService(this.host, {
      model: this.model,
      translationModel: {},
      chain: `${MODEL_CHAIN_PREFIX}${DATA_INTERNAL_CHAIN}`
    });
    this.listeners.getModel.add();
    this.listeners.getTranslationModel.add();
    this.listeners.getParentChain.add();
    dataTable.prepend(...header);
    this.dataSource._renderPageAsync();
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
  }
  async fillCurrentPage(data) {
    this.model.data = data;
  }
  async clearCurrentPage() {
    this.model.data.length = 0;
  }
  pageSizeHandler() {
    this.dataSource._renderPageAsync();
  }
  render() {
    return this.dataSource ? (h(Host, null, h("slot", { name: "before" }), h("slot", { name: "data" }), this.hidePagination ? null : (h("div", { part: "pagination", class: "pagination" }, this.renderPagination())), h("slot", { name: "footer" }), h("slot", { name: "after" }))) : null;
  }
  static get watchers() { return {
    "pageSize": ["pageSizeHandler"]
  }; }
};
__decorate([
  HostElement()
], WebcDatatable.prototype, "host", void 0);
WebcDatatable.style = {
  default: defaultWebcDatatableCss
};

export { WebcDatatable as webc_datatable };
