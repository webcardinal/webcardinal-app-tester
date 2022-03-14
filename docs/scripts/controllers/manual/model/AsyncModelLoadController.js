const {WebcController} = WebCardinal.controllers;

export default class AsyncModelLoadController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model.form = {};

        this.model.form.input1 = {
            type: "text",
            placeholder: "Enter some data in input #1",
            value: ""
        }

        this.model.form.input2 = {};

        setTimeout(() => {
            this.model.form.input2 = {
                type: "text",
                placeholder: "Enter some data in input #2",
                value: ""
            }
        }, 10)
    }
}