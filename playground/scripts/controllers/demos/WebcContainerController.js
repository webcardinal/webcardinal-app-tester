const { WebcController } = WebCardinal.controllers;

class WebcContainerController extends WebcController {
    getModel = (_) => ({
        button1: {
            text: this.translate("button1"),
        },
        button2: {
            text: this.translate("button2"),
        },
        button3: {
            text: this.translate("button3"),
        },
        conditionResult: true,
        itemsOne: [
            {
                html: "Item 0",
            },
            {
                html: this.translate("Item 1"),
            },
            {
                html: this.translate("Item 2"),
            },
            {
                html: this.translate("Item 3"),
            },
        ],
        templateInput: {
            type: "text",
            value: 0,
            style: "border: 1px solid #333",
        },
        templateLabel: {
            text: this.translate("templateLabel"),
        },
        templateInnerInput: {
            templateInput: {
                type: "text",
                value: 0,
                style: "border: 1px solid red",
            },
            templateLabel: {
                text: this.translate("templateLabel"),
            },
        },
    });

    constructor(element, history) {
        super(element, history);

        this.setModel(this.getModel());
    }

    async onReady() {
        let isEven = false;

        this.onTagClick("button1", (model, event) => {
            this.model.button1.text = this.translate(isEven ? "button1" : "button2");
            isEven = !isEven;
        });

        this.interval = setInterval((_) => {
            this.model.conditionResult = !this.model.conditionResult;
            this.model.templateInput.value++;
            this.model.templateInnerInput.templateInput.value += 2;
            this.model.button1.text = this.translate(isEven ? "button1" : "button2");
            this.model.button2.text = this.translate(isEven ? "button2" : "button3");
            this.model.button3.text = this.translate(isEven ? "button3" : "button1");
            isEven = !isEven;
        }, 1000);
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
    }
}

export default WebcContainerController; // used by <webc-container> and other components
