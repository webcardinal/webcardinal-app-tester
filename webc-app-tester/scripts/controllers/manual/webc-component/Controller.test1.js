// Path: scripts/controllers/manual/webc-component/Controller.test1.js

const { Controller } = WebCardinal.controllers;
export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            input: {
                value: 'john.doe@example.com',
                type: 'email',
                label: '📧 My Email:'
            },
            inputNumber: {
                value: 100,
                type: 'number',
                label: '🔢 My Power:'
            }
        };
    }
}