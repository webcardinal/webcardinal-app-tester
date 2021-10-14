const { WebcController } = WebCardinal.controllers;

class DataIfController extends WebcController {
    getModel = (_) => ({
        input: {
            type: "text",
            value: "0",
            style: "border: 1px solid #333",
        },
        conditionResult: true,
        wasSubmitted: false,
        hasErrors: false,
        trueText: this.translate("true"),
        falseText: this.translate("false"),
        enButton: {
            language: "en",
        },
        roButton: {
            language: "ro",
        },
        conditionPromise: new Promise(() => {}),
    });

    constructor(element, history) {
        super(element, history);

        this.setModel(this.getModel());

        this.model.addExpression(
            "isEvenInputValue",
            () => {
                return this.model.input.value % 2 === 0;
            },
            "input.value"
        );

        this.model.addExpression(
            "formattedInputValue",
            () => {
                return `Current value is: ${this.model.input.value}`;
            },
            "input.value"
        );
    }

    async onReady() {
        this.interval = setInterval((_) => {
            this.model.input.value++;
            this.model.conditionResult = !this.model.conditionResult;
        }, 2000);

        // testing various conditions update
        const updateSubmittedInfo = () => {
            this.timeout1 = setTimeout(() => {
                this.model.wasSubmitted = true;

                this.timeout2 = setTimeout(() => {
                    this.model.hasErrors = true;

                    this.timeout3 = setTimeout(() => {
                        this.model.wasSubmitted = false;
                        this.model.hasErrors = false;

                        updateSubmittedInfo();
                    }, 2000);
                }, 2000);
            }, 2000);
        };
        updateSubmittedInfo();

        let conditionPromiseResult = false;
        this.interval2 = setInterval((_) => {
            this.model.conditionPromise = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(conditionPromiseResult);
                    conditionPromiseResult = !conditionPromiseResult;
                }, 1000);
            });
        }, 2000);

        this.onTagClick("set-language", (model, event) => {
            this.setLanguage(model.language);
        });
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
        clearTimeout(this.timeout3);
    }
}

export default DataIfController; // used by <webc-container> and other components
