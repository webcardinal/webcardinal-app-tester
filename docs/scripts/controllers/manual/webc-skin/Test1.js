const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    initializeModel() {
        return ({
            header: {
                title: { text: 'WebcSkin examples 👨‍🏫' },
                card: { title: 'Subheader' }
            },
            main: {
                textarea: {
                    cols: '40',
                    rows: '10',
                    placeholder: 'Type something here...'
                },
                save: { text: 'Save' },
                reset: { text: 'Reset' },
                items: [
                    {
                        title: 'Item 1',
                        html: `Content 1`,
                        opened: true
                    },
                    {
                        title: 'Item 2',
                        html: `Content 2`
                    },
                    {
                        title: 'Item 3',
                        html: `Content 3`
                    }
                ]
            }
        })
    }

    constructor(element, history) {
        super(element, history);

        this.setModel(this.initializeModel());
    }
}