const { Controller } = WebCardinal.controllers;
const { root } = WebCardinal;

export default class _ extends Controller {
  constructor(...props) {
    super(...props);

    this.hideHeader();

    this.model = {};

    this.model.onChange("data", () => {
      console.log(this.model.data);
      alert(JSON.stringify(this.model.data, null, "2"));
    });
  }

  onDisconnectedCallback = () => {
    this.showHeader();
  }

  showHeader = () => {
    root.disableHeader = false;
  }

  hideHeader = () => {
    root.disableHeader = true;
  }
}
