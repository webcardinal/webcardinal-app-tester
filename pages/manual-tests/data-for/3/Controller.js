const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    getItems = () => {
        switch (this.model.state) {
            case 1: // Hello World
                return [
                    { content: 'Hello' },
                    { content: 'World' }
                ];
            case 2: // This is Sparta
                return [
                    { content: 'This' },
                    { content: 'is' },
                    { content: 'Sparta' }
                ];
            case 3: {
                return undefined;
            }
            default: // No data
                return [];
        }
    }

    changeItems = () => {
        this.model.state = (this.model.state + 1) % 4;
        this.model.items = this.getItems();
    }

    constructor(...props) {
        super(...props);
        this.model = { state: 0 };
        this.model.addExpression('typeOfState', () => {
            let type = typeof this.model.items;
            if (Array.isArray(this.model.items)) {
                type = `${type}, arrayLength: ${this.model.items.length}`;
            }
            return type;
        }, 'items');
        setInterval(this.changeItems, 1000);
    }
}