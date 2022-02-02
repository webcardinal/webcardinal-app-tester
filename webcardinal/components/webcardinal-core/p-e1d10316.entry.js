import{r as t,c as s,h as i}from"./p-afa78421.js";import{v as e,w as n,C as o}from"./p-5ba60a84.js";import{d as r,c as a,V as l,N as h}from"./p-bc85da7f.js";import{H as c}from"./p-dc68eded.js";import{p as d}from"./p-f8a2682a.js";import"./p-e506992e.js";import{C as u}from"./p-f2e7848e.js";import{B as m}from"./p-da78c3db.js";import"./p-0572c496.js";import{i as f}from"./p-585d5e03.js";import{C as p}from"./p-542ba184.js";const b=class{constructor(i){t(this,i),this.getModelEvent=s(this,"webcardinal:model:get",7),this.getTranslationModelEvent=s(this,"webcardinal:translationModel:get",7),this.getChainPrefix=s(this,"webcardinal:parentChain:get",7),this.controller="",this.disableContainer=!1}async componentWillLoad(){if(!this.host.isConnected)return;if(this.host.hasAttribute("instantiate"))return;this.host.setAttribute("instantiate","");const[t,s]=this.resolveControllerElement();let i,c;this.controllerElement=t;const u=this.history;if(this.chain=e(this.host),-1!==this.chain.indexOf(r)){const s=await d(this.getChainPrefix);this.chain=n(s,this.chain);try{i=await d(this.getModelEvent),c=await d(this.getTranslationModelEvent);const s=this.chain?this.chain.slice(1):null;i=i.getChainValue(s),this.controllerInstance=await this.loadController(t,u,i,c)}catch(t){console.error(t)}}else this.controllerInstance=await this.loadController(t,u),i=this.controllerInstance.model,c=this.controllerInstance.translationModel;this.host.hasAttribute(a)&&!this.host.hasAttribute(l)||(m.bindChildNodes(s,{model:i,translationModel:c,recursive:!0,enableTranslations:h()}),this.listeners=new o(s,{model:i,translationModel:c,chain:this.chain}),this.listeners.getModel.add(),this.listeners.getTranslationModel.add(),this.listeners.getParentChain.add())}async connectedCallback(){if(this.listeners){const{getModel:t,getTranslationModel:s,getParentChain:i}=this.listeners;null==t||t.add(),null==s||s.add(),null==i||i.add()}}async disconnectedCallback(){if(this.listeners){const{getModel:t,getTranslationModel:s,getParentChain:i}=this.listeners;null==t||t.remove(),null==s||s.remove(),null==i||i.remove()}setTimeout((()=>{var t,s,i;document.body.contains(this.controllerElement)||(null===(t=this.controllerInstance)||void 0===t||t.disconnectedCallback(),this.chain||null===(i=null===(s=this.controllerInstance)||void 0===s?void 0:s.model)||void 0===i||i.cleanReferencedChangeCallbacks())}),100)}async componentDidLoad(){this.disableContainer&&(Array.from(this.host.childNodes).forEach((t=>this.host.parentNode.insertBefore(t,this.host))),this.host.remove())}async getModel(){if(this.controllerInstance)return this.controllerInstance.model}async getTranslationModel(){if(this.controllerInstance)return this.controllerInstance.translationModel}resolveControllerElement(){const t=this.host;return this.disableContainer?[t.parentElement,t]:[t,t]}async loadController(t,s,i,e){const n=()=>(this.host.setAttribute(a,""),new p(t,s,i,e));if(this.host.hasAttribute("controller-name")&&!this.controller&&(console.warn(['Attribute "controller-name" is deprecated!','Use "controller" instead!'].join("\n"),"target:",this.host),this.controller=this.host.getAttribute("controller-name")),"string"!=typeof this.controller)return console.error('"controller" must be a string!'),n();if(0===this.controller.length)return n();try{const o=await u.getController(this.controller);try{return new o(t,s,i,e)}catch(t){return console.error(`Controller "${this.controller}" has runtime errors!`,"Controller is not a constructor"!==t.message?t:""),n()}}catch(t){return console.error(`Error while loading controller "${this.controller}"`,t),n()}}render(){return this.disableContainer?null:i("slot",null)}};(function(t,s,i,e){var n,o=arguments.length,r=o<3?s:null===e?e=Object.getOwnPropertyDescriptor(s,i):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,s,i,e);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(s,i,r):n(s,i))||r);o>3&&r&&Object.defineProperty(s,i,r)})([c()],b.prototype,"host",void 0),f(b);export{b as webc_container}