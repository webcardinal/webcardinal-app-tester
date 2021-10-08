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
            default: // No data
                return [];
        }
    }

    changeItems = () => {
        this.model.state = (this.model.state + 1) % 3;
        this.model.items = this.getItems();
    }

    constructor(...props) {
        super(...props);
        this.model = { state: 0, items: [] };
        setInterval(this.changeItems, 1000);
    }
}