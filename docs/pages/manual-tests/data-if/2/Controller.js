// Path: pages/manual-tests/data-if/2/Controller.js

export default class _ extends WebCardinal.controllers.Controller {
    constructor(...props) {
        super(...props);
        this.state = 0;
        this.model = { condition: undefined };
        this.model.addExpression("conditionString", () => {
            let value = this.model.condition;
            let type = typeof this.model.condition;
            let suffix = '';
            if (value !== null && type === 'object') {
                value = Array.isArray(this.model.condition) ? '[]' : '{}';
                suffix = `, isArray: ${Array.isArray(this.model.condition)}`;
            }
            return `
                value: ${value === '' ? "''" : value}, 
                typeof: ${type}${suffix}
            `;
        }, 'condition');
        this.interval = setInterval(this.changeCondition, 2500);
    }

    changeCondition = () => {
        // true > false > null > [] > {} > 6 > NaN > 'lorem' > ''
        // undefined between each state
        let newCondition;
        switch (this.state) {
            case  0: newCondition = true; break;
            case  2: newCondition = false; break;
            case  4: newCondition = null; break;
            case  6: newCondition = []; break;
            case  8: newCondition = {}; break;
            case 10: newCondition = 6; break;
            case 12: newCondition = NaN; break;
            case 14: newCondition = "'lorem'"; break;
            case 16: newCondition = ''; break;
            default: newCondition = undefined;
        }
        this.state = (this.state + 1) % 17;
        this.model.condition = newCondition;
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}