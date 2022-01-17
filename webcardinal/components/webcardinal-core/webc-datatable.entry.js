import { r as registerInstance, e as createEvent, h, f as Host } from './index-30eb7fef.js';
import { d as MODEL_CHAIN_PREFIX, ae as promisifyEventEmit, D as DISABLE_BINDING, s as FOR_TEMPLATE_SIZE, F as FOR_ATTRIBUTE, m as FOR_OPTIONS, n as FOR_EVENTS, o as FOR_OPTIMISTIC, r as FOR_CONTENT_REPLACED_EVENT, q as FOR_CONTENT_UPDATED_EVENT } from './index-0e9697d2.js';
import { H as HostElement } from './index-482a933e.js';
import { i as isTextNode, c as isElementNode, B as BindingService, C as ComponentsListenerService } from './index-8a818fc7.js';

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
const DATA_INTERNAL_CHAIN = `data`;
const WebcDatatable = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getModelEvent = createEvent(this, "webcardinal:model:get", 7);
    this.getTranslationModelEvent = createEvent(this, "webcardinal:translationModel:get", 7);
    this.pageSize = 0;
    this.pageSizeDelta = 2;
    this.curentPageIndex = 0;
    this.lastPageIndex = 0;
    this.hidePagination = false;
    this.useInfiniteScroll = false;
    this.useOptimisticMode = false;
    this.loading = false;
    this.childrenCount = 0;
    this.bootConfig = {
      hidePagination: false,
    };
    this.getTemplatesFromDOM = () => {
      const templates = {
        header: [],
        data: [],
        loading: [],
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
    this.createDataTableWithPagination = () => {
      const { header, data, loading } = this.getTemplatesFromDOM();
      header.forEach(element => element.setAttribute(DISABLE_BINDING, ''));
      const dataTable = document.createElement('div');
      dataTable.setAttribute('slot', 'data');
      dataTable.classList.add('webc-datatable--container');
      dataTable.setAttribute(FOR_TEMPLATE_SIZE, `${this.childrenCount}`);
      dataTable.setAttribute(FOR_ATTRIBUTE, `${MODEL_CHAIN_PREFIX}${DATA_INTERNAL_CHAIN}`);
      dataTable.setAttribute(FOR_OPTIONS, `${FOR_EVENTS}${this.useOptimisticMode ? ` ${FOR_OPTIMISTIC}` : ''}`);
      dataTable.addEventListener(FOR_CONTENT_REPLACED_EVENT, event => {
        event.stopPropagation();
        dataTable.prepend(...header);
      });
      dataTable.addEventListener(FOR_CONTENT_UPDATED_EVENT, event => {
        event.stopPropagation();
      });
      if (this.useInfiniteScroll) {
        for (const element of loading) {
          element.remove();
        }
      }
      else {
        if (loading.length === 0) {
          const webcSpinner = this.createDefaultSpinner();
          webcSpinner.style.position = 'relative';
          webcSpinner.style.margin = '0 auto';
          loading.push(webcSpinner);
        }
        for (const element of loading) {
          element.setAttribute('slot', 'loading');
          dataTable.append(element);
        }
      }
      dataTable.append(...data);
      const afterBindingCallback = () => {
        header.forEach(element => element.removeAttribute(DISABLE_BINDING));
        // This is quite unorthodox, we are wrapping all header slots in a single div,
        // This div is bounded by BindingService
        // Then all the child nodes are inserted in webc-datatable
        const hiddenWrapper = document.createElement('div');
        hiddenWrapper.append(...header);
        BindingService.bindChildNodes(hiddenWrapper, {
          model: this.model,
          translationModel: this.translationModel,
          recursive: true,
          enableTranslations: true,
        });
        dataTable.prepend(...Array.from(hiddenWrapper.childNodes));
        // Real life scenario reveals that this solution is more optimal than multiple BindingService.bindElement
        // also 'data-for' would be affected in the above use-case
      };
      return {
        dataTable,
        afterBindingCallback,
        loading,
      };
    };
    this.createDataTableWithInfiniteScroll = () => {
      if (!customElements.get('ion-infinite-scroll') || !customElements.get('ion-infinite-scroll-content')) {
        console.error([
          `For Infinit Scroll webc-datatable uses Ionic (v5)!`,
          `Please add Ionic distribution to your application!`,
        ].join('\n'));
        console.warn('Fallback to pagination mode for webc-datatable!');
        return this.createDataTableWithPagination();
      }
      const { dataTable: internDataTable, afterBindingCallback: internAfterBindingCallback, loading: loadingSlots, } = this.createDataTableWithPagination();
      internDataTable.removeAttribute('slot');
      const ionContent = document.createElement('ion-content');
      ionContent.style.setProperty('--background', 'transparent');
      ionContent.scrollY = false;
      ionContent.append(internDataTable);
      const dataTable = document.createElement('div');
      dataTable.classList.add('webc-datatable--scroll');
      dataTable.setAttribute('slot', 'data');
      dataTable.append(ionContent);
      // after first render of data-for, the height of ion-content (parent of .webc-datatable--container) must be set
      // this is made automatically base on first bucket/page of items that are rendered
      // watch property "height" in styles of ion-content, the main conclusion is that
      // the height of webc-datasource in infinite scroll mode is equal with the height of first bucket of items
      // if a static height is desired, set '--height' custom property for webc-datatable (or for ion-content)
      const internDataTableCallback = event => {
        event.stopPropagation();
        internDataTable.removeEventListener(FOR_CONTENT_REPLACED_EVENT, internDataTableCallback);
        internDataTable.removeEventListener(FOR_CONTENT_UPDATED_EVENT, internDataTableCallback);
        ionContent.scrollY = true;
        window.requestAnimationFrame(() => {
          ionContent.style.height = `var(--height, ${internDataTable.scrollHeight}px)`;
        });
      };
      // after BindingService does his job, other nodes must be injected into the webc-datatable
      // for example ion-infinite-scroll and infinite-infinit-scroll-content
      const afterBindingCallback = () => {
        internAfterBindingCallback();
        const ionInfiniteContent = document.createElement('ion-infinite-scroll-content');
        ionInfiniteContent.loadingSpinner = null;
        if (loadingSlots.length > 0) {
          const div = document.createElement('div');
          div.append(...loadingSlots);
          ionInfiniteContent.componentOnReady().then(() => {
            ionInfiniteContent.firstElementChild.append(div);
          });
        }
        else {
          const webcSpinner = this.createDefaultSpinner();
          ionInfiniteContent.loadingText = webcSpinner.outerHTML;
        }
        this.infinitScroll = document.createElement('ion-infinite-scroll');
        this.infinitScroll.classList.add('infinite-scroll-enabled', 'infinite-scroll-loading');
        let currentPageIndex = 0;
        this.infinitScroll.addEventListener('ionInfinite', async (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
          currentPageIndex++;
          await this.dataSource._renderPageAsync(currentPageIndex);
          window.requestAnimationFrame(() => this.infinitScroll.complete());
        });
        this.infinitScroll.append(ionInfiniteContent);
        this.infinitScroll.componentOnReady().then(() => {
          ionContent.style.height = `var(--height, ${internDataTable.scrollHeight + this.infinitScroll.scrollHeight}px)`;
        });
        ionContent.append(this.infinitScroll);
      };
      internDataTable.addEventListener(FOR_CONTENT_REPLACED_EVENT, internDataTableCallback);
      internDataTable.addEventListener(FOR_CONTENT_UPDATED_EVENT, internDataTableCallback);
      return { dataTable, afterBindingCallback };
    };
    this.createDefaultSpinner = () => {
      const webcSpinner = document.createElement('webc-spinner');
      webcSpinner.classList.add('webc-datatable--loading');
      return webcSpinner;
    };
    this.createDefaultPagination = () => {
      const pageIndex = this.curentPageIndex + 1;
      const numberOfPages = this.lastPageIndex;
      const result = [];
      const pagination = getPagination(pageIndex, numberOfPages, this.pageSizeDelta);
      for (const i of pagination) {
        if (typeof i === 'number') {
          if (i === pageIndex) {
            result.push(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            h("button", { active: true, part: 'pagination-button pagination-button--active', disabled: true }, i));
            continue;
          }
          result.push(h("button", { part: 'pagination-button', onClick: () => this.dataSource.goToPageByIndex(i - 1) }, i));
          continue;
        }
        if (typeof i === 'string') {
          result.push(i);
        }
      }
      if (numberOfPages !== 1) {
        result.unshift(h("button", { part: 'pagination-button pagination-button--previous', disabled: pageIndex === 1, onClick: () => this.dataSource.goToPreviousPage() }, '‹'));
        result.push(h("button", { part: 'pagination-button pagination-button--next', disabled: pageIndex === numberOfPages, onClick: () => this.dataSource.goToNextPage() }, '›'));
      }
      return result;
    };
    this.managePagination = () => {
      this.model.pageNumbers = {
        current: this.curentPageIndex + 1,
        start: 1,
        end: this.lastPageIndex,
      };
      if (this.hidePagination || this.useInfiniteScroll) {
        return null;
      }
      return (h("div", { part: 'pagination', class: 'pagination' }, this.createDefaultPagination()));
    };
  }
  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }
    this.bootConfig.hidePagination = this.hidePagination;
    this.dataSource = await this.getDataSourceFromModel();
    this.translationModel = await promisifyEventEmit(this.getTranslationModelEvent);
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
    this.host.classList.add('webc-datatable');
    const { dataTable, afterBindingCallback } = this.useInfiniteScroll
      ? this.createDataTableWithInfiniteScroll()
      : this.createDataTableWithPagination();
    this.host.append(dataTable);
    BindingService.bindChildNodes(this.host, {
      model: this.model,
      translationModel: this.translationModel,
      recursive: true,
      enableTranslations: true,
    });
    afterBindingCallback();
    this.listeners = new ComponentsListenerService(this.host, {
      model: this.model,
      translationModel: this.translationModel,
      chain: `${MODEL_CHAIN_PREFIX}${DATA_INTERNAL_CHAIN}`,
    });
    this.listeners.getModel.add();
    this.listeners.getTranslationModel.add();
    this.listeners.getParentChain.add();
  }
  async componentWillRender() {
    this.lastPageIndex = this.dataSize ? Math.ceil(this.dataSize / this.pageSize) : 1;
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
    const getSlot = slot => this.host.shadowRoot.querySelector(`slot[name="${slot}"]`);
    const createSlot = slot => Object.assign(document.createElement('slot'), { name: slot });
    const injectSlot = slot => {
      const beforeSlot = getSlot('before');
      const elementSlot = createSlot(slot);
      beforeSlot.insertAdjacentElement('afterend', elementSlot);
      return elementSlot;
    };
    let dataSlot = getSlot('data');
    const renderNoDataSlotIfNotExist = () => {
      dataSlot === null || dataSlot === void 0 ? void 0 : dataSlot.remove();
      dataSlot = undefined;
      if (!getSlot('no-data')) {
        injectSlot('no-data');
      }
      this.hidePagination = true;
      this.model.data = [];
    };
    const renderDataSlotIfNotExist = () => {
      var _a;
      if (!dataSlot) {
        (_a = getSlot('no-data')) === null || _a === void 0 ? void 0 : _a.remove();
        dataSlot = injectSlot('data');
      }
    };
    const isDataEmpty = (newData = data) => Array.isArray(newData) && newData.length === 0;
    const isLoading = () => typeof data === 'undefined';
    // infinite scroll
    if (this.useInfiniteScroll) {
      if (isDataEmpty() && isDataEmpty(this.model.data)) {
        renderNoDataSlotIfNotExist();
        return;
      }
      if (isDataEmpty()) {
        this.infinitScroll.disabled = true;
        return;
      }
      if (isLoading()) {
        this.model.data = undefined;
        return;
      }
      this.infinitScroll.disabled = false;
      renderDataSlotIfNotExist();
      if (!Array.isArray(this.model.data)) {
        this.model.data = [];
      }
      this.model.data.push(...data);
      // if there will be no data to fetch in the future disable infinite scrolling
      // more precise, all the date from the datasource is now shown in datatable
      if (typeof this.dataSize === 'number' && this.dataSize === this.model.data.length) {
        this.infinitScroll.disabled = true;
        return;
      }
      return;
    }
    // pagination
    if (isDataEmpty()) {
      renderNoDataSlotIfNotExist();
      return;
    }
    if (isLoading()) {
      this.model.data = undefined;
      return;
    }
    renderDataSlotIfNotExist();
    if (!Array.isArray(this.model.data)) {
      this.model.data = [];
    }
    if (!this.bootConfig.hidePagination) {
      this.hidePagination = false;
    }
    this.model.data = data;
  }
  async clearCurrentPage() {
    if (!this.model) {
      return;
    }
    if (typeof this.model.data === 'undefined') {
      return;
    }
    this.model.data.length = 0;
  }
  async pageSizeHandler() {
    this.dataSource._renderPageAsync();
  }
  render() {
    return this.dataSource ? (h(Host, null, h("slot", { name: 'before' }), h("slot", { name: 'data' }), this.managePagination(), h("slot", { name: 'loading' }), h("slot", { name: 'footer' }), h("slot", { name: 'after' }))) : null;
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
