const { Controller } = WebCardinal.controllers;

export default class _ extends Controller {
  constructor(...props) {
    console.log('[3] props', props);
    super(...props);
    console.log('[3] model', this.model);
  }
}
