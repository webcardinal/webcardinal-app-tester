import { initTest } from '../../utils';
import environment from '../../environments/1';

describe('webc-container', () => {
  beforeEach(async () => await initTest(environment));

  describe('renders itself and applies initial binding', () => {
    beforeEach(() => (environment.state = { tag: 'webc-container', controller: 'T1' }));

    it('renders itself', async () => {
      await environment.getContainerElement();
    });

    it(`binds text '{{ @title }}'`, async () => {
      const h1Element = await environment.getTestElement('01');
      expect(h1Element.innerText).toEqual('Title!');
    });

    it(`binds text 'Description: {{ @description }}'`, async () => {
      const pElement = await environment.getTestElement('02');
      expect(pElement.innerText).toEqual('Description: This is our Description!');
    });

    it(`binds attributes 'class="@class"'`, async () => {
      const divElement = await environment.getTestElement('03');
      expect(divElement.innerText).toEqual('This div has a nice class!');
      expect(divElement).toHaveClass('surprise');
    });

    it(`binds data-view-model 'data-view-model="@dataViewModel"`, async () => {
      const divElement = await environment.getTestElement('04');
      expect(divElement).toEqualAttribute('data-view-model', '@dataViewModel');
      expect(divElement.innerText).toEqual('Text');
      expect(divElement.classList.contains('success')).toEqual(true);
      expect(divElement.classList.contains('inactive')).toEqual(false);
      expect(divElement).toEqualAttribute('custom', 'custom-attribute');
      expect(divElement).toEqualAttribute('data-tag', 'div-tag');
    });
  });

  describe('applies re-rendering when is needed', () => {
    beforeEach(() => (environment.state = { tag: 'webc-container', controller: 'T2' }));

    it('renders itself', async () => {
      await environment.getContainerElement();
    });

    it('model change triggers a render', async () => {
      const div = await environment.getTestElement('01');

      const code = await div.find('code');
      const dec = await div.find('button[data-tag=number-decrement]');
      const inc = await div.find('button[data-tag=number-increment]');

      expect(code.innerText).toEqual('Value: 0');
      await dec.click();
      expect(code.innerText).toEqual('Value: -1');
      await inc.click();
      expect(code.innerText).toEqual('Value: 0');
      await inc.click();
      expect(code.innerText).toEqual('Value: 1');
      await dec.click();
      expect(code.innerText).toEqual('Value: 0');
    });
  });
});
