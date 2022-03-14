import { HYDRATED_CLASS, initTest } from '../../utils';
import environment from '../../environments/1';

describe('webc-app-root', () => {
  beforeEach(async () => await initTest(environment));

  describe('renders itself and children', () => {
    async function getRootElement() {
      const rootElement = await environment.page.find('webc-app-root');
      await rootElement.callMethod('componentOnReady');
      return rootElement;
    }

    it('renders itself', async () => {
      const rootElement = await getRootElement();
      expect(rootElement.tagName).toEqual('WEBC-APP-ROOT');
      expect(rootElement).toHaveClass(HYDRATED_CLASS);
    });

    it('renders webc-app-menu', async () => {
      const rootElement = await getRootElement();
      const menuElement = await rootElement.find(`webc-app-root > webc-app-menu`);
      await menuElement.callMethod('componentOnReady');
      expect(menuElement.tagName).toEqual('WEBC-APP-MENU');
      expect(menuElement).toHaveClass(HYDRATED_CLASS);
    });

    it('renders webc-app-container', async () => {
      const rootElement = await getRootElement();
      const containerElement = await rootElement.find(`webc-app-root > webc-app-container`);
      await containerElement.callMethod('componentOnReady');
      expect(containerElement.tagName).toEqual('WEBC-APP-CONTAINER');
      expect(containerElement).toHaveClass(HYDRATED_CLASS);
    });

    it('renders webc-app-error-toast', async () => {
      const rootElement = await getRootElement();
      const errorToastElement = await rootElement.find(`webc-app-root > webc-app-error-toast`);
      await errorToastElement.callMethod('componentOnReady');
      expect(errorToastElement.tagName).toEqual('WEBC-APP-ERROR-TOAST');
      expect(errorToastElement).toHaveClass(HYDRATED_CLASS);
    });
  });
});
