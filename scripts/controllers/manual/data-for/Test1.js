const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    generateItems(number) {
        return Array.from(Array(number), (_, i) => ({ name: `${i + 1}. Item` }))
    }

    constructor(element, history) {
        super(element, history);

        const initialNumber = 4;

        this.setModel({
            number: initialNumber,
            items: this.generateItems(initialNumber)
        });

        this.model.onChange('number', _ => {
            const newNumber = parseInt(this.model.number);
            if (Number.isNaN(newNumber)) return;
            this.model.items = this.generateItems(newNumber);
        });

        this.onTagClick('plus', _ => this.model.number++);
        this.onTagClick('minus', _ => this.model.number > 0 && this.model.number--);

        let oldValue = this.model.items[1].name;
        let newValue = '2. SUPER ITEM!';
        setInterval(() => {
            if (this.model.items.length < 2) return;
            this.model.items[1].name = (this.model.items[1].name === newValue ? oldValue : newValue);
        }, 1000)
    }
}