// Path: pages/manual-tests/data-if/5/Controller.js

const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export default class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            condition1: true,
            condition2: true,
            condition3: true,
            id: 1,
        }
        this.model.addExpression('finalCondition', this.computeFinalCondition, 'condition1', 'condition2', 'condition3');
        this.model.addExpression('condition1String', () => `${this.model.condition1}`);
        this.model.addExpression('condition2String', () => `${this.model.condition2}`);
        this.model.addExpression('condition3String', () => `${this.model.condition3}`);
        this.steps = [];

        this.startIntervals(true).then(this.logSteps);
        this.interval = setInterval(this.startIntervals, 5 * 1000);
    }

    startIntervals = async (isRegistering = false) => {
        /** Steps: **/
        // 1. true > true
        // 2. false > true
        // 3. false > false
        // 4. true > false
        // 3. false > false

        await this.registerCurrentStep(isRegistering);

        this.model.id = 2;
        this.model.condition1 = false;
        await this.registerCurrentStep(isRegistering);

        this.model.id = 3;
        this.model.condition3 = false;
        await this.registerCurrentStep(isRegistering);

        this.model.id = 4;
        this.model.condition1 = true;
        this.model.condition2 = false;
        await this.registerCurrentStep(isRegistering);

        this.model.id = 3;
        this.model.condition1 = false;
        await this.registerCurrentStep(isRegistering);

        this.model.id = 1;
        this.model.condition1 = true;
        this.model.condition2 = true;
        this.model.condition3 = true;
    }

    computeFinalCondition = () => {
        const { id, condition1, condition2, condition3 } = this.model;
        if (condition1) {
            return `${id}. ${condition1} > ${condition2}`
        }
        return `${id}. ${condition1} > ${condition3}`
    }

    registerCurrentStep = async (isRegistering) => {
        if (!isRegistering) {
            return;
        }

        this.steps.push(this.computeFinalCondition());
        await timeout(1000);
    }

    logSteps = () => {
        const actualContainer = this.getElementByTag('actual');
        const expectedContainer = this.getElementByTag('expected');

        actualContainer.innerHTML = '';
        for (const step of this.steps) {
            actualContainer.append(document.createElement('br'), step);
        }

        if (actualContainer.innerText !== expectedContainer.innerText) {
            alert('Test fail!\nPlease check the console!')
            console.error('Fail: "data-if" in "data-if" test failed!\n', 'Actual:', actualContainer.innerText, '\n', 'Expected:', expectedContainer.innerText);
        }
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}
