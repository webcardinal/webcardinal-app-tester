const { Controller } = WebCardinal.controllers;

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            skin: this.getSkin()
        }

        this.onTagClick('language', (model, target) => {
            const { skin } = target.dataset;
            this.applySkinForCurrentPage(skin);
            this.setSkin(skin, { save: false });
        })
    }
}