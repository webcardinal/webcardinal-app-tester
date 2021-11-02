const {Controller} = WebCardinal.controllers;

export default class extends Controller {

    lastId = 1;
    colors = ["red", "blue", "green", "orange", "black", "darkred"];
    icons = ["users", "cog", "cogs", "star", "linkedin", "umbrella"];

    constructor(element, history) {
        super(element, history);

        const initialNumber = 4;

        this.model = {
            items: this.generateItems(initialNumber),
            isDisabled: false
        };

        this.onTagClick("plus", () => {
            const newItem = this.generateItem();
            this.model.items.push(newItem);
        });

        this.onTagClick("minus", (model) => {
            const indexToRemove = this.model.items.findIndex((x) => x.id === model.id);
            this.model.items.splice(indexToRemove, 1);
        });

        this.onTagClick("toggle-display", () => {
            this.model.isDisabled = !this.model.isDisabled;
        });

        this.model.addExpression("modelString", () => JSON.stringify(this.model.toObject(), null, 2), "*");
    }

    getRandomItem() {
        const min = Math.ceil(0);
        const max = Math.floor(this.colors.length - 1);
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return {
            icon: this.icons[random],
            color: this.colors[random]
        };
    }

    generateItems(number) {
        return Array.from(Array(number), () => {
            return this.generateItem();
        });
    }

    generateItem() {
        return {
            id: this.lastId,
            name: `Item ${this.lastId++}`,
            ...this.getRandomItem(),
        }
    }
}
