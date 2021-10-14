// Path: scripts/controllers/manual/webc-component/Controller.test2.js

const { Controller } = WebCardinal.controllers;
export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            value: 'test-value',
            label: 'Test label'
        };
    }
}