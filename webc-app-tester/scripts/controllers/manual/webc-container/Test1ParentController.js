const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    constructor(...props) {
        console.log('ParentController');

        super(...props);

        this.model = { items: ['Outer 1', 'Outer 2', 'Outer 3'] }
    }
}