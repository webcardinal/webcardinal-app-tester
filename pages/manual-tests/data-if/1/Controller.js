// Path: pages/manual-tests/data-if/1/Controller.js

const { Controller } = WebCardinal.controllers;

class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            condition: true
        }

        this.interval = setInterval(() => {
            this.model.condition = !this.model.condition;
        }, 1000);
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}

export default TestController;