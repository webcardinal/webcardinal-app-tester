const { Controller } = WebCardinal.controllers;

export default class _ extends Controller {
  constructor(...props) {
    console.log('[1] props', props);
    super(...props);

    this.model = {
      input: {
        chain: "scope.text3",
        value: "My Custom Text!"
      },
      text1: "Text 1",
      number1: 1,
      array1: [
        { index1: 1, value1: "Value 1.1" },
        { index1: 2, value1: "Value 1.2" },
        { index1: 3, value1: "Value 1.3" },
      ],
      boolean1: true,
      trueValue1: "True Value 1",
      falseValue1: "False Value 1",
      scope: {
        text3: "Text 2",
        number3: 2,
        array3: [
          { index3: 1, value3: "Value 3.1" },
          { index3: 2, value3: "Value 3.2" },
          { index3: 3, value3: "Value 3.3" },
        ],
        boolean3: true,
        trueValue3: "True Value 3",
        falseValue3: "False Value 3",
      },
    };

    console.log('[1] model', this.model);

    this.onTagEvent("apply", "click", () => {
      const { chain, value } = this.model.input;
      this.model.setChainValue(chain, value);
    });

    this.onTagEvent("restore", "click", () => {
      location.reload();
    });

    // this.model.addExpression("model", () => JSON.stringify(this.model.toObject(), null, 2), "*");
  }
}
