import { E2EPage } from '@stencil/core/testing';
import { HYDRATED_CLASS } from '../../utils';

class Environment {
  private environment: {
    page: E2EPage,
    [key: string]: any
  };

  constructor() {
    this.environment = {
      page: undefined, // it is set by initTest() from utils
      basePath: '/test/environments/1',
      state: {},
    };

    this.environment.content = `
      <base href="${this.environment.basePath}">
      <webc-app-root></webc-app-root>
    `;
  }

  set page(page) {
    this.environment.page = page;
  }

  get page() {
    return this.environment.page;
  }

  set content(content) {
    this.environment.content = content;
  }

  get content() {
    return this.environment.content;
  }

  set state(state) {
    this.environment.state = state;
  }

  get state() {
    return this.environment.state;
  }

  async getLoaderElement() {
    if (!this.environment.page) {
      throw 'initTest() must be called before each test!';
    }

    const page: E2EPage = this.environment.page;
    const { tag } = this.environment.state;

    // find and wait for application to load completely
    const rootElement = await page.find('webc-app-root');
    await rootElement.callMethod('componentOnReady');
    expect(rootElement).toHaveClass(HYDRATED_CLASS);

    // find and wait for loader of the homepage to load completely
    let loaderElement = await rootElement.find('webc-app-loader');
    await loaderElement.callMethod('componentOnReady');
    expect(loaderElement).toHaveClass(HYDRATED_CLASS);

    if (loaderElement.getAttribute('src') !== './pages/home.html') {
      return loaderElement;
    }

    // go to desired page
    const linkElement = await loaderElement.find(`webc-link[tag="${tag}"]`);
    await linkElement.callMethod('componentOnReady');
    expect(linkElement.tagName).toEqual('WEBC-LINK');

    await this.environment.page.waitForChanges();

    expect(linkElement).toHaveClass(HYDRATED_CLASS);
    const aElement = await linkElement.find('a');
    await aElement.click();

    await this.environment.page.waitForChanges();

    // find the loader for desired page
    loaderElement = await rootElement.find('webc-app-loader');
    await loaderElement.callMethod('componentOnReady');
    expect(loaderElement).toHaveClass(HYDRATED_CLASS);

    return loaderElement;
  }

  async getContainerElement() {
    const loaderElement = await this.getLoaderElement();

    const { tag, controller } = this.environment.state;

    const controllerPath = `${tag}/${controller}`;
    const containerElement = await loaderElement.find(`webc-container[controller="${controllerPath}"]`);
    await containerElement.callMethod('componentOnReady');
    expect(containerElement).toEqualAttribute('controller', `${controllerPath}`);
    expect(containerElement).toHaveClass(HYDRATED_CLASS);

    await this.environment.page.waitForChanges();

    return containerElement;
  }

  async getTestElement(testIdentifier) {
    const containerElement = await this.getContainerElement();
    const testElement = await containerElement.find(`[data-test="${testIdentifier}"]`);
    expect(testElement['dataset'].test).toEqual(testIdentifier);
    return testElement;
  }
}

export default new Environment();

