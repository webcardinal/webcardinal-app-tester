// Path: pages/manual-tests/data-if/2/Controller.js

const { Controller } = WebCardinal.controllers;

class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            condition: undefined
        }

        this.model.addExpression("conditionString", () => {
            return `${this.model.condition}`;
        }, 'condition');

        this.interval = setInterval(() => {
            this.changeCondition();
        }, 1000);
    }

    changeCondition() {
        let newCondition;
        switch (this.model.condition) {
            case true:
                newCondition = false;
                break;
            case false:
                newCondition = undefined;
                break;
            default:
                newCondition = true;
        }
        this.model.condition = newCondition;
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}

export default TestController;