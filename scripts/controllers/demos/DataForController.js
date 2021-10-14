const { WebcController } = WebCardinal.controllers;

class DataForController extends WebcController {
    getModel = (_) => ({
        input: {
            type: "text",
            value: "0",
            style: "border: 1px solid #333",
        },
        buttonText: "root buttonText",
        spanText: "root spanText",
        itemsOne: [
            {
                title: {
                    text: "Title 1",
                    class: "title--bigger",
                    style: "color: red",
                },
                content: {
                    text: "Description 1",
                },
                buttonText: "itemsOne buttonText 1",
                spanText: "itemsOne spanText 1",
            },
            {
                title: {
                    text: "Title 2",
                },
                content: {
                    text: "Description 2",
                },
                buttonText: "itemsOne buttonText 2",
                spanText: "itemsOne spanText 2",
            },
            {
                title: {
                    html: 'Title 3 <a href="/more">...read more</a>',
                },
                content: {
                    text: "Description 3",
                },
                buttonText: "itemsOne buttonText 3",
                spanText: "itemsOne spanText 3",
            },
        ],
        itemsEmpty: [],
        itemsTwo: [
            {
                html: "Item 0",
            },
            {
                html: "Item 1",
            },
            {
                html: "Item 2",
            },
            {
                html: "Item 3",
            },
        ],
        itemsTwoTranslations: [
            {
                html: this.translate("item0"),
            },
            {
                html: this.translate("item1"),
            },
            {
                html: this.translate("item2"),
            },
            {
                html: this.translate("item3"),
            },
        ],
        itemsThree: [
            {
                div: { text: "A" },
                array: [{ text: "a1" }, { text: "a2" }],
            },
            {
                div: { text: "B" },
                array: [{ text: "b1" }, { text: "b2" }, { text: "b3" }],
            },
        ],

        enButton: {
            language: "en",
        },
        roButton: {
            language: "ro",
        },
    });

    constructor(element, history) {
        super(element, history);

        this.setModel(this.getModel());

        Array.from(Array(this.model.itemsOne.length)).forEach((_, idx) => {
            this.model.addExpression(
                `itemsOne.${idx}.formattedInputValue`,
                () => {
                    return `Current value is: ${this.model.input.value * idx + 1}`;
                },
                "input.value"
            );
            this.model.addExpression(
                `itemsOne.${idx}.formattedClass`,
                () => {
                    return `class-${this.model.input.value * idx + 1}`;
                },
                "input.value"
            );
        });
    }

    async onReady() {
        this.interval = setInterval((_) => {
            this.model.input.value++;
        }, 2000);

        this.onTagClick("set-language", (model, event) => {
            this.setLanguage(model.language);
        });
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}

export default DataForController; // used by <webc-container> and other components
