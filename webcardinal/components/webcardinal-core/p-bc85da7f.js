const a="pages",n="skins",t="templates",e="modals",o="scripts",s="components",r="assets",i="data-model",d="data-view-model",l="disable-binding",c="default-controller",w="hydrated",u="@",f="$",p=["_saveElement"],m=["webc-template","webc-container","webc-component","webc-datatable"],b="psk-",v="data-tag",h="getDataTagModel",E="data-for",P="no-data",g="loading",y="data-for-options",R="events",k="optimistic",A="rerender",L="content-updated",O="content-replaced",T="data-for-template-size",_="data-if",C="true",F="false",j="no-data",G="loading",N="webc-skin-default-stylesheet",U="webc-skin-custom-stylesheet",B={NONE:"none",WARN:"warn",ERROR:"error"},D={BEFORE_APP:"beforeAppLoads",AFTER_APP:"afterAppLoads",BEFORE_PAGE:"beforePageLoads",AFTER_PAGE:"afterPageLoads",CLOSED_PAGE:"whenPageClose"},S="--mode",W="--mode-mobile-breakpoint";function x(a){return M(z(a))}function z(a=""){return a.startsWith("/")?a.slice(1):a}function M(a=""){return a.endsWith("/")?a.slice(0,-1):a}const q={trim:x,trimEnd:M,trimStart:z,join:(a,...n)=>{let t=new URL(M(window.location.origin)+"/");for(let a of n)a=M(a),""!==a&&(t=new URL(a+"/",t));return""!==(a=x(a))&&(t=new URL(a+"/"+x(t.pathname),x(t.origin))),{href:M(t.href),pathname:M(t.pathname)||"/"}}};async function H(a){try{const n=await fetch(a+".html"),t=await n.text();if(!n.ok)throw new Error(t);return[null,t]}catch(a){return[a]}}async function I(a){try{const n=await import(a+".js");return n.default||n}catch(a){return}}async function J(a){try{const n=await fetch(a+".json");if(!n.ok){const a=await n.text();throw new Error(a)}return[null,await n.json()]}catch(a){return[a]}}function K(){var a,n,t;return(null===(a=window.WebCardinal)||void 0===a?void 0:a.state)&&"boolean"==typeof(null===(t=null===(n=window.WebCardinal)||void 0===n?void 0:n.state)||void 0===t?void 0:t.translations)?window.WebCardinal.state.translations:(console.warn(['Preferred "translations" can not be found in WebCardinal.state!','The fallback for translations is "true".'].join("\n"),window.WebCardinal),!0)}function Q(){var a,n,t,e;return(null===(n=null===(a=window.WebCardinal)||void 0===a?void 0:a.state)||void 0===n?void 0:n.skin)&&"string"==typeof(null===(e=null===(t=window.WebCardinal)||void 0===t?void 0:t.state)||void 0===e?void 0:e.skin)?window.WebCardinal.state.skin:(console.warn(['Preferred "skin" can not be found in WebCardinal.state!','The fallback for skin is "default".'].join("\n"),window.WebCardinal),"default")}function V(){const a=Q();return"default"!==a?"skins/"+a:""}function $(){let{pathname:a}=window.location;return a.endsWith("/")&&"/"!==a&&(a=a.slice(0,-1)),window.parent!==window?q.join(window.WebCardinal.basePath,a).pathname:a}export{r as A,S as B,s as C,l as D,W as E,E as F,H as G,w as H,_ as I,I as J,J as K,B as L,e as M,K as N,Q as O,a as P,V as Q,$ as R,n as S,t as T,q as U,d as V,o as a,i as b,c,u as d,f as e,p as f,m as g,b as h,v as i,h as j,P as k,g as l,y as m,R as n,k as o,A as p,L as q,O as r,T as s,C as t,F as u,j as v,G as w,N as x,U as y,D as z}