const { Controller } = WebCardinal.controllers;

export default class _ extends Controller {
  constructor(...props) {
    console.log('[2] props', props);
    super(...props);
    console.log('[2] model', this.model);
  }
}
