const {WebcController} = WebCardinal.controllers;
const TEMPLATE_PATH = 'webc-template/2/templates-without-controllers/';

class NestedTemplatesController extends WebcController {
    getModel = (_) => ({
        testString: 'This should be visible only in main page and mother template.',
        templateName: `${TEMPLATE_PATH}mother-template`,
        arrayTest: [{
            name: 'Rafael',
            children: [{
                name: "Maria",
                children: [{
                    name: "Adrian"
                }, {
                    name: "Viorica",
                    children:[{
                        name:"Gheorghe"
                    }]
                }]
            },
                {
                    name: "George"
                }
            ]
        },
            {
                name: 'Tudor',
            },
            {
                name: 'Doina',
                children: [{
                    name: "Viorel"
                },
                    {
                        name: "Ioan"
                    }
                ]
            }
        ]
    });

    constructor(element, history) {
        super(element, history);
        let model = this.getModel();

        let setTemplate = function (person) {
            if (person.children) {
                person.templateName = `${TEMPLATE_PATH}child-template`;
                person.children.forEach(person => setTemplate(person))
            } else {
                person.templateName =`${TEMPLATE_PATH}no-child-template`;
            }
        }

        model.arrayTest.forEach(person=>setTemplate(person))
        this.model = model;


    }
}

export default NestedTemplatesController;