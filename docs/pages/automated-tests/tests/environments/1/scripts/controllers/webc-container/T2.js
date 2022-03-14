const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    constructor(element, history) {
        super(element, history);
        this.model = { number: 0 };

        this.onTagClick('number-increment', (_m, _t, event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.model.number++;
        });

        this.onTagEvent('number-decrement', 'click', (_m, _t, event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.model.number--;
        });
    }
}
