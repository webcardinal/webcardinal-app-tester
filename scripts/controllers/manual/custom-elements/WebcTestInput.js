const { Controller } = WebCardinal.controllers;

export default class _ extends Controller {
    getModel1 = () => ({
        label: "Email",
        value: "john.doe@example.com",
        type: "email"
    })

    getModel2 = () => ({
        label: "Full name",
        value: "John Doe",
        type: "text"
    })

    constructor(...props) {
        super(...props);

        let isFirst = true;
        this.model = {
            example1: this.getModel1(),
            example2: this.getModel2(),
            exampleInterval: this.getModel1()
        }

        setInterval(() => {
            this.model.exampleInterval = isFirst ? this.getModel2() : this.getModel1()
            isFirst = !isFirst;
        }, 1000)
    }
}