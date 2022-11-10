const { WebcController } = WebCardinal.controllers;
export default class CarouselCardController extends WebcController {
    constructor(...props) {
        super(...props);
        console.log("Model from inside slider: "+JSON.stringify(this.model))
        this.carouselContainer = this.getElementByTag("scroll-container");
        setTimeout(()=>{this.addCarouselChildren();});

        setTimeout(() => {
            // this.model.items.push({
            //     type:'child-component',
            //     data:{
            //         text1:'dummy text5',
            //         text2:'dummy text6'
            //     }
            // });
            this.model.items = [
                {
                    type:'child-component',
                    data:{
                        text1:'dynamic added whole array dummy text1',
                        text2:'dynamic added whole array dummy text2'
                    }
                },
                {
                    type:'child-component',
                    data:{
                        text1:'dynamic added whole array dummy text3',
                        text2:'dynamic added whole array dummy text4'
                    }
                },
                {
                    type:'child-component',
                    data:{
                        text1:'dynamic added whole array dummy text5',
                        text2:'dynamic added whole array dummy text6'
                    }
                }
            ]
            const parent=this.getElementByTag("slider");
            parent.innerHTML = ""; // clear current content
            this.addCarouselChildren();
        }, 2000);
    }

    addCarouselChildren(){
        const parent=this.getElementByTag("slider");
        let children=[]
        this.model.items.forEach((item,index)=>{

            const newChild = document.createElement(item.type);
            newChild.setAttribute('data-view-model',`@items.${index}.data`)
            // children.push(newChild); // also works

            parent.append(newChild);
        });
        parent.append(...children);
    }





}
