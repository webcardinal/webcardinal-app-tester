import{p as a}from"./p-f8a2682a.js";import"./p-e506992e.js";import{W as n,Y as t,Q as o,X as r,U as e}from"./p-f5c9fd96.js";async function s(n){try{return await a(n.getRoutingStateEvent)}catch(a){return console.error('Routing configuration can not be obtained from "webc-app-loader"!\n',a),null}}const{join:i}=e,p={loadAndSetTranslationsForPage:async(a,e)=>{var s;const{basePath:p,mapping:c}=a,l=n();window.WebCardinal.translations||(window.WebCardinal.translations={});const{translations:f}=window.WebCardinal,u=t();if(null===(s=f[l])||void 0===s?void 0:s[u])return!0;let d;if(d="string"==typeof e?e:c[u],!d)return console.warn(`No HTML page mapping was found for the current pathname: ${u}`),!1;if(d.startsWith("http"))return console.warn("Translations for external sources are not supported yet!"),!1;const w=`${d.slice(0,d.lastIndexOf("."))}.translate`;let[m,g]=await o(i(p,r(),w).pathname);return m?"default"!==l&&([m,g]=await o(i(p,w).pathname),!m&&(f.default||(f.default={}),f.default[u]=g,!0)):(f[l]||(f[l]={}),f[l][u]=g,!0)}};export{p as C,s as r}