const { WebcController } = WebCardinal.controllers;

class AboutController extends WebcController {
    getModel = (_) => ({
        input: {
            label: "Seconds",
            type: "text",
            value: "0",
            style: "border: 1px solid #333",
        },
        conditionResult: true,
        wasSubmitted: false,
        hasErrors: false,
        itemsOne: [
            {
                text: "Item 0",
                // html: `<span>${this.t('ITEM')}</span>`,
                // this.t("ITEM")
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
        itemsTwo: [
            {
                title: {
                    text: "Title 1",
                    class: "title--bigger",
                    style: "color: red",
                },
                content: {
                    text: "Description 1",
                },
            },
            {
                title: {
                    text: "Title 2",
                },
                content: {
                    text: "Description 2",
                },
            },
            {
                title: {
                    html: 'Title 3 <a href="/more">...read more</a>',
                },
                content: {
                    text: "Description 3",
                },
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
        addItem: {
            text: "Add +",
            _saveElement: true,
        },
        removeItem: {
            text: "Remove -",
            _saveElement: true,
        },
        modifyItem: {
            text: `What's your lucky number?`,
            _saveElement: true,
        },
        reverse: {
            text: `Reverse ↻`,
            _saveElement: true,
        },
        button1: {
            text: "Button 1",
            data: "button1 data",
        },
        button2: {
            text: "Button 2",
            data: "button2 data",
        },
        button3: {
            text: "Button 3",
            tag: "button3",
            data: "button3 data",
        },
        redirectToContact: {
            text: "Redirect to contact",
            tag: "redirect",
        },
    });

    constructor(element, history) {
        super(element, history);

        console.log("Hello World!");

        this.setModel(this.getModel());

        console.log({
            proxy: this.model,
            model: JSON.stringify(this.model),
        });
    }

    async onReady() {
        this.interval = setInterval((_) => {
            this.model.input.value++;
            this.model.conditionResult = !this.model.conditionResult;
            // console.warn("test", "test2");
            // console.log(test);
        }, 1000);

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

        this.onTagClick("showModal", (model, target, event) => {
            this.showModal("Sample content");
        });
        this.onTagClick("showModalFromTemplate", (model, target, event) => {
            this.showModalFromTemplate("demo-modal", (e) => {
                const input = e.detail.modal.querySelector("input");
                alert(`You've entered: ${input.value}`);
            });
        });
        this.onTagClick("showModalError", (model, target, event) => {
            this.showErrorModal("Error message", "Error");
        });
        this.onTagClick("showModalRedirect", (model, target, event) => {
            this.showErrorModalAndRedirect("Error message", "Redirecting to contact", "contact", 3000);
        });

        this.model.addItem.getElement().addEventListener("click", () => {
            let index = this.model.itemsTwo.length + 1;
            this.model.itemsTwo.push({
                title: { text: `Title ${index}` },
                content: { text: `Span ${index}` },
            });
        });

        this.model.removeItem.getElement().addEventListener("click", () => {
            this.model.itemsTwo.splice(-1, 1);
        });

        this.model.modifyItem.getElement().addEventListener("click", () => {
            this.model.itemsTwo[0].title.text = `My lucky number is ${Math.round(Math.random() * 100)}!`;
        });

        this.model.reverse.getElement().addEventListener("click", () => {
            this.model.itemsTwo.reverse();
        });

        const sample1TagSecondListener = (model, target, event) => {
            console.log(`2) Tag sample1`, model, target, event);
        };

        this.onTagEvent("sample1", "click", (model, target, event) => {
            console.log(`1) Tag sample1`, model, target, event);
        });
        this.onTagClick("sample1", sample1TagSecondListener);
        this.onTagClick("sample1", (model, target, event) => {
            console.log(`3) Tag sample1`, model, target, event);
        });

        this.onTagClick("button1", (model, target, event) => {
            console.log(`Tag button1 click`, model, target, event);
            alert(`Tag button1 click with data: ${model.data}`);
        });
        this.onTagClick("button2", (model, target, event) => {
            console.log(`Tag button2 click`, model, target, event);
            alert(`Tag button2 click with data: ${model.data}`);
        });
        this.onTagClick("button3", (model, target, event) => {
            console.log(`Tag button3 click`, model, target, event);
            alert(`Tag button3 click with data: ${model.data}`);
        });

        this.timeout4 = setTimeout(() => {
            this.offTagClick("sample1", sample1TagSecondListener);
        }, 2000);

        this.onTagClick("redirect", () => {
            this.navigateToPageTag("contact");
        });
    }

    onDisconnectedCallback() {
        clearInterval(this.interval);
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
        clearTimeout(this.timeout3);
        clearTimeout(this.timeout4);
    }
}

export default AboutController; // used by <webc-container> and other components
