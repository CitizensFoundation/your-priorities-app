import{E as t,F as e,G as i,H as s,I as r,J as o,K as n,M as a,O as l,P as d,Q as h,R as c,S as u,U as _,V as p,W as m,X as f,Z as g,$ as b}from"./Whz9zorx.js";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let v=0;const y=function(t){let e=t.__mixinApplications;e||(e=new WeakMap,t.__mixinApplications=e);let i=v++;return function(s){let r=s.__mixinSet;if(r&&r[i])return s;let o=e,n=o.get(s);if(!n){n=t(s),o.set(s,n);let e=Object.create(n.__mixinSet||r||null);e[i]=!0,n.__mixinSet=e}return n}};
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class A extends HTMLElement{static get version(){return"23.5.2"}}customElements.define("vaadin-lumo-styles",A);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C=window,w=C.ShadowRoot&&(void 0===C.ShadyCSS||C.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,x=Symbol(),E=new WeakMap;let S=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==x)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(w&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=E.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&E.set(e,t))}return t}toString(){return this.cssText}};const P=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new S(i,t,x)},T=w?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new S("string"==typeof t?t:t+"",void 0,x))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var I;const z=window,O=z.trustedTypes,R=O?O.emptyScript:"",N=z.reactiveElementPolyfillSupport,k={toAttribute(t,e){switch(e){case Boolean:t=t?R:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},F=(t,e)=>e!==t&&(e==e||t==t),L={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:F},$="finalized";let D=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=L){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||L}static finalize(){if(this.hasOwnProperty($))return!1;this[$]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(T(t))}else void 0!==t&&e.push(T(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{w?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=C.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=L){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:k).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:k;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||F)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var M;D[$]=!0,D.elementProperties=new Map,D.elementStyles=[],D.shadowRootOptions={mode:"open"},null==N||N({ReactiveElement:D}),(null!==(I=z.reactiveElementVersions)&&void 0!==I?I:z.reactiveElementVersions=[]).push("1.6.3");const H=window,B=H.trustedTypes,V=B?B.createPolicy("lit-html",{createHTML:t=>t}):void 0,U="$lit$",G=`lit$${(Math.random()+"").slice(9)}$`,W="?"+G,j=`<${W}>`,Y=document,q=()=>Y.createComment(""),K=t=>null===t||"object"!=typeof t&&"function"!=typeof t,Z=Array.isArray,J="[ \t\n\f\r]",X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Q=/-->/g,tt=/>/g,et=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,st=/"/g,rt=/^(?:script|style|textarea|title)$/i,ot=Symbol.for("lit-noChange"),nt=Symbol.for("lit-nothing"),at=new WeakMap,lt=Y.createTreeWalker(Y,129,null,!1);function dt(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==V?V.createHTML(e):e}const ht=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":"",n=X;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===X?"!--"===l[1]?n=Q:void 0!==l[1]?n=tt:void 0!==l[2]?(rt.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=et):void 0!==l[3]&&(n=et):n===et?">"===l[0]?(n=null!=r?r:X,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?et:'"'===l[3]?st:it):n===st||n===it?n=et:n===Q||n===tt?n=X:(n=et,r=void 0);const c=n===et&&t[e+1].startsWith("/>")?" ":"";o+=n===X?i+j:d>=0?(s.push(a),i.slice(0,d)+U+i.slice(d)+G+c):i+G+(-2===d?(s.push(void 0),e):c)}return[dt(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class ct{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,d]=ht(t,e);if(this.el=ct.createElement(l,i),lt.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=lt.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(U)||e.startsWith(G)){const i=d[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+U).split(G),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?ft:"?"===e[1]?bt:"@"===e[1]?vt:mt})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(rt.test(s.tagName)){const t=s.textContent.split(G),e=t.length-1;if(e>0){s.textContent=B?B.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],q()),lt.nextNode(),a.push({type:2,index:++r});s.append(t[e],q())}}}else if(8===s.nodeType)if(s.data===W)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(G,t+1));)a.push({type:7,index:r}),t+=G.length-1}r++}}static createElement(t,e){const i=Y.createElement("template");return i.innerHTML=t,i}}function ut(t,e,i=t,s){var r,o,n,a;if(e===ot)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const d=K(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=ut(t,l._$AS(t,e.values),l,s)),e}class _t{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:Y).importNode(i,!0);lt.currentNode=r;let o=lt.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new pt(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new yt(o,this,t)),this._$AV.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(o=lt.nextNode(),n++)}return lt.currentNode=Y,r}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class pt{constructor(t,e,i,s){var r;this.type=2,this._$AH=nt,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ut(this,t,e),K(t)?t===nt||null==t||""===t?(this._$AH!==nt&&this._$AR(),this._$AH=nt):t!==this._$AH&&t!==ot&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>Z(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==nt&&K(this._$AH)?this._$AA.nextSibling.data=t:this.$(Y.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=ct.createElement(dt(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.v(i);else{const t=new _t(r,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=at.get(t.strings);return void 0===e&&at.set(t.strings,e=new ct(t)),e}T(t){Z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new pt(this.k(q()),this.k(q()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class mt{constructor(t,e,i,s,r){this.type=1,this._$AH=nt,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=nt}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=ut(this,t,e,0),o=!K(t)||t!==this._$AH&&t!==ot,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=ut(this,s[i+n],e,n),a===ot&&(a=this._$AH[n]),o||(o=!K(a)||a!==this._$AH[n]),a===nt?t=nt:t!==nt&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===nt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class ft extends mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===nt?void 0:t}}const gt=B?B.emptyScript:"";class bt extends mt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==nt?this.element.setAttribute(this.name,gt):this.element.removeAttribute(this.name)}}class vt extends mt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=ut(this,t,e,0))&&void 0!==i?i:nt)===ot)return;const s=this._$AH,r=t===nt&&s!==nt||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==nt&&(s===nt||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class yt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ut(this,t)}}const At=H.litHtmlPolyfillSupport;null==At||At(ct,pt),(null!==(M=H.litHtmlVersions)&&void 0!==M?M:H.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ct,wt;class xt extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new pt(e.insertBefore(q(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return ot}}xt.finalized=!0,xt._$litElement$=!0,null===(Ct=globalThis.litElementHydrateSupport)||void 0===Ct||Ct.call(globalThis,{LitElement:xt});const Et=globalThis.litElementPolyfillSupport;null==Et||Et({LitElement:xt}),(null!==(wt=globalThis.litElementVersions)&&void 0!==wt?wt:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const St=t=>class extends t{static get properties(){return{theme:{type:String,reflectToAttribute:!0,observer:"__deprecatedThemePropertyChanged"},_theme:{type:String,readOnly:!0}}}__deprecatedThemePropertyChanged(t){this._set_theme(t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Pt=[];function Tt(t,e,i={}){var s;t&&(s=t,Nt(customElements.get(s))&&console.warn(`The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`)),e=function(t=[]){return[t].flat(1/0).filter((t=>t instanceof S||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}(e),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(t,e,i):Pt.push({themeFor:t,styles:e,include:i.include,moduleId:i.moduleId})}function It(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():Pt}function zt(t=""){let e=0;return t.startsWith("lumo-")||t.startsWith("material-")?e=1:t.startsWith("vaadin-")&&(e=2),e}function Ot(t){const e=[];return t.include&&[].concat(t.include).forEach((t=>{const i=It().find((e=>e.moduleId===t));i?e.push(...Ot(i),...i.styles):console.warn(`Included moduleId ${t} not found in style registry`)}),t.styles),e}function Rt(t){const e=`${t}-default-theme`,i=It().filter((i=>i.moduleId!==e&&function(t,e){return(t||"").split(" ").some((t=>new RegExp(`^${t.split("*").join(".*")}$`).test(e)))}(i.themeFor,t))).map((t=>({...t,styles:[...Ot(t),...t.styles],includePriority:zt(t.moduleId)}))).sort(((t,e)=>e.includePriority-t.includePriority));return i.length>0?i:It().filter((t=>t.moduleId===e))}function Nt(t){return t&&Object.prototype.hasOwnProperty.call(t,"__themes")}const kt=t=>class extends(St(t)){static finalize(){if(super.finalize(),this.elementStyles)return;const t=this.prototype._template;t&&!Nt(this)&&function(t,e){const i=document.createElement("style");i.innerHTML=t.map((t=>t.cssText)).join("\n"),e.content.appendChild(i)}(this.getStylesForThis(),t)}static finalizeStyles(t){const e=this.getStylesForThis();return t?[...super.finalizeStyles(t),...e]:e}static getStylesForThis(){const t=Object.getPrototypeOf(this.prototype),e=(t?t.constructor.__themes:[])||[];this.__themes=[...e,...Rt(this.is)];const i=this.__themes.flatMap((t=>t.styles));return i.filter(((t,e)=>e===i.lastIndexOf(t)))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Ft=P`
  :host {
    /* Base (background) */
    --lumo-base-color: #fff;

    /* Tint */
    --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
    --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
    --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
    --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
    --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
    --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
    --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
    --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
    --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
    --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
    --lumo-tint: #fff;

    /* Shade */
    --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
    --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
    --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
    --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
    --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
    --lumo-shade-50pct: hsla(214, 45%, 20%, 0.52);
    --lumo-shade-60pct: hsla(214, 43%, 19%, 0.6);
    --lumo-shade-70pct: hsla(214, 42%, 18%, 0.69);
    --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
    --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
    --lumo-shade: hsl(214, 35%, 15%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-shade-5pct);
    --lumo-contrast-10pct: var(--lumo-shade-10pct);
    --lumo-contrast-20pct: var(--lumo-shade-20pct);
    --lumo-contrast-30pct: var(--lumo-shade-30pct);
    --lumo-contrast-40pct: var(--lumo-shade-40pct);
    --lumo-contrast-50pct: var(--lumo-shade-50pct);
    --lumo-contrast-60pct: var(--lumo-shade-60pct);
    --lumo-contrast-70pct: var(--lumo-shade-70pct);
    --lumo-contrast-80pct: var(--lumo-shade-80pct);
    --lumo-contrast-90pct: var(--lumo-shade-90pct);
    --lumo-contrast: var(--lumo-shade);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 100%, 48%);
    --lumo-primary-color-50pct: hsla(214, 100%, 49%, 0.76);
    --lumo-primary-color-10pct: hsla(214, 100%, 60%, 0.13);
    --lumo-primary-text-color: hsl(214, 100%, 43%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 85%, 48%);
    --lumo-error-color-50pct: hsla(3, 85%, 49%, 0.5);
    --lumo-error-color-10pct: hsla(3, 85%, 49%, 0.1);
    --lumo-error-text-color: hsl(3, 89%, 42%);
    --lumo-error-contrast-color: #fff;

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 72%, 31%, 0.5);
    --lumo-success-color-10pct: hsla(145, 72%, 31%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 25%);
    --lumo-success-contrast-color: #fff;
  }
`,Lt=document.createElement("template");Lt.innerHTML=`<style>${Ft.toString().replace(":host","html")}</style>`,document.head.appendChild(Lt.content);const $t=P`
  [theme~='dark'] {
    /* Base (background) */
    --lumo-base-color: hsl(214, 35%, 21%);

    /* Tint */
    --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
    --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
    --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
    --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
    --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
    --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
    --lumo-tint-60pct: hsla(214, 82%, 90%, 0.58);
    --lumo-tint-70pct: hsla(214, 87%, 92%, 0.69);
    --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
    --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
    --lumo-tint: hsl(214, 100%, 98%);

    /* Shade */
    --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
    --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
    --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
    --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
    --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
    --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
    --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
    --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
    --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
    --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
    --lumo-shade: hsl(214, 33%, 13%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-tint-5pct);
    --lumo-contrast-10pct: var(--lumo-tint-10pct);
    --lumo-contrast-20pct: var(--lumo-tint-20pct);
    --lumo-contrast-30pct: var(--lumo-tint-30pct);
    --lumo-contrast-40pct: var(--lumo-tint-40pct);
    --lumo-contrast-50pct: var(--lumo-tint-50pct);
    --lumo-contrast-60pct: var(--lumo-tint-60pct);
    --lumo-contrast-70pct: var(--lumo-tint-70pct);
    --lumo-contrast-80pct: var(--lumo-tint-80pct);
    --lumo-contrast-90pct: var(--lumo-tint-90pct);
    --lumo-contrast: var(--lumo-tint);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 90%, 48%);
    --lumo-primary-color-50pct: hsla(214, 90%, 70%, 0.69);
    --lumo-primary-color-10pct: hsla(214, 90%, 55%, 0.13);
    --lumo-primary-text-color: hsl(214, 90%, 77%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 79%, 49%);
    --lumo-error-color-50pct: hsla(3, 75%, 62%, 0.5);
    --lumo-error-color-10pct: hsla(3, 75%, 62%, 0.14);
    --lumo-error-text-color: hsl(3, 100%, 80%);

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 92%, 51%, 0.5);
    --lumo-success-color-10pct: hsla(145, 92%, 51%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 46%);
  }

  html {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: light;
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a:where(:any-link) {
    color: var(--lumo-primary-text-color);
  }

  a:not(:any-link) {
    color: var(--lumo-disabled-text-color);
  }

  blockquote {
    color: var(--lumo-secondary-text-color);
  }

  code,
  pre {
    background-color: var(--lumo-contrast-10pct);
    border-radius: var(--lumo-border-radius-m);
  }
`;Tt("",$t,{moduleId:"lumo-color"});Tt("",[$t,P`
  :host {
    color: var(--lumo-body-text-color) !important;
    background-color: var(--lumo-base-color) !important;
  }
`],{moduleId:"lumo-color-legacy"});
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Dt=document.createElement("template");Dt.innerHTML='\n  <style>\n    @font-face {\n      font-family: \'lumo-icons\';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format(\'woff\');\n      font-weight: normal;\n      font-style: normal;\n    }\n\n    html {\n      --lumo-icons-align-center: "\\ea01";\n      --lumo-icons-align-left: "\\ea02";\n      --lumo-icons-align-right: "\\ea03";\n      --lumo-icons-angle-down: "\\ea04";\n      --lumo-icons-angle-left: "\\ea05";\n      --lumo-icons-angle-right: "\\ea06";\n      --lumo-icons-angle-up: "\\ea07";\n      --lumo-icons-arrow-down: "\\ea08";\n      --lumo-icons-arrow-left: "\\ea09";\n      --lumo-icons-arrow-right: "\\ea0a";\n      --lumo-icons-arrow-up: "\\ea0b";\n      --lumo-icons-bar-chart: "\\ea0c";\n      --lumo-icons-bell: "\\ea0d";\n      --lumo-icons-calendar: "\\ea0e";\n      --lumo-icons-checkmark: "\\ea0f";\n      --lumo-icons-chevron-down: "\\ea10";\n      --lumo-icons-chevron-left: "\\ea11";\n      --lumo-icons-chevron-right: "\\ea12";\n      --lumo-icons-chevron-up: "\\ea13";\n      --lumo-icons-clock: "\\ea14";\n      --lumo-icons-cog: "\\ea15";\n      --lumo-icons-cross: "\\ea16";\n      --lumo-icons-download: "\\ea17";\n      --lumo-icons-dropdown: "\\ea18";\n      --lumo-icons-edit: "\\ea19";\n      --lumo-icons-error: "\\ea1a";\n      --lumo-icons-eye: "\\ea1b";\n      --lumo-icons-eye-disabled: "\\ea1c";\n      --lumo-icons-menu: "\\ea1d";\n      --lumo-icons-minus: "\\ea1e";\n      --lumo-icons-ordered-list: "\\ea1f";\n      --lumo-icons-phone: "\\ea20";\n      --lumo-icons-photo: "\\ea21";\n      --lumo-icons-play: "\\ea22";\n      --lumo-icons-plus: "\\ea23";\n      --lumo-icons-redo: "\\ea24";\n      --lumo-icons-reload: "\\ea25";\n      --lumo-icons-search: "\\ea26";\n      --lumo-icons-undo: "\\ea27";\n      --lumo-icons-unordered-list: "\\ea28";\n      --lumo-icons-upload: "\\ea29";\n      --lumo-icons-user: "\\ea2a";\n    }\n  </style>\n',document.head.appendChild(Dt.content);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Mt=P`
  :host {
    --lumo-size-xs: 1.625rem;
    --lumo-size-s: 1.875rem;
    --lumo-size-m: 2.25rem;
    --lumo-size-l: 2.75rem;
    --lumo-size-xl: 3.5rem;

    /* Icons */
    --lumo-icon-size-s: 1.25em;
    --lumo-icon-size-m: 1.5em;
    --lumo-icon-size-l: 2.25em;
    /* For backwards compatibility */
    --lumo-icon-size: var(--lumo-icon-size-m);
  }
`,Ht=document.createElement("template");Ht.innerHTML=`<style>${Mt.toString().replace(":host","html")}</style>`,document.head.appendChild(Ht.content);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Bt=P`
  :host {
    /* Square */
    --lumo-space-xs: 0.25rem;
    --lumo-space-s: 0.5rem;
    --lumo-space-m: 1rem;
    --lumo-space-l: 1.5rem;
    --lumo-space-xl: 2.5rem;

    /* Wide */
    --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
    --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
    --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
    --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
    --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

    /* Tall */
    --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
    --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
    --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
    --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
    --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
  }
`,Vt=document.createElement("template");Vt.innerHTML=`<style>${Bt.toString().replace(":host","html")}</style>`,document.head.appendChild(Vt.content);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Ut=P`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
    --lumo-border-radius: 0.25em; /* Deprecated */

    /* Shadow */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
    --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
    --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
    --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
    --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

    /* Clickable element cursor */
    --lumo-clickable-cursor: default;
  }
`;P`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
  }
`;const Gt=document.createElement("template");Gt.innerHTML=`<style>${Ut.toString().replace(":host","html")}$</style>`,document.head.appendChild(Gt.content);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Wt=P`
  :host {
    /* prettier-ignore */
    --lumo-font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    /* Font sizes */
    --lumo-font-size-xxs: 0.75rem;
    --lumo-font-size-xs: 0.8125rem;
    --lumo-font-size-s: 0.875rem;
    --lumo-font-size-m: 1rem;
    --lumo-font-size-l: 1.125rem;
    --lumo-font-size-xl: 1.375rem;
    --lumo-font-size-xxl: 1.75rem;
    --lumo-font-size-xxxl: 2.5rem;

    /* Line heights */
    --lumo-line-height-xs: 1.25;
    --lumo-line-height-s: 1.375;
    --lumo-line-height-m: 1.625;
  }
`;Tt("",P`
  html,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size, var(--lumo-font-size-m));
    line-height: var(--lumo-line-height-m);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  small,
  [theme~='font-size-s'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
  }

  [theme~='font-size-xs'] {
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-top: 1.25em;
  }

  h1 {
    font-size: var(--lumo-font-size-xxxl);
    margin-bottom: 0.75em;
  }

  h2 {
    font-size: var(--lumo-font-size-xxl);
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: var(--lumo-font-size-xl);
    margin-bottom: 0.5em;
  }

  h4 {
    font-size: var(--lumo-font-size-l);
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: var(--lumo-font-size-m);
    margin-bottom: 0.25em;
  }

  h6 {
    font-size: var(--lumo-font-size-xs);
    margin-bottom: 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  p,
  blockquote {
    margin-top: 0.5em;
    margin-bottom: 0.75em;
  }

  a {
    text-decoration: none;
  }

  a:where(:any-link):hover {
    text-decoration: underline;
  }

  hr {
    display: block;
    align-self: stretch;
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
    background-color: var(--lumo-contrast-10pct);
  }

  blockquote {
    border-left: 2px solid var(--lumo-contrast-30pct);
  }

  b,
  strong {
    font-weight: 600;
  }

  /* RTL specific styles */
  blockquote[dir='rtl'] {
    border-left: none;
    border-right: 2px solid var(--lumo-contrast-30pct);
  }
`,{moduleId:"lumo-typography"});const jt=document.createElement("template");jt.innerHTML=`<style>${Wt.toString().replace(":host","html")}</style>`,document.head.appendChild(jt.content),Tt("vaadin-checkbox",P`
    :host {
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      font-family: var(--lumo-font-family);
      line-height: var(--lumo-line-height-s);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: default;
      outline: none;
      --_checkbox-size: var(--vaadin-checkbox-size, calc(var(--lumo-size-m) / 2));
    }

    :host([has-label]) ::slotted(label) {
      padding-block: var(--lumo-space-xs);
      padding-inline: var(--lumo-space-xs) var(--lumo-space-s);
    }

    [part='checkbox'] {
      width: var(--_checkbox-size);
      height: var(--_checkbox-size);
      margin: var(--lumo-space-xs);
      position: relative;
      border-radius: var(--lumo-border-radius-s);
      background-color: var(--lumo-contrast-20pct);
      transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), background-color 0.15s;
      cursor: var(--lumo-clickable-cursor);
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--lumo-primary-color);
    }

    /* Checkmark */
    [part='checkbox']::after {
      pointer-events: none;
      font-family: 'lumo-icons';
      content: var(--lumo-icons-checkmark);
      color: var(--lumo-primary-contrast-color);
      font-size: calc(var(--_checkbox-size) + 2px);
      line-height: 1;
      position: absolute;
      top: -1px;
      left: -1px;
      contain: content;
      opacity: 0;
    }

    :host([checked]) [part='checkbox']::after {
      opacity: 1;
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      content: '';
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--lumo-primary-contrast-color);
    }

    /* Focus ring */
    :host([focus-ring]) [part='checkbox'] {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      color: var(--lumo-disabled-text-color);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='checkbox'] {
      background-color: var(--lumo-contrast-10pct);
    }

    :host([disabled]) [part='checkbox']::after {
      color: var(--lumo-contrast-30pct);
    }

    :host([indeterminate][disabled]) [part='checkbox']::after {
      background-color: var(--lumo-contrast-30pct);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Used for activation "halo" */
    [part='checkbox']::before {
      pointer-events: none;
      color: transparent;
      width: 100%;
      height: 100%;
      line-height: var(--_checkbox-size);
      border-radius: inherit;
      background-color: inherit;
      transform: scale(1.4);
      opacity: 0;
      transition: transform 0.1s, opacity 0.8s;
    }

    /* Hover */
    :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
      background-color: var(--lumo-contrast-30pct);
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
        background-color: var(--lumo-contrast-20pct);
      }
    }

    /* Active */
    :host([active]) [part='checkbox'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='checkbox'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='checkbox']::before {
      transition-duration: 0.01s, 0.01s;
      transform: scale(0);
      opacity: 0.4;
    }
  `,{moduleId:"lumo-checkbox"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Yt={},qt={};function Kt(t,e){Yt[t]=qt[t.toLowerCase()]=e}function Zt(t){return Yt[t]||qt[t.toLowerCase()]}class Jt extends HTMLElement{static get observedAttributes(){return["id"]}static import(t,e){if(t){let i=Zt(t);return i&&e?i.querySelector(e):i}return null}attributeChangedCallback(t,e,i,s){e!==i&&this.register()}get assetpath(){if(!this.__assetpath){const i=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,s=t(this.getAttribute("assetpath")||"",i.baseURI);this.__assetpath=e(s)}return this.__assetpath}register(t){if(t=t||this.id){if(i&&void 0!==Zt(t))throw Kt(t,null),new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);this.id=t,Kt(t,this),(e=this).querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}var e}}Jt.prototype.modules=Yt,customElements.define("dom-module",Jt);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const Xt="link[rel=import][type~=css]",Qt="include",te="shady-unscoped";function ee(t){return Jt.import(t)}function ie(t){let e=t.body?t.body:t;const i=s(e.textContent,t.baseURI),r=document.createElement("style");return r.textContent=i,r}function se(t){const e=t.trim().split(/\s+/),i=[];for(let t=0;t<e.length;t++)i.push(...re(e[t]));return i}function re(t){const e=ee(t);if(!e)return console.warn("Could not find style data in module named",t),[];if(void 0===e._styles){const t=[];t.push(...ne(e));const i=e.querySelector("template");i&&t.push(...oe(i,e.assetpath)),e._styles=t}return e._styles}function oe(t,e){if(!t._styles){const i=[],r=t.content.querySelectorAll("style");for(let t=0;t<r.length;t++){let o=r[t],n=o.getAttribute(Qt);n&&i.push(...se(n).filter((function(t,e,i){return i.indexOf(t)===e}))),e&&(o.textContent=s(o.textContent,e)),i.push(o)}t._styles=i}return t._styles}function ne(t){const e=[],i=t.querySelectorAll(Xt);for(let t=0;t<i.length;t++){let s=i[t];if(s.import){const t=s.import,i=s.hasAttribute(te);if(i&&!t._unscopedStyle){const e=ie(t);e.setAttribute(te,""),t._unscopedStyle=e}else t._style||(t._style=ie(t));e.push(i?t._unscopedStyle:t._style)}}return e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function ae(t){return t.indexOf(".")>=0}function le(t){let e=t.indexOf(".");return-1===e?t:t.slice(0,e)}function de(t,e){return 0===e.indexOf(t+".")}function he(t,e,i){return e+i.slice(t.length)}function ce(t){if(Array.isArray(t)){let e=[];for(let i=0;i<t.length;i++){let s=t[i].toString().split(".");for(let t=0;t<s.length;t++)e.push(s[t])}return e.join(".")}return t}function ue(t){return Array.isArray(t)?ce(t).split("."):t.toString().split(".")}function _e(t,e,i){let s=t,r=ue(e);for(let t=0;t<r.length;t++){if(!s)return;s=s[r[t]]}return i&&(i.path=r.join(".")),s}function pe(t,e,i){let s=t,r=ue(e),o=r[r.length-1];if(r.length>1){for(let t=0;t<r.length-1;t++){if(s=s[r[t]],!s)return}s[o]=i}else s[e]=i;return r.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const me={},fe=/-[a-z]/g,ge=/([A-Z])/g;function be(t){return me[t]||(me[t]=t.indexOf("-")<0?t:t.replace(fe,(t=>t[1].toUpperCase())))}function ve(t){return me[t]||(me[t]=t.replace(ge,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const ye=o,Ae=y((t=>class extends t{static createProperties(t){const e=this.prototype;for(let i in t)i in e||e._createPropertyAccessor(i)}static attributeNameForProperty(t){return t.toLowerCase()}static typeForProperty(t){}_createPropertyAccessor(t,e){this._addPropertyToAttributeMap(t),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[t]||(this.__dataHasAccessor[t]=!0,this._definePropertyAccessor(t,e))}_addPropertyToAttributeMap(t){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.__dataAttributes=Object.assign({},this.__dataAttributes));let e=this.__dataAttributes[t];return e||(e=this.constructor.attributeNameForProperty(t),this.__dataAttributes[e]=t),e}_definePropertyAccessor(t,e){Object.defineProperty(this,t,{get(){return this.__data[t]},set:e?function(){}:function(e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__dataCounter=0,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let t in this.__dataHasAccessor)this.hasOwnProperty(t)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[t]=this[t],delete this[t])}_initializeInstanceProperties(t){Object.assign(this,t)}_setProperty(t,e){this._setPendingProperty(t,e)&&this._invalidateProperties()}_getProperty(t){return this.__data[t]}_setPendingProperty(t,e,i){let s=this.__data[t],r=this._shouldPropertyChange(t,e,s);return r&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(t in this.__dataOld)&&(this.__dataOld[t]=s),this.__data[t]=e,this.__dataPending[t]=e),r}_isPropertyPending(t){return!(!this.__dataPending||!this.__dataPending.hasOwnProperty(t))}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,ye.run((()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())})))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){this.__dataCounter++;const t=this.__data,e=this.__dataPending,i=this.__dataOld;this._shouldPropertiesChange(t,e,i)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(t,e,i)),this.__dataCounter--}_shouldPropertiesChange(t,e,i){return Boolean(e)}_propertiesChanged(t,e,i){}_shouldPropertyChange(t,e,i){return i!==e&&(i==i||e==e)}attributeChangedCallback(t,e,i,s){e!==i&&this._attributeToProperty(t,i),super.attributeChangedCallback&&super.attributeChangedCallback(t,e,i,s)}_attributeToProperty(t,e,i){if(!this.__serializing){const s=this.__dataAttributes,r=s&&s[t]||t;this[r]=this._deserializeValue(e,i||this.constructor.typeForProperty(r))}}_propertyToAttribute(t,e,i){this.__serializing=!0,i=arguments.length<3?this[t]:i,this._valueToNodeAttribute(this,i,e||this.constructor.attributeNameForProperty(t)),this.__serializing=!1}_valueToNodeAttribute(t,e,i){const s=this._serializeValue(e);"class"!==i&&"name"!==i&&"slot"!==i||(t=r(t)),void 0===s?t.removeAttribute(i):t.setAttribute(i,""===s&&window.trustedTypes?window.trustedTypes.emptyScript:s)}_serializeValue(t){return"boolean"==typeof t?t?"":void 0:null!=t?t.toString():void 0}_deserializeValue(t,e){switch(e){case Boolean:return null!==t;case Number:return Number(t);default:return t}}})),Ce={};let we=HTMLElement.prototype;for(;we;){let t=Object.getOwnPropertyNames(we);for(let e=0;e<t.length;e++)Ce[t[e]]=!0;we=Object.getPrototypeOf(we)}const xe=window.trustedTypes?t=>trustedTypes.isHTML(t)||trustedTypes.isScript(t)||trustedTypes.isScriptURL(t):()=>!1;const Ee=y((t=>{const e=Ae(t);return class extends e{static createPropertiesForAttributes(){let t=this.observedAttributes;for(let e=0;e<t.length;e++)this.prototype._createPropertyAccessor(be(t[e]))}static attributeNameForProperty(t){return ve(t)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(t){for(let e in t)this._setProperty(e,t[e])}_ensureAttribute(t,e){const i=this;i.hasAttribute(t)||this._valueToNodeAttribute(i,e,t)}_serializeValue(t){if("object"==typeof t){if(t instanceof Date)return t.toString();if(t){if(xe(t))return t;try{return JSON.stringify(t)}catch(t){return""}}}return super._serializeValue(t)}_deserializeValue(t,e){let i;switch(e){case Object:try{i=JSON.parse(t)}catch(e){i=t}break;case Array:try{i=JSON.parse(t)}catch(e){i=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${t}`)}break;case Date:i=isNaN(t)?String(t):Number(t),i=new Date(i);break;default:i=super._deserializeValue(t,e)}return i}_definePropertyAccessor(t,e){!function(t,e){if(!Ce[e]){let i=t[e];void 0!==i&&(t.__data?t._setPendingProperty(e,i):(t.__dataProto?t.hasOwnProperty(JSCompiler_renameProperty("__dataProto",t))||(t.__dataProto=Object.create(t.__dataProto)):t.__dataProto={},t.__dataProto[e]=i))}}(this,t),super._definePropertyAccessor(t,e)}_hasAccessor(t){return this.__dataHasAccessor&&this.__dataHasAccessor[t]}_isPropertyPending(t){return Boolean(this.__dataPending&&t in this.__dataPending)}}})),Se={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Pe=!1,Te=!1;function Ie(t){(function(){if(!Pe){Pe=!0;const t=document.createElement("textarea");t.placeholder="a",Te=t.placeholder===t.textContent}return Te})()&&"textarea"===t.localName&&t.placeholder&&t.placeholder===t.textContent&&(t.textContent=null)}const ze=(()=>{const t=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:t=>t});return(e,i,s)=>{const r=i.getAttribute(s);t&&s.startsWith("on-")?e.setAttribute(s,t.createScript(r,s)):e.setAttribute(s,r)}})();function Oe(t){let e=t.getAttribute("is");if(e&&Se[e]){let i=t;for(i.removeAttribute("is"),t=i.ownerDocument.createElement(e),i.parentNode.replaceChild(t,i),t.appendChild(i);i.attributes.length;){const{name:e}=i.attributes[0];ze(t,i,e),i.removeAttribute(e)}}return t}function Re(t,e){let i=e.parentInfo&&Re(t,e.parentInfo);if(!i)return t;for(let t=i.firstChild,s=0;t;t=t.nextSibling)if(e.parentIndex===s++)return t}function Ne(t,e,i,s){s.id&&(e[s.id]=i)}function ke(t,e,i){if(i.events&&i.events.length)for(let s,r=0,o=i.events;r<o.length&&(s=o[r]);r++)t._addMethodEventListenerToNode(e,s.name,s.value,t)}function Fe(t,e,i,s){i.templateInfo&&(e._templateInfo=i.templateInfo,e._parentTemplateInfo=s)}const Le=y((t=>class extends t{static _parseTemplate(t,e){if(!t._templateInfo){let i=t._templateInfo={};i.nodeInfoList=[],i.nestedTemplate=Boolean(e),i.stripWhiteSpace=e&&e.stripWhiteSpace||t.hasAttribute&&t.hasAttribute("strip-whitespace"),this._parseTemplateContent(t,i,{parent:null})}return t._templateInfo}static _parseTemplateContent(t,e,i){return this._parseTemplateNode(t.content,e,i)}static _parseTemplateNode(t,e,i){let s=!1,r=t;return"template"!=r.localName||r.hasAttribute("preserve-content")?"slot"===r.localName&&(e.hasInsertionPoint=!0):s=this._parseTemplateNestedTemplate(r,e,i)||s,Ie(r),r.firstChild&&this._parseTemplateChildNodes(r,e,i),r.hasAttributes&&r.hasAttributes()&&(s=this._parseTemplateNodeAttributes(r,e,i)||s),s||i.noted}static _parseTemplateChildNodes(t,e,i){if("script"!==t.localName&&"style"!==t.localName)for(let s,r=t.firstChild,o=0;r;r=s){if("template"==r.localName&&(r=Oe(r)),s=r.nextSibling,r.nodeType===Node.TEXT_NODE){let i=s;for(;i&&i.nodeType===Node.TEXT_NODE;)r.textContent+=i.textContent,s=i.nextSibling,t.removeChild(i),i=s;if(e.stripWhiteSpace&&!r.textContent.trim()){t.removeChild(r);continue}}let n={parentIndex:o,parentInfo:i};this._parseTemplateNode(r,e,n)&&(n.infoIndex=e.nodeInfoList.push(n)-1),r.parentNode&&o++}}static _parseTemplateNestedTemplate(t,e,i){let s=t,r=this._parseTemplate(s,e);return(r.content=s.content.ownerDocument.createDocumentFragment()).appendChild(s.content),i.templateInfo=r,!0}static _parseTemplateNodeAttributes(t,e,i){let s=!1,r=Array.from(t.attributes);for(let o,n=r.length-1;o=r[n];n--)s=this._parseTemplateNodeAttribute(t,e,i,o.name,o.value)||s;return s}static _parseTemplateNodeAttribute(t,e,i,s,r){return"on-"===s.slice(0,3)?(t.removeAttribute(s),i.events=i.events||[],i.events.push({name:s.slice(3),value:r}),!0):"id"===s&&(i.id=r,!0)}static _contentForTemplate(t){let e=t._templateInfo;return e&&e.content||t.content}_stampTemplate(t,e){t&&!t.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(t);let i=(e=e||this.constructor._parseTemplate(t)).nodeInfoList,s=e.content||t.content,r=document.importNode(s,!0);r.__noInsertionPoint=!e.hasInsertionPoint;let o=r.nodeList=new Array(i.length);r.$={};for(let t,s=0,n=i.length;s<n&&(t=i[s]);s++){let i=o[s]=Re(r,t);Ne(0,r.$,i,t),Fe(0,i,t,e),ke(this,i,t)}return r}_addMethodEventListenerToNode(t,e,i,s){let r=function(t,e,i){return t=t._methodHost||t,function(e){t[i]?t[i](e,e.detail):console.warn("listener method `"+i+"` not defined")}}(s=s||t,0,i);return this._addEventListenerToNode(t,e,r),r}_addEventListenerToNode(t,e,i){t.addEventListener(e,i)}_removeEventListenerFromNode(t,e,i){t.removeEventListener(e,i)}}));
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */let $e=0;const De=[],Me={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},He="__computeInfo",Be=/[A-Z]/;function Ve(t,e,i){let s=t[e];if(s){if(!t.hasOwnProperty(e)&&(s=t[e]=Object.create(t[e]),i))for(let t in s){let e=s[t],i=s[t]=Array(e.length);for(let t=0;t<e.length;t++)i[t]=e[t]}}else s=t[e]={};return s}function Ue(t,e,i,s,r,o){if(e){let n=!1;const a=$e++;for(let l in i){let d=e[r?le(l):l];if(d)for(let e,h=0,c=d.length;h<c&&(e=d[h]);h++)e.info&&e.info.lastRun===a||r&&!We(l,e.trigger)||(e.info&&(e.info.lastRun=a),e.fn(t,l,i,s,e.info,r,o),n=!0)}return n}return!1}function Ge(t,e,i,s,r,o,n,a){let l=!1,d=e[n?le(s):s];if(d)for(let e,h=0,c=d.length;h<c&&(e=d[h]);h++)e.info&&e.info.lastRun===i||n&&!We(s,e.trigger)||(e.info&&(e.info.lastRun=i),e.fn(t,s,r,o,e.info,n,a),l=!0);return l}function We(t,e){if(e){let i=e.name;return i==t||!(!e.structured||!function(t,e){return 0===t.indexOf(e+".")}(i,t))||!(!e.wildcard||!de(i,t))}return!0}function je(t,e,i,s,r){let o="string"==typeof r.method?t[r.method]:r.method,n=r.property;o?o.call(t,t.__data[n],s[n]):r.dynamicFn||console.warn("observer method `"+r.method+"` not defined")}function Ye(t,e,i){let s=le(e);if(s!==e){return qe(t,ve(s)+"-changed",i[e],e),!0}return!1}function qe(t,e,i,s){let o={value:i,queueProperty:!0};s&&(o.path=s),r(t).dispatchEvent(new CustomEvent(e,{detail:o}))}function Ke(t,e,i,s,r,o){let n=(o?le(e):e)!=e?e:null,a=n?_e(t,n):t.__data[e];n&&void 0===a&&(a=i[e]),qe(t,r.eventName,a,n)}function Ze(t,e,i,s,r){let o=t.__data[e];d&&(o=d(o,r.attrName,"attribute",t)),t._propertyToAttribute(e,r.attrName,o)}function Je(t,e,i,s){let r=t[Me.COMPUTE];if(r)if(h){$e++;const o=function(t){let e=t.constructor.__orderedComputedDeps;if(!e){e=new Map;const i=t[Me.COMPUTE];let s,{counts:r,ready:o,total:n}=function(t){const e=t[He],i={},s=t[Me.COMPUTE],r=[];let o=0;for(let t in e){const s=e[t];o+=i[t]=s.args.filter((t=>!t.literal)).length+(s.dynamicFn?1:0)}for(let t in s)e[t]||r.push(t);return{counts:i,ready:r,total:o}}(t);for(;s=o.shift();){e.set(s,e.size);const t=i[s];t&&t.forEach((t=>{const e=t.info.methodInfo;--n,0==--r[e]&&o.push(e)}))}if(0!==n){const e=t;console.warn(`Computed graph for ${e.localName} incomplete; circular?`)}t.constructor.__orderedComputedDeps=e}return e}(t),n=[];for(let t in e)Qe(t,r,n,o,s);let a;for(;a=n.shift();)ti(t,"",e,i,a)&&Qe(a.methodInfo,r,n,o,s);Object.assign(i,t.__dataOld),Object.assign(e,t.__dataPending),t.__dataPending=null}else{let o=e;for(;Ue(t,r,o,i,s);)Object.assign(i,t.__dataOld),Object.assign(e,t.__dataPending),o=t.__dataPending,t.__dataPending=null}}const Xe=(t,e,i)=>{let s=0,r=e.length-1,o=-1;for(;s<=r;){const n=s+r>>1,a=i.get(e[n].methodInfo)-i.get(t.methodInfo);if(a<0)s=n+1;else{if(!(a>0)){o=n;break}r=n-1}}o<0&&(o=r+1),e.splice(o,0,t)},Qe=(t,e,i,s,r)=>{const o=e[r?le(t):t];if(o)for(let e=0;e<o.length;e++){const n=o[e];n.info.lastRun===$e||r&&!We(t,n.trigger)||(n.info.lastRun=$e,Xe(n.info,i,s))}};function ti(t,e,i,s,r){let o=ai(t,e,i,s,r);if(o===De)return!1;let n=r.methodInfo;return t.__dataHasAccessor&&t.__dataHasAccessor[n]?t._setPendingProperty(n,o,!0):(t[n]=o,!1)}function ei(t,e,i,s,r,o,n){i.bindings=i.bindings||[];let a={kind:s,target:r,parts:o,literal:n,isCompound:1!==o.length};if(i.bindings.push(a),function(t){return Boolean(t.target)&&"attribute"!=t.kind&&"text"!=t.kind&&!t.isCompound&&"{"===t.parts[0].mode}(a)){let{event:t,negate:e}=a.parts[0];a.listenerEvent=t||ve(r)+"-changed",a.listenerNegate=e}let l=e.nodeInfoList.length;for(let i=0;i<a.parts.length;i++){let s=a.parts[i];s.compoundIndex=i,ii(t,e,a,s,l)}}function ii(t,e,i,s,r){if(!s.literal)if("attribute"===i.kind&&"-"===i.target[0])console.warn("Cannot set attribute "+i.target+' because "-" is not a valid attribute starting character');else{let o=s.dependencies,n={index:r,binding:i,part:s,evaluator:t};for(let i=0;i<o.length;i++){let s=o[i];"string"==typeof s&&(s=pi(s),s.wildcard=!0),t._addTemplatePropertyEffect(e,s.rootProperty,{fn:si,info:n,trigger:s})}}}function si(t,e,i,s,r,o,n){let a=n[r.index],l=r.binding,h=r.part;if(o&&h.source&&e.length>h.source.length&&"property"==l.kind&&!l.isCompound&&a.__isPropertyEffectsClient&&a.__dataHasAccessor&&a.__dataHasAccessor[l.target]){let s=i[e];e=he(h.source,l.target,e),a._setPendingPropertyOrPath(e,s,!1,!0)&&t._enqueueClient(a)}else{let n=r.evaluator._evaluateBinding(t,h,e,i,s,o);n!==De&&function(t,e,i,s,r){r=function(t,e,i,s){if(i.isCompound){let r=t.__dataCompoundStorage[i.target];r[s.compoundIndex]=e,e=r.join("")}"attribute"!==i.kind&&("textContent"!==i.target&&("value"!==i.target||"input"!==t.localName&&"textarea"!==t.localName)||(e=null==e?"":e));return e}(e,r,i,s),d&&(r=d(r,i.target,i.kind,e));if("attribute"==i.kind)t._valueToNodeAttribute(e,r,i.target);else{let s=i.target;e.__isPropertyEffectsClient&&e.__dataHasAccessor&&e.__dataHasAccessor[s]?e[Me.READ_ONLY]&&e[Me.READ_ONLY][s]||e._setPendingProperty(s,r)&&t._enqueueClient(e):t._setUnmanagedPropertyToNode(e,s,r)}}(t,a,l,h,n)}}function ri(t,e){if(e.isCompound){let i=t.__dataCompoundStorage||(t.__dataCompoundStorage={}),s=e.parts,o=new Array(s.length);for(let t=0;t<s.length;t++)o[t]=s[t].literal;let n=e.target;i[n]=o,e.literal&&"property"==e.kind&&("className"===n&&(t=r(t)),t[n]=e.literal)}}function oi(t,e,i){if(i.listenerEvent){let s=i.parts[0];t.addEventListener(i.listenerEvent,(function(t){!function(t,e,i,s,r){let o,n=t.detail,a=n&&n.path;a?(s=he(i,s,a),o=n&&n.value):o=t.currentTarget[i],o=r?!o:o,e[Me.READ_ONLY]&&e[Me.READ_ONLY][s]||!e._setPendingPropertyOrPath(s,o,!0,Boolean(a))||n&&n.queueProperty||e._invalidateProperties()}(t,e,i.target,s.source,s.negate)}))}}function ni(t,e,i,s,r,o){o=e.static||o&&("object"!=typeof o||o[e.methodName]);let n={methodName:e.methodName,args:e.args,methodInfo:r,dynamicFn:o};for(let r,o=0;o<e.args.length&&(r=e.args[o]);o++)r.literal||t._addPropertyEffect(r.rootProperty,i,{fn:s,info:n,trigger:r});return o&&t._addPropertyEffect(e.methodName,i,{fn:s,info:n}),n}function ai(t,e,i,s,r){let o=t._methodHost||t,n=o[r.methodName];if(n){let s=t._marshalArgs(r.args,e,i);return s===De?De:n.apply(o,s)}r.dynamicFn||console.warn("method `"+r.methodName+"` not defined")}const li=[],di="(?:[a-zA-Z_$][\\w.:$\\-*]*)",hi="(?:("+di+"|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",ci=new RegExp("(\\[\\[|{{)\\s*(?:(!)\\s*)?"+("("+di+"\\s*"+("(?:\\(\\s*(?:"+("(?:"+hi+"(?:,\\s*"+hi+")*)")+"?)\\)\\s*)")+"?)")+"(?:]]|}})","g");function ui(t){let e="";for(let i=0;i<t.length;i++){e+=t[i].literal||""}return e}function _i(t){let e=t.match(/([^\s]+?)\(([\s\S]*)\)/);if(e){let t={methodName:e[1],static:!0,args:li};if(e[2].trim()){return function(t,e){return e.args=t.map((function(t){let i=pi(t);return i.literal||(e.static=!1),i}),this),e}(e[2].replace(/\\,/g,"&comma;").split(","),t)}return t}return null}function pi(t){let e=t.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),i={name:e,value:"",literal:!1},s=e[0];switch("-"===s&&(s=e[1]),s>="0"&&s<="9"&&(s="#"),s){case"'":case'"':i.value=e.slice(1,-1),i.literal=!0;break;case"#":i.value=Number(e),i.literal=!0}return i.literal||(i.rootProperty=le(e),i.structured=ae(e),i.structured&&(i.wildcard=".*"==e.slice(-2),i.wildcard&&(i.name=e.slice(0,-2)))),i}function mi(t,e,i){let s=_e(t,i);return void 0===s&&(s=e[i]),s}function fi(t,e,i,s){const r={indexSplices:s};n&&!t._overrideLegacyUndefined&&(e.splices=r),t.notifyPath(i+".splices",r),t.notifyPath(i+".length",e.length),n&&!t._overrideLegacyUndefined&&(r.indexSplices=[])}function gi(t,e,i,s,r,o){fi(t,e,i,[{index:s,addedCount:r,removed:o,object:e,type:"splice"}])}const bi=y((t=>{const e=Le(Ee(t));return class extends e{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__computeInfo,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return Me}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_registerHost(){if(vi.length){let t=vi[vi.length-1];t._enqueueClient(this),this.__dataHost=t}}_initializeProtoProperties(t){this.__data=Object.create(t),this.__dataPending=Object.create(t),this.__dataOld={}}_initializeInstanceProperties(t){let e=this[Me.READ_ONLY];for(let i in t)e&&e[i]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[i]=this.__dataPending[i]=t[i])}_addPropertyEffect(t,e,i){this._createPropertyAccessor(t,e==Me.READ_ONLY);let s=Ve(this,e,!0)[t];s||(s=this[e][t]=[]),s.push(i)}_removePropertyEffect(t,e,i){let s=Ve(this,e,!0)[t],r=s.indexOf(i);r>=0&&s.splice(r,1)}_hasPropertyEffect(t,e){let i=this[e];return Boolean(i&&i[t])}_hasReadOnlyEffect(t){return this._hasPropertyEffect(t,Me.READ_ONLY)}_hasNotifyEffect(t){return this._hasPropertyEffect(t,Me.NOTIFY)}_hasReflectEffect(t){return this._hasPropertyEffect(t,Me.REFLECT)}_hasComputedEffect(t){return this._hasPropertyEffect(t,Me.COMPUTE)}_setPendingPropertyOrPath(t,e,i,s){if(s||le(Array.isArray(t)?t[0]:t)!==t){if(!s){let i=_e(this,t);if(!(t=pe(this,t,e))||!super._shouldPropertyChange(t,e,i))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(t,e,i))return function(t,e,i){let s=t.__dataLinkedPaths;if(s){let r;for(let o in s){let n=s[o];de(o,e)?(r=he(o,n,e),t._setPendingPropertyOrPath(r,i,!0,!0)):de(n,e)&&(r=he(n,o,e),t._setPendingPropertyOrPath(r,i,!0,!0))}}}(this,t,e),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[t])return this._setPendingProperty(t,e,i);this[t]=e}return!1}_setUnmanagedPropertyToNode(t,e,i){i===t[e]&&"object"!=typeof i||("className"===e&&(t=r(t)),t[e]=i)}_setPendingProperty(t,e,i){let s=this.__dataHasPaths&&ae(t),r=s?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(t,e,r[t])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),t in this.__dataOld||(this.__dataOld[t]=this.__data[t]),s?this.__dataTemp[t]=e:this.__data[t]=e,this.__dataPending[t]=e,(s||this[Me.NOTIFY]&&this[Me.NOTIFY][t])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[t]=i),!0)}_setProperty(t,e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(t){this.__dataPendingClients=this.__dataPendingClients||[],t!==this&&this.__dataPendingClients.push(t)}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let t=this.__dataPendingClients;if(t){this.__dataPendingClients=null;for(let e=0;e<t.length;e++){let i=t[e];i.__dataEnabled?i.__dataPending&&i._flushProperties():i._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(t,e){for(let i in t)!e&&this[Me.READ_ONLY]&&this[Me.READ_ONLY][i]||this._setPendingPropertyOrPath(i,t[i],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(t,e,i){let s,r=this.__dataHasPaths;this.__dataHasPaths=!1,Je(this,e,i,r),s=this.__dataToNotify,this.__dataToNotify=null,this._propagatePropertyChanges(e,i,r),this._flushClients(),Ue(this,this[Me.REFLECT],e,i,r),Ue(this,this[Me.OBSERVE],e,i,r),s&&function(t,e,i,s,r){let o,n,a=t[Me.NOTIFY],l=$e++;for(let n in e)e[n]&&(a&&Ge(t,a,l,n,i,s,r)||r&&Ye(t,n,i))&&(o=!0);o&&(n=t.__dataHost)&&n._invalidateProperties&&n._invalidateProperties()}(this,s,e,i,r),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(t,e,i){this[Me.PROPAGATE]&&Ue(this,this[Me.PROPAGATE],t,e,i),this.__templateInfo&&this._runEffectsForTemplate(this.__templateInfo,t,e,i)}_runEffectsForTemplate(t,e,i,s){const r=(e,s)=>{Ue(this,t.propertyEffects,e,i,s,t.nodeList);for(let r=t.firstChild;r;r=r.nextSibling)this._runEffectsForTemplate(r,e,i,s)};t.runEffects?t.runEffects(r,e,s):r(e,s)}linkPaths(t,e){t=ce(t),e=ce(e),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[t]=e}unlinkPaths(t){t=ce(t),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[t]}notifySplices(t,e){let i={path:""};fi(this,_e(this,t,i),i.path,e)}get(t,e){return _e(e||this,t)}set(t,e,i){i?pe(i,t,e):this[Me.READ_ONLY]&&this[Me.READ_ONLY][t]||this._setPendingPropertyOrPath(t,e,!0)&&this._invalidateProperties()}push(t,...e){let i={path:""},s=_e(this,t,i),r=s.length,o=s.push(...e);return e.length&&gi(this,s,i.path,r,e.length,[]),o}pop(t){let e={path:""},i=_e(this,t,e),s=Boolean(i.length),r=i.pop();return s&&gi(this,i,e.path,i.length,0,[r]),r}splice(t,e,i,...s){let r,o={path:""},n=_e(this,t,o);return e<0?e=n.length-Math.floor(-e):e&&(e=Math.floor(e)),r=2===arguments.length?n.splice(e):n.splice(e,i,...s),(s.length||r.length)&&gi(this,n,o.path,e,s.length,r),r}shift(t){let e={path:""},i=_e(this,t,e),s=Boolean(i.length),r=i.shift();return s&&gi(this,i,e.path,0,0,[r]),r}unshift(t,...e){let i={path:""},s=_e(this,t,i),r=s.unshift(...e);return e.length&&gi(this,s,i.path,0,e.length,[]),r}notifyPath(t,e){let i;if(1==arguments.length){let s={path:""};e=_e(this,t,s),i=s.path}else i=Array.isArray(t)?ce(t):t;this._setPendingPropertyOrPath(i,e,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(t,e){var i;this._addPropertyEffect(t,Me.READ_ONLY),e&&(this["_set"+(i=t,i[0].toUpperCase()+i.substring(1))]=function(e){this._setProperty(t,e)})}_createPropertyObserver(t,e,i){let s={property:t,method:e,dynamicFn:Boolean(i)};this._addPropertyEffect(t,Me.OBSERVE,{fn:je,info:s,trigger:{name:t}}),i&&this._addPropertyEffect(e,Me.OBSERVE,{fn:je,info:s,trigger:{name:e}})}_createMethodObserver(t,e){let i=_i(t);if(!i)throw new Error("Malformed observer expression '"+t+"'");ni(this,i,Me.OBSERVE,ai,null,e)}_createNotifyingProperty(t){this._addPropertyEffect(t,Me.NOTIFY,{fn:Ke,info:{eventName:ve(t)+"-changed",property:t}})}_createReflectedProperty(t){let e=this.constructor.attributeNameForProperty(t);"-"===e[0]?console.warn("Property "+t+" cannot be reflected to attribute "+e+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(t,Me.REFLECT,{fn:Ze,info:{attrName:e}})}_createComputedProperty(t,e,i){let s=_i(e);if(!s)throw new Error("Malformed computed expression '"+e+"'");const r=ni(this,s,Me.COMPUTE,ti,t,i);Ve(this,He)[t]=r}_marshalArgs(t,e,i){const s=this.__data,r=[];for(let o=0,a=t.length;o<a;o++){let{name:a,structured:l,wildcard:d,value:h,literal:c}=t[o];if(!c)if(d){const t=de(a,e),r=mi(s,i,t?e:a);h={path:t?e:a,value:r,base:t?_e(s,a):r}}else h=l?mi(s,i,a):s[a];if(n&&!this._overrideLegacyUndefined&&void 0===h&&t.length>1)return De;r[o]=h}return r}static addPropertyEffect(t,e,i){this.prototype._addPropertyEffect(t,e,i)}static createPropertyObserver(t,e,i){this.prototype._createPropertyObserver(t,e,i)}static createMethodObserver(t,e){this.prototype._createMethodObserver(t,e)}static createNotifyingProperty(t){this.prototype._createNotifyingProperty(t)}static createReadOnlyProperty(t,e){this.prototype._createReadOnlyProperty(t,e)}static createReflectedProperty(t){this.prototype._createReflectedProperty(t)}static createComputedProperty(t,e,i){this.prototype._createComputedProperty(t,e,i)}static bindTemplate(t){return this.prototype._bindTemplate(t)}_bindTemplate(t,e){let i=this.constructor._parseTemplate(t),s=this.__preBoundTemplateInfo==i;if(!s)for(let t in i.propertyEffects)this._createPropertyAccessor(t);if(e)if(i=Object.create(i),i.wasPreBound=s,this.__templateInfo){const e=t._parentTemplateInfo||this.__templateInfo,s=e.lastChild;i.parent=e,e.lastChild=i,i.previousSibling=s,s?s.nextSibling=i:e.firstChild=i}else this.__templateInfo=i;else this.__preBoundTemplateInfo=i;return i}static _addTemplatePropertyEffect(t,e,i){(t.hostProps=t.hostProps||{})[e]=!0;let s=t.propertyEffects=t.propertyEffects||{};(s[e]=s[e]||[]).push(i)}_stampTemplate(t,e){e=e||this._bindTemplate(t,!0),vi.push(this);let i=super._stampTemplate(t,e);if(vi.pop(),e.nodeList=i.nodeList,!e.wasPreBound){let t=e.childNodes=[];for(let e=i.firstChild;e;e=e.nextSibling)t.push(e)}return i.templateInfo=e,function(t,e){let{nodeList:i,nodeInfoList:s}=e;if(s.length)for(let e=0;e<s.length;e++){let r=s[e],o=i[e],n=r.bindings;if(n)for(let e=0;e<n.length;e++){let i=n[e];ri(o,i),oi(o,t,i)}o.__dataHost=t}}(this,e),this.__dataClientsReady&&(this._runEffectsForTemplate(e,this.__data,null,!1),this._flushClients()),i}_removeBoundDom(t){const e=t.templateInfo,{previousSibling:i,nextSibling:s,parent:o}=e;i?i.nextSibling=s:o&&(o.firstChild=s),s?s.previousSibling=i:o&&(o.lastChild=i),e.nextSibling=e.previousSibling=null;let n=e.childNodes;for(let t=0;t<n.length;t++){let e=n[t];r(r(e).parentNode).removeChild(e)}}static _parseTemplateNode(t,i,s){let r=e._parseTemplateNode.call(this,t,i,s);if(t.nodeType===Node.TEXT_NODE){let e=this._parseBindings(t.textContent,i);e&&(t.textContent=ui(e)||" ",ei(this,i,s,"text","textContent",e),r=!0)}return r}static _parseTemplateNodeAttribute(t,i,s,r,o){let n=this._parseBindings(o,i);if(n){let e=r,o="property";Be.test(r)?o="attribute":"$"==r[r.length-1]&&(r=r.slice(0,-1),o="attribute");let a=ui(n);return a&&"attribute"==o&&("class"==r&&t.hasAttribute("class")&&(a+=" "+t.getAttribute(r)),t.setAttribute(r,a)),"attribute"==o&&"disable-upgrade$"==e&&t.setAttribute(r,""),"input"===t.localName&&"value"===e&&t.setAttribute(e,""),t.removeAttribute(e),"property"===o&&(r=be(r)),ei(this,i,s,o,r,n,a),!0}return e._parseTemplateNodeAttribute.call(this,t,i,s,r,o)}static _parseTemplateNestedTemplate(t,i,s){let r=e._parseTemplateNestedTemplate.call(this,t,i,s);const o=t.parentNode,n=s.templateInfo,d="dom-if"===o.localName,h="dom-repeat"===o.localName;a&&(d||h)&&(o.removeChild(t),(s=s.parentInfo).templateInfo=n,s.noted=!0,r=!1);let c=n.hostProps;if(l&&d)c&&(i.hostProps=Object.assign(i.hostProps||{},c),a||(s.parentInfo.noted=!0));else{let t="{";for(let e in c){ei(this,i,s,"property","_host_"+e,[{mode:t,source:e,dependencies:[e],hostProp:!0}])}}return r}static _parseBindings(t,e){let i,s=[],r=0;for(;null!==(i=ci.exec(t));){i.index>r&&s.push({literal:t.slice(r,i.index)});let o=i[1][0],n=Boolean(i[2]),a=i[3].trim(),l=!1,d="",h=-1;"{"==o&&(h=a.indexOf("::"))>0&&(d=a.substring(h+2),a=a.substring(0,h),l=!0);let c=_i(a),u=[];if(c){let{args:t,methodName:i}=c;for(let e=0;e<t.length;e++){let i=t[e];i.literal||u.push(i)}let s=e.dynamicFns;(s&&s[i]||c.static)&&(u.push(i),c.dynamicFn=!0)}else u.push(a);s.push({source:a,mode:o,negate:n,customEvent:l,signature:c,dependencies:u,event:d}),r=ci.lastIndex}if(r&&r<t.length){let e=t.substring(r);e&&s.push({literal:e})}return s.length?s:null}static _evaluateBinding(t,e,i,s,r,o){let n;return n=e.signature?ai(t,i,s,0,e.signature):i!=e.source?_e(t,e.source):o&&ae(i)?_e(t,i):t.__data[i],e.negate&&(n=!n),n}}})),vi=[];const yi=y((t=>{const e=Ae(t);function i(t){const e=Object.getPrototypeOf(t);return e.prototype instanceof r?e:null}function s(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",t))){let e=null;if(t.hasOwnProperty(JSCompiler_renameProperty("properties",t))){const i=t.properties;i&&(e=
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function(t){const e={};for(let i in t){const s=t[i];e[i]="function"==typeof s?{type:s}:s}return e}(i))}t.__ownProperties=e}return t.__ownProperties}class r extends e{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){this.prototype;const t=this._properties;this.__observedAttributes=t?Object.keys(t).map((t=>this.prototype._addPropertyToAttributeMap(t))):[]}return this.__observedAttributes}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const t=i(this);t&&t.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const t=s(this);t&&this.createProperties(t)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const t=i(this);this.__properties=Object.assign({},t&&t._properties,s(this))}return this.__properties}static typeForProperty(t){const e=this._properties[t];return e&&e.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return r})),Ai=window.ShadyCSS&&window.ShadyCSS.cssBuild,Ci=y((o=>{const n=yi(bi(o));function a(t,e,i,s){i.computed&&(i.readOnly=!0),i.computed&&(t._hasReadOnlyEffect(e)?console.warn(`Cannot redefine computed property '${e}'.`):t._createComputedProperty(e,i.computed,s)),i.readOnly&&!t._hasReadOnlyEffect(e)?t._createReadOnlyProperty(e,!i.computed):!1===i.readOnly&&t._hasReadOnlyEffect(e)&&console.warn(`Cannot make readOnly property '${e}' non-readOnly.`),i.reflectToAttribute&&!t._hasReflectEffect(e)?t._createReflectedProperty(e):!1===i.reflectToAttribute&&t._hasReflectEffect(e)&&console.warn(`Cannot make reflected property '${e}' non-reflected.`),i.notify&&!t._hasNotifyEffect(e)?t._createNotifyingProperty(e):!1===i.notify&&t._hasNotifyEffect(e)&&console.warn(`Cannot make notify property '${e}' non-notify.`),i.observer&&t._createPropertyObserver(e,i.observer,s[i.observer]),t._addPropertyToAttributeMap(e)}function l(t,e,i,s){if(!Ai){const r=e.content.querySelectorAll("style"),o=oe(e),n=function(t){let e=ee(t);return e?ne(e):[]}(i),a=e.content.firstElementChild;for(let i=0;i<n.length;i++){let r=n[i];r.textContent=t._processStyleText(r.textContent,s),e.content.insertBefore(r,a)}let l=0;for(let e=0;e<o.length;e++){let i=o[e],n=r[l];n!==i?(i=i.cloneNode(!0),n.parentNode.insertBefore(i,n)):l++,i.textContent=t._processStyleText(i.textContent,s)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(e,i),m&&Ai&&f){const i=e.content.querySelectorAll("style");if(i){let e="";Array.from(i).forEach((t=>{e+=t.textContent,t.parentNode.removeChild(t)})),t._styleSheet=new CSSStyleSheet,t._styleSheet.replaceSync(e)}}}return class extends n{static get polymerElementVersion(){return"3.5.1"}static _finalizeClass(){n._finalizeClass.call(this);const t=((e=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",e))||(e.__ownObservers=e.hasOwnProperty(JSCompiler_renameProperty("observers",e))?e.observers:null),e.__ownObservers);var e;t&&this.createObservers(t,this._properties),this._prepareTemplate()}static _prepareTemplate(){let t=this.template;t&&("string"==typeof t?(console.error("template getter must return HTMLTemplateElement"),t=null):c||(t=t.cloneNode(!0))),this.prototype._template=t}static createProperties(t){for(let e in t)a(this.prototype,e,t[e],t)}static createObservers(t,e){const i=this.prototype;for(let s=0;s<t.length;s++)i._createMethodObserver(t[s],e)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let t=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof t&&(t=t()),this._template=void 0!==t?t:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(t){let e=null;if(t&&(!i||g)&&(e=Jt.import(t,"template"),i&&!e))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${t}`);return e}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(t){this._template=t}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const t=this.importMeta;if(t)this._importPath=e(t.url);else{const t=Jt.import(this.is);this._importPath=t&&t.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=u,this.importPath=this.constructor.importPath;let t=function(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",t))){t.__propertyDefaults=null;let e=t._properties;for(let i in e){let s=e[i];"value"in s&&(t.__propertyDefaults=t.__propertyDefaults||{},t.__propertyDefaults[i]=s)}}return t.__propertyDefaults}(this.constructor);if(t)for(let e in t){let i=t[e];if(this._canApplyPropertyDefault(e)){let t="function"==typeof i.value?i.value.call(this):i.value;this._hasAccessor(e)?this._setPendingProperty(e,t,!0):this[e]=t}}}_canApplyPropertyDefault(t){return!this.hasOwnProperty(t)}static _processStyleText(t,e){return s(t,e)}static _finalizeTemplate(e){const i=this.prototype._template;if(i&&!i.__polymerFinalized){i.__polymerFinalized=!0;const s=this.importPath;l(this,i,e,s?t(s):""),this.prototype._bindTemplate(i)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(t){const e=r(this);if(e.attachShadow)return t?(e.shadowRoot||(e.attachShadow({mode:"open",shadyUpgradeFragment:t}),e.shadowRoot.appendChild(t),this.constructor._styleSheet&&(e.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),_&&window.ShadyDOM&&window.ShadyDOM.flushInitial(e.shadowRoot),e.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(t){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,t)}resolveUrl(e,i){return!i&&this.importPath&&(i=t(this.importPath)),t(e,i)}static _parseTemplateContent(t,e,i){return e.dynamicFns=e.dynamicFns||this._properties,n._parseTemplateContent.call(this,t,e,i)}static _addTemplatePropertyEffect(t,e,i){return!p||e in this._properties||i.info.part.signature&&i.info.part.signature.static||i.info.part.hostProp||t.nestedTemplate||console.warn(`Property '${e}' used in template but not declared in 'properties'; attribute will not be observed.`),n._addTemplatePropertyEffect.call(this,t,e,i)}}})),wi=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:t=>t});
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */class xi{constructor(t,e){Pi(t,e);const i=e.reduce(((e,i,s)=>e+Ei(i)+t[s+1]),t[0]);this.value=i.toString()}toString(){return this.value}}function Ei(t){if(t instanceof xi)return t.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)}const Si=function(t,...e){Pi(t,e);const i=document.createElement("template");let s=e.reduce(((e,i,s)=>e+function(t){if(t instanceof HTMLTemplateElement)return t.innerHTML;if(t instanceof xi)return Ei(t);throw new Error(`non-template value passed to Polymer's html function: ${t}`)}(i)+t[s+1]),t[0]);return wi&&(s=wi.createHTML(s)),i.innerHTML=s,i},Pi=(t,e)=>{if(!Array.isArray(t)||!Array.isArray(t.raw)||e.length!==t.length-1)throw new TypeError("Invalid call to the html template tag")},Ti=Ci(HTMLElement),Ii=y((t=>class extends t{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(t){this._setAriaDisabled(t)}_setAriaDisabled(t){t?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}}));
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let zi=0,Oi=0;const Ri=[];let Ni=0,ki=!1;const Fi=document.createTextNode("");new window.MutationObserver((function(){ki=!1;const t=Ri.length;for(let e=0;e<t;e++){const t=Ri[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}Ri.splice(0,t),Oi+=t})).observe(Fi,{characterData:!0});const Li={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},$i={run:t=>window.requestAnimationFrame(t),cancel(t){window.cancelAnimationFrame(t)}},Di={run:t=>window.requestIdleCallback?window.requestIdleCallback(t):window.setTimeout(t,16),cancel(t){window.cancelIdleCallback?window.cancelIdleCallback(t):window.clearTimeout(t)}},Mi={run(t){ki||(ki=!0,Fi.textContent=Ni,Ni+=1),Ri.push(t);const e=zi;return zi+=1,e},cancel(t){const e=t-Oi;if(e>=0){if(!Ri[e])throw new Error(`invalid async handle: ${t}`);Ri[e]=null}}},Hi=!1,Bi=t=>t,Vi="string"==typeof document.head.style.touchAction,Ui="__polymerGestures",Gi="__polymerGesturesHandled",Wi="__polymerGesturesTouchAction",ji=["mousedown","mousemove","mouseup","click"],Yi=[0,1,4,2],qi=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Ki(t){return ji.indexOf(t)>-1}let Zi=!1;function Ji(t){if(!Ki(t)&&"touchend"!==t)return Vi&&Zi&&Hi?{passive:!0}:void 0}!function(){try{const t=Object.defineProperty({},"passive",{get(){Zi=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();const Xi=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),Qi={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function ts(t){const e=t.type;if(!Ki(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!qi&&(e=Yi[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}const es={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function is(t,e,i){t.movefn=e,t.upfn=i,document.addEventListener("mousemove",e),document.addEventListener("mouseup",i)}function ss(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}const rs=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],os={},ns=[];function as(t){const e=rs(t);return e.length>0?e[0]:t.target}function ls(t){const e=t.type,i=t.currentTarget[Ui];if(!i)return;const s=i[e];if(!s)return;if(!t[Gi]&&(t[Gi]={},e.startsWith("touch"))){const i=t.changedTouches[0];if("touchstart"===e&&1===t.touches.length&&(es.touch.id=i.identifier),es.touch.id!==i.identifier)return;Vi||"touchstart"!==e&&"touchmove"!==e||function(t){const e=t.changedTouches[0],i=t.type;if("touchstart"===i)es.touch.x=e.clientX,es.touch.y=e.clientY,es.touch.scrollDecided=!1;else if("touchmove"===i){if(es.touch.scrollDecided)return;es.touch.scrollDecided=!0;const i=function(t){let e="auto";const i=rs(t);for(let t,s=0;s<i.length;s++)if(t=i[s],t[Wi]){e=t[Wi];break}return e}(t);let s=!1;const r=Math.abs(es.touch.x-e.clientX),o=Math.abs(es.touch.y-e.clientY);t.cancelable&&("none"===i?s=!0:"pan-x"===i?s=o>r:"pan-y"===i&&(s=r>o)),s?t.preventDefault():us("track")}}(t)}const r=t[Gi];if(!r.skip){for(let e,i=0;i<ns.length;i++)e=ns[i],s[e.name]&&!r[e.name]&&e.flow&&e.flow.start.indexOf(t.type)>-1&&e.reset&&e.reset();for(let i,o=0;o<ns.length;o++)i=ns[o],s[i.name]&&!r[i.name]&&(r[i.name]=!0,i[e](t))}}function ds(t,e,i){return!!os[e]&&(function(t,e,i){const s=os[e],r=s.deps,o=s.name;let n=t[Ui];n||(t[Ui]=n={});for(let e,i,s=0;s<r.length;s++)e=r[s],Xi&&Ki(e)&&"click"!==e||(i=n[e],i||(n[e]=i={_count:0}),0===i._count&&t.addEventListener(e,ls,Ji(e)),i[o]=(i[o]||0)+1,i._count=(i._count||0)+1);t.addEventListener(e,i),s.touchAction&&function(t,e){Vi&&t instanceof HTMLElement&&Mi.run((()=>{t.style.touchAction=e}));t[Wi]=e}(t,s.touchAction)}(t,e,i),!0)}function hs(t){ns.push(t);for(let e=0;e<t.emits.length;e++)os[t.emits[e]]=t}function cs(t,e,i){const s=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(s.detail=i,Bi(t).dispatchEvent(s),s.defaultPrevented){const t=i.preventer||i.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function us(t){const e=function(t){for(let e,i=0;i<ns.length;i++){e=ns[i];for(let i,s=0;s<e.emits.length;s++)if(i=e.emits[s],i===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function _s(t,e,i,s){e&&cs(e,t,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:s,prevent:t=>us(t)})}function ps(t,e,i){if(t.prevent)return!1;if(t.started)return!0;const s=Math.abs(t.x-e),r=Math.abs(t.y-i);return s>=5||r>=5}function ms(t,e,i){if(!e)return;const s=t.moves[t.moves.length-2],r=t.moves[t.moves.length-1],o=r.x-t.x,n=r.y-t.y;let a,l=0;s&&(a=r.x-s.x,l=r.y-s.y),cs(e,"track",{state:t.state,x:i.clientX,y:i.clientY,dx:o,dy:n,ddx:a,ddy:l,sourceEvent:i,hover:()=>function(t,e){let i=document.elementFromPoint(t,e),s=i;for(;s&&s.shadowRoot&&!window.ShadyDOM;){const r=s;if(s=s.shadowRoot.elementFromPoint(t,e),r===s)break;s&&(i=s)}return i}(i.clientX,i.clientY)})}function fs(t,e,i){const s=Math.abs(e.clientX-t.x),r=Math.abs(e.clientY-t.y),o=as(i||e);!o||Qi[o.localName]&&o.hasAttribute("disabled")||(isNaN(s)||isNaN(r)||s<=25&&r<=25||function(t){if("click"===t.type){if(0===t.detail)return!0;const e=as(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;const i=e.getBoundingClientRect(),s=t.pageX,r=t.pageY;return!(s>=i.left&&s<=i.right&&r>=i.top&&r<=i.bottom)}return!1}(e))&&(t.prevent||cs(o,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:i}))}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */hs({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){ss(this.info)},mousedown(t){if(!ts(t))return;const e=as(t),i=this;is(this.info,(t=>{ts(t)||(_s("up",e,t),ss(i.info))}),(t=>{ts(t)&&_s("up",e,t),ss(i.info)})),_s("down",e,t)},touchstart(t){_s("down",as(t),t.changedTouches[0],t)},touchend(t){_s("up",as(t),t.changedTouches[0],t)}}),hs({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,ss(this.info)},mousedown(t){if(!ts(t))return;const e=as(t),i=this,s=t=>{const s=t.clientX,r=t.clientY;ps(i.info,s,r)&&(i.info.state=i.info.started?"mouseup"===t.type?"end":"track":"start","start"===i.info.state&&us("tap"),i.info.addMove({x:s,y:r}),ts(t)||(i.info.state="end",ss(i.info)),e&&ms(i.info,e,t),i.info.started=!0)};is(this.info,s,(t=>{i.info.started&&s(t),ss(i.info)})),this.info.x=t.clientX,this.info.y=t.clientY},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove(t){const e=as(t),i=t.changedTouches[0],s=i.clientX,r=i.clientY;ps(this.info,s,r)&&("start"===this.info.state&&us("tap"),this.info.addMove({x:s,y:r}),ms(this.info,e,i),this.info.state="track",this.info.started=!0)},touchend(t){const e=as(t),i=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),ms(this.info,e,i))}}),hs({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(t){ts(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click(t){ts(t)&&fs(this.info,t)},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend(t){fs(this.info,t.changedTouches[0],t)}});const gs=y((t=>class extends t{ready(){super.ready(),this.addEventListener("keydown",(t=>{this._onKeyDown(t)})),this.addEventListener("keyup",(t=>{this._onKeyUp(t)}))}_onKeyDown(t){switch(t.key){case"Enter":this._onEnter(t);break;case"Escape":this._onEscape(t)}}_onKeyUp(t){}_onEnter(t){}_onEscape(t){}})),bs=t=>class extends(Ii(gs(t))){get _activeKeys(){return[" "]}ready(){super.ready(),ds(this,"down",(t=>{this._shouldSetActive(t)&&this._setActive(!0)})),ds(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(t){return!this.disabled}_onKeyDown(t){super._onKeyDown(t),this._shouldSetActive(t)&&this._activeKeys.includes(t.key)&&(this._setActive(!0),document.addEventListener("keyup",(t=>{this._activeKeys.includes(t.key)&&this._setActive(!1)}),{once:!0}))}_setActive(t){this.toggleAttribute("active",t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,vs=y((t=>class extends t{constructor(){super(),this.__controllers=new Set}connectedCallback(){super.connectedCallback(),this.__controllers.forEach((t=>{t.hostConnected&&t.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.__controllers.forEach((t=>{t.hostDisconnected&&t.hostDisconnected()}))}addController(t){this.__controllers.add(t),void 0!==this.$&&this.isConnected&&t.hostConnected&&t.hostConnected()}removeController(t){this.__controllers.delete(t)}})),ys=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,As=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */function Cs(t,e){if("function"!=typeof t)return;const i=ys.exec(t.toString());if(i)try{t=new Function(i[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(e)}window.Vaadin=window.Vaadin||{};const ws=function(t,e){if(window.Vaadin.developmentMode)return Cs(t,e)};function xs(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(As?!(As&&Object.keys(As).map((t=>As[t])).filter((t=>t.productionMode)).length>0):!Cs((function(){return!0})))}catch(t){return!1}}());
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
class Es{static debounce(t,e,i){return t instanceof Es?t._cancelAsync():t=new Es,t.setConfig(e,i),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run((()=>{this._timer=null,Ss.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),Ss.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}let Ss=new Set;function Ps(t){Ss.add(t)}function Ts(){const t=Boolean(Ss.size);return Ss.forEach((t=>{try{t.flush()}catch(t){setTimeout((()=>{throw t}))}})),t}const Is=()=>{let t;do{t=Ts()}while(t)};
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class zs{static detectScrollType(){const t=document.createElement("div");t.textContent="ABCD",t.dir="rtl",t.style.fontSize="14px",t.style.width="4px",t.style.height="1px",t.style.position="absolute",t.style.top="-1000px",t.style.overflow="scroll",document.body.appendChild(t);let e="reverse";return t.scrollLeft>0?e="default":(t.scrollLeft=2,t.scrollLeft<2&&(e="negative")),document.body.removeChild(t),e}static getNormalizedScrollLeft(t,e,i){const{scrollLeft:s}=i;if("rtl"!==e||!t)return s;switch(t){case"negative":return i.scrollWidth-i.clientWidth+s;case"reverse":return i.scrollWidth-i.clientWidth-s;default:return s}}static setNormalizedScrollLeft(t,e,i,s){if("rtl"===e&&t)switch(t){case"negative":i.scrollLeft=i.clientWidth-i.scrollWidth+s;break;case"reverse":i.scrollLeft=i.scrollWidth-i.clientWidth-s;break;default:i.scrollLeft=s}else i.scrollLeft=s}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const Os=[];let Rs;function Ns(t,e,i=t.getAttribute("dir")){e?t.setAttribute("dir",e):null!=i&&t.removeAttribute("dir")}function ks(){return document.documentElement.getAttribute("dir")}new MutationObserver((function(){const t=ks();Os.forEach((e=>{Ns(e,t)}))})).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const Fs=t=>class extends t{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:t=>t||"",toAttribute:t=>""===t?null:t}}}}static finalize(){super.finalize(),Rs||(Rs=zs.detectScrollType())}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),Ns(this,ks(),null))}attributeChangedCallback(t,e,i){if(super.attributeChangedCallback(t,e,i),"dir"!==t)return;const s=ks(),r=i===s&&-1===Os.indexOf(this),o=!i&&e&&-1===Os.indexOf(this),n=i!==s&&e===s;r||o?(this.__subscribe(),Ns(this,s,i)):n&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=Os.includes(this),this.__unsubscribe()}_valueToNodeAttribute(t,e,i){("dir"!==i||""!==e||t.hasAttribute("dir"))&&super._valueToNodeAttribute(t,e,i)}_attributeToProperty(t,e,i){"dir"!==t||e?super._attributeToProperty(t,e,i):this.dir=""}__subscribe(){Os.includes(this)||Os.push(this)}__unsubscribe(){Os.includes(this)&&Os.splice(Os.indexOf(this),1)}__getNormalizedScrollLeft(t){return zs.getNormalizedScrollLeft(Rs,this.getAttribute("dir")||"ltr",t)}__setNormalizedScrollLeft(t,e){return zs.setNormalizedScrollLeft(Rs,this.getAttribute("dir")||"ltr",t,e)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let Ls;window.Vaadin=window.Vaadin||{},window.Vaadin.registrations=window.Vaadin.registrations||[],window.Vaadin.developmentModeCallback=window.Vaadin.developmentModeCallback||{},window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){ws(xs)};const $s=new Set,Ds=t=>class extends(Fs(t)){static get version(){return"23.5.2"}static finalize(){super.finalize();const{is:t}=this;t&&!$s.has(t)&&(window.Vaadin.registrations.push(this),$s.add(t),window.Vaadin.developmentModeCallback&&(Ls=Es.debounce(Ls,Di,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),Ps(Ls)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let Ms=0;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class Hs extends EventTarget{static generateId(t,e){return`${t||"default"}-${e.localName}-${Ms++}`}constructor(t,e,i,s,r){super(),this.host=t,this.slotName=e,this.slotFactory=i,this.slotInitializer=s,r&&(this.defaultId=Hs.generateId(e,t))}hostConnected(){if(!this.initialized){let t=this.getSlotChild();t?(this.node=t,this.initCustomNode(t)):t=this.attachDefaultNode(),this.initNode(t),this.observe(),this.initialized=!0}}attachDefaultNode(){const{host:t,slotName:e,slotFactory:i}=this;let s=this.defaultNode;return!s&&i&&(s=i(t),s instanceof Element&&(""!==e&&s.setAttribute("slot",e),this.node=s,this.defaultNode=s)),s&&t.appendChild(s),s}getSlotChild(){const{slotName:t}=this;return Array.from(this.host.childNodes).find((e=>e.nodeType===Node.ELEMENT_NODE&&e.slot===t||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()&&""===t))}initNode(t){const{slotInitializer:e}=this;e&&e(this.host,t)}initCustomNode(t){}teardownNode(t){}observe(){const{slotName:t}=this,e=""===t?"slot:not([name])":`slot[name=${t}]`,i=this.host.shadowRoot.querySelector(e);this.__slotObserver=new b(i,(t=>{const e=this.node,i=t.addedNodes.find((t=>t!==e));t.removedNodes.length&&t.removedNodes.forEach((t=>{this.teardownNode(t)})),i&&(e&&e.isConnected&&this.host.removeChild(e),this.node=i,i!==this.defaultNode&&(this.initCustomNode(i),this.initNode(i)))}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class Bs extends Hs{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,void 0!==this.context&&(t.context=this.context),void 0!==this.manual&&(t.manual=this.manual),void 0!==this.opened&&(t.opened=this.opened),void 0!==this.position&&(t._position=this.position),void 0!==this.shouldShow&&(t.shouldShow=this.shouldShow)}setContext(t){this.context=t;const e=this.node;e&&(e.context=t)}setManual(t){this.manual=t;const e=this.node;e&&(e.manual=t)}setOpened(t){this.opened=t;const e=this.node;e&&(e.opened=t)}setPosition(t){this.position=t;const e=this.node;e&&(e._position=t)}setShouldShow(t){this.shouldShow=t;const e=this.node;e&&(e.shouldShow=t)}setTarget(t){this.target=t;const e=this.node;e&&(e.target=t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */let Vs=!1;function Us(){return Vs}function Gs(t){return null===t.offsetParent&&0===t.clientWidth&&0===t.clientHeight||function(t){const e=t.style;if("hidden"===e.visibility||"none"===e.display)return!0;const i=window.getComputedStyle(t);return"hidden"===i.visibility||"none"===i.display}(t)}window.addEventListener("keydown",(()=>{Vs=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{Vs=!1}),{capture:!0});
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Ws=y((t=>class extends t{static get properties(){return{stateTarget:{type:Object,observer:"_stateTargetChanged"}}}static get delegateAttrs(){return[]}static get delegateProps(){return[]}ready(){super.ready(),this._createDelegateAttrsObserver(),this._createDelegatePropsObserver()}_stateTargetChanged(t){t&&(this._ensureAttrsDelegated(),this._ensurePropsDelegated())}_createDelegateAttrsObserver(){this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`)}_createDelegatePropsObserver(){this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`)}_ensureAttrsDelegated(){this.constructor.delegateAttrs.forEach((t=>{this._delegateAttribute(t,this[t])}))}_ensurePropsDelegated(){this.constructor.delegateProps.forEach((t=>{this._delegateProperty(t,this[t])}))}_delegateAttrsChanged(...t){this.constructor.delegateAttrs.forEach(((e,i)=>{this._delegateAttribute(e,t[i])}))}_delegatePropsChanged(...t){this.constructor.delegateProps.forEach(((e,i)=>{this._delegateProperty(e,t[i])}))}_delegateAttribute(t,e){this.stateTarget&&("invalid"===t&&this._delegateAttribute("aria-invalid",!!e&&"true"),"boolean"==typeof e?this.stateTarget.toggleAttribute(t,e):e?this.stateTarget.setAttribute(t,e):this.stateTarget.removeAttribute(t))}_delegateProperty(t,e){this.stateTarget&&(this.stateTarget[t]=e)}})),js=y((t=>class extends t{static get properties(){return{inputElement:{type:Object,readOnly:!0,observer:"_inputElementChanged"},type:{type:String,readOnly:!0},value:{type:String,value:"",observer:"_valueChanged",notify:!0},_hasInputValue:{type:Boolean,value:!1,observer:"_hasInputValueChanged"}}}constructor(){super(),this._boundOnInput=this.__onInput.bind(this),this._boundOnChange=this._onChange.bind(this)}clear(){this.value=""}_addInputListeners(t){t.addEventListener("input",this._boundOnInput),t.addEventListener("change",this._boundOnChange)}_removeInputListeners(t){t.removeEventListener("input",this._boundOnInput),t.removeEventListener("change",this._boundOnChange)}_forwardInputValue(t){this.inputElement&&(this.inputElement.value=null!=t?t:"")}_inputElementChanged(t,e){t?this._addInputListeners(t):e&&this._removeInputListeners(e)}_hasInputValueChanged(t,e){(t||e)&&this.dispatchEvent(new CustomEvent("has-input-value-changed"))}__onInput(t){this._setHasInputValue(t),this._onInput(t)}_onInput(t){const e=t.composedPath()[0];this.__userInput=t.isTrusted,this.value=e.value,this.__userInput=!1}_onChange(t){}_toggleHasValue(t){this.toggleAttribute("has-value",t)}_valueChanged(t,e){this._toggleHasValue(this._hasValue),""===t&&void 0===e||this.__userInput||this._forwardInputValue(t)}get _hasValue(){return null!=this.value&&""!==this.value}_setHasInputValue(t){const e=t.composedPath()[0];this._hasInputValue=e.value.length>0}})),Ys=y((t=>class extends(Ws(Ii(js(t)))){static get properties(){return{checked:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0}}}static get delegateProps(){return[...super.delegateProps,"checked"]}_onChange(t){const e=t.target;var i;this._toggleChecked(e.checked),(i=e).getRootNode().activeElement!==i&&e.focus()}_toggleChecked(t){this.checked=t}})),qs=y((t=>class extends t{get _keyboardActive(){return Us()}ready(){this.addEventListener("focusin",(t=>{this._shouldSetFocus(t)&&this._setFocused(!0)})),this.addEventListener("focusout",(t=>{this._shouldRemoveFocus(t)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(t){this.toggleAttribute("focused",t),this.toggleAttribute("focus-ring",t&&this._keyboardActive)}_shouldSetFocus(t){return!0}_shouldRemoveFocus(t){return!0}})),Ks=t=>class extends(Ii(t)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(t,e){super._disabledChanged(t,e),t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):e&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(t){this.disabled&&-1!==t&&(this._lastTabIndex=t,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Zs=y((t=>class extends(qs(Ks(t))){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged"},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame((()=>{this.focus(),this.setAttribute("focus-ring","")}))}focus(){this.focusElement&&!this.disabled&&(this.focusElement.focus(),this._setFocused(!0))}blur(){this.focusElement&&(this.focusElement.blur(),this._setFocused(!1))}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(t,e){t?(t.disabled=this.disabled,this._addFocusListeners(t),this.__forwardTabIndex(this.tabindex)):e&&this._removeFocusListeners(e)}_addFocusListeners(t){t.addEventListener("blur",this._boundOnBlur),t.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(t){t.removeEventListener("blur",this._boundOnBlur),t.removeEventListener("focus",this._boundOnFocus)}_onFocus(t){t.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(t){t.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(t){return t.target===this.focusElement}_disabledChanged(t,e){super._disabledChanged(t,e),this.focusElement&&(this.focusElement.disabled=t),t&&this.blur()}_tabindexChanged(t){this.__forwardTabIndex(t)}__forwardTabIndex(t){void 0!==t&&this.focusElement&&(this.focusElement.tabIndex=t,-1!==t&&(this.tabindex=void 0)),this.disabled&&t&&(-1!==t&&(this._lastTabIndex=t),this.tabindex=void 0)}}));
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class Js extends Hs{constructor(t,e){super(t,"input",(()=>document.createElement("input")),((t,i)=>{t.value&&(i.value=t.value),t.type&&i.setAttribute("type",t.type),i.id=this.defaultId,"function"==typeof e&&e(i)}),!0)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class Xs extends Hs{constructor(t){super(t,"label",(()=>document.createElement("label")),((t,e)=>{this.__updateLabelId(e),this.__updateDefaultLabel(this.label),this.__observeLabel(e)}),!0)}get labelId(){return this.node.id}initCustomNode(t){this.__updateLabelId(t);const e=this.__hasLabel(t);this.__toggleHasLabel(e)}teardownNode(t){this.__labelObserver&&this.__labelObserver.disconnect();let e=this.getSlotChild();e||t===this.defaultNode||(e=this.attachDefaultNode(),this.initNode(e));const i=this.__hasLabel(e);this.__toggleHasLabel(i)}setLabel(t){this.label=t,this.__updateDefaultLabel(t)}__hasLabel(t){return!!t&&(t.children.length>0||this.__isNotEmpty(t.textContent))}__isNotEmpty(t){return Boolean(t&&""!==t.trim())}__observeLabel(t){this.__labelObserver=new MutationObserver((t=>{t.forEach((t=>{const e=t.target,i=e===this.node;if("attributes"===t.type)i&&e.id!==this.defaultId&&this.__updateLabelId(e);else if(i||e.parentElement===this.node){const t=this.__hasLabel(this.node);this.__toggleHasLabel(t)}}))})),this.__labelObserver.observe(t,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}__toggleHasLabel(t){this.host.toggleAttribute("has-label",t),this.dispatchEvent(new CustomEvent("label-changed",{detail:{hasLabel:t,node:this.node}}))}__updateDefaultLabel(t){if(this.defaultNode&&(this.defaultNode.textContent=t,this.defaultNode===this.node)){const e=this.__isNotEmpty(t);this.__toggleHasLabel(e)}}__updateLabelId(t){t.id||(t.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const Qs=y((t=>class extends(vs(t)){static get properties(){return{label:{type:String,observer:"_labelChanged"}}}get _labelId(){return this._labelController.labelId}get _labelNode(){return this._labelController.node}constructor(){super(),this._labelController=new Xs(this)}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(t){this._labelController.setLabel(t)}}));
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class tr{constructor(t,e){this.input=t,this.__preventDuplicateLabelClick=this.__preventDuplicateLabelClick.bind(this),e.addEventListener("label-changed",(t=>{this.__initLabel(t.detail.node)})),this.__initLabel(e.node)}__initLabel(t){t&&(t.addEventListener("click",this.__preventDuplicateLabelClick),this.input&&t.setAttribute("for",this.input.id))}__preventDuplicateLabelClick(){const t=e=>{e.stopImmediatePropagation(),this.input.removeEventListener("click",t)};this.input.addEventListener("click",t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class er{constructor(t,e,i){this.sourceSlot=t,this.targetFactory=e,this.copyCallback=i,t&&t.addEventListener("slotchange",(()=>{this.__copying?this.__copying=!1:this.__checkAndCopyNodesToSlotTarget()}))}hostConnected(){this.__sourceSlotObserver=new MutationObserver((()=>this.__checkAndCopyNodesToSlotTarget())),this.__copying||this.__checkAndCopyNodesToSlotTarget()}__checkAndCopyNodesToSlotTarget(){this.__sourceSlotObserver.disconnect();const t=this.targetFactory();if(!t)return;this.__slotTargetClones&&(this.__slotTargetClones.forEach((e=>{e.parentElement===t&&t.removeChild(e)})),delete this.__slotTargetClones);const e=this.sourceSlot.assignedNodes({flatten:!0}).filter((t=>!(t.nodeType===Node.TEXT_NODE&&""===t.textContent.trim())));e.length>0&&(t.innerHTML="",this.__copying=!0,this.__copyNodesToSlotTarget(e,t))}__copyNodesToSlotTarget(t,e){this.__slotTargetClones=this.__slotTargetClones||[],t.forEach((t=>{const i=t.cloneNode(!0);this.__slotTargetClones.push(i),e.appendChild(i),this.__sourceSlotObserver.observe(t,{attributes:!0,childList:!0,subtree:!0,characterData:!0})})),"function"==typeof this.copyCallback&&this.copyCallback(t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class ir extends(Qs(Ys(Zs(bs(Ds(kt(vs(Ti)))))))){static get is(){return"vaadin-checkbox"}static get template(){return Si`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }

        .vaadin-checkbox-container {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
        }

        [part='checkbox'],
        ::slotted(input),
        ::slotted(label) {
          grid-row: 1;
        }

        [part='checkbox'],
        ::slotted(input) {
          grid-column: 1;
        }

        [part='checkbox'] {
          width: var(--vaadin-checkbox-size, 1em);
          height: var(--vaadin-checkbox-size, 1em);
        }

        [part='checkbox']::before {
          display: block;
          content: '\\202F';
          line-height: var(--vaadin-checkbox-size, 1em);
          contain: paint;
        }

        /* visually hidden */
        ::slotted(input) {
          opacity: 0;
          cursor: inherit;
          margin: 0;
          align-self: stretch;
          -webkit-appearance: none;
          width: initial;
          height: initial;
        }
      </style>
      <div class="vaadin-checkbox-container">
        <div part="checkbox"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>

        <div style="display: none !important">
          <slot id="noop"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `}static get properties(){return{indeterminate:{type:Boolean,notify:!0,value:!1,reflectToAttribute:!0},name:{type:String,value:""}}}static get delegateProps(){return[...super.delegateProps,"indeterminate"]}static get delegateAttrs(){return[...super.delegateAttrs,"name"]}constructor(){super(),this._setType("checkbox"),this.value="on"}ready(){super.ready(),this.addController(new Js(this,(t=>{this._setInputElement(t),this._setFocusElement(t),this.stateTarget=t,this.ariaTarget=t}))),this.addController(new tr(this.inputElement,this._labelController)),this.addController(new er(this.$.noop,(()=>this._labelController.node),(()=>this.__warnDeprecated()))),this._tooltipController=new Bs(this),this.addController(this._tooltipController)}__warnDeprecated(){console.warn('WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.\nPlease use <label slot="label"> wrapper or the label property instead.')}_shouldSetActive(t){return"a"!==t.target.localName&&super._shouldSetActive(t)}_toggleChecked(t){this.indeterminate&&(this.indeterminate=!1),super._toggleChecked(t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
function sr(t){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(t):t.querySelector("template")&&console.warn(`WARNING: <template> inside <${t.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */customElements.define(ir.is,ir),Tt("vaadin-grid",P`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      line-height: var(--lumo-line-height-s);
      color: var(--lumo-body-text-color);
      background-color: var(--lumo-base-color);
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      /* For internal use only */
      --_lumo-grid-border-color: var(--lumo-contrast-20pct);
      --_lumo-grid-secondary-border-color: var(--lumo-contrast-10pct);
      --_lumo-grid-border-width: 1px;
      --_lumo-grid-selected-row-color: var(--lumo-primary-color-10pct);
    }

    /* No (outer) border */

    :host(:not([theme~='no-border'])) {
      border: var(--_lumo-grid-border-width) solid var(--_lumo-grid-border-color);
    }

    :host([disabled]) {
      opacity: 0.7;
    }

    /* Cell styles */

    [part~='cell'] {
      min-height: var(--lumo-size-m);
      background-color: var(--lumo-base-color);
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: default;
      padding: var(--lumo-space-xs) var(--lumo-space-m);
    }

    /* Apply row borders by default and introduce the "no-row-borders" variant */
    :host(:not([theme~='no-row-borders'])) [part~='cell']:not([part~='details-cell']) {
      border-top: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Hide first body row top border */
    :host(:not([theme~='no-row-borders'])) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      border-top: 0;
      min-height: calc(var(--lumo-size-m) - var(--_lumo-grid-border-width));
    }

    /* Focus-ring */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='focused-cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='focused-cell']:focus::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    :host([navigating]) [part~='row']:focus::before {
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: calc(var(--_lumo-grid-border-width) + 2px);
      pointer-events: none;
      background: var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] [part~='cell'][last-frozen]::after {
      right: -1px;
    }

    :host([theme~='no-row-borders']) [dragover] [part~='cell']::after {
      height: 2px;
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      top: 100%;
      bottom: auto;
      margin-top: -1px;
    }

    :host([all-rows-visible]) [part~='row'][last][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      top: auto;
      bottom: 100%;
      margin-bottom: -1px;
    }

    [part~='row'][details-opened][dragover='below'] [part~='cell']:not([part~='details-cell'])::after,
    [part~='row'][details-opened][dragover='above'] [part~='details-cell']::after {
      display: none;
    }

    [part~='row'][dragover][dragover='on-top'] [part~='cell']::after {
      height: 100%;
      opacity: 0.5;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    #scroller [part~='row'][dragstart]:not([dragstart=''])::after {
      display: block;
      position: absolute;
      left: var(--_grid-drag-start-x);
      top: var(--_grid-drag-start-y);
      z-index: 100;
      content: attr(dragstart);
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: calc(var(--lumo-space-xs) * 0.8);
      color: var(--lumo-error-contrast-color);
      background-color: var(--lumo-error-color);
      border-radius: var(--lumo-border-radius-m);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
      font-weight: 500;
      text-transform: initial;
      letter-spacing: initial;
      min-width: calc(var(--lumo-size-s) * 0.7);
      text-align: center;
    }

    /* Headers and footers */

    [part~='header-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='reorder-ghost'] {
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content) {
      font-weight: 400;
    }

    [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-xl);
    }

    /* Header borders */

    /* Hide first header row top border */
    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='header-cell'] {
      border-top: 0;
    }

    [part='row']:last-child [part~='header-cell'] {
      border-bottom: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='top']) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-border-color);
    }

    /* Footer borders */

    [part='row']:first-child [part~='footer-cell'] {
      border-top: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='bottom']) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-border-color);
    }

    /* Column reordering */

    :host([reordering]) [part~='cell'] {
      background: linear-gradient(var(--lumo-shade-20pct), var(--lumo-shade-20pct)) var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      background: var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      background: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct)) var(--lumo-base-color);
    }

    [part~='reorder-ghost'] {
      opacity: 0.85;
      box-shadow: var(--lumo-box-shadow-s);
      /* TODO Use the same styles as for the cell element (reorder-ghost copies styles from the cell element) */
      padding: var(--lumo-space-s) var(--lumo-space-m) !important;
    }

    /* Column resizing */

    [part='resize-handle'] {
      width: 3px;
      background-color: var(--lumo-primary-color-50pct);
      opacity: 0;
      transition: opacity 0.2s;
    }

    :host(:not([reordering])) *:not([column-resizing]) [part~='cell']:hover [part='resize-handle'],
    [part='resize-handle']:active {
      opacity: 1;
      transition-delay: 0.15s;
    }

    /* Column borders */

    :host([theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Frozen columns */

    [last-frozen] {
      border-right: var(--_lumo-grid-border-width) solid transparent;
      overflow: hidden;
    }

    :host([overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }

    [first-frozen-to-end] {
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    /* Row stripes */

    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='body-cell'],
    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='details-cell'] {
      background-image: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
      background-repeat: repeat-x;
    }

    /* Selected row */

    /* Raise the selected rows above unselected rows (so that box-shadow can cover unselected rows) */
    :host(:not([reordering])) [part~='row'][selected] {
      z-index: 1;
    }

    :host(:not([reordering])) [part~='row'][selected] [part~='body-cell']:not([part~='details-cell']) {
      background-image: linear-gradient(var(--_lumo-grid-selected-row-color), var(--_lumo-grid-selected-row-color));
      background-repeat: repeat;
    }

    /* Cover the border of an unselected row */
    :host(:not([theme~='no-row-borders'])) [part~='row'][selected] [part~='cell']:not([part~='details-cell']) {
      box-shadow: 0 var(--_lumo-grid-border-width) 0 0 var(--_lumo-grid-selected-row-color);
    }

    /* Compact */

    :host([theme~='compact']) [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-m);
    }

    :host([theme~='compact']) [part~='cell'] {
      min-height: var(--lumo-size-s);
    }

    :host([theme~='compact']) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      min-height: calc(var(--lumo-size-s) - var(--_lumo-grid-border-width));
    }

    :host([theme~='compact']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Wrap cell contents */

    :host([theme~='wrap-cell-content']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      white-space: normal;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    :host([dir='rtl'][theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    :host([dir='rtl']) [last-frozen] {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl']) [first-frozen-to-end] {
      border-left: none;
      border-right: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl'][overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    :host([dir='rtl'][overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }
  `,{moduleId:"lumo-grid"});const rr=t=>class extends t{static get properties(){return{resizable:{type:Boolean,value(){if("vaadin-grid-column-group"===this.localName)return;const t=this.parentNode;return t&&"vaadin-grid-column-group"===t.localName&&t.resizable||!1}},frozen:{type:Boolean,value:!1},frozenToEnd:{type:Boolean,value:!1},hidden:{type:Boolean,value:!1},header:{type:String},textAlign:{type:String},_lastFrozen:{type:Boolean,value:!1},_firstFrozenToEnd:{type:Boolean,value:!1},_order:Number,_reorderStatus:Boolean,_emptyCells:Array,_headerCell:Object,_footerCell:Object,_grid:Object,__initialized:{type:Boolean,value:!0},headerRenderer:Function,_headerRenderer:{type:Function,computed:"_computeHeaderRenderer(headerRenderer, header, __initialized)"},footerRenderer:Function,_footerRenderer:{type:Function,computed:"_computeFooterRenderer(footerRenderer, __initialized)"},__gridColumnElement:{type:Boolean,value:!0}}}static get observers(){return["_widthChanged(width, _headerCell, _footerCell, _cells.*)","_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)","_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells.*)","_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)","_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)","_orderChanged(_order, _headerCell, _footerCell, _cells.*)","_lastFrozenChanged(_lastFrozen)","_firstFrozenToEndChanged(_firstFrozenToEnd)","_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)","_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)","_resizableChanged(resizable, _headerCell)","_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)","_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)"]}connectedCallback(){super.connectedCallback(),requestAnimationFrame((()=>{this._grid&&this._allCells.forEach((t=>{t._content.parentNode||this._grid.appendChild(t._content)}))}))}disconnectedCallback(){super.disconnectedCallback(),requestAnimationFrame((()=>{this._grid||this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)}))})),this._gridValue=void 0}ready(){super.ready(),sr(this)}_findHostGrid(){let t=this;for(;t&&!/^vaadin.*grid(-pro)?$/.test(t.localName);)t=t.assignedSlot?t.assignedSlot.parentNode:t.parentNode;return t||void 0}get _grid(){return this._gridValue||(this._gridValue=this._findHostGrid()),this._gridValue}get _allCells(){return[].concat(this._cells||[]).concat(this._emptyCells||[]).concat(this._headerCell).concat(this._footerCell).filter((t=>t))}_renderHeaderAndFooter(){this._renderHeaderCellContent(this._headerRenderer,this._headerCell),this._renderFooterCellContent(this._footerRenderer,this._footerCell)}_flexGrowChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("flexGrow"),this._allCells.forEach((e=>{e.style.flexGrow=t}))}_orderChanged(t){this._allCells.forEach((e=>{e.style.order=t}))}_widthChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("width"),this._allCells.forEach((e=>{e.style.width=t}))}_frozenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozen",t),this._allCells.forEach((e=>e.toggleAttribute("frozen",t))),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_frozenToEndChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozenToEnd",t),this._allCells.forEach((e=>{this._grid&&e.parentElement===this._grid.$.sizer||e.toggleAttribute("frozen-to-end",t)})),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_lastFrozenChanged(t){this._allCells.forEach((e=>e.toggleAttribute("last-frozen",t))),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._lastFrozen=t)}_firstFrozenToEndChanged(t){this._allCells.forEach((e=>{this._grid&&e.parentElement===this._grid.$.sizer||e.toggleAttribute("first-frozen-to-end",t)})),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._firstFrozenToEnd=t)}_generateHeader(t){return t.substr(t.lastIndexOf(".")+1).replace(/([A-Z])/g,"-$1").toLowerCase().replace(/-/g," ").replace(/^./,(t=>t.toUpperCase()))}_reorderStatusChanged(t){this._allCells.forEach((e=>e.setAttribute("reorder-status",t)))}_resizableChanged(t,e){void 0!==t&&void 0!==e&&e&&[e].concat(this._emptyCells).forEach((e=>{if(e){const i=e.querySelector('[part~="resize-handle"]');if(i&&e.removeChild(i),t){const t=document.createElement("div");t.setAttribute("part","resize-handle"),e.appendChild(t)}}}))}_textAlignChanged(t){if(void 0===t||void 0===this._grid)return;if(-1===["start","end","center"].indexOf(t))return void console.warn('textAlign can only be set as "start", "end" or "center"');let e;"ltr"===getComputedStyle(this._grid).direction?"start"===t?e="left":"end"===t&&(e="right"):"start"===t?e="right":"end"===t&&(e="left"),this._allCells.forEach((i=>{i._content.style.textAlign=t,getComputedStyle(i._content).textAlign!==t&&(i._content.style.textAlign=e)}))}_hiddenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("hidden",t),!!t!=!!this._previousHidden&&this._grid&&(!0===t&&this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)})),this._grid._debouncerHiddenChanged=Es.debounce(this._grid._debouncerHiddenChanged,$i,(()=>{this._grid&&this._grid._renderColumnTree&&this._grid._renderColumnTree(this._grid._columnTree)})),this._grid._debounceUpdateFrozenColumn&&this._grid._debounceUpdateFrozenColumn(),this._grid._resetKeyboardNavigation&&this._grid._resetKeyboardNavigation()),this._previousHidden=t}_runRenderer(t,e,i){const s=[e._content,this];i&&i.item&&s.push(i),t.apply(this,s)}__renderCellsContent(t,e){!this.hidden&&this._grid&&e.forEach((e=>{if(!e.parentElement)return;const i=this._grid.__getRowModel(e.parentElement);t&&(e._renderer!==t&&this._clearCellContent(e),e._renderer=t,(i.item||t===this._headerRenderer||t===this._footerRenderer)&&this._runRenderer(t,e,i))}))}_clearCellContent(t){t._content.innerHTML="",delete t._content._$litPart$}_renderHeaderCellContent(t,e){e&&t&&(this.__renderCellsContent(t,[e]),this._grid&&e.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(e.parentElement))}_onHeaderRendererOrBindingChanged(t,e,...i){this._renderHeaderCellContent(t,e)}_renderBodyCellsContent(t,e){e&&t&&this.__renderCellsContent(t,e)}_onRendererOrBindingChanged(t,e,...i){this._renderBodyCellsContent(t,e)}_renderFooterCellContent(t,e){e&&t&&(this.__renderCellsContent(t,[e]),this._grid&&e.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(e.parentElement))}_onFooterRendererOrBindingChanged(t,e){this._renderFooterCellContent(t,e)}__setTextContent(t,e){t.textContent!==e&&(t.textContent=e)}__textHeaderRenderer(){this.__setTextContent(this._headerCell._content,this.header)}_defaultHeaderRenderer(){this.path&&this.__setTextContent(this._headerCell._content,this._generateHeader(this.path))}_defaultRenderer(t,e,{item:i}){this.path&&this.__setTextContent(t,this.get(this.path,i))}_defaultFooterRenderer(){}_computeHeaderRenderer(t,e){return t||(null!=e?this.__textHeaderRenderer:this._defaultHeaderRenderer)}_computeRenderer(t){return t||this._defaultRenderer}_computeFooterRenderer(t){return t||this._defaultFooterRenderer}};class or extends(rr(Fs(Ti))){static get is(){return"vaadin-grid-column"}static get properties(){return{width:{type:String,value:"100px"},flexGrow:{type:Number,value:1},renderer:Function,_renderer:{type:Function,computed:"_computeRenderer(renderer, __initialized)"},path:{type:String},autoWidth:{type:Boolean,value:!1},_focusButtonMode:{type:Boolean,value:!1},_cells:Array}}}customElements.define(or.is,or),
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
Tt("vaadin-grid",P`
    @keyframes vaadin-grid-appear {
      to {
        opacity: 1;
      }
    }

    :host {
      display: block;
      animation: 1ms vaadin-grid-appear;
      height: 400px;
      flex: 1 1 auto;
      align-self: stretch;
      position: relative;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    #scroller {
      display: block;
      transform: translateY(0);
      width: auto;
      height: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    :host([all-rows-visible]) {
      height: auto;
      align-self: flex-start;
      flex-grow: 0;
      width: 100%;
    }

    :host([all-rows-visible]) #scroller {
      width: 100%;
      height: 100%;
      position: relative;
    }

    :host([all-rows-visible]) #items {
      min-height: 1px;
    }

    #table {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      outline: none;
      /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
      z-index: 0;
    }

    #header,
    #footer {
      display: block;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      overflow: visible;
      width: 100%;
      z-index: 1;
    }

    #header {
      top: 0;
    }

    th {
      text-align: inherit;
    }

    /* Safari doesn't work with "inherit" */
    [safari] th {
      text-align: initial;
    }

    #footer {
      bottom: 0;
    }

    #items {
      flex-grow: 1;
      flex-shrink: 0;
      display: block;
      position: -webkit-sticky;
      position: sticky;
      width: 100%;
      left: 0;
      overflow: visible;
    }

    [part~='row'] {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }

    [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
      opacity: 0;
    }

    #items [part~='row'] {
      position: absolute;
    }

    #items [part~='row']:empty {
      height: 100%;
    }

    [part~='cell']:not([part~='details-cell']) {
      flex-shrink: 0;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;
      padding: 0;
      white-space: nowrap;
    }

    [part~='cell'] > [tabindex] {
      display: flex;
      align-items: inherit;
      outline: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    [part~='details-cell'] {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [hidden] {
      display: none !important;
    }

    [frozen],
    [frozen-to-end] {
      z-index: 2;
      will-change: transform;
    }

    [no-scrollbars][safari] #table,
    [no-scrollbars][firefox] #table {
      overflow: hidden;
    }

    /* Reordering styles */
    :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
    :host([reordering]) [part~='resize-handle'],
    #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      pointer-events: none;
    }

    [part~='reorder-ghost'] {
      visibility: hidden;
      position: fixed;
      pointer-events: none;
      opacity: 0.5;

      /* Prevent overflowing the grid in Firefox */
      top: 0;
      left: 0;
    }

    :host([reordering]) {
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Resizing styles */
    [part~='resize-handle'] {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      cursor: col-resize;
      z-index: 1;
    }

    [part~='resize-handle']::before {
      position: absolute;
      content: '';
      height: 100%;
      width: 35px;
      transform: translateX(-50%);
    }

    [last-column] [part~='resize-handle']::before,
    [last-frozen] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
      right: 0;
    }

    [frozen-to-end] [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    [frozen-to-end] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    [first-frozen-to-end] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
    }

    [first-frozen-to-end] {
      margin-inline-start: auto;
    }

    /* Hide resize handle if scrolled to end */
    :host(:not([overflow~='end'])) [first-frozen-to-end] [part~='resize-handle'] {
      display: none;
    }

    #scroller[column-resizing] {
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Sizer styles */
    #sizer {
      display: flex;
      position: absolute;
      visibility: hidden;
    }

    #sizer [part~='details-cell'] {
      display: none !important;
    }

    #sizer [part~='cell'][hidden] {
      display: none !important;
    }

    #sizer [part~='cell'] {
      display: block;
      flex-shrink: 0;
      line-height: 0;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    #sizer [part~='cell']::before {
      content: '-';
    }

    #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: none !important;
    }

    /* RTL specific styles */

    :host([dir='rtl']) #items,
    :host([dir='rtl']) #header,
    :host([dir='rtl']) #footer {
      left: auto;
    }

    :host([dir='rtl']) [part~='reorder-ghost'] {
      left: auto;
      right: 0;
    }

    :host([dir='rtl']) [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [part~='resize-handle']::before {
      transform: translateX(50%);
    }

    :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
    :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle'] {
      right: 0;
      left: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle']::before {
      right: 0;
      left: auto;
    }
  `,{moduleId:"vaadin-grid-styles"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let nr=!1,ar=[],lr=[];function dr(){nr=!0,requestAnimationFrame((function(){nr=!1,function(t){for(;t.length;)hr(t.shift())}(ar),setTimeout((function(){!function(t){for(let e=0,i=t.length;e<i;e++)hr(t.shift())}(lr)}))}))}function hr(t){const e=t[0],i=t[1],s=t[2];try{i.apply(e,s)}catch(t){setTimeout((()=>{throw t}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const cr=t=>t.test(navigator.userAgent),ur=t=>t.test(navigator.platform),_r=cr(/Android/),pr=cr(/Chrome/)&&/Google Inc/.test(navigator.vendor);const mr=cr(/Firefox/),fr=ur(/^iPad/)||ur(/^Mac/)&&navigator.maxTouchPoints>1,gr=ur(/^iPhone/)||fr,br=cr(/^((?!chrome|android).)*safari/i),vr=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(t){return!1}})(),yr=navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/),Ar=yr&&yr[1]>=8,Cr={_ratio:.5,_scrollerPaddingTop:0,_scrollPosition:0,_physicalSize:0,_physicalAverage:0,_physicalAverageCount:0,_physicalTop:0,_virtualCount:0,_estScrollHeight:0,_scrollHeight:0,_viewportHeight:0,_viewportWidth:0,_physicalItems:null,_physicalSizes:null,_firstVisibleIndexVal:null,_lastVisibleIndexVal:null,_maxPages:2,_templateCost:0,get _physicalBottom(){return this._physicalTop+this._physicalSize},get _scrollBottom(){return this._scrollPosition+this._viewportHeight},get _virtualEnd(){return this._virtualStart+this._physicalCount-1},get _hiddenContentSize(){return this._physicalSize-this._viewportHeight},get _maxScrollTop(){return this._estScrollHeight-this._viewportHeight+this._scrollOffset},get _maxVirtualStart(){const t=this._virtualCount;return Math.max(0,t-this._physicalCount)},get _virtualStart(){return this._virtualStartVal||0},set _virtualStart(t){t=this._clamp(t,0,this._maxVirtualStart),this._virtualStartVal=t},get _physicalStart(){return this._physicalStartVal||0},set _physicalStart(t){(t%=this._physicalCount)<0&&(t=this._physicalCount+t),this._physicalStartVal=t},get _physicalEnd(){return(this._physicalStart+this._physicalCount-1)%this._physicalCount},get _physicalCount(){return this._physicalCountVal||0},set _physicalCount(t){this._physicalCountVal=t},get _optPhysicalSize(){return 0===this._viewportHeight?1/0:this._viewportHeight*this._maxPages},get _isVisible(){return Boolean(this.offsetWidth||this.offsetHeight)},get firstVisibleIndex(){let t=this._firstVisibleIndexVal;if(null==t){let e=this._physicalTop+this._scrollOffset;t=this._iterateItems(((t,i)=>{if(e+=this._getPhysicalSizeIncrement(t),e>this._scrollPosition)return i}))||0,this._firstVisibleIndexVal=t}return t},get lastVisibleIndex(){let t=this._lastVisibleIndexVal;if(null==t){let e=this._physicalTop+this._scrollOffset;this._iterateItems(((i,s)=>{e<this._scrollBottom&&(t=s),e+=this._getPhysicalSizeIncrement(i)})),this._lastVisibleIndexVal=t}return t},get _scrollOffset(){return this._scrollerPaddingTop+this.scrollOffset},_scrollHandler(){const t=Math.max(0,Math.min(this._maxScrollTop,this._scrollTop));let e=t-this._scrollPosition;const i=e>=0;if(this._scrollPosition=t,this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,Math.abs(e)>this._physicalSize&&this._physicalSize>0){e-=this._scrollOffset;const t=Math.round(e/this._physicalAverage);this._virtualStart+=t,this._physicalStart+=t,this._physicalTop=Math.min(Math.floor(this._virtualStart)*this._physicalAverage,this._scrollPosition),this._update()}else if(this._physicalCount>0){const t=this._getReusables(i);i?(this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length):(this._virtualStart-=t.indexes.length,this._physicalStart-=t.indexes.length),this._update(t.indexes,i?null:t.indexes),this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,0),Mi)}},_getReusables(t){let e,i,s;const r=[],o=this._hiddenContentSize*this._ratio,n=this._virtualStart,a=this._virtualEnd,l=this._physicalCount;let d=this._physicalTop+this._scrollOffset;const h=this._physicalBottom+this._scrollOffset,c=this._scrollPosition,u=this._scrollBottom;for(t?(e=this._physicalStart,i=c-d):(e=this._physicalEnd,i=h-u);s=this._getPhysicalSizeIncrement(e),i-=s,!(r.length>=l||i<=o);)if(t){if(a+r.length+1>=this._virtualCount)break;if(d+s>=c-this._scrollOffset)break;r.push(e),d+=s,e=(e+1)%l}else{if(n-r.length<=0)break;if(d+this._physicalSize-s<=u)break;r.push(e),d-=s,e=0===e?l-1:e-1}return{indexes:r,physicalTop:d-this._scrollOffset}},_update(t,e){if(!(t&&0===t.length||0===this._physicalCount)){if(this._assignModels(t),this._updateMetrics(t),e)for(;e.length;){const t=e.pop();this._physicalTop-=this._getPhysicalSizeIncrement(t)}this._positionItems(),this._updateScrollerSize()}},_isClientFull(){return 0!==this._scrollBottom&&this._physicalBottom-1>=this._scrollBottom&&this._physicalTop<=this._scrollPosition},_increasePoolIfNeeded(t){const e=this._clamp(this._physicalCount+t,3,this._virtualCount-this._virtualStart)-this._physicalCount;let i=Math.round(.5*this._physicalCount);if(!(e<0)){if(e>0){const t=window.performance.now();[].push.apply(this._physicalItems,this._createPool(e));for(let t=0;t<e;t++)this._physicalSizes.push(0);this._physicalCount+=e,this._physicalStart>this._physicalEnd&&this._isIndexRendered(this._focusedVirtualIndex)&&this._getPhysicalIndex(this._focusedVirtualIndex)<this._physicalEnd&&(this._physicalStart+=e),this._update(),this._templateCost=(window.performance.now()-t)/e,i=Math.round(.5*this._physicalCount)}this._virtualEnd>=this._virtualCount-1||0===i||(this._isClientFull()?this._physicalSize<this._optPhysicalSize&&this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,this._clamp(Math.round(50/this._templateCost),1,i)),Di):this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,i),Mi))}},_render(){if(this.isAttached&&this._isVisible)if(0!==this._physicalCount){const t=this._getReusables(!0);this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length,this._update(t.indexes),this._update(),this._increasePoolIfNeeded(0)}else this._virtualCount>0&&(this.updateViewportBoundaries(),this._increasePoolIfNeeded(3))},_itemsChanged(t){"items"===t.path&&(this._virtualStart=0,this._physicalTop=0,this._virtualCount=this.items?this.items.length:0,this._physicalIndexForKey={},this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._physicalCount=this._physicalCount||0,this._physicalItems=this._physicalItems||[],this._physicalSizes=this._physicalSizes||[],this._physicalStart=0,this._scrollTop>this._scrollOffset&&this._resetScrollPosition(0),this._debounce("_render",this._render,$i))},_iterateItems(t,e){let i,s,r,o;if(2===arguments.length&&e){for(o=0;o<e.length;o++)if(i=e[o],s=this._computeVidx(i),null!=(r=t.call(this,i,s)))return r}else{for(i=this._physicalStart,s=this._virtualStart;i<this._physicalCount;i++,s++)if(null!=(r=t.call(this,i,s)))return r;for(i=0;i<this._physicalStart;i++,s++)if(null!=(r=t.call(this,i,s)))return r}},_computeVidx(t){return t>=this._physicalStart?this._virtualStart+(t-this._physicalStart):this._virtualStart+(this._physicalCount-this._physicalStart)+t},_positionItems(){this._adjustScrollPosition();let t=this._physicalTop;this._iterateItems((e=>{this.translate3d(0,`${t}px`,0,this._physicalItems[e]),t+=this._physicalSizes[e]}))},_getPhysicalSizeIncrement(t){return this._physicalSizes[t]},_adjustScrollPosition(){const t=0===this._virtualStart?this._physicalTop:Math.min(this._scrollPosition+this._physicalTop,0);if(0!==t){this._physicalTop-=t;const e=this._scrollPosition;!Ar&&e>0&&this._resetScrollPosition(e-t)}},_resetScrollPosition(t){this.scrollTarget&&t>=0&&(this._scrollTop=t,this._scrollPosition=this._scrollTop)},_updateScrollerSize(t){this._estScrollHeight=this._physicalBottom+Math.max(this._virtualCount-this._physicalCount-this._virtualStart,0)*this._physicalAverage,((t=(t=t||0===this._scrollHeight)||this._scrollPosition>=this._estScrollHeight-this._physicalSize)||Math.abs(this._estScrollHeight-this._scrollHeight)>=this._viewportHeight)&&(this.$.items.style.height=`${this._estScrollHeight}px`,this._scrollHeight=this._estScrollHeight)},scrollToIndex(t){if("number"!=typeof t||t<0||t>this.items.length-1)return;if(Is(),0===this._physicalCount)return;t=this._clamp(t,0,this._virtualCount-1),(!this._isIndexRendered(t)||t>=this._maxVirtualStart)&&(this._virtualStart=t-1),this._assignModels(),this._updateMetrics(),this._physicalTop=this._virtualStart*this._physicalAverage;let e=this._physicalStart,i=this._virtualStart,s=0;const r=this._hiddenContentSize;for(;i<t&&s<=r;)s+=this._getPhysicalSizeIncrement(e),e=(e+1)%this._physicalCount,i+=1;this._updateScrollerSize(!0),this._positionItems(),this._resetScrollPosition(this._physicalTop+this._scrollOffset+s),this._increasePoolIfNeeded(0),this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null},_resetAverage(){this._physicalAverage=0,this._physicalAverageCount=0},_resizeHandler(){this._debounce("_render",(()=>{this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._isVisible?(this.updateViewportBoundaries(),this.toggleScrollListener(!0),this._resetAverage(),this._render()):this.toggleScrollListener(!1)}),$i)},_isIndexRendered(t){return t>=this._virtualStart&&t<=this._virtualEnd},_getPhysicalIndex(t){return(this._physicalStart+(t-this._virtualStart))%this._physicalCount},_clamp:(t,e,i)=>Math.min(i,Math.max(e,t)),_debounce(t,e,i){this._debouncers=this._debouncers||{},this._debouncers[t]=Es.debounce(this._debouncers[t],i,e.bind(this)),Ps(this._debouncers[t])}},wr=1e3;class xr{constructor({createElements:t,updateElement:e,scrollTarget:i,scrollContainer:s,elementsContainer:r,reorderElements:o}){this.isAttached=!0,this._vidxOffset=0,this.createElements=t,this.updateElement=e,this.scrollTarget=i,this.scrollContainer=s,this.elementsContainer=r||s,this.reorderElements=o,this._maxPages=1.3,this.__placeholderHeight=200,this.__elementHeightQueue=Array(10),this.timeouts={SCROLL_REORDER:500,IGNORE_WHEEL:500,FIX_INVALID_ITEM_POSITIONING:100},this.__resizeObserver=new ResizeObserver((()=>this._resizeHandler())),"visible"===getComputedStyle(this.scrollTarget).overflow&&(this.scrollTarget.style.overflow="auto"),"static"===getComputedStyle(this.scrollContainer).position&&(this.scrollContainer.style.position="relative"),this.__resizeObserver.observe(this.scrollTarget),this.scrollTarget.addEventListener("scroll",(()=>this._scrollHandler())),this._scrollLineHeight=this._getScrollLineHeight(),this.scrollTarget.addEventListener("wheel",(t=>this.__onWheel(t))),this.reorderElements&&(this.scrollTarget.addEventListener("mousedown",(()=>{this.__mouseDown=!0})),this.scrollTarget.addEventListener("mouseup",(()=>{this.__mouseDown=!1,this.__pendingReorder&&this.__reorderElements()})))}get scrollOffset(){return 0}get adjustedFirstVisibleIndex(){return this.firstVisibleIndex+this._vidxOffset}get adjustedLastVisibleIndex(){return this.lastVisibleIndex+this._vidxOffset}scrollToIndex(t){if("number"!=typeof t||isNaN(t)||0===this.size||!this.scrollTarget.offsetHeight)return;t=this._clamp(t,0,this.size-1);const e=this.__getVisibleElements().length;let i=Math.floor(t/this.size*this._virtualCount);this._virtualCount-i<e?(i=this._virtualCount-(this.size-t),this._vidxOffset=this.size-this._virtualCount):i<e?t<wr?(i=t,this._vidxOffset=0):(i=wr,this._vidxOffset=t-i):this._vidxOffset=t-i,this.__skipNextVirtualIndexAdjust=!0,super.scrollToIndex(i),this.adjustedFirstVisibleIndex!==t&&this._scrollTop<this._maxScrollTop&&!this.grid&&(this._scrollTop-=this.__getIndexScrollOffset(t)||0),this._scrollHandler()}flush(){0!==this.scrollTarget.offsetHeight&&(this._resizeHandler(),Is(),this._scrollHandler(),this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.flush(),this.__scrollReorderDebouncer&&this.__scrollReorderDebouncer.flush(),this.__debouncerWheelAnimationFrame&&this.__debouncerWheelAnimationFrame.flush())}update(t=0,e=this.size-1){this.__getVisibleElements().forEach((i=>{i.__virtualIndex>=t&&i.__virtualIndex<=e&&this.__updateElement(i,i.__virtualIndex,!0)}))}_updateMetrics(t){Is();let e=0,i=0;const s=this._physicalAverageCount,r=this._physicalAverage;this._iterateItems(((t,s)=>{i+=this._physicalSizes[t],this._physicalSizes[t]=Math.ceil(this.__getBorderBoxHeight(this._physicalItems[t])),e+=this._physicalSizes[t],this._physicalAverageCount+=this._physicalSizes[t]?1:0}),t),this._physicalSize=this._physicalSize+e-i,this._physicalAverageCount!==s&&(this._physicalAverage=Math.round((r*s+e)/this._physicalAverageCount))}__getBorderBoxHeight(t){const e=getComputedStyle(t),i=parseFloat(e.height)||0;if("border-box"===e.boxSizing)return i;return i+(parseFloat(e.paddingBottom)||0)+(parseFloat(e.paddingTop)||0)+(parseFloat(e.borderBottomWidth)||0)+(parseFloat(e.borderTopWidth)||0)}__updateElement(t,e,i){t.style.paddingTop&&(t.style.paddingTop=""),this.__preventElementUpdates||t.__lastUpdatedIndex===e&&!i||(this.updateElement(t,e),t.__lastUpdatedIndex=e);const s=t.offsetHeight;if(0===s)t.style.paddingTop=`${this.__placeholderHeight}px`,requestAnimationFrame((()=>this._resizeHandler()));else{this.__elementHeightQueue.push(s),this.__elementHeightQueue.shift();const t=this.__elementHeightQueue.filter((t=>void 0!==t));this.__placeholderHeight=Math.round(t.reduce(((t,e)=>t+e),0)/t.length)}}__getIndexScrollOffset(t){const e=this.__getVisibleElements().find((e=>e.__virtualIndex===t));return e?this.scrollTarget.getBoundingClientRect().top-e.getBoundingClientRect().top:void 0}get size(){return this.__size}set size(t){if(t===this.size)return;let e,i;if(this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.cancel(),this._debouncers&&this._debouncers._increasePoolIfNeeded&&this._debouncers._increasePoolIfNeeded.cancel(),this.__preventElementUpdates=!0,t>0&&(e=this.adjustedFirstVisibleIndex,i=this.__getIndexScrollOffset(e)),this.__size=t,this._itemsChanged({path:"items"}),Is(),t>0){e=Math.min(e,t-1),this.scrollToIndex(e);const s=this.__getIndexScrollOffset(e);void 0!==i&&void 0!==s&&(this._scrollTop+=i-s)}this.elementsContainer.children.length||requestAnimationFrame((()=>this._resizeHandler())),this.__preventElementUpdates=!1,this._resizeHandler(),Is()}get _scrollTop(){return this.scrollTarget.scrollTop}set _scrollTop(t){this.scrollTarget.scrollTop=t}get items(){return{length:Math.min(this.size,1e5)}}get offsetHeight(){return this.scrollTarget.offsetHeight}get $(){return{items:this.scrollContainer}}updateViewportBoundaries(){const t=window.getComputedStyle(this.scrollTarget);this._scrollerPaddingTop=this.scrollTarget===this?0:parseInt(t["padding-top"],10),this._isRTL=Boolean("rtl"===t.direction),this._viewportWidth=this.elementsContainer.offsetWidth,this._viewportHeight=this.scrollTarget.offsetHeight,this._scrollPageHeight=this._viewportHeight-this._scrollLineHeight,this.grid&&this._updateGridMetrics()}setAttribute(){}_createPool(t){const e=this.createElements(t),i=document.createDocumentFragment();return e.forEach((t=>{t.style.position="absolute",i.appendChild(t),this.__resizeObserver.observe(t)})),this.elementsContainer.appendChild(i),e}_assignModels(t){this._iterateItems(((t,e)=>{const i=this._physicalItems[t];i.hidden=e>=this.size,i.hidden?delete i.__lastUpdatedIndex:(i.__virtualIndex=e+(this._vidxOffset||0),this.__updateElement(i,i.__virtualIndex))}),t)}_isClientFull(){return setTimeout((()=>{this.__clientFull=!0})),this.__clientFull||super._isClientFull()}translate3d(t,e,i,s){s.style.transform=`translateY(${e})`}toggleScrollListener(){}_scrollHandler(){if(0===this.scrollTarget.offsetHeight)return;this._adjustVirtualIndexOffset(this._scrollTop-(this.__previousScrollTop||0));const t=this.scrollTarget.scrollTop-this._scrollPosition;if(super._scrollHandler(),0!==this._physicalCount){const e=t>=0,i=this._getReusables(!e);i.indexes.length&&(this._physicalTop=i.physicalTop,e?(this._virtualStart-=i.indexes.length,this._physicalStart-=i.indexes.length):(this._virtualStart+=i.indexes.length,this._physicalStart+=i.indexes.length),this._resizeHandler())}t&&(this.__fixInvalidItemPositioningDebouncer=Es.debounce(this.__fixInvalidItemPositioningDebouncer,Li.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),(()=>this.__fixInvalidItemPositioning()))),this.reorderElements&&(this.__scrollReorderDebouncer=Es.debounce(this.__scrollReorderDebouncer,Li.after(this.timeouts.SCROLL_REORDER),(()=>this.__reorderElements()))),this.__previousScrollTop=this._scrollTop,0===this._scrollTop&&0!==this.firstVisibleIndex&&Math.abs(t)>0&&this.scrollToIndex(0)}__fixInvalidItemPositioning(){if(!this.scrollTarget.isConnected)return;const t=this._physicalTop>this._scrollTop,e=this._physicalBottom<this._scrollBottom,i=0===this.adjustedFirstVisibleIndex,s=this.adjustedLastVisibleIndex===this.size-1;if(t&&!i||e&&!s){const t=e,i=this._ratio;this._ratio=0,this._scrollPosition=this._scrollTop+(t?-1:1),this._scrollHandler(),this._ratio=i}}__onWheel(t){if(t.ctrlKey||this._hasScrolledAncestor(t.target,t.deltaX,t.deltaY))return;let e=t.deltaY;if(t.deltaMode===WheelEvent.DOM_DELTA_LINE?e*=this._scrollLineHeight:t.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(e*=this._scrollPageHeight),this._deltaYAcc=this._deltaYAcc||0,this._wheelAnimationFrame)return this._deltaYAcc+=e,void t.preventDefault();e+=this._deltaYAcc,this._deltaYAcc=0,this._wheelAnimationFrame=!0,this.__debouncerWheelAnimationFrame=Es.debounce(this.__debouncerWheelAnimationFrame,$i,(()=>{this._wheelAnimationFrame=!1}));const i=Math.abs(t.deltaX)+Math.abs(e);this._canScroll(this.scrollTarget,t.deltaX,e)?(t.preventDefault(),this.scrollTarget.scrollTop+=e,this.scrollTarget.scrollLeft+=t.deltaX,this._hasResidualMomentum=!0,this._ignoreNewWheel=!0,this._debouncerIgnoreNewWheel=Es.debounce(this._debouncerIgnoreNewWheel,Li.after(this.timeouts.IGNORE_WHEEL),(()=>{this._ignoreNewWheel=!1}))):this._hasResidualMomentum&&i<=this._previousMomentum||this._ignoreNewWheel?t.preventDefault():i>this._previousMomentum&&(this._hasResidualMomentum=!1),this._previousMomentum=i}_hasScrolledAncestor(t,e,i){return t!==this.scrollTarget&&t!==this.scrollTarget.getRootNode().host&&(!(!this._canScroll(t,e,i)||-1===["auto","scroll"].indexOf(getComputedStyle(t).overflow))||(t!==this&&t.parentElement?this._hasScrolledAncestor(t.parentElement,e,i):void 0))}_canScroll(t,e,i){return i>0&&t.scrollTop<t.scrollHeight-t.offsetHeight||i<0&&t.scrollTop>0||e>0&&t.scrollLeft<t.scrollWidth-t.offsetWidth||e<0&&t.scrollLeft>0}_getScrollLineHeight(){const t=document.createElement("div");t.style.fontSize="initial",t.style.display="none",document.body.appendChild(t);const e=window.getComputedStyle(t).fontSize;return document.body.removeChild(t),e?window.parseInt(e):void 0}__getVisibleElements(){return Array.from(this.elementsContainer.children).filter((t=>!t.hidden))}__reorderElements(){if(this.__mouseDown)return void(this.__pendingReorder=!0);this.__pendingReorder=!1;const t=this._virtualStart+(this._vidxOffset||0),e=this.__getVisibleElements(),i=e.find((t=>t.contains(this.elementsContainer.getRootNode().activeElement)||t.contains(this.scrollTarget.getRootNode().activeElement)))||e[0];if(!i)return;const s=i.__virtualIndex-t,r=e.indexOf(i)-s;if(r>0)for(let t=0;t<r;t++)this.elementsContainer.appendChild(e[t]);else if(r<0)for(let t=e.length+r;t<e.length;t++)this.elementsContainer.insertBefore(e[t],e[0]);if(br){const{transform:t}=this.scrollTarget.style;this.scrollTarget.style.transform="translateZ(0)",setTimeout((()=>{this.scrollTarget.style.transform=t}))}}_adjustVirtualIndexOffset(t){if(this._virtualCount>=this.size)this._vidxOffset=0;else if(this.__skipNextVirtualIndexAdjust)this.__skipNextVirtualIndexAdjust=!1;else if(Math.abs(t)>1e4){const t=this._scrollTop/(this.scrollTarget.scrollHeight-this.scrollTarget.offsetHeight),e=t*this.size;this._vidxOffset=Math.round(e-t*this._virtualCount)}else{const t=this._vidxOffset,e=wr,i=100;0===this._scrollTop?(this._vidxOffset=0,t!==this._vidxOffset&&super.scrollToIndex(0)):this.firstVisibleIndex<e&&this._vidxOffset>0&&(this._vidxOffset-=Math.min(this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex+(t-this._vidxOffset)));const s=this.size-this._virtualCount;this._scrollTop>=this._maxScrollTop&&this._maxScrollTop>0?(this._vidxOffset=s,t!==this._vidxOffset&&super.scrollToIndex(this._virtualCount-1)):this.firstVisibleIndex>this._virtualCount-e&&this._vidxOffset<s&&(this._vidxOffset+=Math.min(s-this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex-(this._vidxOffset-t)))}}}Object.setPrototypeOf(xr.prototype,Cr);class Er{constructor(t){this.__adapter=new xr(t)}get size(){return this.__adapter.size}set size(t){this.__adapter.size=t}scrollToIndex(t){this.__adapter.scrollToIndex(t)}update(t=0,e=this.size-1){this.__adapter.update(t,e)}flush(){this.__adapter.flush()}get firstVisibleIndex(){return this.__adapter.adjustedFirstVisibleIndex}get lastVisibleIndex(){return this.__adapter.adjustedLastVisibleIndex}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const Sr=t=>class extends t{static get observers(){return["_a11yUpdateGridSize(size, _columnTree, _columnTree.*)"]}_a11yGetHeaderRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer||t.path||t.header)))).length}_a11yGetFooterRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer)))).length}_a11yUpdateGridSize(t,e){if(void 0===t||void 0===e)return;const i=e[e.length-1];this.$.table.setAttribute("aria-rowcount",t+this._a11yGetHeaderRowCount(e)+this._a11yGetFooterRowCount(e)),this.$.table.setAttribute("aria-colcount",i&&i.length||0),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows()}_a11yUpdateHeaderRows(){Array.from(this.$.header.children).forEach(((t,e)=>t.setAttribute("aria-rowindex",e+1)))}_a11yUpdateFooterRows(){Array.from(this.$.footer.children).forEach(((t,e)=>t.setAttribute("aria-rowindex",this._a11yGetHeaderRowCount(this._columnTree)+this.size+e+1)))}_a11yUpdateRowRowindex(t,e){t.setAttribute("aria-rowindex",e+this._a11yGetHeaderRowCount(this._columnTree)+1)}_a11yUpdateRowSelected(t,e){t.setAttribute("aria-selected",Boolean(e)),Array.from(t.children).forEach((t=>t.setAttribute("aria-selected",Boolean(e))))}_a11yUpdateRowExpanded(t){this.__isRowExpandable(t)?t.setAttribute("aria-expanded","false"):this.__isRowCollapsible(t)?t.setAttribute("aria-expanded","true"):t.removeAttribute("aria-expanded")}_a11yUpdateRowLevel(t,e){e>0||this.__isRowCollapsible(t)||this.__isRowExpandable(t)?t.setAttribute("aria-level",e+1):t.removeAttribute("aria-level")}_a11ySetRowDetailsCell(t,e){Array.from(t.children).forEach((t=>{t!==e&&t.setAttribute("aria-controls",e.id)}))}_a11yUpdateCellColspan(t,e){t.setAttribute("aria-colspan",Number(e))}_a11yUpdateSorters(){Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((t=>{let e=t.parentNode;for(;e&&"vaadin-grid-cell-content"!==e.localName;)e=e.parentNode;if(e&&e.assignedSlot){e.assignedSlot.parentNode.setAttribute("aria-sort",{asc:"ascending",desc:"descending"}[String(t.direction)]||"none")}}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Pr=t=>class extends t{static get properties(){return{activeItem:{type:Object,notify:!0,value:null}}}ready(){super.ready(),this.$.scroller.addEventListener("click",this._onClick.bind(this)),this.addEventListener("cell-activate",this._activateItem.bind(this)),this.addEventListener("row-activate",this._activateItem.bind(this))}_activateItem(t){const e=t.detail.model,i=e?e.item:null;i&&(this.activeItem=this._itemsEqual(this.activeItem,i)?null:i)}_onClick(t){if(t.defaultPrevented)return;const e=t.composedPath(),i=e[e.indexOf(this.$.table)-3];if(!i||i.getAttribute("part").indexOf("details-cell")>-1)return;const s=i._content,r=this.getRootNode().activeElement;s.contains(r)||this._isFocusable(t.target)||t.target instanceof HTMLLabelElement||this.dispatchEvent(new CustomEvent("cell-activate",{detail:{model:this.__getRowModel(i.parentElement)}}))}_isFocusable(t){return Tr(t)}},Tr=t=>{if(!t.parentNode)return!1;const e=Array.from(t.parentNode.querySelectorAll("[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]")).filter((t=>{const e=t.getAttribute("part");return!(e&&e.includes("body-cell"))})).includes(t);return!t.disabled&&e&&t.offsetParent&&"hidden"!==getComputedStyle(t).visibility};function Ir(t,e){return t.split(".").reduce(((t,e)=>t[e]),e)}function zr(t,e,i){if(0===i.length)return!1;let s=!0;return t.forEach((({path:t})=>{if(!t||-1===t.indexOf("."))return;void 0===Ir(t.replace(/\.[^.]*$/,""),i[0])&&(console.warn(`Path "${t}" used for ${e} does not exist in all of the items, ${e} is disabled.`),s=!1)})),s}function Or(t){return[void 0,null].indexOf(t)>=0?"":isNaN(t)?t.toString():t}function Rr(t,e){return(t=Or(t))<(e=Or(e))?-1:t>e?1:0}const Nr=t=>(e,i)=>{let s=t?[...t]:[];e.filters&&zr(e.filters,"filtering",s)&&(s=function(t,e){return t.filter((t=>e.every((e=>{const i=Or(Ir(e.path,t)),s=Or(e.value).toString().toLowerCase();return i.toString().toLowerCase().includes(s)}))))}(s,e.filters)),Array.isArray(e.sortOrders)&&e.sortOrders.length&&zr(e.sortOrders,"sorting",s)&&(s=function(t,e){return t.sort(((t,i)=>e.map((e=>"asc"===e.direction?Rr(Ir(e.path,t),Ir(e.path,i)):"desc"===e.direction?Rr(Ir(e.path,i),Ir(e.path,t)):0)).reduce(((t,e)=>0!==t?t:e),0)))}(s,e.sortOrders));const r=Math.min(s.length,e.pageSize),o=e.page*r,n=o+r;i(s.slice(o,n),s.length)},kr=t=>class extends t{static get properties(){return{items:Array}}static get observers(){return["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)"]}__setArrayDataProvider(t){const e=Nr(this.items);e.__items=t,this.setProperties({_arrayDataProvider:e,size:t.length,dataProvider:e})}__dataProviderOrItemsChanged(t,e,i){i&&(this._arrayDataProvider?t!==this._arrayDataProvider?this.setProperties({_arrayDataProvider:void 0,items:void 0}):e?this._arrayDataProvider.__items===e?(this.clearCache(),this.size=this._effectiveSize):this.__setArrayDataProvider(e):(this.setProperties({_arrayDataProvider:void 0,dataProvider:void 0,size:0}),this.clearCache()):e&&this.__setArrayDataProvider(e))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const Fr=t=>class extends t{static get properties(){return{columnReorderingAllowed:{type:Boolean,value:!1},_orderBaseScope:{type:Number,value:1e7}}}static get observers(){return["_updateOrders(_columnTree)"]}ready(){super.ready(),ds(this,"track",this._onTrackEvent),this._reorderGhost=this.shadowRoot.querySelector('[part="reorder-ghost"]'),this.addEventListener("touchstart",this._onTouchStart.bind(this)),this.addEventListener("touchmove",this._onTouchMove.bind(this)),this.addEventListener("touchend",this._onTouchEnd.bind(this)),this.addEventListener("contextmenu",this._onContextMenu.bind(this))}_onContextMenu(t){this.hasAttribute("reordering")&&(t.preventDefault(),vr||this._onTrackEnd())}_onTouchStart(t){this._startTouchReorderTimeout=setTimeout((()=>{this._onTrackStart({detail:{x:t.touches[0].clientX,y:t.touches[0].clientY}})}),100)}_onTouchMove(t){this._draggedColumn&&t.preventDefault(),clearTimeout(this._startTouchReorderTimeout)}_onTouchEnd(){clearTimeout(this._startTouchReorderTimeout),this._onTrackEnd()}_onTrackEvent(t){if("start"===t.detail.state){const e=t.composedPath(),i=e[e.indexOf(this.$.header)-2];if(!i||!i._content)return;if(i._content.contains(this.getRootNode().activeElement))return;if(this.$.scroller.hasAttribute("column-resizing"))return;this._touchDevice||this._onTrackStart(t)}else"track"===t.detail.state?this._onTrack(t):"end"===t.detail.state&&this._onTrackEnd(t)}_onTrackStart(t){if(!this.columnReorderingAllowed)return;const e=t.composedPath&&t.composedPath();if(e&&e.some((t=>t.hasAttribute&&t.hasAttribute("draggable"))))return;const i=this._cellFromPoint(t.detail.x,t.detail.y);if(i&&i.getAttribute("part").includes("header-cell")){for(this.toggleAttribute("reordering",!0),this._draggedColumn=i._column;1===this._draggedColumn.parentElement.childElementCount;)this._draggedColumn=this._draggedColumn.parentElement;this._setSiblingsReorderStatus(this._draggedColumn,"allowed"),this._draggedColumn._reorderStatus="dragging",this._updateGhost(i),this._reorderGhost.style.visibility="visible",this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._autoScroller()}}_onTrack(t){if(!this._draggedColumn)return;const e=this._cellFromPoint(t.detail.x,t.detail.y);if(!e)return;const i=this._getTargetColumn(e,this._draggedColumn);if(this._isSwapAllowed(this._draggedColumn,i)&&this._isSwappableByPosition(i,t.detail.x)){const t=this._columnTree.findIndex((t=>t.includes(i))),e=this._getColumnsInOrder(t),s=e.indexOf(this._draggedColumn),r=e.indexOf(i),o=s<r?1:-1;for(let t=s;t!==r;t+=o)this._swapColumnOrders(this._draggedColumn,e[t+o])}this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._lastDragClientX=t.detail.x}_onTrackEnd(){this._draggedColumn&&(this.toggleAttribute("reordering",!1),this._draggedColumn._reorderStatus="",this._setSiblingsReorderStatus(this._draggedColumn,""),this._draggedColumn=null,this._lastDragClientX=null,this._reorderGhost.style.visibility="hidden",this.dispatchEvent(new CustomEvent("column-reorder",{detail:{columns:this._getColumnsInOrder()}})))}_getColumnsInOrder(t=this._columnTree.length-1){return this._columnTree[t].filter((t=>!t.hidden)).sort(((t,e)=>t._order-e._order))}_cellFromPoint(t,e){t=t||0,e=e||0,this._draggedColumn||this.$.scroller.toggleAttribute("no-content-pointer-events",!0);const i=this.shadowRoot.elementFromPoint(t,e);if(this.$.scroller.toggleAttribute("no-content-pointer-events",!1),i&&i._column)return i}_updateGhostPosition(t,e){const i=this._reorderGhost.getBoundingClientRect(),s=t-i.width/2,r=e-i.height/2,o=parseInt(this._reorderGhost._left||0),n=parseInt(this._reorderGhost._top||0);this._reorderGhost._left=o-(i.left-s),this._reorderGhost._top=n-(i.top-r),this._reorderGhost.style.transform=`translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`}_updateGhost(t){const e=this._reorderGhost;e.textContent=t._content.innerText;const i=window.getComputedStyle(t);return["boxSizing","display","width","height","background","alignItems","padding","border","flex-direction","overflow"].forEach((t=>{e.style[t]=i[t]})),e}_updateOrders(t){void 0!==t&&(t[0].forEach((t=>{t._order=0})),function(t,e,i){let s=1;t.forEach((t=>{s%10==0&&(s+=1),t._order=i+s*e,s+=1}))}(t[0],this._orderBaseScope,0))}_setSiblingsReorderStatus(t,e){Array.from(t.parentNode.children).filter((e=>/column/.test(e.localName)&&this._isSwapAllowed(e,t))).forEach((t=>{t._reorderStatus=e}))}_autoScroller(){if(this._lastDragClientX){const t=this._lastDragClientX-this.getBoundingClientRect().right+50,e=this.getBoundingClientRect().left-this._lastDragClientX+50;t>0?this.$.table.scrollLeft+=t/10:e>0&&(this.$.table.scrollLeft-=e/10)}this._draggedColumn&&setTimeout((()=>this._autoScroller()),10)}_isSwapAllowed(t,e){if(t&&e){const i=t!==e,s=t.parentElement===e.parentElement,r=t.frozen&&e.frozen||t.frozenToEnd&&e.frozenToEnd||!t.frozen&&!t.frozenToEnd&&!e.frozen&&!e.frozenToEnd;return i&&s&&r}}_isSwappableByPosition(t,e){const i=Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find((e=>t.contains(e._column))),s=this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(),r=i.getBoundingClientRect();return r.left>s.left?e>r.right-s.width:e<r.left+s.width}_swapColumnOrders(t,e){[t._order,e._order]=[e._order,t._order],this._debounceUpdateFrozenColumn(),this._updateFirstAndLastColumn()}_getTargetColumn(t,e){if(t&&e){let i=t._column;for(;i.parentElement!==e.parentElement&&i!==this;)i=i.parentElement;return i.parentElement===e.parentElement?i:t._column}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Lr=t=>class extends t{ready(){super.ready();const t=this.$.scroller;ds(t,"track",this._onHeaderTrack.bind(this)),t.addEventListener("touchmove",(e=>t.hasAttribute("column-resizing")&&e.preventDefault())),t.addEventListener("contextmenu",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault())),t.addEventListener("mousedown",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault()))}_onHeaderTrack(t){const e=t.target;if("resize-handle"===e.getAttribute("part")){let i=e.parentElement._column;for(this.$.scroller.toggleAttribute("column-resizing",!0);"vaadin-grid-column-group"===i.localName;)i=i._childColumns.slice(0).sort(((t,e)=>t._order-e._order)).filter((t=>!t.hidden)).pop();const s=t.detail.x,r=Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')),o=r.find((t=>t._column===i));if(o.offsetWidth){const t=getComputedStyle(o._content),e=10+parseInt(t.paddingLeft)+parseInt(t.paddingRight)+parseInt(t.borderLeftWidth)+parseInt(t.borderRightWidth)+parseInt(t.marginLeft)+parseInt(t.marginRight);let r;const n=o.offsetWidth,a=o.getBoundingClientRect();r=o.hasAttribute("frozen-to-end")?n+(this.__isRTL?s-a.right:a.left-s):n+(this.__isRTL?a.left-s:s-a.right),i.width=`${Math.max(e,r)}px`,i.flexGrow=0}r.sort(((t,e)=>t._column._order-e._column._order)).forEach(((t,e,i)=>{e<i.indexOf(o)&&(t._column.width=`${t.offsetWidth}px`,t._column.flexGrow=0)}));const n=this._frozenToEndCells[0];if(n&&this.$.table.scrollWidth>this.$.table.offsetWidth){const t=n.getBoundingClientRect(),e=s-(this.__isRTL?t.right:t.left);(this.__isRTL&&e<=0||!this.__isRTL&&e>=0)&&(this.$.table.scrollLeft+=e)}"end"===t.detail.state&&(this.$.scroller.toggleAttribute("column-resizing",!1),this.dispatchEvent(new CustomEvent("column-resize",{detail:{resizedColumn:i}}))),this._resizeHandler()}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,$r=class t{constructor(t,e,i){this.grid=t,this.parentCache=e,this.parentItem=i,this.itemCaches={},this.items={},this.effectiveSize=0,this.size=0,this.pendingRequests={}}isLoading(){return Boolean(Object.keys(this.pendingRequests).length||Object.keys(this.itemCaches).filter((t=>this.itemCaches[t].isLoading()))[0])}getItemForIndex(t){const{cache:e,scaledIndex:i}=this.getCacheAndIndex(t);return e.items[i]}updateSize(){this.effectiveSize=!this.parentItem||this.grid._isExpanded(this.parentItem)?this.size+Object.keys(this.itemCaches).reduce(((t,e)=>{const i=this.itemCaches[e];return i.updateSize(),t+i.effectiveSize}),0):0}ensureSubCacheForScaledIndex(e){if(!this.itemCaches[e]){const i=new t(this.grid,this,this.items[e]);this.itemCaches[e]=i,this.grid._loadPage(0,i)}}getCacheAndIndex(t){let e=t;const i=Object.keys(this.itemCaches);for(let t=0;t<i.length;t++){const s=Number(i[t]),r=this.itemCaches[s];if(e<=s)return{cache:this,scaledIndex:e};if(e<=s+r.effectiveSize)return r.getCacheAndIndex(e-s-1);e-=r.effectiveSize}return{cache:this,scaledIndex:e}}},Dr=t=>class extends t{static get properties(){return{size:{type:Number,notify:!0},pageSize:{type:Number,value:50,observer:"_pageSizeChanged"},dataProvider:{type:Object,notify:!0,observer:"_dataProviderChanged"},loading:{type:Boolean,notify:!0,readOnly:!0,reflectToAttribute:!0},_cache:{type:Object,value(){return new $r(this)}},_hasData:{type:Boolean,value:!1},itemHasChildrenPath:{type:String,value:"children"},itemIdPath:{type:String,value:null},expandedItems:{type:Object,notify:!0,value:()=>[]},__expandedKeys:{type:Object,computed:"__computeExpandedKeys(itemIdPath, expandedItems.*)"}}}static get observers(){return["_sizeChanged(size)","_expandedItemsChanged(expandedItems.*)"]}_sizeChanged(t){const e=t-this._cache.size;this._cache.size+=e,this._cache.effectiveSize+=e,this._effectiveSize=this._cache.effectiveSize}_getItem(t,e){if(t>=this._effectiveSize)return;e.index=t;const{cache:i,scaledIndex:s}=this._cache.getCacheAndIndex(t),r=i.items[s];r?(e.toggleAttribute("loading",!1),this._updateItem(e,r),this._isExpanded(r)&&i.ensureSubCacheForScaledIndex(s)):(e.toggleAttribute("loading",!0),this._loadPage(this._getPageForIndex(s),i))}getItemId(t){return this.itemIdPath?this.get(this.itemIdPath,t):t}_isExpanded(t){return this.__expandedKeys.has(this.getItemId(t))}_expandedItemsChanged(){this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,this.__updateVisibleRows()}__computeExpandedKeys(t,e){const i=e.base||[],s=new Set;return i.forEach((t=>{s.add(this.getItemId(t))})),s}expandItem(t){this._isExpanded(t)||(this.expandedItems=[...this.expandedItems,t])}collapseItem(t){this._isExpanded(t)&&(this.expandedItems=this.expandedItems.filter((e=>!this._itemsEqual(e,t))))}_getIndexLevel(t){let{cache:e}=this._cache.getCacheAndIndex(t),i=0;for(;e.parentCache;)e=e.parentCache,i+=1;return i}_loadPage(t,e){if(!e.pendingRequests[t]&&this.dataProvider){this._setLoading(!0),e.pendingRequests[t]=!0;const i={page:t,pageSize:this.pageSize,sortOrders:this._mapSorters(),filters:this._mapFilters(),parentItem:e.parentItem};this.dataProvider(i,((s,r)=>{void 0!==r?e.size=r:i.parentItem&&(e.size=s.length);const o=Array.from(this.$.items.children).map((t=>t._item));s.forEach(((i,s)=>{const r=t*this.pageSize+s;e.items[r]=i,this._isExpanded(i)&&o.indexOf(i)>-1&&e.ensureSubCacheForScaledIndex(r)})),this._hasData=!0,delete e.pendingRequests[t],this._debouncerApplyCachedData=Es.debounce(this._debouncerApplyCachedData,Li.after(0),(()=>{this._setLoading(!1),this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._cache.getItemForIndex(t.index)&&this._getItem(t.index,t)})),this.__scrollToPendingIndex(),this.__dispatchPendingBodyCellFocus()})),this._cache.isLoading()||this._debouncerApplyCachedData.flush(),this.__itemsReceived()}))}}_getPageForIndex(t){return Math.floor(t/this.pageSize)}clearCache(){this._cache=new $r(this),this._cache.size=this.size||0,this._cache.updateSize(),this._hasData=!1,this.__updateVisibleRows(),this._effectiveSize||this._loadPage(0,this._cache)}_pageSizeChanged(t,e){void 0!==e&&t!==e&&this.clearCache()}_checkSize(){void 0===this.size&&0===this._effectiveSize&&console.warn("The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.")}_dataProviderChanged(t,e){void 0!==e&&this.clearCache(),this._ensureFirstPageLoaded(),this._debouncerCheckSize=Es.debounce(this._debouncerCheckSize,Li.after(2e3),this._checkSize.bind(this))}_ensureFirstPageLoaded(){this._hasData||this._loadPage(0,this._cache)}_itemsEqual(t,e){return this.getItemId(t)===this.getItemId(e)}_getItemIndexInArray(t,e){let i=-1;return e.forEach(((e,s)=>{this._itemsEqual(e,t)&&(i=s)})),i}scrollToIndex(t){super.scrollToIndex(t),isNaN(t)||!this._cache.isLoading()&&this.clientHeight||(this.__pendingScrollToIndex=t)}__scrollToPendingIndex(){if(this.__pendingScrollToIndex&&this.$.items.children.length){const t=this.__pendingScrollToIndex;delete this.__pendingScrollToIndex,this.scrollToIndex(t)}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Mr="between",Hr="on-top-or-between",Br="on-grid",Vr="on-top",Ur="above",Gr="below",Wr="empty",jr=!("draggable"in document.createElement("div")),Yr=t=>class extends t{static get properties(){return{dropMode:String,rowsDraggable:Boolean,dragFilter:Function,dropFilter:Function,__dndAutoScrollThreshold:{value:50}}}static get observers(){return["_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)"]}ready(){super.ready(),this.$.table.addEventListener("dragstart",this._onDragStart.bind(this)),this.$.table.addEventListener("dragend",this._onDragEnd.bind(this)),this.$.table.addEventListener("dragover",this._onDragOver.bind(this)),this.$.table.addEventListener("dragleave",this._onDragLeave.bind(this)),this.$.table.addEventListener("drop",this._onDrop.bind(this)),this.$.table.addEventListener("dragenter",(t=>{this.dropMode&&(t.preventDefault(),t.stopPropagation())}))}_onDragStart(t){if(this.rowsDraggable){let e=t.target;if("vaadin-grid-cell-content"===e.localName&&(e=e.assignedSlot.parentNode.parentNode),e.parentNode!==this.$.items)return;if(t.stopPropagation(),this.toggleAttribute("dragging-rows",!0),this._safari){const t=e.style.transform;e.style.top=/translateY\((.*)\)/.exec(t)[1],e.style.transform="none",requestAnimationFrame((()=>{e.style.top="",e.style.transform=t}))}const i=e.getBoundingClientRect();jr?t.dataTransfer.setDragImage(e):t.dataTransfer.setDragImage(e,t.clientX-i.left,t.clientY-i.top);let s=[e];this._isSelected(e._item)&&(s=this.__getViewportRows().filter((t=>this._isSelected(t._item))).filter((t=>!this.dragFilter||this.dragFilter(this.__getRowModel(t))))),t.dataTransfer.setData("text",this.__formatDefaultTransferData(s)),e.setAttribute("dragstart",s.length>1?s.length:""),this.style.setProperty("--_grid-drag-start-x",t.clientX-i.left+20+"px"),this.style.setProperty("--_grid-drag-start-y",t.clientY-i.top+10+"px"),requestAnimationFrame((()=>{e.removeAttribute("dragstart"),this.updateStyles({"--_grid-drag-start-x":"","--_grid-drag-start-y":""})}));const r=new CustomEvent("grid-dragstart",{detail:{draggedItems:s.map((t=>t._item)),setDragData:(e,i)=>t.dataTransfer.setData(e,i),setDraggedItemsCount:t=>e.setAttribute("dragstart",t)}});r.originalEvent=t,this.dispatchEvent(r)}}_onDragEnd(t){this.toggleAttribute("dragging-rows",!1),t.stopPropagation();const e=new CustomEvent("grid-dragend");e.originalEvent=t,this.dispatchEvent(e)}_onDragLeave(t){t.stopPropagation(),this._clearDragStyles()}_onDragOver(t){if(this.dropMode){if(this._dropLocation=void 0,this._dragOverItem=void 0,this.__dndAutoScroll(t.clientY))return void this._clearDragStyles();let e=t.composedPath().find((t=>"tr"===t.localName));if(this._effectiveSize&&this.dropMode!==Br)if(e&&e.parentNode===this.$.items){const i=e.getBoundingClientRect();if(this._dropLocation=Vr,this.dropMode===Mr){const e=t.clientY-i.top<i.bottom-t.clientY;this._dropLocation=e?Ur:Gr}else this.dropMode===Hr&&(t.clientY-i.top<i.height/3?this._dropLocation=Ur:t.clientY-i.top>i.height/3*2&&(this._dropLocation=Gr))}else{if(e)return;if(this.dropMode!==Mr&&this.dropMode!==Hr)return;e=Array.from(this.$.items.children).filter((t=>!t.hidden)).pop(),this._dropLocation=Gr}else this._dropLocation=Wr;if(e&&e.hasAttribute("drop-disabled"))return void(this._dropLocation=void 0);t.stopPropagation(),t.preventDefault(),this._dropLocation===Wr?this.toggleAttribute("dragover",!0):e?(this._dragOverItem=e._item,e.getAttribute("dragover")!==this._dropLocation&&e.setAttribute("dragover",this._dropLocation)):this._clearDragStyles()}}__dndAutoScroll(t){if(this.__dndAutoScrolling)return!0;const e=this.$.header.getBoundingClientRect().bottom,i=this.$.footer.getBoundingClientRect().top,s=e-t+this.__dndAutoScrollThreshold,r=t-i+this.__dndAutoScrollThreshold;let o=0;if(r>0?o=2*r:s>0&&(o=2*-s),o){const t=this.$.table.scrollTop;this.$.table.scrollTop+=o;if(t!==this.$.table.scrollTop)return this.__dndAutoScrolling=!0,setTimeout((()=>{this.__dndAutoScrolling=!1}),20),!0}}__getViewportRows(){const t=this.$.header.getBoundingClientRect().bottom,e=this.$.footer.getBoundingClientRect().top;return Array.from(this.$.items.children).filter((i=>{const s=i.getBoundingClientRect();return s.bottom>t&&s.top<e}))}_clearDragStyles(){this.removeAttribute("dragover"),Array.from(this.$.items.children).forEach((t=>t.removeAttribute("dragover")))}_onDrop(t){if(this.dropMode){t.stopPropagation(),t.preventDefault();const e=t.dataTransfer.types&&Array.from(t.dataTransfer.types).map((e=>({type:e,data:t.dataTransfer.getData(e)})));this._clearDragStyles();const i=new CustomEvent("grid-drop",{bubbles:t.bubbles,cancelable:t.cancelable,detail:{dropTargetItem:this._dragOverItem,dropLocation:this._dropLocation,dragData:e}});i.originalEvent=t,this.dispatchEvent(i)}}__formatDefaultTransferData(t){return t.map((t=>Array.from(t.children).filter((t=>!t.hidden&&-1===t.getAttribute("part").indexOf("details-cell"))).sort(((t,e)=>t._column._order>e._column._order?1:-1)).map((t=>t._content.textContent.trim())).filter((t=>t)).join("\t"))).join("\n")}_dragDropAccessChanged(){this.filterDragAndDrop()}filterDragAndDrop(){Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._filterDragAndDrop(t,this.__getRowModel(t))}))}_filterDragAndDrop(t,e){const i=this.loading||t.hasAttribute("loading"),s=!this.rowsDraggable||i||this.dragFilter&&!this.dragFilter(e),r=!this.dropMode||i||this.dropFilter&&!this.dropFilter(e);Array.from(t.children).map((t=>t._content)).forEach((t=>{s?t.removeAttribute("draggable"):t.setAttribute("draggable",!0)})),t.toggleAttribute("drag-disabled",!!s),t.toggleAttribute("drop-disabled",!!r)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;function qr(t,e){if(!t||!e||t.length!==e.length)return!1;for(let i=0,s=t.length;i<s;i++)if(t[i]instanceof Array&&e[i]instanceof Array){if(!qr(t[i],e[i]))return!1}else if(t[i]!==e[i])return!1;return!0}const Kr=t=>class extends t{static get properties(){return{_columnTree:Object}}ready(){super.ready(),this._addNodeObserver()}_hasColumnGroups(t){for(let e=0;e<t.length;e++)if("vaadin-grid-column-group"===t[e].localName)return!0;return!1}_getChildColumns(t){return b.getFlattenedNodes(t).filter(this._isColumnElement)}_flattenColumnGroups(t){return t.map((t=>"vaadin-grid-column-group"===t.localName?this._getChildColumns(t):[t])).reduce(((t,e)=>t.concat(e)),[])}_getColumnTree(){const t=b.getFlattenedNodes(this).filter(this._isColumnElement),e=[t];let i=t;for(;this._hasColumnGroups(i);)i=this._flattenColumnGroups(i),e.push(i);return e}_updateColumnTree(){const t=this._getColumnTree();qr(t,this._columnTree)||(this._columnTree=t)}_addNodeObserver(){this._observer=new b(this,(t=>{const e=t=>t.filter(this._isColumnElement).length>0;if(e(t.addedNodes)||e(t.removedNodes)){const e=t.removedNodes.flatMap((t=>t._allCells)),i=t=>e.filter((e=>e&&e._content.contains(t))).length;this.__removeSorters(this._sorters.filter(i)),this.__removeFilters(this._filters.filter(i)),this._updateColumnTree()}this._debouncerCheckImports=Es.debounce(this._debouncerCheckImports,Li.after(2e3),this._checkImports.bind(this)),this._ensureFirstPageLoaded()}))}_checkImports(){["vaadin-grid-column-group","vaadin-grid-filter","vaadin-grid-filter-column","vaadin-grid-tree-toggle","vaadin-grid-selection-column","vaadin-grid-sort-column","vaadin-grid-sorter"].forEach((t=>{const e=this.querySelector(t);!e||e instanceof Ti||console.warn(`Make sure you have imported the required module for <${t}> element.`)}))}_updateFirstAndLastColumn(){Array.from(this.shadowRoot.querySelectorAll("tr")).forEach((t=>this._updateFirstAndLastColumnForRow(t)))}_updateFirstAndLastColumnForRow(t){Array.from(t.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort(((t,e)=>t._column._order-e._column._order)).forEach(((t,e,i)=>{t.toggleAttribute("first-column",0===e),t.toggleAttribute("last-column",e===i.length-1)}))}_isColumnElement(t){return t.nodeType===Node.ELEMENT_NODE&&/\bcolumn\b/.test(t.localName)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Zr=t=>class extends t{getEventContext(t){const e={},i=t.__composedPath||t.composedPath(),s=i[i.indexOf(this.$.table)-3];return s?(e.section=["body","header","footer","details"].find((t=>s.getAttribute("part").indexOf(t)>-1)),s._column&&(e.column=s._column),"body"!==e.section&&"details"!==e.section||Object.assign(e,this.__getRowModel(s.parentElement)),e):e}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Jr=t=>class extends t{static get properties(){return{_filters:{type:Array,value:()=>[]}}}ready(){super.ready(),this.addEventListener("filter-changed",this._filterChanged.bind(this))}_filterChanged(t){t.stopPropagation(),this.__addFilter(t.target),this.__applyFilters()}__removeFilters(t){0!==t.length&&(this._filters=this._filters.filter((e=>t.indexOf(e)<0)),this.__applyFilters())}__addFilter(t){-1===this._filters.indexOf(t)&&this._filters.push(t)}__applyFilters(){this.dataProvider&&this.isAttached&&this.clearCache()}_mapFilters(){return this._filters.map((t=>({path:t.path,value:t.value})))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;function Xr(t){return t?new Set(t.split(" ")):new Set}function Qr(t){return[...t].join(" ")}function to(t,e,i){const s=Xr(t.getAttribute(e));s.add(i),t.setAttribute(e,Qr(s))}function eo(t,e,i){const s=Xr(t.getAttribute(e));s.delete(i),0!==s.size?t.setAttribute(e,Qr(s)):t.removeAttribute(e)}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const io=t=>class extends t{static get properties(){return{_headerFocusable:{type:Object,observer:"_focusableChanged"},_itemsFocusable:{type:Object,observer:"_focusableChanged"},_footerFocusable:{type:Object,observer:"_focusableChanged"},_navigatingIsHidden:Boolean,_focusedItemIndex:{type:Number,value:0},_focusedColumnOrder:Number,_focusedCell:{type:Object,observer:"_focusedCellChanged"},interacting:{type:Boolean,value:!1,reflectToAttribute:!0,readOnly:!0,observer:"_interactingChanged"}}}ready(){super.ready(),this._ios||this._android||(this.addEventListener("keydown",this._onKeyDown),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("focusin",this._onFocusIn),this.addEventListener("focusout",this._onFocusOut),this.$.table.addEventListener("focusin",this._onContentFocusIn.bind(this)),this.addEventListener("mousedown",(()=>{this.toggleAttribute("navigating",!1),this._isMousedown=!0,this._focusedColumnOrder=void 0})),this.addEventListener("mouseup",(()=>{this._isMousedown=!1})))}get __rowFocusMode(){return this.__isRow(this._itemsFocusable)||this.__isRow(this._headerFocusable)||this.__isRow(this._footerFocusable)}set __rowFocusMode(t){["_itemsFocusable","_footerFocusable","_headerFocusable"].forEach((e=>{const i=this[e];if(t){const t=i&&i.parentElement;this.__isCell(i)?this[e]=t:this.__isCell(t)&&(this[e]=t.parentElement)}else if(!t&&this.__isRow(i)){const t=i.firstElementChild;this[e]=t._focusButton||t}}))}_focusableChanged(t,e){e&&e.setAttribute("tabindex","-1"),t&&this._updateGridSectionFocusTarget(t)}_focusedCellChanged(t,e){e&&eo(e,"part","focused-cell"),t&&to(t,"part","focused-cell")}_interactingChanged(){this._updateGridSectionFocusTarget(this._headerFocusable),this._updateGridSectionFocusTarget(this._itemsFocusable),this._updateGridSectionFocusTarget(this._footerFocusable)}__updateItemsFocusable(){if(!this._itemsFocusable)return;const t=this.shadowRoot.activeElement===this._itemsFocusable;this._getVisibleRows().forEach((t=>{if(t.index===this._focusedItemIndex)if(this.__rowFocusMode)this._itemsFocusable=t;else{let e=this._itemsFocusable.parentElement,i=this._itemsFocusable;if(e){this.__isCell(e)&&(i=e,e=e.parentElement);const s=[...e.children].indexOf(i);this._itemsFocusable=this.__getFocusable(t,t.children[s])}}})),t&&this._itemsFocusable.focus()}_onKeyDown(t){const e=t.key;let i;switch(e){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"PageUp":case"PageDown":case"Home":case"End":i="Navigation";break;case"Enter":case"Escape":case"F2":i="Interaction";break;case"Tab":i="Tab";break;case" ":i="Space"}this._detectInteracting(t),this.interacting&&"Interaction"!==i&&(i=void 0),i&&this[`_on${i}KeyDown`](t,e)}_ensureScrolledToIndex(t){[...this.$.items.children].find((e=>e.index===t))?this.__scrollIntoViewport(t):this.scrollToIndex(t)}__isRowExpandable(t){if(this.itemHasChildrenPath){const e=t._item;return e&&this.get(this.itemHasChildrenPath,e)&&!this._isExpanded(e)}}__isRowCollapsible(t){return this._isExpanded(t._item)}__isDetailsCell(t){return t.matches('[part~="details-cell"]')}__isCell(t){return t instanceof HTMLTableCellElement}__isRow(t){return t instanceof HTMLTableRowElement}__getIndexOfChildElement(t){return Array.prototype.indexOf.call(t.parentNode.children,t)}_onNavigationKeyDown(t,e){t.preventDefault();const i=this._lastVisibleIndex-this._firstVisibleIndex-1;let s=0,r=0;switch(e){case"ArrowRight":s=this.__isRTL?-1:1;break;case"ArrowLeft":s=this.__isRTL?1:-1;break;case"Home":this.__rowFocusMode||t.ctrlKey?r=-1/0:s=-1/0;break;case"End":this.__rowFocusMode||t.ctrlKey?r=1/0:s=1/0;break;case"ArrowDown":r=1;break;case"ArrowUp":r=-1;break;case"PageDown":r=i;break;case"PageUp":r=-i}const o=t.composedPath().find((t=>this.__isRow(t))),n=t.composedPath().find((t=>this.__isCell(t)));if(this.__rowFocusMode&&!o||!this.__rowFocusMode&&!n)return;const a=this.__isRTL?"ArrowLeft":"ArrowRight",l=this.__isRTL?"ArrowRight":"ArrowLeft";if(e===a){if(this.__rowFocusMode)return this.__isRowExpandable(o)?void this.expandItem(o._item):(this.__rowFocusMode=!1,void this._onCellNavigation(o.firstElementChild,0,0))}else if(e===l)if(this.__rowFocusMode){if(this.__isRowCollapsible(o))return void this.collapseItem(o._item)}else{const t=[...o.children].sort(((t,e)=>t._order-e._order));if(n===t[0]||this.__isDetailsCell(n))return this.__rowFocusMode=!0,void this._onRowNavigation(o,0)}this.__rowFocusMode?this._onRowNavigation(o,r):this._onCellNavigation(n,s,r)}_onRowNavigation(t,e){const{dstRow:i}=this.__navigateRows(e,t);i&&i.focus()}__getIndexInGroup(t,e){return t.parentNode===this.$.items?void 0!==e?e:t.index:this.__getIndexOfChildElement(t)}__navigateRows(t,e,i){const s=this.__getIndexInGroup(e,this._focusedItemIndex),r=e.parentNode,o=(r===this.$.items?this._effectiveSize:r.children.length)-1;let n=Math.max(0,Math.min(s+t,o));if(r!==this.$.items){if(n>s)for(;n<o&&r.children[n].hidden;)n+=1;else if(n<s)for(;n>0&&r.children[n].hidden;)n-=1;return this.toggleAttribute("navigating",!0),{dstRow:r.children[n]}}let a=!1;if(i){const o=this.__isDetailsCell(i);if(r===this.$.items){const i=e._item,r=this._cache.getItemForIndex(n);a=o?0===t:1===t&&this._isDetailsOpened(i)||-1===t&&n!==s&&this._isDetailsOpened(r),a!==o&&(1===t&&a||-1===t&&!a)&&(n=s)}}return this._ensureScrolledToIndex(n),this._focusedItemIndex=n,this.toggleAttribute("navigating",!0),{dstRow:[...r.children].find((t=>!t.hidden&&t.index===n)),dstIsRowDetails:a}}_onCellNavigation(t,e,i){const s=t.parentNode,{dstRow:r,dstIsRowDetails:o}=this.__navigateRows(i,s,t);if(!r)return;const n=this.__getIndexOfChildElement(t),a=this.__isDetailsCell(t),l=s.parentNode,d=this.__getIndexInGroup(s,this._focusedItemIndex);if(void 0===this._focusedColumnOrder&&(this._focusedColumnOrder=a?0:this._getColumns(l,d).filter((t=>!t.hidden))[n]._order),o){[...r.children].find((t=>this.__isDetailsCell(t))).focus()}else{const t=this.__getIndexInGroup(r,this._focusedItemIndex),s=this._getColumns(l,t).filter((t=>!t.hidden)),o=s.map((t=>t._order)).sort(((t,e)=>t-e)),n=o.length-1,d=o.indexOf(o.slice(0).sort(((t,e)=>Math.abs(t-this._focusedColumnOrder)-Math.abs(e-this._focusedColumnOrder)))[0]),h=0===i&&a?d:Math.max(0,Math.min(d+e,n));h!==d&&(this._focusedColumnOrder=void 0);const c=s.reduce(((t,e,i)=>(t[e._order]=i,t)),{}),u=c[o[h]],_=r.children[u];this._scrollHorizontallyToCell(_),_.focus()}}_onInteractionKeyDown(t,e){const i=t.composedPath()[0],s="input"===i.localName&&!/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(i.type);let r;switch(e){case"Enter":r=!this.interacting||!s;break;case"Escape":r=!1;break;case"F2":r=!this.interacting}const{cell:o}=this._getGridEventLocation(t);if(this.interacting!==r&&null!==o)if(r){const e=o._content.querySelector("[focus-target]")||[...o._content.querySelectorAll("*")].find((t=>this._isFocusable(t)));e&&(t.preventDefault(),e.focus(),this._setInteracting(!0),this.toggleAttribute("navigating",!1))}else t.preventDefault(),this._focusedColumnOrder=void 0,o.focus(),this._setInteracting(!1),this.toggleAttribute("navigating",!0);"Escape"===e&&this._hideTooltip(!0)}_predictFocusStepTarget(t,e){const i=[this.$.table,this._headerFocusable,this._itemsFocusable,this._footerFocusable,this.$.focusexit];let s=i.indexOf(t);for(s+=e;s>=0&&s<=i.length-1;){let t=i[s];if(t&&!this.__rowFocusMode&&(t=i[s].parentNode),t&&!t.hidden)break;s+=e}let r=i[s];if(r&&!this.__isHorizontallyInViewport(r)){const t=this._getColumnsInOrder().find((t=>this.__isColumnInViewport(t)));if(t)if(r===this._headerFocusable)r=t._headerCell;else if(r===this._itemsFocusable){const e=r._column._cells.indexOf(r);r=t._cells[e]}else r===this._footerFocusable&&(r=t._footerCell)}return r}__isColumnInViewport(t){return!(!t.frozen&&!t.frozenToEnd)||this.__isHorizontallyInViewport(t._sizerCell)}__isHorizontallyInViewport(t){return t.offsetLeft+t.offsetWidth>=this._scrollLeft&&t.offsetLeft<=this._scrollLeft+this.clientWidth}_onTabKeyDown(t){const e=this._predictFocusStepTarget(t.composedPath()[0],t.shiftKey?-1:1);if(e){if(t.stopPropagation(),e===this.$.table)this.$.table.focus();else if(e===this.$.focusexit)this.$.focusexit.focus();else if(e===this._itemsFocusable){let i=e;const s=this.__isRow(e)?e:e.parentNode;if(this._ensureScrolledToIndex(this._focusedItemIndex),s.index!==this._focusedItemIndex&&this.__isCell(e)){const t=Array.from(s.children).indexOf(this._itemsFocusable),e=Array.from(this.$.items.children).find((t=>!t.hidden&&t.index===this._focusedItemIndex));e&&(i=e.children[t])}t.preventDefault(),i.focus()}else t.preventDefault(),e.focus();this.toggleAttribute("navigating",!0)}}_onSpaceKeyDown(t){t.preventDefault();const e=t.composedPath()[0],i=this.__isRow(e);!i&&e._content&&e._content.firstElementChild||this.dispatchEvent(new CustomEvent(i?"row-activate":"cell-activate",{detail:{model:this.__getRowModel(i?e:e.parentElement)}}))}_onKeyUp(t){if(!/^( |SpaceBar)$/.test(t.key)||this.interacting)return;t.preventDefault();const e=t.composedPath()[0];if(e._content&&e._content.firstElementChild){const i=this.hasAttribute("navigating");e._content.firstElementChild.dispatchEvent(new MouseEvent("click",{shiftKey:t.shiftKey,bubbles:!0,composed:!0,cancelable:!0})),this.toggleAttribute("navigating",i)}}_onFocusIn(t){this._isMousedown||this.toggleAttribute("navigating",!0);const e=t.composedPath()[0];e===this.$.table||e===this.$.focusexit?(this._isMousedown||this._predictFocusStepTarget(e,e===this.$.table?1:-1).focus(),this._setInteracting(!1)):this._detectInteracting(t)}_onFocusOut(t){this.toggleAttribute("navigating",!1),this._detectInteracting(t),this._hideTooltip(),this._focusedCell=null}_onContentFocusIn(t){const{section:e,cell:i,row:s}=this._getGridEventLocation(t);if(i||this.__rowFocusMode){if(this._detectInteracting(t),e&&(i||s))if(this._activeRowGroup=e,this.$.header===e?this._headerFocusable=this.__getFocusable(s,i):this.$.items===e?this._itemsFocusable=this.__getFocusable(s,i):this.$.footer===e&&(this._footerFocusable=this.__getFocusable(s,i)),i){const e=this.getEventContext(t);this.__pendingBodyCellFocus=this.loading&&"body"===e.section,this.__pendingBodyCellFocus||i.dispatchEvent(new CustomEvent("cell-focus",{bubbles:!0,composed:!0,detail:{context:e}})),this._focusedCell=i._focusButton||i,Us()&&t.target===i&&this._showTooltip(t)}else this._focusedCell=null;this._detectFocusedItemIndex(t)}}__dispatchPendingBodyCellFocus(){this.__pendingBodyCellFocus&&this.shadowRoot.activeElement===this._itemsFocusable&&this._itemsFocusable.dispatchEvent(new Event("focusin",{bubbles:!0,composed:!0}))}__getFocusable(t,e){return this.__rowFocusMode?t:e._focusButton||e}_detectInteracting(t){const e=t.composedPath().some((t=>"vaadin-grid-cell-content"===t.localName));this._setInteracting(e),this.__updateHorizontalScrollPosition()}_detectFocusedItemIndex(t){const{section:e,row:i}=this._getGridEventLocation(t);e===this.$.items&&(this._focusedItemIndex=i.index)}_updateGridSectionFocusTarget(t){if(!t)return;const e=this._getGridSectionFromFocusTarget(t),i=this.interacting&&e===this._activeRowGroup;t.tabIndex=i?-1:0}_preventScrollerRotatingCellFocus(t,e){t.index===this._focusedItemIndex&&this.hasAttribute("navigating")&&this._activeRowGroup===this.$.items&&(this._navigatingIsHidden=!0,this.toggleAttribute("navigating",!1)),e===this._focusedItemIndex&&this._navigatingIsHidden&&(this._navigatingIsHidden=!1,this.toggleAttribute("navigating",!0))}_getColumns(t,e){let i=this._columnTree.length-1;return t===this.$.header?i=e:t===this.$.footer&&(i=this._columnTree.length-1-e),this._columnTree[i]}__isValidFocusable(t){return this.$.table.contains(t)&&t.offsetHeight}_resetKeyboardNavigation(){if(["header","footer"].forEach((t=>{if(!this.__isValidFocusable(this[`_${t}Focusable`])){const e=[...this.$[t].children].find((t=>t.offsetHeight)),i=e?[...e.children].find((t=>!t.hidden)):null;e&&i&&(this[`_${t}Focusable`]=this.__getFocusable(e,i))}})),!this.__isValidFocusable(this._itemsFocusable)&&this.$.items.firstElementChild){const t=this.__getFirstVisibleItem(),e=t?[...t.children].find((t=>!t.hidden)):null;e&&t&&(delete this._focusedColumnOrder,this._itemsFocusable=this.__getFocusable(t,e))}else this.__updateItemsFocusable()}_scrollHorizontallyToCell(t){if(t.hasAttribute("frozen")||t.hasAttribute("frozen-to-end")||this.__isDetailsCell(t))return;const e=t.getBoundingClientRect(),i=t.parentNode,s=Array.from(i.children).indexOf(t),r=this.$.table.getBoundingClientRect();let o=r.left,n=r.right;for(let t=s-1;t>=0;t--){const e=i.children[t];if(!e.hasAttribute("hidden")&&!this.__isDetailsCell(e)&&(e.hasAttribute("frozen")||e.hasAttribute("frozen-to-end"))){o=e.getBoundingClientRect().right;break}}for(let t=s+1;t<i.children.length;t++){const e=i.children[t];if(!e.hasAttribute("hidden")&&!this.__isDetailsCell(e)&&(e.hasAttribute("frozen")||e.hasAttribute("frozen-to-end"))){n=e.getBoundingClientRect().left;break}}e.left<o&&(this.$.table.scrollLeft+=Math.round(e.left-o)),e.right>n&&(this.$.table.scrollLeft+=Math.round(e.right-n))}_getGridEventLocation(t){const e=t.composedPath(),i=e.indexOf(this.$.table);return{section:i>=1?e[i-1]:null,row:i>=2?e[i-2]:null,cell:i>=3?e[i-3]:null}}_getGridSectionFromFocusTarget(t){return t===this._headerFocusable?this.$.header:t===this._itemsFocusable?this.$.items:t===this._footerFocusable?this.$.footer:null}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,so=t=>class extends t{static get properties(){return{detailsOpenedItems:{type:Array,value:()=>[]},rowDetailsRenderer:Function,_detailsCells:{type:Array}}}static get observers(){return["_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)","_rowDetailsRendererChanged(rowDetailsRenderer)"]}ready(){super.ready(),this._detailsCellResizeObserver=new ResizeObserver((t=>{t.forEach((({target:t})=>{this._updateDetailsCellHeight(t.parentElement)})),this.__virtualizer.__adapter._resizeHandler()}))}_rowDetailsRendererChanged(t){t&&this._columnTree&&Array.from(this.$.items.children).forEach((t=>{if(!t.querySelector("[part~=details-cell]")){this._updateRow(t,this._columnTree[this._columnTree.length-1]);const e=this._isDetailsOpened(t._item);this._toggleDetailsCell(t,e)}}))}_detailsOpenedItemsChanged(t,e){"detailsOpenedItems.length"!==t.path&&t.value&&[...this.$.items.children].forEach((t=>{(t.hasAttribute("details-opened")||e&&this._isDetailsOpened(t._item))&&this._updateItem(t,t._item)}))}_configureDetailsCell(t){t.setAttribute("part","cell details-cell"),t.toggleAttribute("frozen",!0),this._detailsCellResizeObserver.observe(t)}_toggleDetailsCell(t,e){const i=t.querySelector('[part~="details-cell"]');i&&(i.hidden=!e,i.hidden||this.rowDetailsRenderer&&(i._renderer=this.rowDetailsRenderer))}_updateDetailsCellHeight(t){const e=t.querySelector('[part~="details-cell"]');e&&(this.__updateDetailsRowPadding(t,e),requestAnimationFrame((()=>this.__updateDetailsRowPadding(t,e))))}__updateDetailsRowPadding(t,e){e.hidden?t.style.removeProperty("padding-bottom"):t.style.setProperty("padding-bottom",`${e.offsetHeight}px`)}_updateDetailsCellHeights(){[...this.$.items.children].forEach((t=>{this._updateDetailsCellHeight(t)}))}_isDetailsOpened(t){return this.detailsOpenedItems&&-1!==this._getItemIndexInArray(t,this.detailsOpenedItems)}openItemDetails(t){this._isDetailsOpened(t)||(this.detailsOpenedItems=[...this.detailsOpenedItems,t])}closeItemDetails(t){this._isDetailsOpened(t)&&(this.detailsOpenedItems=this.detailsOpenedItems.filter((e=>!this._itemsEqual(e,t))))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,ro=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.resizables?t.target.resizables.forEach((e=>{e._onResize(t.contentRect)})):t.target._onResize(t.contentRect)}))}))})),oo=y((t=>class extends t{connectedCallback(){if(super.connectedCallback(),ro.observe(this),this._observeParent){const t=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;t.resizables||(t.resizables=new Set,ro.observe(t)),t.resizables.add(this),this.__parent=t}}disconnectedCallback(){super.disconnectedCallback(),ro.unobserve(this);const t=this.__parent;if(this._observeParent&&t){const e=t.resizables;e&&(e.delete(this),0===e.size&&ro.unobserve(t)),this.__parent=null}}get _observeParent(){return!1}_onResize(t){}notifyResize(){console.warn("WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}})),no=500,ao=t=>class extends(oo(t)){static get properties(){return{_frozenCells:{type:Array,value:()=>[]},_frozenToEndCells:{type:Array,value:()=>[]},_rowWithFocusedElement:Element}}get _scrollTop(){return this.$.table.scrollTop}set _scrollTop(t){this.$.table.scrollTop=t}get _scrollLeft(){return this.$.table.scrollLeft}ready(){super.ready(),this.scrollTarget=this.$.table,this.$.items.addEventListener("focusin",(t=>{const e=t.composedPath().indexOf(this.$.items);this._rowWithFocusedElement=t.composedPath()[e-1]})),this.$.items.addEventListener("focusout",(()=>{this._rowWithFocusedElement=void 0})),this.$.table.addEventListener("scroll",(()=>this._afterScroll()))}_onResize(){if(this._updateOverflow(),this.__updateHorizontalScrollPosition(),this._firefox){const t=!Gs(this);t&&!1===this.__previousVisible&&(this._scrollTop=this.__memorizedScrollTop||0),this.__previousVisible=t}}scrollToIndex(t){t=Math.min(this._effectiveSize-1,Math.max(0,t)),this.__virtualizer.scrollToIndex(t),this.__scrollIntoViewport(t)}__scrollIntoViewport(t){const e=[...this.$.items.children].find((e=>e.index===t));if(e){const t=e.getBoundingClientRect(),i=this.$.footer.getBoundingClientRect().top,s=this.$.header.getBoundingClientRect().bottom;t.bottom>i?this.$.table.scrollTop+=t.bottom-i:t.top<s&&(this.$.table.scrollTop-=s-t.top)}}_scheduleScrolling(){this._scrollingFrame||(this._scrollingFrame=requestAnimationFrame((()=>this.$.scroller.toggleAttribute("scrolling",!0)))),this._debounceScrolling=Es.debounce(this._debounceScrolling,Li.after(no),(()=>{cancelAnimationFrame(this._scrollingFrame),delete this._scrollingFrame,this.$.scroller.toggleAttribute("scrolling",!1)}))}_afterScroll(){if(this.__updateHorizontalScrollPosition(),this.hasAttribute("reordering")||this._scheduleScrolling(),this.hasAttribute("navigating")||this._hideTooltip(!0),this._updateOverflow(),this._firefox){!Gs(this)&&!1!==this.__previousVisible&&(this.__memorizedScrollTop=this._scrollTop)}}_updateOverflow(){let t="";const e=this.$.table;e.scrollTop<e.scrollHeight-e.clientHeight&&(t+=" bottom"),e.scrollTop>0&&(t+=" top");const i=this.__getNormalizedScrollLeft(e);i>0&&(t+=" start"),i<e.scrollWidth-e.clientWidth&&(t+=" end"),this.__isRTL&&(t=t.replace(/start|end/gi,(t=>"start"===t?"end":"start"))),e.scrollLeft<e.scrollWidth-e.clientWidth&&(t+=" right"),e.scrollLeft>0&&(t+=" left"),this._debounceOverflow=Es.debounce(this._debounceOverflow,$i,(()=>{const e=t.trim();e.length>0&&this.getAttribute("overflow")!==e?this.setAttribute("overflow",e):0===e.length&&this.hasAttribute("overflow")&&this.removeAttribute("overflow")}))}_frozenCellsChanged(){this._debouncerCacheElements=Es.debounce(this._debouncerCacheElements,Mi,(()=>{Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((t=>{t.style.transform=""})),this._frozenCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")),this._frozenToEndCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")),this.__updateHorizontalScrollPosition()})),this._debounceUpdateFrozenColumn()}_debounceUpdateFrozenColumn(){this.__debounceUpdateFrozenColumn=Es.debounce(this.__debounceUpdateFrozenColumn,Mi,(()=>this._updateFrozenColumn()))}_updateFrozenColumn(){if(!this._columnTree)return;const t=this._columnTree[this._columnTree.length-1].slice(0);let e,i;t.sort(((t,e)=>t._order-e._order));for(let s=0;s<t.length;s++){const r=t[s];r._lastFrozen=!1,r._firstFrozenToEnd=!1,void 0===i&&r.frozenToEnd&&!r.hidden&&(i=s),r.frozen&&!r.hidden&&(e=s)}void 0!==e&&(t[e]._lastFrozen=!0),void 0!==i&&(t[i]._firstFrozenToEnd=!0)}__updateHorizontalScrollPosition(){const t=this.$.table.scrollWidth,e=this.$.table.clientWidth,i=Math.max(0,this.$.table.scrollLeft),s=this.__getNormalizedScrollLeft(this.$.table),r=`translate(${-i}px, 0)`;this.$.header.style.transform=r,this.$.footer.style.transform=r,this.$.items.style.transform=r;const o=this.__isRTL?s+e-t:i,n=`translate(${o}px, 0)`;for(let t=0;t<this._frozenCells.length;t++)this._frozenCells[t].style.transform=n;const a=`translate(${this.__isRTL?s:i+e-t}px, 0)`;for(let t=0;t<this._frozenToEndCells.length;t++)this._frozenToEndCells[t].style.transform=a;this.hasAttribute("navigating")&&this.__rowFocusMode&&this.$.table.style.setProperty("--_grid-horizontal-scroll-position",-o+"px")}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,lo=t=>class extends t{static get properties(){return{selectedItems:{type:Object,notify:!0,value:()=>[]},__selectedKeys:{type:Object,computed:"__computeSelectedKeys(itemIdPath, selectedItems.*)"}}}static get observers(){return["__selectedItemsChanged(itemIdPath, selectedItems.*)"]}_isSelected(t){return this.__selectedKeys.has(this.getItemId(t))}selectItem(t){this._isSelected(t)||(this.selectedItems=[...this.selectedItems,t])}deselectItem(t){this._isSelected(t)&&(this.selectedItems=this.selectedItems.filter((e=>!this._itemsEqual(e,t))))}_toggleItem(t){this._isSelected(t)?this.deselectItem(t):this.selectItem(t)}__selectedItemsChanged(){this.requestContentUpdate()}__computeSelectedKeys(t,e){const i=e.base||[],s=new Set;return i.forEach((t=>{s.add(this.getItemId(t))})),s}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let ho="prepend";const co=t=>class extends t{static get properties(){return{multiSort:{type:Boolean,value:!1},multiSortPriority:{type:String,value:()=>ho},multiSortOnShiftClick:{type:Boolean,value:!1},_sorters:{type:Array,value:()=>[]},_previousSorters:{type:Array,value:()=>[]}}}static setDefaultMultiSortPriority(t){ho=["append","prepend"].includes(t)?t:"prepend"}ready(){super.ready(),this.addEventListener("sorter-changed",this._onSorterChanged)}_onSorterChanged(t){const e=t.target;t.stopPropagation(),e._grid=this,this.__updateSorter(e,t.detail.shiftClick,t.detail.fromSorterClick),this.__applySorters()}__removeSorters(t){0!==t.length&&(this._sorters=this._sorters.filter((e=>t.indexOf(e)<0)),this.multiSort&&this.__updateSortOrders(),this.__applySorters())}__updateSortOrders(){this._sorters.forEach(((t,e)=>{t._order=this._sorters.length>1?e:null}))}__appendSorter(t){t.direction?this._sorters.includes(t)||this._sorters.push(t):this._removeArrayItem(this._sorters,t),this.__updateSortOrders()}__prependSorter(t){this._removeArrayItem(this._sorters,t),t.direction&&this._sorters.unshift(t),this.__updateSortOrders()}__updateSorter(t,e,i){if(t.direction||-1!==this._sorters.indexOf(t))if(t._order=null,this.multiSort&&(!this.multiSortOnShiftClick||!i)||this.multiSortOnShiftClick&&e)"append"===this.multiSortPriority?this.__appendSorter(t):this.__prependSorter(t);else if(t.direction||this.multiSortOnShiftClick){const e=this._sorters.filter((e=>e!==t));this._sorters=t.direction?[t]:[],e.forEach((t=>{t._order=null,t.direction=null}))}}__applySorters(){this.dataProvider&&this.isAttached&&JSON.stringify(this._previousSorters)!==JSON.stringify(this._mapSorters())&&this.clearCache(),this._a11yUpdateSorters(),this._previousSorters=this._mapSorters()}_mapSorters(){return this._sorters.map((t=>({path:t.path,direction:t.direction})))}_removeArrayItem(t,e){const i=t.indexOf(e);i>-1&&t.splice(i,1)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,uo=t=>class extends t{static get properties(){return{cellClassNameGenerator:Function}}static get observers(){return["__cellClassNameGeneratorChanged(cellClassNameGenerator)"]}__cellClassNameGeneratorChanged(){this.generateCellClassNames()}generateCellClassNames(){Array.from(this.$.items.children).filter((t=>!t.hidden&&!t.hasAttribute("loading"))).forEach((t=>this._generateCellClassNames(t,this.__getRowModel(t))))}_generateCellClassNames(t,e){Array.from(t.children).forEach((t=>{if(t.__generatedClasses&&t.__generatedClasses.forEach((e=>t.classList.remove(e))),this.cellClassNameGenerator){const i=this.cellClassNameGenerator(t._column,e);t.__generatedClasses=i&&i.split(" ").filter((t=>t.length>0)),t.__generatedClasses&&t.__generatedClasses.forEach((e=>t.classList.add(e)))}}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;class _o extends(Ds(kt(Dr(kr(Kr(Pr(ao(lo(co(so(io(Sr(Jr(Fr(Lr(vs(Zr(Yr(uo(Ks(Ti))))))))))))))))))))){static get template(){return Si`
      <div
        id="scroller"
        safari$="[[_safari]]"
        ios$="[[_ios]]"
        loading$="[[loading]]"
        column-reordering-allowed$="[[columnReorderingAllowed]]"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <slot name="tooltip"></slot>

      <div id="focusexit" tabindex="0"></div>
    `}static get is(){return"vaadin-grid"}static get observers(){return["_columnTreeChanged(_columnTree, _columnTree.*)","_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)"]}static get properties(){return{_safari:{type:Boolean,value:br},_ios:{type:Boolean,value:gr},_firefox:{type:Boolean,value:mr},_android:{type:Boolean,value:_r},_touchDevice:{type:Boolean,value:vr},allRowsVisible:{type:Boolean,value:!1,reflectToAttribute:!0},_recalculateColumnWidthOnceLoadingFinished:{type:Boolean,value:!0},isAttached:{value:!1},__gridElement:{type:Boolean,value:!0}}}constructor(){super(),this.addEventListener("animationend",this._onAnimationEnd)}connectedCallback(){super.connectedCallback(),this.isAttached=!0,this.recalculateColumnWidths()}disconnectedCallback(){super.disconnectedCallback(),this.isAttached=!1,this._hideTooltip(!0)}__getFirstVisibleItem(){return this._getVisibleRows().find((t=>this._isInViewport(t)))}get _firstVisibleIndex(){const t=this.__getFirstVisibleItem();return t?t.index:void 0}__getLastVisibleItem(){return this._getVisibleRows().reverse().find((t=>this._isInViewport(t)))}get _lastVisibleIndex(){const t=this.__getLastVisibleItem();return t?t.index:void 0}_isInViewport(t){const e=this.$.table.getBoundingClientRect(),i=t.getBoundingClientRect(),s=this.$.header.getBoundingClientRect().height,r=this.$.footer.getBoundingClientRect().height;return i.bottom>e.top+s&&i.top<e.bottom-r}_getVisibleRows(){return Array.from(this.$.items.children).filter((t=>!t.hidden)).sort(((t,e)=>t.index-e.index))}ready(){super.ready(),this.__virtualizer=new Er({createElements:this._createScrollerRows.bind(this),updateElement:this._updateScrollerItem.bind(this),scrollContainer:this.$.items,scrollTarget:this.$.table,reorderElements:!0}),new ResizeObserver((()=>setTimeout((()=>{this.__updateFooterPositioning(),this._recalculateColumnWidthOnceVisible&&(this._recalculateColumnWidthOnceVisible=!1,this.recalculateColumnWidths())})))).observe(this.$.table),sr(this),this._tooltipController=new Bs(this),this.addController(this._tooltipController),this._tooltipController.setManual(!0)}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),"dir"===t&&(this.__isRTL="rtl"===i)}__getBodyCellCoordinates(t){if(this.$.items.contains(t)&&"td"===t.localName)return{item:t.parentElement._item,column:t._column}}__focusBodyCell({item:t,column:e}){const i=this._getVisibleRows().find((e=>e._item===t)),s=i&&[...i.children].find((t=>t._column===e));s&&s.focus()}_effectiveSizeChanged(t,e,i,s){if(e&&i&&s){const i=this.shadowRoot.activeElement,s=this.__getBodyCellCoordinates(i);e.size=t,e.update(),e.flush(),s&&i.parentElement.hidden&&this.__focusBodyCell(s),this._resetKeyboardNavigation()}}__itemsReceived(){if(!this._recalculateColumnWidthOnceLoadingFinished||this._cache.isLoading())return;if([...this.$.items.children].some((t=>void 0===t.index)))return;[...this.$.items.children].some((t=>t.clientHeight>0))&&(this._recalculateColumnWidthOnceLoadingFinished=!1,this.recalculateColumnWidths())}__getIntrinsicWidth(t){if(this.__intrinsicWidthCache.has(t))return this.__intrinsicWidthCache.get(t);const e=this.__calculateIntrinsicWidth(t);return this.__intrinsicWidthCache.set(t,e),e}__calculateIntrinsicWidth(t){const e=t.width,i=t.flexGrow;t.width="auto",t.flexGrow=0;const s=t._allCells.filter((t=>!this.$.items.contains(t)||this._isInViewport(t.parentElement))).reduce(((t,e)=>Math.max(t,e.offsetWidth+1)),0);return t.flexGrow=i,t.width=e,s}__getDistributedWidth(t,e){if(null==t||t===this)return 0;const i=Math.max(this.__getIntrinsicWidth(t),this.__getDistributedWidth((t.assignedSlot||t).parentElement,t));if(!e)return i;const s=i,r=t._visibleChildColumns.map((t=>this.__getIntrinsicWidth(t))).reduce(((t,e)=>t+e),0),o=Math.max(0,s-r),n=this.__getIntrinsicWidth(e)/r*o;return this.__getIntrinsicWidth(e)+n}_recalculateColumnWidths(t){this.__virtualizer.flush(),[...this.$.header.children,...this.$.footer.children].forEach((t=>{t.__debounceUpdateHeaderFooterRowVisibility&&t.__debounceUpdateHeaderFooterRowVisibility.flush()})),this._debouncerHiddenChanged&&this._debouncerHiddenChanged.flush(),this.__intrinsicWidthCache=new Map,t.forEach((t=>{t.width=`${this.__getDistributedWidth(t)}px`}))}recalculateColumnWidths(){if(!this._columnTree)return;if(Gs(this))return void(this._recalculateColumnWidthOnceVisible=!0);if(this._cache.isLoading())return void(this._recalculateColumnWidthOnceLoadingFinished=!0);const t=this._getColumns().filter((t=>!t.hidden&&t.autoWidth));this._recalculateColumnWidths(t)}_createScrollerRows(t){const e=[];for(let i=0;i<t;i++){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this._columnTree&&this._updateRow(t,this._columnTree[this._columnTree.length-1],"body",!1,!0),e.push(t)}var i,s,r;return this._columnTree&&this._columnTree[this._columnTree.length-1].forEach((t=>t.isConnected&&t.notifyPath&&t.notifyPath("_cells.*",t._cells))),i=this,s=()=>{this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._afterScroll(),this.__itemsReceived()},nr||dr(),ar.push([i,s,r]),e}_createCell(t,e){const i=`vaadin-grid-cell-content-${this._contentIndex=this._contentIndex+1||0}`,s=document.createElement("vaadin-grid-cell-content");s.setAttribute("slot",i);const r=document.createElement(t);r.id=i.replace("-content-","-"),r.setAttribute("role","td"===t?"gridcell":"columnheader"),_r||gr||(r.addEventListener("mouseenter",(t=>{this.$.scroller.hasAttribute("scrolling")||this._showTooltip(t)})),r.addEventListener("mouseleave",(()=>{this._hideTooltip()})),r.addEventListener("mousedown",(()=>{this._hideTooltip(!0)})));const o=document.createElement("slot");if(o.setAttribute("name",i),e&&e._focusButtonMode){const t=document.createElement("div");t.setAttribute("role","button"),t.setAttribute("tabindex","-1"),r.appendChild(t),r._focusButton=t,r.focus=function(){r._focusButton.focus()},t.appendChild(o)}else r.setAttribute("tabindex","-1"),r.appendChild(o);return r._content=s,s.addEventListener("mousedown",(()=>{if(pr){const t=e=>{const i=s.contains(this.getRootNode().activeElement),o=e.composedPath().includes(s);!i&&o&&r.focus(),document.removeEventListener("mouseup",t,!0)};document.addEventListener("mouseup",t,!0)}else setTimeout((()=>{s.contains(this.getRootNode().activeElement)||r.focus()}))})),r}_updateRow(t,e,i,s,r){i=i||"body";const o=document.createDocumentFragment();Array.from(t.children).forEach((t=>{t._vacant=!0})),t.innerHTML="",e.filter((t=>!t.hidden)).forEach(((e,n,a)=>{let l;if("body"===i){if(e._cells=e._cells||[],l=e._cells.find((t=>t._vacant)),l||(l=this._createCell("td",e),e._cells.push(l)),l.setAttribute("part","cell body-cell"),t.appendChild(l),t===this.$.sizer&&(e._sizerCell=l),n===a.length-1&&this.rowDetailsRenderer){this._detailsCells=this._detailsCells||[];const e=this._detailsCells.find((t=>t._vacant))||this._createCell("td");-1===this._detailsCells.indexOf(e)&&this._detailsCells.push(e),e._content.parentElement||o.appendChild(e._content),this._configureDetailsCell(e),t.appendChild(e),this._a11ySetRowDetailsCell(t,e),e._vacant=!1}e.notifyPath&&!r&&e.notifyPath("_cells.*",e._cells)}else{const r="header"===i?"th":"td";s||"vaadin-grid-column-group"===e.localName?(l=e[`_${i}Cell`]||this._createCell(r),l._column=e,t.appendChild(l),e[`_${i}Cell`]=l):(e._emptyCells=e._emptyCells||[],l=e._emptyCells.find((t=>t._vacant))||this._createCell(r),l._column=e,t.appendChild(l),-1===e._emptyCells.indexOf(l)&&e._emptyCells.push(l)),l.setAttribute("part",`cell ${i}-cell`)}l._content.parentElement||o.appendChild(l._content),l._vacant=!1,l._column=e})),"body"!==i&&this.__debounceUpdateHeaderFooterRowVisibility(t),this.appendChild(o),this._frozenCellsChanged(),this._updateFirstAndLastColumnForRow(t)}__debounceUpdateHeaderFooterRowVisibility(t){t.__debounceUpdateHeaderFooterRowVisibility=Es.debounce(t.__debounceUpdateHeaderFooterRowVisibility,Mi,(()=>this.__updateHeaderFooterRowVisibility(t)))}__updateHeaderFooterRowVisibility(t){if(!t)return;const e=Array.from(t.children).filter((e=>{const i=e._column;if(i._emptyCells&&i._emptyCells.indexOf(e)>-1)return!1;if(t.parentElement===this.$.header){if(i.headerRenderer)return!0;if(null===i.header)return!1;if(i.path||void 0!==i.header)return!0}else if(i.footerRenderer)return!0;return!1}));t.hidden!==!e.length&&(t.hidden=!e.length),this._resetKeyboardNavigation()}_updateScrollerItem(t,e){this._preventScrollerRotatingCellFocus(t,e),this._columnTree&&(t.toggleAttribute("first",0===e),t.toggleAttribute("last",e===this._effectiveSize-1),t.toggleAttribute("odd",e%2),this._a11yUpdateRowRowindex(t,e),this._getItem(e,t))}_columnTreeChanged(t){this._renderColumnTree(t),this.recalculateColumnWidths()}_renderColumnTree(t){for(Array.from(this.$.items.children).forEach((e=>this._updateRow(e,t[t.length-1],null,!1,!0)));this.$.header.children.length<t.length;){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this.$.header.appendChild(t);const e=document.createElement("tr");e.setAttribute("part","row"),e.setAttribute("role","row"),e.setAttribute("tabindex","-1"),this.$.footer.appendChild(e)}for(;this.$.header.children.length>t.length;)this.$.header.removeChild(this.$.header.firstElementChild),this.$.footer.removeChild(this.$.footer.firstElementChild);Array.from(this.$.header.children).forEach(((e,i)=>this._updateRow(e,t[i],"header",i===t.length-1))),Array.from(this.$.footer.children).forEach(((e,i)=>this._updateRow(e,t[t.length-1-i],"footer",0===i))),this._updateRow(this.$.sizer,t[t.length-1]),this._resizeHandler(),this._frozenCellsChanged(),this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows(),this.__updateFooterPositioning(),this.generateCellClassNames(),this.__updateHeaderAndFooter()}__updateFooterPositioning(){this._firefox&&parseFloat(navigator.userAgent.match(/Firefox\/(\d{2,3}.\d)/)[1])<99&&(this.$.items.style.paddingBottom=0,this.allRowsVisible||(this.$.items.style.paddingBottom=`${this.$.footer.offsetHeight}px`))}_updateItem(t,e){t._item=e;const i=this.__getRowModel(t);this._toggleDetailsCell(t,i.detailsOpened),this._a11yUpdateRowLevel(t,i.level),this._a11yUpdateRowSelected(t,i.selected),t.toggleAttribute("expanded",i.expanded),t.toggleAttribute("selected",i.selected),t.toggleAttribute("details-opened",i.detailsOpened),this._generateCellClassNames(t,i),this._filterDragAndDrop(t,i),Array.from(t.children).forEach((t=>{if(t._renderer){const e=t._column||this;t._renderer.call(e,t._content,e,i)}})),this._updateDetailsCellHeight(t),this._a11yUpdateRowExpanded(t,i.expanded)}_resizeHandler(){this._updateDetailsCellHeights(),this.__updateFooterPositioning(),this.__updateHorizontalScrollPosition()}_onAnimationEnd(t){0===t.animationName.indexOf("vaadin-grid-appear")&&(t.stopPropagation(),this.__itemsReceived(),requestAnimationFrame((()=>{this.__scrollToPendingIndex()})))}__getRowModel(t){return{index:t.index,item:t._item,level:this._getIndexLevel(t.index),expanded:this._isExpanded(t._item),selected:this._isSelected(t._item),detailsOpened:!!this.rowDetailsRenderer&&this._isDetailsOpened(t._item)}}_showTooltip(t){const e=this._tooltipController.node;e&&e.isConnected&&(this._tooltipController.setTarget(t.target),this._tooltipController.setContext(this.getEventContext(t)),e._stateController.open({focus:"focusin"===t.type,hover:"mouseenter"===t.type}))}_hideTooltip(t){const e=this._tooltipController.node;e&&e._stateController.close(t)}requestContentUpdate(){this.__updateHeaderAndFooter(),this.__updateVisibleRows()}__updateHeaderAndFooter(){(this._columnTree||[]).forEach((t=>{t.forEach((t=>{t._renderHeaderAndFooter&&t._renderHeaderAndFooter()}))}))}__updateVisibleRows(t,e){this.__virtualizer&&this.__virtualizer.update(t,e)}notifyResize(){console.warn("WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}}customElements.define(_o.is,_o),Tt("vaadin-grid-sorter",P`
    :host {
      justify-content: flex-start;
      align-items: baseline;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: var(--lumo-clickable-cursor);
    }

    [part='content'] {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part='indicators'] {
      margin-left: var(--lumo-space-s);
    }

    [part='indicators']::before {
      transform: scale(0.8);
    }

    :host(:not([direction]):not(:hover)) [part='indicators'] {
      color: var(--lumo-tertiary-text-color);
    }

    :host([direction]) {
      color: var(--lumo-primary-text-color);
    }

    [part='order'] {
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='indicators'] {
      margin-right: var(--lumo-space-s);
      margin-left: 0;
    }
  `,{moduleId:"lumo-grid-sorter"});
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const po=document.createElement("template");po.innerHTML="\n  <style>\n    @font-face {\n      font-family: 'vaadin-grid-sorter-icons';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');\n      font-weight: normal;\n      font-style: normal;\n    }\n  </style>\n",document.head.appendChild(po.content);class mo extends(kt(Fs(Ti))){static get template(){return Si`
      <style>
        :host {
          display: inline-flex;
          cursor: pointer;
          max-width: 100%;
        }

        [part='content'] {
          flex: 1 1 auto;
        }

        [part='indicators'] {
          position: relative;
          align-self: center;
          flex: none;
        }

        [part='order'] {
          display: inline;
          vertical-align: super;
        }

        [part='indicators']::before {
          font-family: 'vaadin-grid-sorter-icons';
          display: inline-block;
        }

        :host(:not([direction])) [part='indicators']::before {
          content: '\\e901';
        }

        :host([direction='asc']) [part='indicators']::before {
          content: '\\e900';
        }

        :host([direction='desc']) [part='indicators']::before {
          content: '\\e902';
        }
      </style>

      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">[[_getDisplayOrder(_order)]]</span>
      </div>
    `}static get is(){return"vaadin-grid-sorter"}static get properties(){return{path:String,direction:{type:String,reflectToAttribute:!0,notify:!0,value:null},_order:{type:Number,value:null},_isConnected:{type:Boolean,observer:"__isConnectedChanged"}}}static get observers(){return["_pathOrDirectionChanged(path, direction)"]}ready(){super.ready(),this.addEventListener("click",this._onClick.bind(this))}connectedCallback(){super.connectedCallback(),this._isConnected=!0}disconnectedCallback(){super.disconnectedCallback(),this._isConnected=!1,!this.parentNode&&this._grid&&this._grid.__removeSorters([this])}_pathOrDirectionChanged(){this.__dispatchSorterChangedEvenIfPossible()}__isConnectedChanged(t,e){!1!==e&&this.__dispatchSorterChangedEvenIfPossible()}__dispatchSorterChangedEvenIfPossible(){void 0!==this.path&&void 0!==this.direction&&this._isConnected&&(this.dispatchEvent(new CustomEvent("sorter-changed",{detail:{shiftClick:Boolean(this._shiftClick),fromSorterClick:Boolean(this._fromSorterClick)},bubbles:!0,composed:!0})),this._fromSorterClick=!1,this._shiftClick=!1)}_getDisplayOrder(t){return null===t?"":t+1}_onClick(t){if(t.defaultPrevented)return;const e=this.getRootNode().activeElement;this!==e&&this.contains(e)||(t.preventDefault(),this._shiftClick=t.shiftKey,this._fromSorterClick=!0,"asc"===this.direction?this.direction="desc":"desc"===this.direction?this.direction=null:this.direction="asc")}}customElements.define(mo.is,mo);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class fo extends or{static get is(){return"vaadin-grid-sort-column"}static get properties(){return{path:String,direction:{type:String,notify:!0}}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)"]}constructor(){super(),this.__boundOnDirectionChanged=this.__onDirectionChanged.bind(this)}_defaultHeaderRenderer(t,e){let i=t.firstElementChild;i||(i=document.createElement("vaadin-grid-sorter"),i.addEventListener("direction-changed",this.__boundOnDirectionChanged),t.appendChild(i)),i.path=this.path,i.__rendererDirection=this.direction,i.direction=this.direction,i.textContent=this.__getHeader(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}__onDirectionChanged(t){t.detail.value!==t.target.__rendererDirection&&(this.direction=t.detail.value)}__getHeader(t,e){return t||(e?this._generateHeader(e):void 0)}}customElements.define(fo.is,fo);export{vs as C,Fs as D,Ds as E,_o as G,js as I,gs as K,Qs as L,Ti as P,Hs as S,kt as T,ds as a,or as b,eo as c,to as d,y as e,Ws as f,Zs as g,Si as h,P as i,vr as j,Es as k,Js as l,tr as m,Bs as n,Tt as r,Li as t};
