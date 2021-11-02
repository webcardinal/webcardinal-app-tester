const {WebcController} = WebCardinal.controllers;

export default class FAIconController extends WebcController {
    constructor(...props) {
        super(...props);
        console.log('c-tor');
    }

    onReady() {
        this.initIconStyle();
    }

    initIconStyle() {
        const {icon, color} = this.model;
        const faIcon = `icon fa fa-${icon}`;

        const spanElement = this.querySelector('span');
        spanElement.setAttribute("class", faIcon);
        if (color) {
            spanElement.setAttribute("style", `color: ${color};`);
        }
    }
}