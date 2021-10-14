export default class extends WebCardinal.controllers.WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = {
            hello: this.translate('hello'),
            skin: this.getPreferredSkin(),
        };

        this.onTagClick('advanced', () => {
            this.setPreferredSkin('advanced');
            this.changeSkinForCurrentPage('advanced');
            this.model.skin = this.getPreferredSkin();
        })

        this.onTagClick('default', () => {
            this.setPreferredSkin('default');
            this.changeSkinForCurrentPage('advanced');
            this.model.skin = this.getPreferredSkin();
        })

        this.onTagClick('modal', () => {
            console.log('click')
            this.showModalFromTemplate('modal')
        })
    }
}