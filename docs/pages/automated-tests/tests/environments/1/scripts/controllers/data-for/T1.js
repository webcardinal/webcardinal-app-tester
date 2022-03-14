const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    constructor(element, history) {
        super(element, history);
        this.model = {
          items: [
            {
              span: 'Span 1',
              div: 'Div 1',
              event: 'event-1',
              type: 'text',
              disabled: false,
              value: 'Value 1'
            },
            {
              span: 'Span 2',
              div: 'Div 2',
              event: 'event-2',
              type: 'password',
              disabled: false,
              value: 'Value 2'
            },
            {
              span: 'Span 3',
              div: 'Div 3',
              event: 'event-3',
              type: 'email',
              disabled: true,
              value: 'Value 3'
            }
          ]
        };

        this.onTagClick('push', () => {
          let i = this.model.items.length + 1;
          this.model.items.push({
            span: `Span ${i}`,
            div: `Div ${i}`,
            event: `event-${i}`,
            type: 'text',
            value: `Value ${i}`
          });
        });
    }
}
