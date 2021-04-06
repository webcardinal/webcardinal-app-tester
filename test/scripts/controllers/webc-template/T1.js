const { Controller } = WebCardinal.controllers;

const getFirstModel = () => ({
  templateInput: { value: 'Input 1' },
  templateLabel: { text: 'Label 1' },
  scoped: {
    templateInput: { value: 'Scoped Input 1' },
    templateLabel: { text: 'Scoped Label 1' },
  }
});

const getSecondModel = () => ({
  templateInput: { value: 'Input 2' },
  templateLabel: { text: 'Label 2' },
  scoped: {
    templateInput: { value: 'Scoped Input 2' },
    templateLabel: { text: 'Scoped Label 2' },
  }
});

export default class extends Controller {
  constructor(element, history) {
    super(element, history);

    this.setModel(getFirstModel());
    this.model.isFirstModel = true;

    this.onTagClick('toggle', () => {
      if (this.model.isFirstModel) {
        this.model = getSecondModel();
        // Object.assign(this.model, getSecondModel())
        this.model.isFirstModel = false;
        return;
      }

      this.model = getFirstModel();
      // Object.assign(this.model, getFirstModel())
      this.model.isFirstModel = true;
    })
  }
}
