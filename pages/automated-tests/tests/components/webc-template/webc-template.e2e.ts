import { E2EElement } from '@stencil/core/testing';
import { HYDRATED_CLASS, initTest } from '../../utils';
import environment from '../../environments/1';

describe('webc-template', () => {
  beforeEach(async () => await initTest(environment));

  describe('it does binding', () => {
    beforeEach(() => (environment.state = { tag: 'webc-template', controller: 'T1' }));

    async function getTemplate(testIdentifier) {
      const templateElement = await environment.getTestElement(testIdentifier);
      expect(templateElement.tagName).toEqual('WEBC-TEMPLATE');
      expect(templateElement).toHaveClass(HYDRATED_CLASS);
      await templateElement.callMethod('componentOnReady');
      return templateElement;
    }

    async function checkTemplate(template: E2EElement, { inputValue, labelValue }) {
      const inputElement = await template.find('input');
      const labelElement = await template.find('label');
      expect(await inputElement.getProperty('value')).toEqual(inputValue);
      expect(labelElement.innerText).toEqual(labelValue);
    }

    async function checkBinding({ isFirstModel, inputValue, labelValue, scopedInputValue, scopedLabelValue }) {
      let divElement, templateElement;

      // check current state
      const stateElement = await environment.getTestElement('00');
      expect(stateElement.tagName).toEqual('CODE');
      expect(stateElement.innerText).toEqual(`isFirstModel: ${isFirstModel.toString()}`);

      // check binding outside of the template (using data-view-model)
      divElement = await environment.getTestElement('01');
      expect(divElement.tagName).toEqual('DIV');
      await checkTemplate(divElement, {
        inputValue,
        labelValue,
      });

      // this template does not have data-view-model => empty values
      templateElement = await getTemplate('02');
      await checkTemplate(templateElement, {
        inputValue: '',
        labelValue: '',
      });

      // this is exactly as the div before, but within a template
      templateElement = await getTemplate('03');
      await checkTemplate(templateElement, {
        inputValue,
        labelValue,
      });

      // scoped data-view-model and a template with data-view-model
      templateElement = await getTemplate('04');
      await checkTemplate(templateElement, {
        inputValue: scopedInputValue,
        labelValue: scopedLabelValue,
      });

      // check binding outside of the template (using attributes and syntax {{ }})
      divElement = await environment.getTestElement('05');
      expect(divElement.tagName).toEqual('DIV');
      await checkTemplate(divElement, {
        inputValue,
        labelValue,
      });

      // this template doesn't have data-view-model, but binding syntax is present inside the template => wrong use-case
      templateElement = await getTemplate('06');
      await checkTemplate(templateElement, {
        inputValue: '@templateInput.value',
        labelValue: '{{ @templateLabel.text }}',
      });

      // template with data-view-model, template content contains bounded attributes
      templateElement = await getTemplate('07');
      await checkTemplate(templateElement, {
        inputValue,
        labelValue,
      });

      // scoped data-view-model and a template with attributes
      templateElement = await getTemplate('08');
      await checkTemplate(templateElement, {
        inputValue: scopedInputValue,
        labelValue: scopedLabelValue,
      });
    }

    it('initial binding of "data-view-model"', async () => {
      await checkBinding({
        isFirstModel: true,
        inputValue: 'Input 1',
        labelValue: 'Label 1',
        scopedInputValue: 'Scoped Input 1',
        scopedLabelValue: 'Scoped Label 1',
      });
    });

    it('should rerender when model is changing ', async () => {
      const { page } = environment;
      const containerElement = await environment.getContainerElement();
      const buttonElement = await containerElement.find('button[data-tag=toggle]');

      await checkBinding({
        isFirstModel: true,
        inputValue: 'Input 1',
        labelValue: 'Label 1',
        scopedInputValue: 'Scoped Input 1',
        scopedLabelValue: 'Scoped Label 1',
      });

      await buttonElement.click();
      await page.waitForChanges();

      await checkBinding({
        isFirstModel: false,
        inputValue: 'Input 2',
        labelValue: 'Label 2',
        scopedInputValue: 'Scoped Input 2',
        scopedLabelValue: 'Scoped Label 2',
      });
    });
  });
});
