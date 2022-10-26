const { WebcController } = WebCardinal.controllers;
export default class CarouselCardController extends WebcController {
    constructor(...props) {
        super(...props);
        console.log("Model from inside slider: "+JSON.stringify(this.model))
        this.carouselContainer = this.getElementByTag("scroll-container");
        setTimeout(()=>{this.addCarouselChildren();});
        }

    addCarouselChildren(){
        const parent=this.getElementByTag("slider");
        let children=[]
        this.model.items.forEach((item,index)=>{

            const newChild = document.createElement(item.type);
            newChild.setAttribute('data-view-model',`@items.${index}`)
            children.push(newChild);
        });
        parent.append(...children);
    }





}
