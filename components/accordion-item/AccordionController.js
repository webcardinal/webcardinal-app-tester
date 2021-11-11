const { Controller } = WebCardinal.controllers;

export default class AccordionController extends Controller {
  constructor(...props) {
    super(...props);

    this.model = {};

    this.onTagClick("accordion-item-click", (model, target) => {
      target.parentElement.classList.toggle("opened");
    });
  }
}
