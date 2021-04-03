const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    lastId = 1;

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateItems(number) {
        return Array.from(Array(number), (_, i) => ({ id: this.lastId++, name: "Item", inputValue: i + 1 }));
    }

    constructor(element, history) {
        super(element, history);

        const initialNumber = 4;

        this.setModel({
            number: initialNumber,
            items: this.generateItems(initialNumber),
        });

        this.onTagClick("plus", (_) => {
            const id = this.lastId++;
            const newItem = {
                id,
                name: "Random item",
                inputValue: id,
            };
            const indexToAdd = this.getRandomInt(0, this.model.items.length);
            this.model.items.splice(indexToAdd, 0, newItem);
        });
        this.onTagClick("minus", (model) => {
            const indexToRemove = this.model.items.findIndex((x) => x.id === model.id);
            this.model.items.splice(indexToRemove, 1);
        });
    }
}
