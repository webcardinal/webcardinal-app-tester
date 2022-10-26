const { WebcController } = WebCardinal.controllers;
export default class CarouselCardController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model={
            outerExample:{
                text1:'dummy outer1',
                text2:'dummy outer2'
            },
            sliderCard:{
                items:[
                    {
                        type:'child-component',
                        data:{
                            text1:'dummy text1',
                            text2:'dummy text2'
                        }
                    },
                    {
                        type:'child-component',
                        data:{
                            text1:'dummy text3',
                            text2:'dummy text4'
                        }
                    },
                    {
                        type:'child-component',
                        data:{
                            text1:'dummy text5',
                            text2:'dummy text6'
                        }
                    }
                ]
            }


        }
    }

}
