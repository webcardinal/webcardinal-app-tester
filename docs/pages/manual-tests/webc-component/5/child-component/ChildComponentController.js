const { WebcController } = WebCardinal.controllers;

export default class ChildComponentController extends WebcController {
    constructor(...props) {
        super(...props);

        console.log("Model from inside child: "+JSON.stringify(this.model))
        if(Object.getOwnPropertyNames(JSON.parse(JSON.stringify(this.model))).length === 0){
            this.model.text1="manually added"
            this.model.text2="manually added"
            console.log("Model from inside child if there was no model: "+JSON.stringify(this.model))
        }

        //Chiar daca am setat o variabila din model, ea este ignorata

    }
}
