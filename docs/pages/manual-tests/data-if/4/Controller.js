// Path: pages/manual-tests/data-if/4/Controller.js

const { Controller } = WebCardinal.controllers;

export default class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            people: [
                { name: 'Name 1', age: 24 },
                { name: 'Name 2' },
                { name: 'Name 3', age: 32 }
            ]
        }
    }
}
