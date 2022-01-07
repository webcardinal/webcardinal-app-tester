import { initTest } from '../../utils';
import environment from '../../environments/1';

describe('data-for', () => {
  beforeEach(async () => await initTest(environment));

  describe('renders itself and applies initial binding', () =>  {
    beforeEach(() => (environment.state = { tag: 'data-for', controller: 'T1' }));

    it('renders items', async () => {
      // const page = environment.page;
      const ul = await environment.getTestElement('01');
      const liArray = await ul.findAll('li');
      expect(liArray.length).toEqual(3);
      for (let i = 0; i < liArray.length; i++) {
        const li = liArray[i];
        const div = await li.find('div');
        const span = await li.find('span');
        const input = await li.find('input');
        expect(div.getAttribute('data-event')).toEqual(`event-${i + 1}`);
        expect(div.innerText).toEqual(`Div ${i + 1}`);
        expect(span.innerHTML).toEqual(`Span ${i + 1}`);
        expect(await input.getProperty('value')).toEqual(`Value ${i + 1}`);

        const type = input.getAttribute('type');
        const isDisabled = await input.getProperty('disabled');

        switch (i) {
          case 2:
            expect(isDisabled).toEqual(true);
            break;
          default:
            expect(isDisabled).toEqual(false);
            break;
        }

        switch (i) {
          case 1:
            expect(type).toEqual('password');
            break;
          case 2:
            expect(type).toEqual('email');
            break;
          default:
            expect(type).toEqual('text');
            break;
        }


      }
    });

    it('should work with push', async () => {
      const page = await environment.page;
      const container = await environment.getContainerElement();
      const ul = await environment.getTestElement('01');
      const pushButton = await container.find('button[data-tag="push"]');
      let array;

      array = await ul.findAll('li');
      expect(array.length).toEqual(3);

      await pushButton.click();
      await page.waitForChanges();

      array = await ul.findAll('li');
      expect(array.length).toEqual(4);

      const li = array[3], i = 4;
      const div = await li.find('div');
      const span = await li.find('span');
      const input = await li.find('input');
      expect(div.getAttribute('data-event')).toEqual(`event-${i}`);
      expect(div.innerText).toEqual(`Div ${i}`);
      expect(span.innerHTML).toEqual(`Span ${i}`);
      expect(await input.getProperty('value')).toEqual(`Value ${i}`);
    });
  });
});
