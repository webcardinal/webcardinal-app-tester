const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    constructor(...props) {
        console.log('ChildController');

        super(...props);

        this.model = { items: ['Inner 1', 'Inner 2', 'Inner 3'] }
    }
}