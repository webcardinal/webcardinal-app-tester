// Path: pages/manual-tests/webc-component/1/Controller.js

const { Controller } = WebCardinal.controllers;

class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            containerValue: "Value for container",
            componentAttribute: "Attribute for container"
        }
    }
}

export default TestController;