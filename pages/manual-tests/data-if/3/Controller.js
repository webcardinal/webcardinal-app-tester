// Path: pages/manual-tests/data-if/3/Controller.js

const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            condition: this.getCondition()
        }

        this.model.addExpression("conditionString", () => {
            return `${this.model.condition}`;
        }, 'condition');

        let state = true;
        this.onTagClick('conditionToggle', (readOnlyModel, target) => {
            state = !state;
            this.model.condition = this.getCondition(state, target);
        });
    }

    async getCondition(value = true, target = this.getElementByTag('conditionToggle')) {
        target.disabled = true;

        // intensive processing
        await timeout(2000);

        target.disabled = false;

        return value;
    }
}

export default TestController;