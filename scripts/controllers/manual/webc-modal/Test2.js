const { WebcController } = WebCardinal.controllers;

export default class extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = {
            modal: {
                title: "My Modal",
                content: "Hello Content 👋"
            }
        };

        this.onTagClick('show-modal', readOnlyModel => {
            const { modal } = readOnlyModel;

            // this.showModalFromTemplate('modal1', this.onConfirm.bind(this), this.onClose.bind(this), {
            //     model: { hello: 'Hello!' },
            //     translationModel: modal,
            //     enableTranslations: true
            // });
        });
    }
}