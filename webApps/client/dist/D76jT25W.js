import{a3 as t,a4 as e,a5 as i,a6 as o,a7 as n,a8 as s,a9 as r,aa as a,ab as l,ac as g,ad as c,ae as I,af as d,ag as h,ah as C,ai as u,aj as m,ak as A,al as p}from"./DKUmqh9O.js";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let b=0;const M=function(t){let e=t.__mixinApplications;e||(e=new WeakMap,t.__mixinApplications=e);let i=b++;return function(o){let n=o.__mixinSet;if(n&&n[i])return o;let s=e,r=s.get(o);if(!r){r=t(o),s.set(o,r);let e=Object.create(r.__mixinSet||n||null);e[i]=!0,r.__mixinSet=e}return r}};
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class Z extends HTMLElement{static get version(){return"23.5.2"}}customElements.define("vaadin-lumo-styles",Z);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N=window,y=N.ShadowRoot&&(void 0===N.ShadyCSS||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,f=Symbol(),w=new WeakMap;let v=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==f)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(y&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=w.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&w.set(e,t))}return t}toString(){return this.cssText}};const T=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1]),t[0]);return new v(i,t,f)},j=y?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new v("string"==typeof t?t:t+"",void 0,f))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var O;const D=window,k=D.trustedTypes,x=k?k.emptyScript:"",z=D.reactiveElementPolyfillSupport,L={toAttribute(t,e){switch(e){case Boolean:t=t?x:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},W=(t,e)=>e!==t&&(e==e||t==t),G={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:W},S="finalized";let R=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const o=this._$Ep(i,e);void 0!==o&&(this._$Ev.set(o,i),t.push(o))})),t}static createProperty(t,e=G){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const n=this[t];this[e]=o,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||G}static finalize(){if(this.hasOwnProperty(S))return!1;this[S]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(j(t))}else void 0!==t&&e.push(j(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{y?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),o=N.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=G){var o;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:L).toAttribute(e,i.type);this._$El=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$El=null}}_$AK(t,e){var i;const o=this.constructor,n=o._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=o.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:L;this._$El=n,this[n]=s.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let o=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||W)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Y;R[S]=!0,R.elementProperties=new Map,R.elementStyles=[],R.shadowRootOptions={mode:"open"},null==z||z({ReactiveElement:R}),(null!==(O=D.reactiveElementVersions)&&void 0!==O?O:D.reactiveElementVersions=[]).push("1.6.3");const H=window,B=H.trustedTypes,E=B?B.createPolicy("lit-html",{createHTML:t=>t}):void 0,_="$lit$",X=`lit$${(Math.random()+"").slice(9)}$`,P="?"+X,J=`<${P}>`,V=document,U=()=>V.createComment(""),K=t=>null===t||"object"!=typeof t&&"function"!=typeof t,Q=Array.isArray,F="[ \t\n\f\r]",$=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,tt=/>/g,et=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,ot=/"/g,nt=/^(?:script|style|textarea|title)$/i,st=Symbol.for("lit-noChange"),rt=Symbol.for("lit-nothing"),at=new WeakMap,lt=V.createTreeWalker(V,129,null,!1);function gt(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const ct=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":"",r=$;for(let e=0;e<i;e++){const i=t[e];let a,l,g=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===$?"!--"===l[1]?r=q:void 0!==l[1]?r=tt:void 0!==l[2]?(nt.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=et):void 0!==l[3]&&(r=et):r===et?">"===l[0]?(r=null!=n?n:$,g=-1):void 0===l[1]?g=-2:(g=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?et:'"'===l[3]?ot:it):r===ot||r===it?r=et:r===q||r===tt?r=$:(r=et,n=void 0);const I=r===et&&t[e+1].startsWith("/>")?" ":"";s+=r===$?i+J:g>=0?(o.push(a),i.slice(0,g)+_+i.slice(g)+X+I):i+X+(-2===g?(o.push(void 0),e):I)}return[gt(t,s+(t[i]||"<?>")+(2===e?"</svg>":"")),o]};class It{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[l,g]=ct(t,e);if(this.el=It.createElement(l,i),lt.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(o=lt.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const e of o.getAttributeNames())if(e.endsWith(_)||e.startsWith(X)){const i=g[s++];if(t.push(e),void 0!==i){const t=o.getAttribute(i.toLowerCase()+_).split(X),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?mt:"?"===e[1]?pt:"@"===e[1]?bt:ut})}else a.push({type:6,index:n})}for(const e of t)o.removeAttribute(e)}if(nt.test(o.tagName)){const t=o.textContent.split(X),e=t.length-1;if(e>0){o.textContent=B?B.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],U()),lt.nextNode(),a.push({type:2,index:++n});o.append(t[e],U())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(X,t+1));)a.push({type:7,index:n}),t+=X.length-1}n++}}static createElement(t,e){const i=V.createElement("template");return i.innerHTML=t,i}}function dt(t,e,i=t,o){var n,s,r,a;if(e===st)return e;let l=void 0!==o?null===(n=i._$Co)||void 0===n?void 0:n[o]:i._$Cl;const g=K(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==g&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===g?l=void 0:(l=new g(t),l._$AT(t,i,o)),void 0!==o?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(e=dt(t,l._$AS(t,e.values),l,o)),e}class ht{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:o}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:V).importNode(i,!0);lt.currentNode=n;let s=lt.nextNode(),r=0,a=0,l=o[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new Ct(s,s.nextSibling,this,t):1===l.type?e=new l.ctor(s,l.name,l.strings,this,t):6===l.type&&(e=new Mt(s,this,t)),this._$AV.push(e),l=o[++a]}r!==(null==l?void 0:l.index)&&(s=lt.nextNode(),r++)}return lt.currentNode=V,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Ct{constructor(t,e,i,o){var n;this.type=2,this._$AH=rt,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cp=null===(n=null==o?void 0:o.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=dt(this,t,e),K(t)?t===rt||null==t||""===t?(this._$AH!==rt&&this._$AR(),this._$AH=rt):t!==this._$AH&&t!==st&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>Q(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==rt&&K(this._$AH)?this._$AA.nextSibling.data=t:this.$(V.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:o}=t,n="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=It.createElement(gt(o.h,o.h[0]),this.options)),o);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new ht(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=at.get(t.strings);return void 0===e&&at.set(t.strings,e=new It(t)),e}T(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new Ct(this.k(U()),this.k(U()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class ut{constructor(t,e,i,o,n){this.type=1,this._$AH=rt,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=rt}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=dt(this,t,e,0),s=!K(t)||t!==this._$AH&&t!==st,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=dt(this,o[i+r],e,r),a===st&&(a=this._$AH[r]),s||(s=!K(a)||a!==this._$AH[r]),a===rt?t=rt:t!==rt&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===rt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class mt extends ut{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===rt?void 0:t}}const At=B?B.emptyScript:"";class pt extends ut{constructor(){super(...arguments),this.type=4}j(t){t&&t!==rt?this.element.setAttribute(this.name,At):this.element.removeAttribute(this.name)}}class bt extends ut{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=dt(this,t,e,0))&&void 0!==i?i:rt)===st)return;const o=this._$AH,n=t===rt&&o!==rt||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==rt&&(o===rt||n);n&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Mt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){dt(this,t)}}const Zt=H.litHtmlPolyfillSupport;null==Zt||Zt(It,Ct),(null!==(Y=H.litHtmlVersions)&&void 0!==Y?Y:H.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Nt,yt;class ft extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var o,n;const s=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:e;let r=s._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;s._$litPart$=r=new Ct(e.insertBefore(U(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return st}}ft.finalized=!0,ft._$litElement$=!0,null===(Nt=globalThis.litElementHydrateSupport)||void 0===Nt||Nt.call(globalThis,{LitElement:ft});const wt=globalThis.litElementPolyfillSupport;null==wt||wt({LitElement:ft}),(null!==(yt=globalThis.litElementVersions)&&void 0!==yt?yt:globalThis.litElementVersions=[]).push("3.3.3");
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
const vt=t=>class extends t{static get properties(){return{theme:{type:String,reflectToAttribute:!0,observer:"__deprecatedThemePropertyChanged"},_theme:{type:String,readOnly:!0}}}__deprecatedThemePropertyChanged(t){this._set_theme(t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Tt=[];function jt(t,e,i={}){var o;t&&(o=t,zt(customElements.get(o))&&console.warn(`The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`)),e=function(t=[]){return[t].flat(1/0).filter((t=>t instanceof v||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}(e),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(t,e,i):Tt.push({themeFor:t,styles:e,include:i.include,moduleId:i.moduleId})}function Ot(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():Tt}function Dt(t=""){let e=0;return t.startsWith("lumo-")||t.startsWith("material-")?e=1:t.startsWith("vaadin-")&&(e=2),e}function kt(t){const e=[];return t.include&&[].concat(t.include).forEach((t=>{const i=Ot().find((e=>e.moduleId===t));i?e.push(...kt(i),...i.styles):console.warn(`Included moduleId ${t} not found in style registry`)}),t.styles),e}function xt(t){const e=`${t}-default-theme`,i=Ot().filter((i=>i.moduleId!==e&&function(t,e){return(t||"").split(" ").some((t=>new RegExp(`^${t.split("*").join(".*")}$`).test(e)))}(i.themeFor,t))).map((t=>({...t,styles:[...kt(t),...t.styles],includePriority:Dt(t.moduleId)}))).sort(((t,e)=>e.includePriority-t.includePriority));return i.length>0?i:Ot().filter((t=>t.moduleId===e))}function zt(t){return t&&Object.prototype.hasOwnProperty.call(t,"__themes")}const Lt=t=>class extends(vt(t)){static finalize(){if(super.finalize(),this.elementStyles)return;const t=this.prototype._template;t&&!zt(this)&&function(t,e){const i=document.createElement("style");i.innerHTML=t.map((t=>t.cssText)).join("\n"),e.content.appendChild(i)}(this.getStylesForThis(),t)}static finalizeStyles(t){const e=this.getStylesForThis();return t?[...super.finalizeStyles(t),...e]:e}static getStylesForThis(){const t=Object.getPrototypeOf(this.prototype),e=(t?t.constructor.__themes:[])||[];this.__themes=[...e,...xt(this.is)];const i=this.__themes.flatMap((t=>t.styles));return i.filter(((t,e)=>e===i.lastIndexOf(t)))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Wt=T`
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
`,Gt=document.createElement("template");Gt.innerHTML=`<style>${Wt.toString().replace(":host","html")}</style>`,document.head.appendChild(Gt.content);const St=T`
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
`;jt("",St,{moduleId:"lumo-color"});jt("",[St,T`
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
const Rt=document.createElement("template");Rt.innerHTML='\n  <style>\n    @font-face {\n      font-family: \'lumo-icons\';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format(\'woff\');\n      font-weight: normal;\n      font-style: normal;\n    }\n\n    html {\n      --lumo-icons-align-center: "\\ea01";\n      --lumo-icons-align-left: "\\ea02";\n      --lumo-icons-align-right: "\\ea03";\n      --lumo-icons-angle-down: "\\ea04";\n      --lumo-icons-angle-left: "\\ea05";\n      --lumo-icons-angle-right: "\\ea06";\n      --lumo-icons-angle-up: "\\ea07";\n      --lumo-icons-arrow-down: "\\ea08";\n      --lumo-icons-arrow-left: "\\ea09";\n      --lumo-icons-arrow-right: "\\ea0a";\n      --lumo-icons-arrow-up: "\\ea0b";\n      --lumo-icons-bar-chart: "\\ea0c";\n      --lumo-icons-bell: "\\ea0d";\n      --lumo-icons-calendar: "\\ea0e";\n      --lumo-icons-checkmark: "\\ea0f";\n      --lumo-icons-chevron-down: "\\ea10";\n      --lumo-icons-chevron-left: "\\ea11";\n      --lumo-icons-chevron-right: "\\ea12";\n      --lumo-icons-chevron-up: "\\ea13";\n      --lumo-icons-clock: "\\ea14";\n      --lumo-icons-cog: "\\ea15";\n      --lumo-icons-cross: "\\ea16";\n      --lumo-icons-download: "\\ea17";\n      --lumo-icons-dropdown: "\\ea18";\n      --lumo-icons-edit: "\\ea19";\n      --lumo-icons-error: "\\ea1a";\n      --lumo-icons-eye: "\\ea1b";\n      --lumo-icons-eye-disabled: "\\ea1c";\n      --lumo-icons-menu: "\\ea1d";\n      --lumo-icons-minus: "\\ea1e";\n      --lumo-icons-ordered-list: "\\ea1f";\n      --lumo-icons-phone: "\\ea20";\n      --lumo-icons-photo: "\\ea21";\n      --lumo-icons-play: "\\ea22";\n      --lumo-icons-plus: "\\ea23";\n      --lumo-icons-redo: "\\ea24";\n      --lumo-icons-reload: "\\ea25";\n      --lumo-icons-search: "\\ea26";\n      --lumo-icons-undo: "\\ea27";\n      --lumo-icons-unordered-list: "\\ea28";\n      --lumo-icons-upload: "\\ea29";\n      --lumo-icons-user: "\\ea2a";\n    }\n  </style>\n',document.head.appendChild(Rt.content);
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
const Yt=T`
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
`,Ht=document.createElement("template");Ht.innerHTML=`<style>${Yt.toString().replace(":host","html")}</style>`,document.head.appendChild(Ht.content);
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
const Bt=T`
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
`,Et=document.createElement("template");Et.innerHTML=`<style>${Bt.toString().replace(":host","html")}</style>`,document.head.appendChild(Et.content);
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
const _t=T`
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
`;T`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
  }
`;const Xt=document.createElement("template");Xt.innerHTML=`<style>${_t.toString().replace(":host","html")}$</style>`,document.head.appendChild(Xt.content);
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
const Pt=T`
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
`;jt("",T`
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
`,{moduleId:"lumo-typography"});const Jt=document.createElement("template");Jt.innerHTML=`<style>${Pt.toString().replace(":host","html")}</style>`,document.head.appendChild(Jt.content),jt("vaadin-checkbox",T`
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
let Vt={},Ut={};function Kt(t,e){Vt[t]=Ut[t.toLowerCase()]=e}function Qt(t){return Vt[t]||Ut[t.toLowerCase()]}class Ft extends HTMLElement{static get observedAttributes(){return["id"]}static import(t,e){if(t){let i=Qt(t);return i&&e?i.querySelector(e):i}return null}attributeChangedCallback(t,e,i,o){e!==i&&this.register()}get assetpath(){if(!this.__assetpath){const i=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,o=t(this.getAttribute("assetpath")||"",i.baseURI);this.__assetpath=e(o)}return this.__assetpath}register(t){if(t=t||this.id){if(i&&void 0!==Qt(t))throw Kt(t,null),new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);this.id=t,Kt(t,this),(e=this).querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}var e}}Ft.prototype.modules=Vt,customElements.define("dom-module",Ft);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const $t="link[rel=import][type~=css]",qt="include",te="shady-unscoped";function ee(t){return Ft.import(t)}function ie(t){let e=t.body?t.body:t;const i=o(e.textContent,t.baseURI),n=document.createElement("style");return n.textContent=i,n}function oe(t){const e=t.trim().split(/\s+/),i=[];for(let t=0;t<e.length;t++)i.push(...ne(e[t]));return i}function ne(t){const e=ee(t);if(!e)return console.warn("Could not find style data in module named",t),[];if(void 0===e._styles){const t=[];t.push(...re(e));const i=e.querySelector("template");i&&t.push(...se(i,e.assetpath)),e._styles=t}return e._styles}function se(t,e){if(!t._styles){const i=[],n=t.content.querySelectorAll("style");for(let t=0;t<n.length;t++){let s=n[t],r=s.getAttribute(qt);r&&i.push(...oe(r).filter((function(t,e,i){return i.indexOf(t)===e}))),e&&(s.textContent=o(s.textContent,e)),i.push(s)}t._styles=i}return t._styles}function re(t){const e=[],i=t.querySelectorAll($t);for(let t=0;t<i.length;t++){let o=i[t];if(o.import){const t=o.import,i=o.hasAttribute(te);if(i&&!t._unscopedStyle){const e=ie(t);e.setAttribute(te,""),t._unscopedStyle=e}else t._style||(t._style=ie(t));e.push(i?t._unscopedStyle:t._style)}}return e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function ae(t){return t.indexOf(".")>=0}function le(t){let e=t.indexOf(".");return-1===e?t:t.slice(0,e)}function ge(t,e){return 0===e.indexOf(t+".")}function ce(t,e,i){return e+i.slice(t.length)}function Ie(t){if(Array.isArray(t)){let e=[];for(let i=0;i<t.length;i++){let o=t[i].toString().split(".");for(let t=0;t<o.length;t++)e.push(o[t])}return e.join(".")}return t}function de(t){return Array.isArray(t)?Ie(t).split("."):t.toString().split(".")}function he(t,e,i){let o=t,n=de(e);for(let t=0;t<n.length;t++){if(!o)return;o=o[n[t]]}return i&&(i.path=n.join(".")),o}function Ce(t,e,i){let o=t,n=de(e),s=n[n.length-1];if(n.length>1){for(let t=0;t<n.length-1;t++){if(o=o[n[t]],!o)return}o[s]=i}else o[e]=i;return n.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const ue={},me=/-[a-z]/g,Ae=/([A-Z])/g;function pe(t){return ue[t]||(ue[t]=t.indexOf("-")<0?t:t.replace(me,(t=>t[1].toUpperCase())))}function be(t){return ue[t]||(ue[t]=t.replace(Ae,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const Me=s,Ze=M((t=>class extends t{static createProperties(t){const e=this.prototype;for(let i in t)i in e||e._createPropertyAccessor(i)}static attributeNameForProperty(t){return t.toLowerCase()}static typeForProperty(t){}_createPropertyAccessor(t,e){this._addPropertyToAttributeMap(t),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[t]||(this.__dataHasAccessor[t]=!0,this._definePropertyAccessor(t,e))}_addPropertyToAttributeMap(t){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.__dataAttributes=Object.assign({},this.__dataAttributes));let e=this.__dataAttributes[t];return e||(e=this.constructor.attributeNameForProperty(t),this.__dataAttributes[e]=t),e}_definePropertyAccessor(t,e){Object.defineProperty(this,t,{get(){return this.__data[t]},set:e?function(){}:function(e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__dataCounter=0,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let t in this.__dataHasAccessor)this.hasOwnProperty(t)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[t]=this[t],delete this[t])}_initializeInstanceProperties(t){Object.assign(this,t)}_setProperty(t,e){this._setPendingProperty(t,e)&&this._invalidateProperties()}_getProperty(t){return this.__data[t]}_setPendingProperty(t,e,i){let o=this.__data[t],n=this._shouldPropertyChange(t,e,o);return n&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(t in this.__dataOld)&&(this.__dataOld[t]=o),this.__data[t]=e,this.__dataPending[t]=e),n}_isPropertyPending(t){return!(!this.__dataPending||!this.__dataPending.hasOwnProperty(t))}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,Me.run((()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())})))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){this.__dataCounter++;const t=this.__data,e=this.__dataPending,i=this.__dataOld;this._shouldPropertiesChange(t,e,i)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(t,e,i)),this.__dataCounter--}_shouldPropertiesChange(t,e,i){return Boolean(e)}_propertiesChanged(t,e,i){}_shouldPropertyChange(t,e,i){return i!==e&&(i==i||e==e)}attributeChangedCallback(t,e,i,o){e!==i&&this._attributeToProperty(t,i),super.attributeChangedCallback&&super.attributeChangedCallback(t,e,i,o)}_attributeToProperty(t,e,i){if(!this.__serializing){const o=this.__dataAttributes,n=o&&o[t]||t;this[n]=this._deserializeValue(e,i||this.constructor.typeForProperty(n))}}_propertyToAttribute(t,e,i){this.__serializing=!0,i=arguments.length<3?this[t]:i,this._valueToNodeAttribute(this,i,e||this.constructor.attributeNameForProperty(t)),this.__serializing=!1}_valueToNodeAttribute(t,e,i){const o=this._serializeValue(e);"class"!==i&&"name"!==i&&"slot"!==i||(t=n(t)),void 0===o?t.removeAttribute(i):t.setAttribute(i,""===o&&window.trustedTypes?window.trustedTypes.emptyScript:o)}_serializeValue(t){return"boolean"==typeof t?t?"":void 0:null!=t?t.toString():void 0}_deserializeValue(t,e){switch(e){case Boolean:return null!==t;case Number:return Number(t);default:return t}}})),Ne={};let ye=HTMLElement.prototype;for(;ye;){let t=Object.getOwnPropertyNames(ye);for(let e=0;e<t.length;e++)Ne[t[e]]=!0;ye=Object.getPrototypeOf(ye)}const fe=window.trustedTypes?t=>trustedTypes.isHTML(t)||trustedTypes.isScript(t)||trustedTypes.isScriptURL(t):()=>!1;const we=M((t=>{const e=Ze(t);return class extends e{static createPropertiesForAttributes(){let t=this.observedAttributes;for(let e=0;e<t.length;e++)this.prototype._createPropertyAccessor(pe(t[e]))}static attributeNameForProperty(t){return be(t)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(t){for(let e in t)this._setProperty(e,t[e])}_ensureAttribute(t,e){const i=this;i.hasAttribute(t)||this._valueToNodeAttribute(i,e,t)}_serializeValue(t){if("object"==typeof t){if(t instanceof Date)return t.toString();if(t){if(fe(t))return t;try{return JSON.stringify(t)}catch(t){return""}}}return super._serializeValue(t)}_deserializeValue(t,e){let i;switch(e){case Object:try{i=JSON.parse(t)}catch(e){i=t}break;case Array:try{i=JSON.parse(t)}catch(e){i=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${t}`)}break;case Date:i=isNaN(t)?String(t):Number(t),i=new Date(i);break;default:i=super._deserializeValue(t,e)}return i}_definePropertyAccessor(t,e){!function(t,e){if(!Ne[e]){let i=t[e];void 0!==i&&(t.__data?t._setPendingProperty(e,i):(t.__dataProto?t.hasOwnProperty(JSCompiler_renameProperty("__dataProto",t))||(t.__dataProto=Object.create(t.__dataProto)):t.__dataProto={},t.__dataProto[e]=i))}}(this,t),super._definePropertyAccessor(t,e)}_hasAccessor(t){return this.__dataHasAccessor&&this.__dataHasAccessor[t]}_isPropertyPending(t){return Boolean(this.__dataPending&&t in this.__dataPending)}}})),ve={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Te=!1,je=!1;function Oe(t){(function(){if(!Te){Te=!0;const t=document.createElement("textarea");t.placeholder="a",je=t.placeholder===t.textContent}return je})()&&"textarea"===t.localName&&t.placeholder&&t.placeholder===t.textContent&&(t.textContent=null)}const De=(()=>{const t=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:t=>t});return(e,i,o)=>{const n=i.getAttribute(o);t&&o.startsWith("on-")?e.setAttribute(o,t.createScript(n,o)):e.setAttribute(o,n)}})();function ke(t){let e=t.getAttribute("is");if(e&&ve[e]){let i=t;for(i.removeAttribute("is"),t=i.ownerDocument.createElement(e),i.parentNode.replaceChild(t,i),t.appendChild(i);i.attributes.length;){const{name:e}=i.attributes[0];De(t,i,e),i.removeAttribute(e)}}return t}function xe(t,e){let i=e.parentInfo&&xe(t,e.parentInfo);if(!i)return t;for(let t=i.firstChild,o=0;t;t=t.nextSibling)if(e.parentIndex===o++)return t}function ze(t,e,i,o){o.id&&(e[o.id]=i)}function Le(t,e,i){if(i.events&&i.events.length)for(let o,n=0,s=i.events;n<s.length&&(o=s[n]);n++)t._addMethodEventListenerToNode(e,o.name,o.value,t)}function We(t,e,i,o){i.templateInfo&&(e._templateInfo=i.templateInfo,e._parentTemplateInfo=o)}const Ge=M((t=>class extends t{static _parseTemplate(t,e){if(!t._templateInfo){let i=t._templateInfo={};i.nodeInfoList=[],i.nestedTemplate=Boolean(e),i.stripWhiteSpace=e&&e.stripWhiteSpace||t.hasAttribute&&t.hasAttribute("strip-whitespace"),this._parseTemplateContent(t,i,{parent:null})}return t._templateInfo}static _parseTemplateContent(t,e,i){return this._parseTemplateNode(t.content,e,i)}static _parseTemplateNode(t,e,i){let o=!1,n=t;return"template"!=n.localName||n.hasAttribute("preserve-content")?"slot"===n.localName&&(e.hasInsertionPoint=!0):o=this._parseTemplateNestedTemplate(n,e,i)||o,Oe(n),n.firstChild&&this._parseTemplateChildNodes(n,e,i),n.hasAttributes&&n.hasAttributes()&&(o=this._parseTemplateNodeAttributes(n,e,i)||o),o||i.noted}static _parseTemplateChildNodes(t,e,i){if("script"!==t.localName&&"style"!==t.localName)for(let o,n=t.firstChild,s=0;n;n=o){if("template"==n.localName&&(n=ke(n)),o=n.nextSibling,n.nodeType===Node.TEXT_NODE){let i=o;for(;i&&i.nodeType===Node.TEXT_NODE;)n.textContent+=i.textContent,o=i.nextSibling,t.removeChild(i),i=o;if(e.stripWhiteSpace&&!n.textContent.trim()){t.removeChild(n);continue}}let r={parentIndex:s,parentInfo:i};this._parseTemplateNode(n,e,r)&&(r.infoIndex=e.nodeInfoList.push(r)-1),n.parentNode&&s++}}static _parseTemplateNestedTemplate(t,e,i){let o=t,n=this._parseTemplate(o,e);return(n.content=o.content.ownerDocument.createDocumentFragment()).appendChild(o.content),i.templateInfo=n,!0}static _parseTemplateNodeAttributes(t,e,i){let o=!1,n=Array.from(t.attributes);for(let s,r=n.length-1;s=n[r];r--)o=this._parseTemplateNodeAttribute(t,e,i,s.name,s.value)||o;return o}static _parseTemplateNodeAttribute(t,e,i,o,n){return"on-"===o.slice(0,3)?(t.removeAttribute(o),i.events=i.events||[],i.events.push({name:o.slice(3),value:n}),!0):"id"===o&&(i.id=n,!0)}static _contentForTemplate(t){let e=t._templateInfo;return e&&e.content||t.content}_stampTemplate(t,e){t&&!t.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(t);let i=(e=e||this.constructor._parseTemplate(t)).nodeInfoList,o=e.content||t.content,n=document.importNode(o,!0);n.__noInsertionPoint=!e.hasInsertionPoint;let s=n.nodeList=new Array(i.length);n.$={};for(let t,o=0,r=i.length;o<r&&(t=i[o]);o++){let i=s[o]=xe(n,t);ze(0,n.$,i,t),We(0,i,t,e),Le(this,i,t)}return n}_addMethodEventListenerToNode(t,e,i,o){let n=function(t,e,i){return t=t._methodHost||t,function(e){t[i]?t[i](e,e.detail):console.warn("listener method `"+i+"` not defined")}}(o=o||t,0,i);return this._addEventListenerToNode(t,e,n),n}_addEventListenerToNode(t,e,i){t.addEventListener(e,i)}_removeEventListenerFromNode(t,e,i){t.removeEventListener(e,i)}}));
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
 */let Se=0;const Re=[],Ye={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},He="__computeInfo",Be=/[A-Z]/;function Ee(t,e,i){let o=t[e];if(o){if(!t.hasOwnProperty(e)&&(o=t[e]=Object.create(t[e]),i))for(let t in o){let e=o[t],i=o[t]=Array(e.length);for(let t=0;t<e.length;t++)i[t]=e[t]}}else o=t[e]={};return o}function _e(t,e,i,o,n,s){if(e){let r=!1;const a=Se++;for(let l in i){let g=e[n?le(l):l];if(g)for(let e,c=0,I=g.length;c<I&&(e=g[c]);c++)e.info&&e.info.lastRun===a||n&&!Pe(l,e.trigger)||(e.info&&(e.info.lastRun=a),e.fn(t,l,i,o,e.info,n,s),r=!0)}return r}return!1}function Xe(t,e,i,o,n,s,r,a){let l=!1,g=e[r?le(o):o];if(g)for(let e,c=0,I=g.length;c<I&&(e=g[c]);c++)e.info&&e.info.lastRun===i||r&&!Pe(o,e.trigger)||(e.info&&(e.info.lastRun=i),e.fn(t,o,n,s,e.info,r,a),l=!0);return l}function Pe(t,e){if(e){let i=e.name;return i==t||!(!e.structured||!function(t,e){return 0===t.indexOf(e+".")}(i,t))||!(!e.wildcard||!ge(i,t))}return!0}function Je(t,e,i,o,n){let s="string"==typeof n.method?t[n.method]:n.method,r=n.property;s?s.call(t,t.__data[r],o[r]):n.dynamicFn||console.warn("observer method `"+n.method+"` not defined")}function Ve(t,e,i){let o=le(e);if(o!==e){return Ue(t,be(o)+"-changed",i[e],e),!0}return!1}function Ue(t,e,i,o){let s={value:i,queueProperty:!0};o&&(s.path=o),n(t).dispatchEvent(new CustomEvent(e,{detail:s}))}function Ke(t,e,i,o,n,s){let r=(s?le(e):e)!=e?e:null,a=r?he(t,r):t.__data[e];r&&void 0===a&&(a=i[e]),Ue(t,n.eventName,a,r)}function Qe(t,e,i,o,n){let s=t.__data[e];g&&(s=g(s,n.attrName,"attribute",t)),t._propertyToAttribute(e,n.attrName,s)}function Fe(t,e,i,o){let n=t[Ye.COMPUTE];if(n)if(c){Se++;const s=function(t){let e=t.constructor.__orderedComputedDeps;if(!e){e=new Map;const i=t[Ye.COMPUTE];let o,{counts:n,ready:s,total:r}=function(t){const e=t[He],i={},o=t[Ye.COMPUTE],n=[];let s=0;for(let t in e){const o=e[t];s+=i[t]=o.args.filter((t=>!t.literal)).length+(o.dynamicFn?1:0)}for(let t in o)e[t]||n.push(t);return{counts:i,ready:n,total:s}}(t);for(;o=s.shift();){e.set(o,e.size);const t=i[o];t&&t.forEach((t=>{const e=t.info.methodInfo;--r,0==--n[e]&&s.push(e)}))}if(0!==r){const e=t;console.warn(`Computed graph for ${e.localName} incomplete; circular?`)}t.constructor.__orderedComputedDeps=e}return e}(t),r=[];for(let t in e)qe(t,n,r,s,o);let a;for(;a=r.shift();)ti(t,"",e,i,a)&&qe(a.methodInfo,n,r,s,o);Object.assign(i,t.__dataOld),Object.assign(e,t.__dataPending),t.__dataPending=null}else{let s=e;for(;_e(t,n,s,i,o);)Object.assign(i,t.__dataOld),Object.assign(e,t.__dataPending),s=t.__dataPending,t.__dataPending=null}}const $e=(t,e,i)=>{let o=0,n=e.length-1,s=-1;for(;o<=n;){const r=o+n>>1,a=i.get(e[r].methodInfo)-i.get(t.methodInfo);if(a<0)o=r+1;else{if(!(a>0)){s=r;break}n=r-1}}s<0&&(s=n+1),e.splice(s,0,t)},qe=(t,e,i,o,n)=>{const s=e[n?le(t):t];if(s)for(let e=0;e<s.length;e++){const r=s[e];r.info.lastRun===Se||n&&!Pe(t,r.trigger)||(r.info.lastRun=Se,$e(r.info,i,o))}};function ti(t,e,i,o,n){let s=ai(t,e,i,o,n);if(s===Re)return!1;let r=n.methodInfo;return t.__dataHasAccessor&&t.__dataHasAccessor[r]?t._setPendingProperty(r,s,!0):(t[r]=s,!1)}function ei(t,e,i,o,n,s,r){i.bindings=i.bindings||[];let a={kind:o,target:n,parts:s,literal:r,isCompound:1!==s.length};if(i.bindings.push(a),function(t){return Boolean(t.target)&&"attribute"!=t.kind&&"text"!=t.kind&&!t.isCompound&&"{"===t.parts[0].mode}(a)){let{event:t,negate:e}=a.parts[0];a.listenerEvent=t||be(n)+"-changed",a.listenerNegate=e}let l=e.nodeInfoList.length;for(let i=0;i<a.parts.length;i++){let o=a.parts[i];o.compoundIndex=i,ii(t,e,a,o,l)}}function ii(t,e,i,o,n){if(!o.literal)if("attribute"===i.kind&&"-"===i.target[0])console.warn("Cannot set attribute "+i.target+' because "-" is not a valid attribute starting character');else{let s=o.dependencies,r={index:n,binding:i,part:o,evaluator:t};for(let i=0;i<s.length;i++){let o=s[i];"string"==typeof o&&(o=Ci(o),o.wildcard=!0),t._addTemplatePropertyEffect(e,o.rootProperty,{fn:oi,info:r,trigger:o})}}}function oi(t,e,i,o,n,s,r){let a=r[n.index],l=n.binding,c=n.part;if(s&&c.source&&e.length>c.source.length&&"property"==l.kind&&!l.isCompound&&a.__isPropertyEffectsClient&&a.__dataHasAccessor&&a.__dataHasAccessor[l.target]){let o=i[e];e=ce(c.source,l.target,e),a._setPendingPropertyOrPath(e,o,!1,!0)&&t._enqueueClient(a)}else{let r=n.evaluator._evaluateBinding(t,c,e,i,o,s);r!==Re&&function(t,e,i,o,n){n=function(t,e,i,o){if(i.isCompound){let n=t.__dataCompoundStorage[i.target];n[o.compoundIndex]=e,e=n.join("")}"attribute"!==i.kind&&("textContent"!==i.target&&("value"!==i.target||"input"!==t.localName&&"textarea"!==t.localName)||(e=null==e?"":e));return e}(e,n,i,o),g&&(n=g(n,i.target,i.kind,e));if("attribute"==i.kind)t._valueToNodeAttribute(e,n,i.target);else{let o=i.target;e.__isPropertyEffectsClient&&e.__dataHasAccessor&&e.__dataHasAccessor[o]?e[Ye.READ_ONLY]&&e[Ye.READ_ONLY][o]||e._setPendingProperty(o,n)&&t._enqueueClient(e):t._setUnmanagedPropertyToNode(e,o,n)}}(t,a,l,c,r)}}function ni(t,e){if(e.isCompound){let i=t.__dataCompoundStorage||(t.__dataCompoundStorage={}),o=e.parts,s=new Array(o.length);for(let t=0;t<o.length;t++)s[t]=o[t].literal;let r=e.target;i[r]=s,e.literal&&"property"==e.kind&&("className"===r&&(t=n(t)),t[r]=e.literal)}}function si(t,e,i){if(i.listenerEvent){let o=i.parts[0];t.addEventListener(i.listenerEvent,(function(t){!function(t,e,i,o,n){let s,r=t.detail,a=r&&r.path;a?(o=ce(i,o,a),s=r&&r.value):s=t.currentTarget[i],s=n?!s:s,e[Ye.READ_ONLY]&&e[Ye.READ_ONLY][o]||!e._setPendingPropertyOrPath(o,s,!0,Boolean(a))||r&&r.queueProperty||e._invalidateProperties()}(t,e,i.target,o.source,o.negate)}))}}function ri(t,e,i,o,n,s){s=e.static||s&&("object"!=typeof s||s[e.methodName]);let r={methodName:e.methodName,args:e.args,methodInfo:n,dynamicFn:s};for(let n,s=0;s<e.args.length&&(n=e.args[s]);s++)n.literal||t._addPropertyEffect(n.rootProperty,i,{fn:o,info:r,trigger:n});return s&&t._addPropertyEffect(e.methodName,i,{fn:o,info:r}),r}function ai(t,e,i,o,n){let s=t._methodHost||t,r=s[n.methodName];if(r){let o=t._marshalArgs(n.args,e,i);return o===Re?Re:r.apply(s,o)}n.dynamicFn||console.warn("method `"+n.methodName+"` not defined")}const li=[],gi="(?:[a-zA-Z_$][\\w.:$\\-*]*)",ci="(?:("+gi+"|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",Ii=new RegExp("(\\[\\[|{{)\\s*(?:(!)\\s*)?"+("("+gi+"\\s*"+("(?:\\(\\s*(?:"+("(?:"+ci+"(?:,\\s*"+ci+")*)")+"?)\\)\\s*)")+"?)")+"(?:]]|}})","g");function di(t){let e="";for(let i=0;i<t.length;i++){e+=t[i].literal||""}return e}function hi(t){let e=t.match(/([^\s]+?)\(([\s\S]*)\)/);if(e){let t={methodName:e[1],static:!0,args:li};if(e[2].trim()){return function(t,e){return e.args=t.map((function(t){let i=Ci(t);return i.literal||(e.static=!1),i}),this),e}(e[2].replace(/\\,/g,"&comma;").split(","),t)}return t}return null}function Ci(t){let e=t.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),i={name:e,value:"",literal:!1},o=e[0];switch("-"===o&&(o=e[1]),o>="0"&&o<="9"&&(o="#"),o){case"'":case'"':i.value=e.slice(1,-1),i.literal=!0;break;case"#":i.value=Number(e),i.literal=!0}return i.literal||(i.rootProperty=le(e),i.structured=ae(e),i.structured&&(i.wildcard=".*"==e.slice(-2),i.wildcard&&(i.name=e.slice(0,-2)))),i}function ui(t,e,i){let o=he(t,i);return void 0===o&&(o=e[i]),o}function mi(t,e,i,o){const n={indexSplices:o};r&&!t._overrideLegacyUndefined&&(e.splices=n),t.notifyPath(i+".splices",n),t.notifyPath(i+".length",e.length),r&&!t._overrideLegacyUndefined&&(n.indexSplices=[])}function Ai(t,e,i,o,n,s){mi(t,e,i,[{index:o,addedCount:n,removed:s,object:e,type:"splice"}])}const pi=M((t=>{const e=Ge(we(t));return class extends e{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__computeInfo,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return Ye}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_registerHost(){if(bi.length){let t=bi[bi.length-1];t._enqueueClient(this),this.__dataHost=t}}_initializeProtoProperties(t){this.__data=Object.create(t),this.__dataPending=Object.create(t),this.__dataOld={}}_initializeInstanceProperties(t){let e=this[Ye.READ_ONLY];for(let i in t)e&&e[i]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[i]=this.__dataPending[i]=t[i])}_addPropertyEffect(t,e,i){this._createPropertyAccessor(t,e==Ye.READ_ONLY);let o=Ee(this,e,!0)[t];o||(o=this[e][t]=[]),o.push(i)}_removePropertyEffect(t,e,i){let o=Ee(this,e,!0)[t],n=o.indexOf(i);n>=0&&o.splice(n,1)}_hasPropertyEffect(t,e){let i=this[e];return Boolean(i&&i[t])}_hasReadOnlyEffect(t){return this._hasPropertyEffect(t,Ye.READ_ONLY)}_hasNotifyEffect(t){return this._hasPropertyEffect(t,Ye.NOTIFY)}_hasReflectEffect(t){return this._hasPropertyEffect(t,Ye.REFLECT)}_hasComputedEffect(t){return this._hasPropertyEffect(t,Ye.COMPUTE)}_setPendingPropertyOrPath(t,e,i,o){if(o||le(Array.isArray(t)?t[0]:t)!==t){if(!o){let i=he(this,t);if(!(t=Ce(this,t,e))||!super._shouldPropertyChange(t,e,i))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(t,e,i))return function(t,e,i){let o=t.__dataLinkedPaths;if(o){let n;for(let s in o){let r=o[s];ge(s,e)?(n=ce(s,r,e),t._setPendingPropertyOrPath(n,i,!0,!0)):ge(r,e)&&(n=ce(r,s,e),t._setPendingPropertyOrPath(n,i,!0,!0))}}}(this,t,e),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[t])return this._setPendingProperty(t,e,i);this[t]=e}return!1}_setUnmanagedPropertyToNode(t,e,i){i===t[e]&&"object"!=typeof i||("className"===e&&(t=n(t)),t[e]=i)}_setPendingProperty(t,e,i){let o=this.__dataHasPaths&&ae(t),n=o?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(t,e,n[t])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),t in this.__dataOld||(this.__dataOld[t]=this.__data[t]),o?this.__dataTemp[t]=e:this.__data[t]=e,this.__dataPending[t]=e,(o||this[Ye.NOTIFY]&&this[Ye.NOTIFY][t])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[t]=i),!0)}_setProperty(t,e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(t){this.__dataPendingClients=this.__dataPendingClients||[],t!==this&&this.__dataPendingClients.push(t)}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let t=this.__dataPendingClients;if(t){this.__dataPendingClients=null;for(let e=0;e<t.length;e++){let i=t[e];i.__dataEnabled?i.__dataPending&&i._flushProperties():i._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(t,e){for(let i in t)!e&&this[Ye.READ_ONLY]&&this[Ye.READ_ONLY][i]||this._setPendingPropertyOrPath(i,t[i],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(t,e,i){let o,n=this.__dataHasPaths;this.__dataHasPaths=!1,Fe(this,e,i,n),o=this.__dataToNotify,this.__dataToNotify=null,this._propagatePropertyChanges(e,i,n),this._flushClients(),_e(this,this[Ye.REFLECT],e,i,n),_e(this,this[Ye.OBSERVE],e,i,n),o&&function(t,e,i,o,n){let s,r,a=t[Ye.NOTIFY],l=Se++;for(let r in e)e[r]&&(a&&Xe(t,a,l,r,i,o,n)||n&&Ve(t,r,i))&&(s=!0);s&&(r=t.__dataHost)&&r._invalidateProperties&&r._invalidateProperties()}(this,o,e,i,n),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(t,e,i){this[Ye.PROPAGATE]&&_e(this,this[Ye.PROPAGATE],t,e,i),this.__templateInfo&&this._runEffectsForTemplate(this.__templateInfo,t,e,i)}_runEffectsForTemplate(t,e,i,o){const n=(e,o)=>{_e(this,t.propertyEffects,e,i,o,t.nodeList);for(let n=t.firstChild;n;n=n.nextSibling)this._runEffectsForTemplate(n,e,i,o)};t.runEffects?t.runEffects(n,e,o):n(e,o)}linkPaths(t,e){t=Ie(t),e=Ie(e),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[t]=e}unlinkPaths(t){t=Ie(t),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[t]}notifySplices(t,e){let i={path:""};mi(this,he(this,t,i),i.path,e)}get(t,e){return he(e||this,t)}set(t,e,i){i?Ce(i,t,e):this[Ye.READ_ONLY]&&this[Ye.READ_ONLY][t]||this._setPendingPropertyOrPath(t,e,!0)&&this._invalidateProperties()}push(t,...e){let i={path:""},o=he(this,t,i),n=o.length,s=o.push(...e);return e.length&&Ai(this,o,i.path,n,e.length,[]),s}pop(t){let e={path:""},i=he(this,t,e),o=Boolean(i.length),n=i.pop();return o&&Ai(this,i,e.path,i.length,0,[n]),n}splice(t,e,i,...o){let n,s={path:""},r=he(this,t,s);return e<0?e=r.length-Math.floor(-e):e&&(e=Math.floor(e)),n=2===arguments.length?r.splice(e):r.splice(e,i,...o),(o.length||n.length)&&Ai(this,r,s.path,e,o.length,n),n}shift(t){let e={path:""},i=he(this,t,e),o=Boolean(i.length),n=i.shift();return o&&Ai(this,i,e.path,0,0,[n]),n}unshift(t,...e){let i={path:""},o=he(this,t,i),n=o.unshift(...e);return e.length&&Ai(this,o,i.path,0,e.length,[]),n}notifyPath(t,e){let i;if(1==arguments.length){let o={path:""};e=he(this,t,o),i=o.path}else i=Array.isArray(t)?Ie(t):t;this._setPendingPropertyOrPath(i,e,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(t,e){var i;this._addPropertyEffect(t,Ye.READ_ONLY),e&&(this["_set"+(i=t,i[0].toUpperCase()+i.substring(1))]=function(e){this._setProperty(t,e)})}_createPropertyObserver(t,e,i){let o={property:t,method:e,dynamicFn:Boolean(i)};this._addPropertyEffect(t,Ye.OBSERVE,{fn:Je,info:o,trigger:{name:t}}),i&&this._addPropertyEffect(e,Ye.OBSERVE,{fn:Je,info:o,trigger:{name:e}})}_createMethodObserver(t,e){let i=hi(t);if(!i)throw new Error("Malformed observer expression '"+t+"'");ri(this,i,Ye.OBSERVE,ai,null,e)}_createNotifyingProperty(t){this._addPropertyEffect(t,Ye.NOTIFY,{fn:Ke,info:{eventName:be(t)+"-changed",property:t}})}_createReflectedProperty(t){let e=this.constructor.attributeNameForProperty(t);"-"===e[0]?console.warn("Property "+t+" cannot be reflected to attribute "+e+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(t,Ye.REFLECT,{fn:Qe,info:{attrName:e}})}_createComputedProperty(t,e,i){let o=hi(e);if(!o)throw new Error("Malformed computed expression '"+e+"'");const n=ri(this,o,Ye.COMPUTE,ti,t,i);Ee(this,He)[t]=n}_marshalArgs(t,e,i){const o=this.__data,n=[];for(let s=0,a=t.length;s<a;s++){let{name:a,structured:l,wildcard:g,value:c,literal:I}=t[s];if(!I)if(g){const t=ge(a,e),n=ui(o,i,t?e:a);c={path:t?e:a,value:n,base:t?he(o,a):n}}else c=l?ui(o,i,a):o[a];if(r&&!this._overrideLegacyUndefined&&void 0===c&&t.length>1)return Re;n[s]=c}return n}static addPropertyEffect(t,e,i){this.prototype._addPropertyEffect(t,e,i)}static createPropertyObserver(t,e,i){this.prototype._createPropertyObserver(t,e,i)}static createMethodObserver(t,e){this.prototype._createMethodObserver(t,e)}static createNotifyingProperty(t){this.prototype._createNotifyingProperty(t)}static createReadOnlyProperty(t,e){this.prototype._createReadOnlyProperty(t,e)}static createReflectedProperty(t){this.prototype._createReflectedProperty(t)}static createComputedProperty(t,e,i){this.prototype._createComputedProperty(t,e,i)}static bindTemplate(t){return this.prototype._bindTemplate(t)}_bindTemplate(t,e){let i=this.constructor._parseTemplate(t),o=this.__preBoundTemplateInfo==i;if(!o)for(let t in i.propertyEffects)this._createPropertyAccessor(t);if(e)if(i=Object.create(i),i.wasPreBound=o,this.__templateInfo){const e=t._parentTemplateInfo||this.__templateInfo,o=e.lastChild;i.parent=e,e.lastChild=i,i.previousSibling=o,o?o.nextSibling=i:e.firstChild=i}else this.__templateInfo=i;else this.__preBoundTemplateInfo=i;return i}static _addTemplatePropertyEffect(t,e,i){(t.hostProps=t.hostProps||{})[e]=!0;let o=t.propertyEffects=t.propertyEffects||{};(o[e]=o[e]||[]).push(i)}_stampTemplate(t,e){e=e||this._bindTemplate(t,!0),bi.push(this);let i=super._stampTemplate(t,e);if(bi.pop(),e.nodeList=i.nodeList,!e.wasPreBound){let t=e.childNodes=[];for(let e=i.firstChild;e;e=e.nextSibling)t.push(e)}return i.templateInfo=e,function(t,e){let{nodeList:i,nodeInfoList:o}=e;if(o.length)for(let e=0;e<o.length;e++){let n=o[e],s=i[e],r=n.bindings;if(r)for(let e=0;e<r.length;e++){let i=r[e];ni(s,i),si(s,t,i)}s.__dataHost=t}}(this,e),this.__dataClientsReady&&(this._runEffectsForTemplate(e,this.__data,null,!1),this._flushClients()),i}_removeBoundDom(t){const e=t.templateInfo,{previousSibling:i,nextSibling:o,parent:s}=e;i?i.nextSibling=o:s&&(s.firstChild=o),o?o.previousSibling=i:s&&(s.lastChild=i),e.nextSibling=e.previousSibling=null;let r=e.childNodes;for(let t=0;t<r.length;t++){let e=r[t];n(n(e).parentNode).removeChild(e)}}static _parseTemplateNode(t,i,o){let n=e._parseTemplateNode.call(this,t,i,o);if(t.nodeType===Node.TEXT_NODE){let e=this._parseBindings(t.textContent,i);e&&(t.textContent=di(e)||" ",ei(this,i,o,"text","textContent",e),n=!0)}return n}static _parseTemplateNodeAttribute(t,i,o,n,s){let r=this._parseBindings(s,i);if(r){let e=n,s="property";Be.test(n)?s="attribute":"$"==n[n.length-1]&&(n=n.slice(0,-1),s="attribute");let a=di(r);return a&&"attribute"==s&&("class"==n&&t.hasAttribute("class")&&(a+=" "+t.getAttribute(n)),t.setAttribute(n,a)),"attribute"==s&&"disable-upgrade$"==e&&t.setAttribute(n,""),"input"===t.localName&&"value"===e&&t.setAttribute(e,""),t.removeAttribute(e),"property"===s&&(n=pe(n)),ei(this,i,o,s,n,r,a),!0}return e._parseTemplateNodeAttribute.call(this,t,i,o,n,s)}static _parseTemplateNestedTemplate(t,i,o){let n=e._parseTemplateNestedTemplate.call(this,t,i,o);const s=t.parentNode,r=o.templateInfo,g="dom-if"===s.localName,c="dom-repeat"===s.localName;a&&(g||c)&&(s.removeChild(t),(o=o.parentInfo).templateInfo=r,o.noted=!0,n=!1);let I=r.hostProps;if(l&&g)I&&(i.hostProps=Object.assign(i.hostProps||{},I),a||(o.parentInfo.noted=!0));else{let t="{";for(let e in I){ei(this,i,o,"property","_host_"+e,[{mode:t,source:e,dependencies:[e],hostProp:!0}])}}return n}static _parseBindings(t,e){let i,o=[],n=0;for(;null!==(i=Ii.exec(t));){i.index>n&&o.push({literal:t.slice(n,i.index)});let s=i[1][0],r=Boolean(i[2]),a=i[3].trim(),l=!1,g="",c=-1;"{"==s&&(c=a.indexOf("::"))>0&&(g=a.substring(c+2),a=a.substring(0,c),l=!0);let I=hi(a),d=[];if(I){let{args:t,methodName:i}=I;for(let e=0;e<t.length;e++){let i=t[e];i.literal||d.push(i)}let o=e.dynamicFns;(o&&o[i]||I.static)&&(d.push(i),I.dynamicFn=!0)}else d.push(a);o.push({source:a,mode:s,negate:r,customEvent:l,signature:I,dependencies:d,event:g}),n=Ii.lastIndex}if(n&&n<t.length){let e=t.substring(n);e&&o.push({literal:e})}return o.length?o:null}static _evaluateBinding(t,e,i,o,n,s){let r;return r=e.signature?ai(t,i,o,0,e.signature):i!=e.source?he(t,e.source):s&&ae(i)?he(t,i):t.__data[i],e.negate&&(r=!r),r}}})),bi=[];const Mi=M((t=>{const e=Ze(t);function i(t){const e=Object.getPrototypeOf(t);return e.prototype instanceof n?e:null}function o(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",t))){let e=null;if(t.hasOwnProperty(JSCompiler_renameProperty("properties",t))){const i=t.properties;i&&(e=
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function(t){const e={};for(let i in t){const o=t[i];e[i]="function"==typeof o?{type:o}:o}return e}(i))}t.__ownProperties=e}return t.__ownProperties}class n extends e{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){this.prototype;const t=this._properties;this.__observedAttributes=t?Object.keys(t).map((t=>this.prototype._addPropertyToAttributeMap(t))):[]}return this.__observedAttributes}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const t=i(this);t&&t.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const t=o(this);t&&this.createProperties(t)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const t=i(this);this.__properties=Object.assign({},t&&t._properties,o(this))}return this.__properties}static typeForProperty(t){const e=this._properties[t];return e&&e.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return n})),Zi=window.ShadyCSS&&window.ShadyCSS.cssBuild,Ni=M((s=>{const r=Mi(pi(s));function a(t,e,i,o){i.computed&&(i.readOnly=!0),i.computed&&(t._hasReadOnlyEffect(e)?console.warn(`Cannot redefine computed property '${e}'.`):t._createComputedProperty(e,i.computed,o)),i.readOnly&&!t._hasReadOnlyEffect(e)?t._createReadOnlyProperty(e,!i.computed):!1===i.readOnly&&t._hasReadOnlyEffect(e)&&console.warn(`Cannot make readOnly property '${e}' non-readOnly.`),i.reflectToAttribute&&!t._hasReflectEffect(e)?t._createReflectedProperty(e):!1===i.reflectToAttribute&&t._hasReflectEffect(e)&&console.warn(`Cannot make reflected property '${e}' non-reflected.`),i.notify&&!t._hasNotifyEffect(e)?t._createNotifyingProperty(e):!1===i.notify&&t._hasNotifyEffect(e)&&console.warn(`Cannot make notify property '${e}' non-notify.`),i.observer&&t._createPropertyObserver(e,i.observer,o[i.observer]),t._addPropertyToAttributeMap(e)}function l(t,e,i,o){if(!Zi){const n=e.content.querySelectorAll("style"),s=se(e),r=function(t){let e=ee(t);return e?re(e):[]}(i),a=e.content.firstElementChild;for(let i=0;i<r.length;i++){let n=r[i];n.textContent=t._processStyleText(n.textContent,o),e.content.insertBefore(n,a)}let l=0;for(let e=0;e<s.length;e++){let i=s[e],r=n[l];r!==i?(i=i.cloneNode(!0),r.parentNode.insertBefore(i,r)):l++,i.textContent=t._processStyleText(i.textContent,o)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(e,i),u&&Zi&&m){const i=e.content.querySelectorAll("style");if(i){let e="";Array.from(i).forEach((t=>{e+=t.textContent,t.parentNode.removeChild(t)})),t._styleSheet=new CSSStyleSheet,t._styleSheet.replaceSync(e)}}}return class extends r{static get polymerElementVersion(){return"3.5.1"}static _finalizeClass(){r._finalizeClass.call(this);const t=((e=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",e))||(e.__ownObservers=e.hasOwnProperty(JSCompiler_renameProperty("observers",e))?e.observers:null),e.__ownObservers);var e;t&&this.createObservers(t,this._properties),this._prepareTemplate()}static _prepareTemplate(){let t=this.template;t&&("string"==typeof t?(console.error("template getter must return HTMLTemplateElement"),t=null):I||(t=t.cloneNode(!0))),this.prototype._template=t}static createProperties(t){for(let e in t)a(this.prototype,e,t[e],t)}static createObservers(t,e){const i=this.prototype;for(let o=0;o<t.length;o++)i._createMethodObserver(t[o],e)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let t=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof t&&(t=t()),this._template=void 0!==t?t:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(t){let e=null;if(t&&(!i||A)&&(e=Ft.import(t,"template"),i&&!e))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${t}`);return e}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(t){this._template=t}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const t=this.importMeta;if(t)this._importPath=e(t.url);else{const t=Ft.import(this.is);this._importPath=t&&t.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=d,this.importPath=this.constructor.importPath;let t=function(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",t))){t.__propertyDefaults=null;let e=t._properties;for(let i in e){let o=e[i];"value"in o&&(t.__propertyDefaults=t.__propertyDefaults||{},t.__propertyDefaults[i]=o)}}return t.__propertyDefaults}(this.constructor);if(t)for(let e in t){let i=t[e];if(this._canApplyPropertyDefault(e)){let t="function"==typeof i.value?i.value.call(this):i.value;this._hasAccessor(e)?this._setPendingProperty(e,t,!0):this[e]=t}}}_canApplyPropertyDefault(t){return!this.hasOwnProperty(t)}static _processStyleText(t,e){return o(t,e)}static _finalizeTemplate(e){const i=this.prototype._template;if(i&&!i.__polymerFinalized){i.__polymerFinalized=!0;const o=this.importPath;l(this,i,e,o?t(o):""),this.prototype._bindTemplate(i)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(t){const e=n(this);if(e.attachShadow)return t?(e.shadowRoot||(e.attachShadow({mode:"open",shadyUpgradeFragment:t}),e.shadowRoot.appendChild(t),this.constructor._styleSheet&&(e.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),h&&window.ShadyDOM&&window.ShadyDOM.flushInitial(e.shadowRoot),e.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(t){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,t)}resolveUrl(e,i){return!i&&this.importPath&&(i=t(this.importPath)),t(e,i)}static _parseTemplateContent(t,e,i){return e.dynamicFns=e.dynamicFns||this._properties,r._parseTemplateContent.call(this,t,e,i)}static _addTemplatePropertyEffect(t,e,i){return!C||e in this._properties||i.info.part.signature&&i.info.part.signature.static||i.info.part.hostProp||t.nestedTemplate||console.warn(`Property '${e}' used in template but not declared in 'properties'; attribute will not be observed.`),r._addTemplatePropertyEffect.call(this,t,e,i)}}})),yi=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:t=>t});
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
 */class fi{constructor(t,e){Ti(t,e);const i=e.reduce(((e,i,o)=>e+wi(i)+t[o+1]),t[0]);this.value=i.toString()}toString(){return this.value}}function wi(t){if(t instanceof fi)return t.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)}const vi=function(t,...e){Ti(t,e);const i=document.createElement("template");let o=e.reduce(((e,i,o)=>e+function(t){if(t instanceof HTMLTemplateElement)return t.innerHTML;if(t instanceof fi)return wi(t);throw new Error(`non-template value passed to Polymer's html function: ${t}`)}(i)+t[o+1]),t[0]);return yi&&(o=yi.createHTML(o)),i.innerHTML=o,i},Ti=(t,e)=>{if(!Array.isArray(t)||!Array.isArray(t.raw)||e.length!==t.length-1)throw new TypeError("Invalid call to the html template tag")},ji=Ni(HTMLElement),Oi=M((t=>class extends t{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(t){this._setAriaDisabled(t)}_setAriaDisabled(t){t?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}}));
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let Di=0,ki=0;const xi=[];let zi=0,Li=!1;const Wi=document.createTextNode("");new window.MutationObserver((function(){Li=!1;const t=xi.length;for(let e=0;e<t;e++){const t=xi[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}xi.splice(0,t),ki+=t})).observe(Wi,{characterData:!0});const Gi={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},Si={run:t=>window.requestAnimationFrame(t),cancel(t){window.cancelAnimationFrame(t)}},Ri={run:t=>window.requestIdleCallback?window.requestIdleCallback(t):window.setTimeout(t,16),cancel(t){window.cancelIdleCallback?window.cancelIdleCallback(t):window.clearTimeout(t)}},Yi={run(t){Li||(Li=!0,Wi.textContent=zi,zi+=1),xi.push(t);const e=Di;return Di+=1,e},cancel(t){const e=t-ki;if(e>=0){if(!xi[e])throw new Error(`invalid async handle: ${t}`);xi[e]=null}}},Hi=!1,Bi=t=>t,Ei="string"==typeof document.head.style.touchAction,_i="__polymerGestures",Xi="__polymerGesturesHandled",Pi="__polymerGesturesTouchAction",Ji=["mousedown","mousemove","mouseup","click"],Vi=[0,1,4,2],Ui=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Ki(t){return Ji.indexOf(t)>-1}let Qi=!1;function Fi(t){if(!Ki(t)&&"touchend"!==t)return Ei&&Qi&&Hi?{passive:!0}:void 0}!function(){try{const t=Object.defineProperty({},"passive",{get(){Qi=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();const $i=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),qi={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function to(t){const e=t.type;if(!Ki(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!Ui&&(e=Vi[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}const eo={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function io(t,e,i){t.movefn=e,t.upfn=i,document.addEventListener("mousemove",e),document.addEventListener("mouseup",i)}function oo(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}const no=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],so={},ro=[];function ao(t){const e=no(t);return e.length>0?e[0]:t.target}function lo(t){const e=t.type,i=t.currentTarget[_i];if(!i)return;const o=i[e];if(!o)return;if(!t[Xi]&&(t[Xi]={},e.startsWith("touch"))){const i=t.changedTouches[0];if("touchstart"===e&&1===t.touches.length&&(eo.touch.id=i.identifier),eo.touch.id!==i.identifier)return;Ei||"touchstart"!==e&&"touchmove"!==e||function(t){const e=t.changedTouches[0],i=t.type;if("touchstart"===i)eo.touch.x=e.clientX,eo.touch.y=e.clientY,eo.touch.scrollDecided=!1;else if("touchmove"===i){if(eo.touch.scrollDecided)return;eo.touch.scrollDecided=!0;const i=function(t){let e="auto";const i=no(t);for(let t,o=0;o<i.length;o++)if(t=i[o],t[Pi]){e=t[Pi];break}return e}(t);let o=!1;const n=Math.abs(eo.touch.x-e.clientX),s=Math.abs(eo.touch.y-e.clientY);t.cancelable&&("none"===i?o=!0:"pan-x"===i?o=s>n:"pan-y"===i&&(o=n>s)),o?t.preventDefault():ho("track")}}(t)}const n=t[Xi];if(!n.skip){for(let e,i=0;i<ro.length;i++)e=ro[i],o[e.name]&&!n[e.name]&&e.flow&&e.flow.start.indexOf(t.type)>-1&&e.reset&&e.reset();for(let i,s=0;s<ro.length;s++)i=ro[s],o[i.name]&&!n[i.name]&&(n[i.name]=!0,i[e](t))}}function go(t,e,i){return!!so[e]&&(function(t,e,i){const o=so[e],n=o.deps,s=o.name;let r=t[_i];r||(t[_i]=r={});for(let e,i,o=0;o<n.length;o++)e=n[o],$i&&Ki(e)&&"click"!==e||(i=r[e],i||(r[e]=i={_count:0}),0===i._count&&t.addEventListener(e,lo,Fi(e)),i[s]=(i[s]||0)+1,i._count=(i._count||0)+1);t.addEventListener(e,i),o.touchAction&&function(t,e){Ei&&t instanceof HTMLElement&&Yi.run((()=>{t.style.touchAction=e}));t[Pi]=e}(t,o.touchAction)}(t,e,i),!0)}function co(t){ro.push(t);for(let e=0;e<t.emits.length;e++)so[t.emits[e]]=t}function Io(t,e,i){const o=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(o.detail=i,Bi(t).dispatchEvent(o),o.defaultPrevented){const t=i.preventer||i.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function ho(t){const e=function(t){for(let e,i=0;i<ro.length;i++){e=ro[i];for(let i,o=0;o<e.emits.length;o++)if(i=e.emits[o],i===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function Co(t,e,i,o){e&&Io(e,t,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:o,prevent:t=>ho(t)})}function uo(t,e,i){if(t.prevent)return!1;if(t.started)return!0;const o=Math.abs(t.x-e),n=Math.abs(t.y-i);return o>=5||n>=5}function mo(t,e,i){if(!e)return;const o=t.moves[t.moves.length-2],n=t.moves[t.moves.length-1],s=n.x-t.x,r=n.y-t.y;let a,l=0;o&&(a=n.x-o.x,l=n.y-o.y),Io(e,"track",{state:t.state,x:i.clientX,y:i.clientY,dx:s,dy:r,ddx:a,ddy:l,sourceEvent:i,hover:()=>function(t,e){let i=document.elementFromPoint(t,e),o=i;for(;o&&o.shadowRoot&&!window.ShadyDOM;){const n=o;if(o=o.shadowRoot.elementFromPoint(t,e),n===o)break;o&&(i=o)}return i}(i.clientX,i.clientY)})}function Ao(t,e,i){const o=Math.abs(e.clientX-t.x),n=Math.abs(e.clientY-t.y),s=ao(i||e);!s||qi[s.localName]&&s.hasAttribute("disabled")||(isNaN(o)||isNaN(n)||o<=25&&n<=25||function(t){if("click"===t.type){if(0===t.detail)return!0;const e=ao(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;const i=e.getBoundingClientRect(),o=t.pageX,n=t.pageY;return!(o>=i.left&&o<=i.right&&n>=i.top&&n<=i.bottom)}return!1}(e))&&(t.prevent||Io(s,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:i}))}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */co({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){oo(this.info)},mousedown(t){if(!to(t))return;const e=ao(t),i=this;io(this.info,(t=>{to(t)||(Co("up",e,t),oo(i.info))}),(t=>{to(t)&&Co("up",e,t),oo(i.info)})),Co("down",e,t)},touchstart(t){Co("down",ao(t),t.changedTouches[0],t)},touchend(t){Co("up",ao(t),t.changedTouches[0],t)}}),co({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,oo(this.info)},mousedown(t){if(!to(t))return;const e=ao(t),i=this,o=t=>{const o=t.clientX,n=t.clientY;uo(i.info,o,n)&&(i.info.state=i.info.started?"mouseup"===t.type?"end":"track":"start","start"===i.info.state&&ho("tap"),i.info.addMove({x:o,y:n}),to(t)||(i.info.state="end",oo(i.info)),e&&mo(i.info,e,t),i.info.started=!0)};io(this.info,o,(t=>{i.info.started&&o(t),oo(i.info)})),this.info.x=t.clientX,this.info.y=t.clientY},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove(t){const e=ao(t),i=t.changedTouches[0],o=i.clientX,n=i.clientY;uo(this.info,o,n)&&("start"===this.info.state&&ho("tap"),this.info.addMove({x:o,y:n}),mo(this.info,e,i),this.info.state="track",this.info.started=!0)},touchend(t){const e=ao(t),i=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),mo(this.info,e,i))}}),co({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(t){to(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click(t){to(t)&&Ao(this.info,t)},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend(t){Ao(this.info,t.changedTouches[0],t)}});const po=M((t=>class extends t{ready(){super.ready(),this.addEventListener("keydown",(t=>{this._onKeyDown(t)})),this.addEventListener("keyup",(t=>{this._onKeyUp(t)}))}_onKeyDown(t){switch(t.key){case"Enter":this._onEnter(t);break;case"Escape":this._onEscape(t)}}_onKeyUp(t){}_onEnter(t){}_onEscape(t){}})),bo=t=>class extends(Oi(po(t))){get _activeKeys(){return[" "]}ready(){super.ready(),go(this,"down",(t=>{this._shouldSetActive(t)&&this._setActive(!0)})),go(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(t){return!this.disabled}_onKeyDown(t){super._onKeyDown(t),this._shouldSetActive(t)&&this._activeKeys.includes(t.key)&&(this._setActive(!0),document.addEventListener("keyup",(t=>{this._activeKeys.includes(t.key)&&this._setActive(!1)}),{once:!0}))}_setActive(t){this.toggleAttribute("active",t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Mo=M((t=>class extends t{constructor(){super(),this.__controllers=new Set}connectedCallback(){super.connectedCallback(),this.__controllers.forEach((t=>{t.hostConnected&&t.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.__controllers.forEach((t=>{t.hostDisconnected&&t.hostDisconnected()}))}addController(t){this.__controllers.add(t),void 0!==this.$&&this.isConnected&&t.hostConnected&&t.hostConnected()}removeController(t){this.__controllers.delete(t)}})),Zo=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,No=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */function yo(t,e){if("function"!=typeof t)return;const i=Zo.exec(t.toString());if(i)try{t=new Function(i[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(e)}window.Vaadin=window.Vaadin||{};const fo=function(t,e){if(window.Vaadin.developmentMode)return yo(t,e)};function wo(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(No?!(No&&Object.keys(No).map((t=>No[t])).filter((t=>t.productionMode)).length>0):!yo((function(){return!0})))}catch(t){return!1}}());
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
class vo{static debounce(t,e,i){return t instanceof vo?t._cancelAsync():t=new vo,t.setConfig(e,i),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run((()=>{this._timer=null,To.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),To.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}let To=new Set;function jo(t){To.add(t)}function Oo(){const t=Boolean(To.size);return To.forEach((t=>{try{t.flush()}catch(t){setTimeout((()=>{throw t}))}})),t}const Do=()=>{let t;do{t=Oo()}while(t)};
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class ko{static detectScrollType(){const t=document.createElement("div");t.textContent="ABCD",t.dir="rtl",t.style.fontSize="14px",t.style.width="4px",t.style.height="1px",t.style.position="absolute",t.style.top="-1000px",t.style.overflow="scroll",document.body.appendChild(t);let e="reverse";return t.scrollLeft>0?e="default":(t.scrollLeft=2,t.scrollLeft<2&&(e="negative")),document.body.removeChild(t),e}static getNormalizedScrollLeft(t,e,i){const{scrollLeft:o}=i;if("rtl"!==e||!t)return o;switch(t){case"negative":return i.scrollWidth-i.clientWidth+o;case"reverse":return i.scrollWidth-i.clientWidth-o;default:return o}}static setNormalizedScrollLeft(t,e,i,o){if("rtl"===e&&t)switch(t){case"negative":i.scrollLeft=i.clientWidth-i.scrollWidth+o;break;case"reverse":i.scrollLeft=i.scrollWidth-i.clientWidth-o;break;default:i.scrollLeft=o}else i.scrollLeft=o}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const xo=[];let zo;function Lo(t,e,i=t.getAttribute("dir")){e?t.setAttribute("dir",e):null!=i&&t.removeAttribute("dir")}function Wo(){return document.documentElement.getAttribute("dir")}new MutationObserver((function(){const t=Wo();xo.forEach((e=>{Lo(e,t)}))})).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const Go=t=>class extends t{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:t=>t||"",toAttribute:t=>""===t?null:t}}}}static finalize(){super.finalize(),zo||(zo=ko.detectScrollType())}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),Lo(this,Wo(),null))}attributeChangedCallback(t,e,i){if(super.attributeChangedCallback(t,e,i),"dir"!==t)return;const o=Wo(),n=i===o&&-1===xo.indexOf(this),s=!i&&e&&-1===xo.indexOf(this),r=i!==o&&e===o;n||s?(this.__subscribe(),Lo(this,o,i)):r&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=xo.includes(this),this.__unsubscribe()}_valueToNodeAttribute(t,e,i){("dir"!==i||""!==e||t.hasAttribute("dir"))&&super._valueToNodeAttribute(t,e,i)}_attributeToProperty(t,e,i){"dir"!==t||e?super._attributeToProperty(t,e,i):this.dir=""}__subscribe(){xo.includes(this)||xo.push(this)}__unsubscribe(){xo.includes(this)&&xo.splice(xo.indexOf(this),1)}__getNormalizedScrollLeft(t){return ko.getNormalizedScrollLeft(zo,this.getAttribute("dir")||"ltr",t)}__setNormalizedScrollLeft(t,e){return ko.setNormalizedScrollLeft(zo,this.getAttribute("dir")||"ltr",t,e)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let So;window.Vaadin=window.Vaadin||{},window.Vaadin.registrations=window.Vaadin.registrations||[],window.Vaadin.developmentModeCallback=window.Vaadin.developmentModeCallback||{},window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){fo(wo)};const Ro=new Set,Yo=t=>class extends(Go(t)){static get version(){return"23.5.2"}static finalize(){super.finalize();const{is:t}=this;t&&!Ro.has(t)&&(window.Vaadin.registrations.push(this),Ro.add(t),window.Vaadin.developmentModeCallback&&(So=vo.debounce(So,Ri,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),jo(So)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let Ho=0;
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
class Bo extends EventTarget{static generateId(t,e){return`${t||"default"}-${e.localName}-${Ho++}`}constructor(t,e,i,o,n){super(),this.host=t,this.slotName=e,this.slotFactory=i,this.slotInitializer=o,n&&(this.defaultId=Bo.generateId(e,t))}hostConnected(){if(!this.initialized){let t=this.getSlotChild();t?(this.node=t,this.initCustomNode(t)):t=this.attachDefaultNode(),this.initNode(t),this.observe(),this.initialized=!0}}attachDefaultNode(){const{host:t,slotName:e,slotFactory:i}=this;let o=this.defaultNode;return!o&&i&&(o=i(t),o instanceof Element&&(""!==e&&o.setAttribute("slot",e),this.node=o,this.defaultNode=o)),o&&t.appendChild(o),o}getSlotChild(){const{slotName:t}=this;return Array.from(this.host.childNodes).find((e=>e.nodeType===Node.ELEMENT_NODE&&e.slot===t||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()&&""===t))}initNode(t){const{slotInitializer:e}=this;e&&e(this.host,t)}initCustomNode(t){}teardownNode(t){}observe(){const{slotName:t}=this,e=""===t?"slot:not([name])":`slot[name=${t}]`,i=this.host.shadowRoot.querySelector(e);this.__slotObserver=new p(i,(t=>{const e=this.node,i=t.addedNodes.find((t=>t!==e));t.removedNodes.length&&t.removedNodes.forEach((t=>{this.teardownNode(t)})),i&&(e&&e.isConnected&&this.host.removeChild(e),this.node=i,i!==this.defaultNode&&(this.initCustomNode(i),this.initNode(i)))}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class Eo extends Bo{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,void 0!==this.context&&(t.context=this.context),void 0!==this.manual&&(t.manual=this.manual),void 0!==this.opened&&(t.opened=this.opened),void 0!==this.position&&(t._position=this.position),void 0!==this.shouldShow&&(t.shouldShow=this.shouldShow)}setContext(t){this.context=t;const e=this.node;e&&(e.context=t)}setManual(t){this.manual=t;const e=this.node;e&&(e.manual=t)}setOpened(t){this.opened=t;const e=this.node;e&&(e.opened=t)}setPosition(t){this.position=t;const e=this.node;e&&(e._position=t)}setShouldShow(t){this.shouldShow=t;const e=this.node;e&&(e.shouldShow=t)}setTarget(t){this.target=t;const e=this.node;e&&(e.target=t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */let _o=!1;function Xo(){return _o}function Po(t){return null===t.offsetParent&&0===t.clientWidth&&0===t.clientHeight||function(t){const e=t.style;if("hidden"===e.visibility||"none"===e.display)return!0;const i=window.getComputedStyle(t);return"hidden"===i.visibility||"none"===i.display}(t)}window.addEventListener("keydown",(()=>{_o=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{_o=!1}),{capture:!0});
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
const Jo=M((t=>class extends t{static get properties(){return{stateTarget:{type:Object,observer:"_stateTargetChanged"}}}static get delegateAttrs(){return[]}static get delegateProps(){return[]}ready(){super.ready(),this._createDelegateAttrsObserver(),this._createDelegatePropsObserver()}_stateTargetChanged(t){t&&(this._ensureAttrsDelegated(),this._ensurePropsDelegated())}_createDelegateAttrsObserver(){this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`)}_createDelegatePropsObserver(){this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`)}_ensureAttrsDelegated(){this.constructor.delegateAttrs.forEach((t=>{this._delegateAttribute(t,this[t])}))}_ensurePropsDelegated(){this.constructor.delegateProps.forEach((t=>{this._delegateProperty(t,this[t])}))}_delegateAttrsChanged(...t){this.constructor.delegateAttrs.forEach(((e,i)=>{this._delegateAttribute(e,t[i])}))}_delegatePropsChanged(...t){this.constructor.delegateProps.forEach(((e,i)=>{this._delegateProperty(e,t[i])}))}_delegateAttribute(t,e){this.stateTarget&&("invalid"===t&&this._delegateAttribute("aria-invalid",!!e&&"true"),"boolean"==typeof e?this.stateTarget.toggleAttribute(t,e):e?this.stateTarget.setAttribute(t,e):this.stateTarget.removeAttribute(t))}_delegateProperty(t,e){this.stateTarget&&(this.stateTarget[t]=e)}})),Vo=M((t=>class extends t{static get properties(){return{inputElement:{type:Object,readOnly:!0,observer:"_inputElementChanged"},type:{type:String,readOnly:!0},value:{type:String,value:"",observer:"_valueChanged",notify:!0},_hasInputValue:{type:Boolean,value:!1,observer:"_hasInputValueChanged"}}}constructor(){super(),this._boundOnInput=this.__onInput.bind(this),this._boundOnChange=this._onChange.bind(this)}clear(){this.value=""}_addInputListeners(t){t.addEventListener("input",this._boundOnInput),t.addEventListener("change",this._boundOnChange)}_removeInputListeners(t){t.removeEventListener("input",this._boundOnInput),t.removeEventListener("change",this._boundOnChange)}_forwardInputValue(t){this.inputElement&&(this.inputElement.value=null!=t?t:"")}_inputElementChanged(t,e){t?this._addInputListeners(t):e&&this._removeInputListeners(e)}_hasInputValueChanged(t,e){(t||e)&&this.dispatchEvent(new CustomEvent("has-input-value-changed"))}__onInput(t){this._setHasInputValue(t),this._onInput(t)}_onInput(t){const e=t.composedPath()[0];this.__userInput=t.isTrusted,this.value=e.value,this.__userInput=!1}_onChange(t){}_toggleHasValue(t){this.toggleAttribute("has-value",t)}_valueChanged(t,e){this._toggleHasValue(this._hasValue),""===t&&void 0===e||this.__userInput||this._forwardInputValue(t)}get _hasValue(){return null!=this.value&&""!==this.value}_setHasInputValue(t){const e=t.composedPath()[0];this._hasInputValue=e.value.length>0}})),Uo=M((t=>class extends(Jo(Oi(Vo(t)))){static get properties(){return{checked:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0}}}static get delegateProps(){return[...super.delegateProps,"checked"]}_onChange(t){const e=t.target;var i;this._toggleChecked(e.checked),(i=e).getRootNode().activeElement!==i&&e.focus()}_toggleChecked(t){this.checked=t}})),Ko=M((t=>class extends t{get _keyboardActive(){return Xo()}ready(){this.addEventListener("focusin",(t=>{this._shouldSetFocus(t)&&this._setFocused(!0)})),this.addEventListener("focusout",(t=>{this._shouldRemoveFocus(t)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(t){this.toggleAttribute("focused",t),this.toggleAttribute("focus-ring",t&&this._keyboardActive)}_shouldSetFocus(t){return!0}_shouldRemoveFocus(t){return!0}})),Qo=t=>class extends(Oi(t)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(t,e){super._disabledChanged(t,e),t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):e&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(t){this.disabled&&-1!==t&&(this._lastTabIndex=t,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Fo=M((t=>class extends(Ko(Qo(t))){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged"},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame((()=>{this.focus(),this.setAttribute("focus-ring","")}))}focus(){this.focusElement&&!this.disabled&&(this.focusElement.focus(),this._setFocused(!0))}blur(){this.focusElement&&(this.focusElement.blur(),this._setFocused(!1))}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(t,e){t?(t.disabled=this.disabled,this._addFocusListeners(t),this.__forwardTabIndex(this.tabindex)):e&&this._removeFocusListeners(e)}_addFocusListeners(t){t.addEventListener("blur",this._boundOnBlur),t.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(t){t.removeEventListener("blur",this._boundOnBlur),t.removeEventListener("focus",this._boundOnFocus)}_onFocus(t){t.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(t){t.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(t){return t.target===this.focusElement}_disabledChanged(t,e){super._disabledChanged(t,e),this.focusElement&&(this.focusElement.disabled=t),t&&this.blur()}_tabindexChanged(t){this.__forwardTabIndex(t)}__forwardTabIndex(t){void 0!==t&&this.focusElement&&(this.focusElement.tabIndex=t,-1!==t&&(this.tabindex=void 0)),this.disabled&&t&&(-1!==t&&(this._lastTabIndex=t),this.tabindex=void 0)}}));
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
class $o extends Bo{constructor(t,e){super(t,"input",(()=>document.createElement("input")),((t,i)=>{t.value&&(i.value=t.value),t.type&&i.setAttribute("type",t.type),i.id=this.defaultId,"function"==typeof e&&e(i)}),!0)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class qo extends Bo{constructor(t){super(t,"label",(()=>document.createElement("label")),((t,e)=>{this.__updateLabelId(e),this.__updateDefaultLabel(this.label),this.__observeLabel(e)}),!0)}get labelId(){return this.node.id}initCustomNode(t){this.__updateLabelId(t);const e=this.__hasLabel(t);this.__toggleHasLabel(e)}teardownNode(t){this.__labelObserver&&this.__labelObserver.disconnect();let e=this.getSlotChild();e||t===this.defaultNode||(e=this.attachDefaultNode(),this.initNode(e));const i=this.__hasLabel(e);this.__toggleHasLabel(i)}setLabel(t){this.label=t,this.__updateDefaultLabel(t)}__hasLabel(t){return!!t&&(t.children.length>0||this.__isNotEmpty(t.textContent))}__isNotEmpty(t){return Boolean(t&&""!==t.trim())}__observeLabel(t){this.__labelObserver=new MutationObserver((t=>{t.forEach((t=>{const e=t.target,i=e===this.node;if("attributes"===t.type)i&&e.id!==this.defaultId&&this.__updateLabelId(e);else if(i||e.parentElement===this.node){const t=this.__hasLabel(this.node);this.__toggleHasLabel(t)}}))})),this.__labelObserver.observe(t,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}__toggleHasLabel(t){this.host.toggleAttribute("has-label",t),this.dispatchEvent(new CustomEvent("label-changed",{detail:{hasLabel:t,node:this.node}}))}__updateDefaultLabel(t){if(this.defaultNode&&(this.defaultNode.textContent=t,this.defaultNode===this.node)){const e=this.__isNotEmpty(t);this.__toggleHasLabel(e)}}__updateLabelId(t){t.id||(t.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const tn=M((t=>class extends(Mo(t)){static get properties(){return{label:{type:String,observer:"_labelChanged"}}}get _labelId(){return this._labelController.labelId}get _labelNode(){return this._labelController.node}constructor(){super(),this._labelController=new qo(this)}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(t){this._labelController.setLabel(t)}}));
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class en{constructor(t,e){this.input=t,this.__preventDuplicateLabelClick=this.__preventDuplicateLabelClick.bind(this),e.addEventListener("label-changed",(t=>{this.__initLabel(t.detail.node)})),this.__initLabel(e.node)}__initLabel(t){t&&(t.addEventListener("click",this.__preventDuplicateLabelClick),this.input&&t.setAttribute("for",this.input.id))}__preventDuplicateLabelClick(){const t=e=>{e.stopImmediatePropagation(),this.input.removeEventListener("click",t)};this.input.addEventListener("click",t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class on{constructor(t,e,i){this.sourceSlot=t,this.targetFactory=e,this.copyCallback=i,t&&t.addEventListener("slotchange",(()=>{this.__copying?this.__copying=!1:this.__checkAndCopyNodesToSlotTarget()}))}hostConnected(){this.__sourceSlotObserver=new MutationObserver((()=>this.__checkAndCopyNodesToSlotTarget())),this.__copying||this.__checkAndCopyNodesToSlotTarget()}__checkAndCopyNodesToSlotTarget(){this.__sourceSlotObserver.disconnect();const t=this.targetFactory();if(!t)return;this.__slotTargetClones&&(this.__slotTargetClones.forEach((e=>{e.parentElement===t&&t.removeChild(e)})),delete this.__slotTargetClones);const e=this.sourceSlot.assignedNodes({flatten:!0}).filter((t=>!(t.nodeType===Node.TEXT_NODE&&""===t.textContent.trim())));e.length>0&&(t.innerHTML="",this.__copying=!0,this.__copyNodesToSlotTarget(e,t))}__copyNodesToSlotTarget(t,e){this.__slotTargetClones=this.__slotTargetClones||[],t.forEach((t=>{const i=t.cloneNode(!0);this.__slotTargetClones.push(i),e.appendChild(i),this.__sourceSlotObserver.observe(t,{attributes:!0,childList:!0,subtree:!0,characterData:!0})})),"function"==typeof this.copyCallback&&this.copyCallback(t)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class nn extends(tn(Uo(Fo(bo(Yo(Lt(Mo(ji)))))))){static get is(){return"vaadin-checkbox"}static get template(){return vi`
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
    `}static get properties(){return{indeterminate:{type:Boolean,notify:!0,value:!1,reflectToAttribute:!0},name:{type:String,value:""}}}static get delegateProps(){return[...super.delegateProps,"indeterminate"]}static get delegateAttrs(){return[...super.delegateAttrs,"name"]}constructor(){super(),this._setType("checkbox"),this.value="on"}ready(){super.ready(),this.addController(new $o(this,(t=>{this._setInputElement(t),this._setFocusElement(t),this.stateTarget=t,this.ariaTarget=t}))),this.addController(new en(this.inputElement,this._labelController)),this.addController(new on(this.$.noop,(()=>this._labelController.node),(()=>this.__warnDeprecated()))),this._tooltipController=new Eo(this),this.addController(this._tooltipController)}__warnDeprecated(){console.warn('WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.\nPlease use <label slot="label"> wrapper or the label property instead.')}_shouldSetActive(t){return"a"!==t.target.localName&&super._shouldSetActive(t)}_toggleChecked(t){this.indeterminate&&(this.indeterminate=!1),super._toggleChecked(t)}}
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
function sn(t){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(t):t.querySelector("template")&&console.warn(`WARNING: <template> inside <${t.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */customElements.define(nn.is,nn),jt("vaadin-grid",T`
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
  `,{moduleId:"lumo-grid"});const rn=t=>class extends t{static get properties(){return{resizable:{type:Boolean,value(){if("vaadin-grid-column-group"===this.localName)return;const t=this.parentNode;return t&&"vaadin-grid-column-group"===t.localName&&t.resizable||!1}},frozen:{type:Boolean,value:!1},frozenToEnd:{type:Boolean,value:!1},hidden:{type:Boolean,value:!1},header:{type:String},textAlign:{type:String},_lastFrozen:{type:Boolean,value:!1},_firstFrozenToEnd:{type:Boolean,value:!1},_order:Number,_reorderStatus:Boolean,_emptyCells:Array,_headerCell:Object,_footerCell:Object,_grid:Object,__initialized:{type:Boolean,value:!0},headerRenderer:Function,_headerRenderer:{type:Function,computed:"_computeHeaderRenderer(headerRenderer, header, __initialized)"},footerRenderer:Function,_footerRenderer:{type:Function,computed:"_computeFooterRenderer(footerRenderer, __initialized)"},__gridColumnElement:{type:Boolean,value:!0}}}static get observers(){return["_widthChanged(width, _headerCell, _footerCell, _cells.*)","_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)","_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells.*)","_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)","_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)","_orderChanged(_order, _headerCell, _footerCell, _cells.*)","_lastFrozenChanged(_lastFrozen)","_firstFrozenToEndChanged(_firstFrozenToEnd)","_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)","_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)","_resizableChanged(resizable, _headerCell)","_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)","_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)"]}connectedCallback(){super.connectedCallback(),requestAnimationFrame((()=>{this._grid&&this._allCells.forEach((t=>{t._content.parentNode||this._grid.appendChild(t._content)}))}))}disconnectedCallback(){super.disconnectedCallback(),requestAnimationFrame((()=>{this._grid||this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)}))})),this._gridValue=void 0}ready(){super.ready(),sn(this)}_findHostGrid(){let t=this;for(;t&&!/^vaadin.*grid(-pro)?$/.test(t.localName);)t=t.assignedSlot?t.assignedSlot.parentNode:t.parentNode;return t||void 0}get _grid(){return this._gridValue||(this._gridValue=this._findHostGrid()),this._gridValue}get _allCells(){return[].concat(this._cells||[]).concat(this._emptyCells||[]).concat(this._headerCell).concat(this._footerCell).filter((t=>t))}_renderHeaderAndFooter(){this._renderHeaderCellContent(this._headerRenderer,this._headerCell),this._renderFooterCellContent(this._footerRenderer,this._footerCell)}_flexGrowChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("flexGrow"),this._allCells.forEach((e=>{e.style.flexGrow=t}))}_orderChanged(t){this._allCells.forEach((e=>{e.style.order=t}))}_widthChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("width"),this._allCells.forEach((e=>{e.style.width=t}))}_frozenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozen",t),this._allCells.forEach((e=>e.toggleAttribute("frozen",t))),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_frozenToEndChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozenToEnd",t),this._allCells.forEach((e=>{this._grid&&e.parentElement===this._grid.$.sizer||e.toggleAttribute("frozen-to-end",t)})),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_lastFrozenChanged(t){this._allCells.forEach((e=>e.toggleAttribute("last-frozen",t))),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._lastFrozen=t)}_firstFrozenToEndChanged(t){this._allCells.forEach((e=>{this._grid&&e.parentElement===this._grid.$.sizer||e.toggleAttribute("first-frozen-to-end",t)})),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._firstFrozenToEnd=t)}_generateHeader(t){return t.substr(t.lastIndexOf(".")+1).replace(/([A-Z])/g,"-$1").toLowerCase().replace(/-/g," ").replace(/^./,(t=>t.toUpperCase()))}_reorderStatusChanged(t){this._allCells.forEach((e=>e.setAttribute("reorder-status",t)))}_resizableChanged(t,e){void 0!==t&&void 0!==e&&e&&[e].concat(this._emptyCells).forEach((e=>{if(e){const i=e.querySelector('[part~="resize-handle"]');if(i&&e.removeChild(i),t){const t=document.createElement("div");t.setAttribute("part","resize-handle"),e.appendChild(t)}}}))}_textAlignChanged(t){if(void 0===t||void 0===this._grid)return;if(-1===["start","end","center"].indexOf(t))return void console.warn('textAlign can only be set as "start", "end" or "center"');let e;"ltr"===getComputedStyle(this._grid).direction?"start"===t?e="left":"end"===t&&(e="right"):"start"===t?e="right":"end"===t&&(e="left"),this._allCells.forEach((i=>{i._content.style.textAlign=t,getComputedStyle(i._content).textAlign!==t&&(i._content.style.textAlign=e)}))}_hiddenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("hidden",t),!!t!=!!this._previousHidden&&this._grid&&(!0===t&&this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)})),this._grid._debouncerHiddenChanged=vo.debounce(this._grid._debouncerHiddenChanged,Si,(()=>{this._grid&&this._grid._renderColumnTree&&this._grid._renderColumnTree(this._grid._columnTree)})),this._grid._debounceUpdateFrozenColumn&&this._grid._debounceUpdateFrozenColumn(),this._grid._resetKeyboardNavigation&&this._grid._resetKeyboardNavigation()),this._previousHidden=t}_runRenderer(t,e,i){const o=[e._content,this];i&&i.item&&o.push(i),t.apply(this,o)}__renderCellsContent(t,e){!this.hidden&&this._grid&&e.forEach((e=>{if(!e.parentElement)return;const i=this._grid.__getRowModel(e.parentElement);t&&(e._renderer!==t&&this._clearCellContent(e),e._renderer=t,(i.item||t===this._headerRenderer||t===this._footerRenderer)&&this._runRenderer(t,e,i))}))}_clearCellContent(t){t._content.innerHTML="",delete t._content._$litPart$}_renderHeaderCellContent(t,e){e&&t&&(this.__renderCellsContent(t,[e]),this._grid&&e.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(e.parentElement))}_onHeaderRendererOrBindingChanged(t,e,...i){this._renderHeaderCellContent(t,e)}_renderBodyCellsContent(t,e){e&&t&&this.__renderCellsContent(t,e)}_onRendererOrBindingChanged(t,e,...i){this._renderBodyCellsContent(t,e)}_renderFooterCellContent(t,e){e&&t&&(this.__renderCellsContent(t,[e]),this._grid&&e.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(e.parentElement))}_onFooterRendererOrBindingChanged(t,e){this._renderFooterCellContent(t,e)}__setTextContent(t,e){t.textContent!==e&&(t.textContent=e)}__textHeaderRenderer(){this.__setTextContent(this._headerCell._content,this.header)}_defaultHeaderRenderer(){this.path&&this.__setTextContent(this._headerCell._content,this._generateHeader(this.path))}_defaultRenderer(t,e,{item:i}){this.path&&this.__setTextContent(t,this.get(this.path,i))}_defaultFooterRenderer(){}_computeHeaderRenderer(t,e){return t||(null!=e?this.__textHeaderRenderer:this._defaultHeaderRenderer)}_computeRenderer(t){return t||this._defaultRenderer}_computeFooterRenderer(t){return t||this._defaultFooterRenderer}};class an extends(rn(Go(ji))){static get is(){return"vaadin-grid-column"}static get properties(){return{width:{type:String,value:"100px"},flexGrow:{type:Number,value:1},renderer:Function,_renderer:{type:Function,computed:"_computeRenderer(renderer, __initialized)"},path:{type:String},autoWidth:{type:Boolean,value:!1},_focusButtonMode:{type:Boolean,value:!1},_cells:Array}}}customElements.define(an.is,an),
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
jt("vaadin-grid",T`
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
let ln=!1,gn=[],cn=[];function In(){ln=!0,requestAnimationFrame((function(){ln=!1,function(t){for(;t.length;)dn(t.shift())}(gn),setTimeout((function(){!function(t){for(let e=0,i=t.length;e<i;e++)dn(t.shift())}(cn)}))}))}function dn(t){const e=t[0],i=t[1],o=t[2];try{i.apply(e,o)}catch(t){setTimeout((()=>{throw t}))}}
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
const hn=t=>t.test(navigator.userAgent),Cn=t=>t.test(navigator.platform),un=hn(/Android/),mn=hn(/Chrome/)&&/Google Inc/.test(navigator.vendor);const An=hn(/Firefox/),pn=Cn(/^iPad/)||Cn(/^Mac/)&&navigator.maxTouchPoints>1,bn=Cn(/^iPhone/)||pn,Mn=hn(/^((?!chrome|android).)*safari/i),Zn=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(t){return!1}})(),Nn=navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/),yn=Nn&&Nn[1]>=8,fn={_ratio:.5,_scrollerPaddingTop:0,_scrollPosition:0,_physicalSize:0,_physicalAverage:0,_physicalAverageCount:0,_physicalTop:0,_virtualCount:0,_estScrollHeight:0,_scrollHeight:0,_viewportHeight:0,_viewportWidth:0,_physicalItems:null,_physicalSizes:null,_firstVisibleIndexVal:null,_lastVisibleIndexVal:null,_maxPages:2,_templateCost:0,get _physicalBottom(){return this._physicalTop+this._physicalSize},get _scrollBottom(){return this._scrollPosition+this._viewportHeight},get _virtualEnd(){return this._virtualStart+this._physicalCount-1},get _hiddenContentSize(){return this._physicalSize-this._viewportHeight},get _maxScrollTop(){return this._estScrollHeight-this._viewportHeight+this._scrollOffset},get _maxVirtualStart(){const t=this._virtualCount;return Math.max(0,t-this._physicalCount)},get _virtualStart(){return this._virtualStartVal||0},set _virtualStart(t){t=this._clamp(t,0,this._maxVirtualStart),this._virtualStartVal=t},get _physicalStart(){return this._physicalStartVal||0},set _physicalStart(t){(t%=this._physicalCount)<0&&(t=this._physicalCount+t),this._physicalStartVal=t},get _physicalEnd(){return(this._physicalStart+this._physicalCount-1)%this._physicalCount},get _physicalCount(){return this._physicalCountVal||0},set _physicalCount(t){this._physicalCountVal=t},get _optPhysicalSize(){return 0===this._viewportHeight?1/0:this._viewportHeight*this._maxPages},get _isVisible(){return Boolean(this.offsetWidth||this.offsetHeight)},get firstVisibleIndex(){let t=this._firstVisibleIndexVal;if(null==t){let e=this._physicalTop+this._scrollOffset;t=this._iterateItems(((t,i)=>{if(e+=this._getPhysicalSizeIncrement(t),e>this._scrollPosition)return i}))||0,this._firstVisibleIndexVal=t}return t},get lastVisibleIndex(){let t=this._lastVisibleIndexVal;if(null==t){let e=this._physicalTop+this._scrollOffset;this._iterateItems(((i,o)=>{e<this._scrollBottom&&(t=o),e+=this._getPhysicalSizeIncrement(i)})),this._lastVisibleIndexVal=t}return t},get _scrollOffset(){return this._scrollerPaddingTop+this.scrollOffset},_scrollHandler(){const t=Math.max(0,Math.min(this._maxScrollTop,this._scrollTop));let e=t-this._scrollPosition;const i=e>=0;if(this._scrollPosition=t,this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,Math.abs(e)>this._physicalSize&&this._physicalSize>0){e-=this._scrollOffset;const t=Math.round(e/this._physicalAverage);this._virtualStart+=t,this._physicalStart+=t,this._physicalTop=Math.min(Math.floor(this._virtualStart)*this._physicalAverage,this._scrollPosition),this._update()}else if(this._physicalCount>0){const t=this._getReusables(i);i?(this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length):(this._virtualStart-=t.indexes.length,this._physicalStart-=t.indexes.length),this._update(t.indexes,i?null:t.indexes),this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,0),Yi)}},_getReusables(t){let e,i,o;const n=[],s=this._hiddenContentSize*this._ratio,r=this._virtualStart,a=this._virtualEnd,l=this._physicalCount;let g=this._physicalTop+this._scrollOffset;const c=this._physicalBottom+this._scrollOffset,I=this._scrollPosition,d=this._scrollBottom;for(t?(e=this._physicalStart,i=I-g):(e=this._physicalEnd,i=c-d);o=this._getPhysicalSizeIncrement(e),i-=o,!(n.length>=l||i<=s);)if(t){if(a+n.length+1>=this._virtualCount)break;if(g+o>=I-this._scrollOffset)break;n.push(e),g+=o,e=(e+1)%l}else{if(r-n.length<=0)break;if(g+this._physicalSize-o<=d)break;n.push(e),g-=o,e=0===e?l-1:e-1}return{indexes:n,physicalTop:g-this._scrollOffset}},_update(t,e){if(!(t&&0===t.length||0===this._physicalCount)){if(this._assignModels(t),this._updateMetrics(t),e)for(;e.length;){const t=e.pop();this._physicalTop-=this._getPhysicalSizeIncrement(t)}this._positionItems(),this._updateScrollerSize()}},_isClientFull(){return 0!==this._scrollBottom&&this._physicalBottom-1>=this._scrollBottom&&this._physicalTop<=this._scrollPosition},_increasePoolIfNeeded(t){const e=this._clamp(this._physicalCount+t,3,this._virtualCount-this._virtualStart)-this._physicalCount;let i=Math.round(.5*this._physicalCount);if(!(e<0)){if(e>0){const t=window.performance.now();[].push.apply(this._physicalItems,this._createPool(e));for(let t=0;t<e;t++)this._physicalSizes.push(0);this._physicalCount+=e,this._physicalStart>this._physicalEnd&&this._isIndexRendered(this._focusedVirtualIndex)&&this._getPhysicalIndex(this._focusedVirtualIndex)<this._physicalEnd&&(this._physicalStart+=e),this._update(),this._templateCost=(window.performance.now()-t)/e,i=Math.round(.5*this._physicalCount)}this._virtualEnd>=this._virtualCount-1||0===i||(this._isClientFull()?this._physicalSize<this._optPhysicalSize&&this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,this._clamp(Math.round(50/this._templateCost),1,i)),Ri):this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,i),Yi))}},_render(){if(this.isAttached&&this._isVisible)if(0!==this._physicalCount){const t=this._getReusables(!0);this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length,this._update(t.indexes),this._update(),this._increasePoolIfNeeded(0)}else this._virtualCount>0&&(this.updateViewportBoundaries(),this._increasePoolIfNeeded(3))},_itemsChanged(t){"items"===t.path&&(this._virtualStart=0,this._physicalTop=0,this._virtualCount=this.items?this.items.length:0,this._physicalIndexForKey={},this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._physicalCount=this._physicalCount||0,this._physicalItems=this._physicalItems||[],this._physicalSizes=this._physicalSizes||[],this._physicalStart=0,this._scrollTop>this._scrollOffset&&this._resetScrollPosition(0),this._debounce("_render",this._render,Si))},_iterateItems(t,e){let i,o,n,s;if(2===arguments.length&&e){for(s=0;s<e.length;s++)if(i=e[s],o=this._computeVidx(i),null!=(n=t.call(this,i,o)))return n}else{for(i=this._physicalStart,o=this._virtualStart;i<this._physicalCount;i++,o++)if(null!=(n=t.call(this,i,o)))return n;for(i=0;i<this._physicalStart;i++,o++)if(null!=(n=t.call(this,i,o)))return n}},_computeVidx(t){return t>=this._physicalStart?this._virtualStart+(t-this._physicalStart):this._virtualStart+(this._physicalCount-this._physicalStart)+t},_positionItems(){this._adjustScrollPosition();let t=this._physicalTop;this._iterateItems((e=>{this.translate3d(0,`${t}px`,0,this._physicalItems[e]),t+=this._physicalSizes[e]}))},_getPhysicalSizeIncrement(t){return this._physicalSizes[t]},_adjustScrollPosition(){const t=0===this._virtualStart?this._physicalTop:Math.min(this._scrollPosition+this._physicalTop,0);if(0!==t){this._physicalTop-=t;const e=this._scrollPosition;!yn&&e>0&&this._resetScrollPosition(e-t)}},_resetScrollPosition(t){this.scrollTarget&&t>=0&&(this._scrollTop=t,this._scrollPosition=this._scrollTop)},_updateScrollerSize(t){this._estScrollHeight=this._physicalBottom+Math.max(this._virtualCount-this._physicalCount-this._virtualStart,0)*this._physicalAverage,((t=(t=t||0===this._scrollHeight)||this._scrollPosition>=this._estScrollHeight-this._physicalSize)||Math.abs(this._estScrollHeight-this._scrollHeight)>=this._viewportHeight)&&(this.$.items.style.height=`${this._estScrollHeight}px`,this._scrollHeight=this._estScrollHeight)},scrollToIndex(t){if("number"!=typeof t||t<0||t>this.items.length-1)return;if(Do(),0===this._physicalCount)return;t=this._clamp(t,0,this._virtualCount-1),(!this._isIndexRendered(t)||t>=this._maxVirtualStart)&&(this._virtualStart=t-1),this._assignModels(),this._updateMetrics(),this._physicalTop=this._virtualStart*this._physicalAverage;let e=this._physicalStart,i=this._virtualStart,o=0;const n=this._hiddenContentSize;for(;i<t&&o<=n;)o+=this._getPhysicalSizeIncrement(e),e=(e+1)%this._physicalCount,i+=1;this._updateScrollerSize(!0),this._positionItems(),this._resetScrollPosition(this._physicalTop+this._scrollOffset+o),this._increasePoolIfNeeded(0),this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null},_resetAverage(){this._physicalAverage=0,this._physicalAverageCount=0},_resizeHandler(){this._debounce("_render",(()=>{this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._isVisible?(this.updateViewportBoundaries(),this.toggleScrollListener(!0),this._resetAverage(),this._render()):this.toggleScrollListener(!1)}),Si)},_isIndexRendered(t){return t>=this._virtualStart&&t<=this._virtualEnd},_getPhysicalIndex(t){return(this._physicalStart+(t-this._virtualStart))%this._physicalCount},_clamp:(t,e,i)=>Math.min(i,Math.max(e,t)),_debounce(t,e,i){this._debouncers=this._debouncers||{},this._debouncers[t]=vo.debounce(this._debouncers[t],i,e.bind(this)),jo(this._debouncers[t])}},wn=1e3;class vn{constructor({createElements:t,updateElement:e,scrollTarget:i,scrollContainer:o,elementsContainer:n,reorderElements:s}){this.isAttached=!0,this._vidxOffset=0,this.createElements=t,this.updateElement=e,this.scrollTarget=i,this.scrollContainer=o,this.elementsContainer=n||o,this.reorderElements=s,this._maxPages=1.3,this.__placeholderHeight=200,this.__elementHeightQueue=Array(10),this.timeouts={SCROLL_REORDER:500,IGNORE_WHEEL:500,FIX_INVALID_ITEM_POSITIONING:100},this.__resizeObserver=new ResizeObserver((()=>this._resizeHandler())),"visible"===getComputedStyle(this.scrollTarget).overflow&&(this.scrollTarget.style.overflow="auto"),"static"===getComputedStyle(this.scrollContainer).position&&(this.scrollContainer.style.position="relative"),this.__resizeObserver.observe(this.scrollTarget),this.scrollTarget.addEventListener("scroll",(()=>this._scrollHandler())),this._scrollLineHeight=this._getScrollLineHeight(),this.scrollTarget.addEventListener("wheel",(t=>this.__onWheel(t))),this.reorderElements&&(this.scrollTarget.addEventListener("mousedown",(()=>{this.__mouseDown=!0})),this.scrollTarget.addEventListener("mouseup",(()=>{this.__mouseDown=!1,this.__pendingReorder&&this.__reorderElements()})))}get scrollOffset(){return 0}get adjustedFirstVisibleIndex(){return this.firstVisibleIndex+this._vidxOffset}get adjustedLastVisibleIndex(){return this.lastVisibleIndex+this._vidxOffset}scrollToIndex(t){if("number"!=typeof t||isNaN(t)||0===this.size||!this.scrollTarget.offsetHeight)return;t=this._clamp(t,0,this.size-1);const e=this.__getVisibleElements().length;let i=Math.floor(t/this.size*this._virtualCount);this._virtualCount-i<e?(i=this._virtualCount-(this.size-t),this._vidxOffset=this.size-this._virtualCount):i<e?t<wn?(i=t,this._vidxOffset=0):(i=wn,this._vidxOffset=t-i):this._vidxOffset=t-i,this.__skipNextVirtualIndexAdjust=!0,super.scrollToIndex(i),this.adjustedFirstVisibleIndex!==t&&this._scrollTop<this._maxScrollTop&&!this.grid&&(this._scrollTop-=this.__getIndexScrollOffset(t)||0),this._scrollHandler()}flush(){0!==this.scrollTarget.offsetHeight&&(this._resizeHandler(),Do(),this._scrollHandler(),this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.flush(),this.__scrollReorderDebouncer&&this.__scrollReorderDebouncer.flush(),this.__debouncerWheelAnimationFrame&&this.__debouncerWheelAnimationFrame.flush())}update(t=0,e=this.size-1){this.__getVisibleElements().forEach((i=>{i.__virtualIndex>=t&&i.__virtualIndex<=e&&this.__updateElement(i,i.__virtualIndex,!0)}))}_updateMetrics(t){Do();let e=0,i=0;const o=this._physicalAverageCount,n=this._physicalAverage;this._iterateItems(((t,o)=>{i+=this._physicalSizes[t],this._physicalSizes[t]=Math.ceil(this.__getBorderBoxHeight(this._physicalItems[t])),e+=this._physicalSizes[t],this._physicalAverageCount+=this._physicalSizes[t]?1:0}),t),this._physicalSize=this._physicalSize+e-i,this._physicalAverageCount!==o&&(this._physicalAverage=Math.round((n*o+e)/this._physicalAverageCount))}__getBorderBoxHeight(t){const e=getComputedStyle(t),i=parseFloat(e.height)||0;if("border-box"===e.boxSizing)return i;return i+(parseFloat(e.paddingBottom)||0)+(parseFloat(e.paddingTop)||0)+(parseFloat(e.borderBottomWidth)||0)+(parseFloat(e.borderTopWidth)||0)}__updateElement(t,e,i){t.style.paddingTop&&(t.style.paddingTop=""),this.__preventElementUpdates||t.__lastUpdatedIndex===e&&!i||(this.updateElement(t,e),t.__lastUpdatedIndex=e);const o=t.offsetHeight;if(0===o)t.style.paddingTop=`${this.__placeholderHeight}px`,requestAnimationFrame((()=>this._resizeHandler()));else{this.__elementHeightQueue.push(o),this.__elementHeightQueue.shift();const t=this.__elementHeightQueue.filter((t=>void 0!==t));this.__placeholderHeight=Math.round(t.reduce(((t,e)=>t+e),0)/t.length)}}__getIndexScrollOffset(t){const e=this.__getVisibleElements().find((e=>e.__virtualIndex===t));return e?this.scrollTarget.getBoundingClientRect().top-e.getBoundingClientRect().top:void 0}get size(){return this.__size}set size(t){if(t===this.size)return;let e,i;if(this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.cancel(),this._debouncers&&this._debouncers._increasePoolIfNeeded&&this._debouncers._increasePoolIfNeeded.cancel(),this.__preventElementUpdates=!0,t>0&&(e=this.adjustedFirstVisibleIndex,i=this.__getIndexScrollOffset(e)),this.__size=t,this._itemsChanged({path:"items"}),Do(),t>0){e=Math.min(e,t-1),this.scrollToIndex(e);const o=this.__getIndexScrollOffset(e);void 0!==i&&void 0!==o&&(this._scrollTop+=i-o)}this.elementsContainer.children.length||requestAnimationFrame((()=>this._resizeHandler())),this.__preventElementUpdates=!1,this._resizeHandler(),Do()}get _scrollTop(){return this.scrollTarget.scrollTop}set _scrollTop(t){this.scrollTarget.scrollTop=t}get items(){return{length:Math.min(this.size,1e5)}}get offsetHeight(){return this.scrollTarget.offsetHeight}get $(){return{items:this.scrollContainer}}updateViewportBoundaries(){const t=window.getComputedStyle(this.scrollTarget);this._scrollerPaddingTop=this.scrollTarget===this?0:parseInt(t["padding-top"],10),this._isRTL=Boolean("rtl"===t.direction),this._viewportWidth=this.elementsContainer.offsetWidth,this._viewportHeight=this.scrollTarget.offsetHeight,this._scrollPageHeight=this._viewportHeight-this._scrollLineHeight,this.grid&&this._updateGridMetrics()}setAttribute(){}_createPool(t){const e=this.createElements(t),i=document.createDocumentFragment();return e.forEach((t=>{t.style.position="absolute",i.appendChild(t),this.__resizeObserver.observe(t)})),this.elementsContainer.appendChild(i),e}_assignModels(t){this._iterateItems(((t,e)=>{const i=this._physicalItems[t];i.hidden=e>=this.size,i.hidden?delete i.__lastUpdatedIndex:(i.__virtualIndex=e+(this._vidxOffset||0),this.__updateElement(i,i.__virtualIndex))}),t)}_isClientFull(){return setTimeout((()=>{this.__clientFull=!0})),this.__clientFull||super._isClientFull()}translate3d(t,e,i,o){o.style.transform=`translateY(${e})`}toggleScrollListener(){}_scrollHandler(){if(0===this.scrollTarget.offsetHeight)return;this._adjustVirtualIndexOffset(this._scrollTop-(this.__previousScrollTop||0));const t=this.scrollTarget.scrollTop-this._scrollPosition;if(super._scrollHandler(),0!==this._physicalCount){const e=t>=0,i=this._getReusables(!e);i.indexes.length&&(this._physicalTop=i.physicalTop,e?(this._virtualStart-=i.indexes.length,this._physicalStart-=i.indexes.length):(this._virtualStart+=i.indexes.length,this._physicalStart+=i.indexes.length),this._resizeHandler())}t&&(this.__fixInvalidItemPositioningDebouncer=vo.debounce(this.__fixInvalidItemPositioningDebouncer,Gi.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),(()=>this.__fixInvalidItemPositioning()))),this.reorderElements&&(this.__scrollReorderDebouncer=vo.debounce(this.__scrollReorderDebouncer,Gi.after(this.timeouts.SCROLL_REORDER),(()=>this.__reorderElements()))),this.__previousScrollTop=this._scrollTop,0===this._scrollTop&&0!==this.firstVisibleIndex&&Math.abs(t)>0&&this.scrollToIndex(0)}__fixInvalidItemPositioning(){if(!this.scrollTarget.isConnected)return;const t=this._physicalTop>this._scrollTop,e=this._physicalBottom<this._scrollBottom,i=0===this.adjustedFirstVisibleIndex,o=this.adjustedLastVisibleIndex===this.size-1;if(t&&!i||e&&!o){const t=e,i=this._ratio;this._ratio=0,this._scrollPosition=this._scrollTop+(t?-1:1),this._scrollHandler(),this._ratio=i}}__onWheel(t){if(t.ctrlKey||this._hasScrolledAncestor(t.target,t.deltaX,t.deltaY))return;let e=t.deltaY;if(t.deltaMode===WheelEvent.DOM_DELTA_LINE?e*=this._scrollLineHeight:t.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(e*=this._scrollPageHeight),this._deltaYAcc=this._deltaYAcc||0,this._wheelAnimationFrame)return this._deltaYAcc+=e,void t.preventDefault();e+=this._deltaYAcc,this._deltaYAcc=0,this._wheelAnimationFrame=!0,this.__debouncerWheelAnimationFrame=vo.debounce(this.__debouncerWheelAnimationFrame,Si,(()=>{this._wheelAnimationFrame=!1}));const i=Math.abs(t.deltaX)+Math.abs(e);this._canScroll(this.scrollTarget,t.deltaX,e)?(t.preventDefault(),this.scrollTarget.scrollTop+=e,this.scrollTarget.scrollLeft+=t.deltaX,this._hasResidualMomentum=!0,this._ignoreNewWheel=!0,this._debouncerIgnoreNewWheel=vo.debounce(this._debouncerIgnoreNewWheel,Gi.after(this.timeouts.IGNORE_WHEEL),(()=>{this._ignoreNewWheel=!1}))):this._hasResidualMomentum&&i<=this._previousMomentum||this._ignoreNewWheel?t.preventDefault():i>this._previousMomentum&&(this._hasResidualMomentum=!1),this._previousMomentum=i}_hasScrolledAncestor(t,e,i){return t!==this.scrollTarget&&t!==this.scrollTarget.getRootNode().host&&(!(!this._canScroll(t,e,i)||-1===["auto","scroll"].indexOf(getComputedStyle(t).overflow))||(t!==this&&t.parentElement?this._hasScrolledAncestor(t.parentElement,e,i):void 0))}_canScroll(t,e,i){return i>0&&t.scrollTop<t.scrollHeight-t.offsetHeight||i<0&&t.scrollTop>0||e>0&&t.scrollLeft<t.scrollWidth-t.offsetWidth||e<0&&t.scrollLeft>0}_getScrollLineHeight(){const t=document.createElement("div");t.style.fontSize="initial",t.style.display="none",document.body.appendChild(t);const e=window.getComputedStyle(t).fontSize;return document.body.removeChild(t),e?window.parseInt(e):void 0}__getVisibleElements(){return Array.from(this.elementsContainer.children).filter((t=>!t.hidden))}__reorderElements(){if(this.__mouseDown)return void(this.__pendingReorder=!0);this.__pendingReorder=!1;const t=this._virtualStart+(this._vidxOffset||0),e=this.__getVisibleElements(),i=e.find((t=>t.contains(this.elementsContainer.getRootNode().activeElement)||t.contains(this.scrollTarget.getRootNode().activeElement)))||e[0];if(!i)return;const o=i.__virtualIndex-t,n=e.indexOf(i)-o;if(n>0)for(let t=0;t<n;t++)this.elementsContainer.appendChild(e[t]);else if(n<0)for(let t=e.length+n;t<e.length;t++)this.elementsContainer.insertBefore(e[t],e[0]);if(Mn){const{transform:t}=this.scrollTarget.style;this.scrollTarget.style.transform="translateZ(0)",setTimeout((()=>{this.scrollTarget.style.transform=t}))}}_adjustVirtualIndexOffset(t){if(this._virtualCount>=this.size)this._vidxOffset=0;else if(this.__skipNextVirtualIndexAdjust)this.__skipNextVirtualIndexAdjust=!1;else if(Math.abs(t)>1e4){const t=this._scrollTop/(this.scrollTarget.scrollHeight-this.scrollTarget.offsetHeight),e=t*this.size;this._vidxOffset=Math.round(e-t*this._virtualCount)}else{const t=this._vidxOffset,e=wn,i=100;0===this._scrollTop?(this._vidxOffset=0,t!==this._vidxOffset&&super.scrollToIndex(0)):this.firstVisibleIndex<e&&this._vidxOffset>0&&(this._vidxOffset-=Math.min(this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex+(t-this._vidxOffset)));const o=this.size-this._virtualCount;this._scrollTop>=this._maxScrollTop&&this._maxScrollTop>0?(this._vidxOffset=o,t!==this._vidxOffset&&super.scrollToIndex(this._virtualCount-1)):this.firstVisibleIndex>this._virtualCount-e&&this._vidxOffset<o&&(this._vidxOffset+=Math.min(o-this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex-(this._vidxOffset-t)))}}}Object.setPrototypeOf(vn.prototype,fn);class Tn{constructor(t){this.__adapter=new vn(t)}get size(){return this.__adapter.size}set size(t){this.__adapter.size=t}scrollToIndex(t){this.__adapter.scrollToIndex(t)}update(t=0,e=this.size-1){this.__adapter.update(t,e)}flush(){this.__adapter.flush()}get firstVisibleIndex(){return this.__adapter.adjustedFirstVisibleIndex}get lastVisibleIndex(){return this.__adapter.adjustedLastVisibleIndex}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const jn=t=>class extends t{static get observers(){return["_a11yUpdateGridSize(size, _columnTree, _columnTree.*)"]}_a11yGetHeaderRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer||t.path||t.header)))).length}_a11yGetFooterRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer)))).length}_a11yUpdateGridSize(t,e){if(void 0===t||void 0===e)return;const i=e[e.length-1];this.$.table.setAttribute("aria-rowcount",t+this._a11yGetHeaderRowCount(e)+this._a11yGetFooterRowCount(e)),this.$.table.setAttribute("aria-colcount",i&&i.length||0),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows()}_a11yUpdateHeaderRows(){Array.from(this.$.header.children).forEach(((t,e)=>t.setAttribute("aria-rowindex",e+1)))}_a11yUpdateFooterRows(){Array.from(this.$.footer.children).forEach(((t,e)=>t.setAttribute("aria-rowindex",this._a11yGetHeaderRowCount(this._columnTree)+this.size+e+1)))}_a11yUpdateRowRowindex(t,e){t.setAttribute("aria-rowindex",e+this._a11yGetHeaderRowCount(this._columnTree)+1)}_a11yUpdateRowSelected(t,e){t.setAttribute("aria-selected",Boolean(e)),Array.from(t.children).forEach((t=>t.setAttribute("aria-selected",Boolean(e))))}_a11yUpdateRowExpanded(t){this.__isRowExpandable(t)?t.setAttribute("aria-expanded","false"):this.__isRowCollapsible(t)?t.setAttribute("aria-expanded","true"):t.removeAttribute("aria-expanded")}_a11yUpdateRowLevel(t,e){e>0||this.__isRowCollapsible(t)||this.__isRowExpandable(t)?t.setAttribute("aria-level",e+1):t.removeAttribute("aria-level")}_a11ySetRowDetailsCell(t,e){Array.from(t.children).forEach((t=>{t!==e&&t.setAttribute("aria-controls",e.id)}))}_a11yUpdateCellColspan(t,e){t.setAttribute("aria-colspan",Number(e))}_a11yUpdateSorters(){Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((t=>{let e=t.parentNode;for(;e&&"vaadin-grid-cell-content"!==e.localName;)e=e.parentNode;if(e&&e.assignedSlot){e.assignedSlot.parentNode.setAttribute("aria-sort",{asc:"ascending",desc:"descending"}[String(t.direction)]||"none")}}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,On=t=>class extends t{static get properties(){return{activeItem:{type:Object,notify:!0,value:null}}}ready(){super.ready(),this.$.scroller.addEventListener("click",this._onClick.bind(this)),this.addEventListener("cell-activate",this._activateItem.bind(this)),this.addEventListener("row-activate",this._activateItem.bind(this))}_activateItem(t){const e=t.detail.model,i=e?e.item:null;i&&(this.activeItem=this._itemsEqual(this.activeItem,i)?null:i)}_onClick(t){if(t.defaultPrevented)return;const e=t.composedPath(),i=e[e.indexOf(this.$.table)-3];if(!i||i.getAttribute("part").indexOf("details-cell")>-1)return;const o=i._content,n=this.getRootNode().activeElement;o.contains(n)||this._isFocusable(t.target)||t.target instanceof HTMLLabelElement||this.dispatchEvent(new CustomEvent("cell-activate",{detail:{model:this.__getRowModel(i.parentElement)}}))}_isFocusable(t){return Dn(t)}},Dn=t=>{if(!t.parentNode)return!1;const e=Array.from(t.parentNode.querySelectorAll("[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]")).filter((t=>{const e=t.getAttribute("part");return!(e&&e.includes("body-cell"))})).includes(t);return!t.disabled&&e&&t.offsetParent&&"hidden"!==getComputedStyle(t).visibility};function kn(t,e){return t.split(".").reduce(((t,e)=>t[e]),e)}function xn(t,e,i){if(0===i.length)return!1;let o=!0;return t.forEach((({path:t})=>{if(!t||-1===t.indexOf("."))return;void 0===kn(t.replace(/\.[^.]*$/,""),i[0])&&(console.warn(`Path "${t}" used for ${e} does not exist in all of the items, ${e} is disabled.`),o=!1)})),o}function zn(t){return[void 0,null].indexOf(t)>=0?"":isNaN(t)?t.toString():t}function Ln(t,e){return(t=zn(t))<(e=zn(e))?-1:t>e?1:0}const Wn=t=>(e,i)=>{let o=t?[...t]:[];e.filters&&xn(e.filters,"filtering",o)&&(o=function(t,e){return t.filter((t=>e.every((e=>{const i=zn(kn(e.path,t)),o=zn(e.value).toString().toLowerCase();return i.toString().toLowerCase().includes(o)}))))}(o,e.filters)),Array.isArray(e.sortOrders)&&e.sortOrders.length&&xn(e.sortOrders,"sorting",o)&&(o=function(t,e){return t.sort(((t,i)=>e.map((e=>"asc"===e.direction?Ln(kn(e.path,t),kn(e.path,i)):"desc"===e.direction?Ln(kn(e.path,i),kn(e.path,t)):0)).reduce(((t,e)=>0!==t?t:e),0)))}(o,e.sortOrders));const n=Math.min(o.length,e.pageSize),s=e.page*n,r=s+n;i(o.slice(s,r),o.length)},Gn=t=>class extends t{static get properties(){return{items:Array}}static get observers(){return["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)"]}__setArrayDataProvider(t){const e=Wn(this.items);e.__items=t,this.setProperties({_arrayDataProvider:e,size:t.length,dataProvider:e})}__dataProviderOrItemsChanged(t,e,i){i&&(this._arrayDataProvider?t!==this._arrayDataProvider?this.setProperties({_arrayDataProvider:void 0,items:void 0}):e?this._arrayDataProvider.__items===e?(this.clearCache(),this.size=this._effectiveSize):this.__setArrayDataProvider(e):(this.setProperties({_arrayDataProvider:void 0,dataProvider:void 0,size:0}),this.clearCache()):e&&this.__setArrayDataProvider(e))}}
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
const Sn=t=>class extends t{static get properties(){return{columnReorderingAllowed:{type:Boolean,value:!1},_orderBaseScope:{type:Number,value:1e7}}}static get observers(){return["_updateOrders(_columnTree)"]}ready(){super.ready(),go(this,"track",this._onTrackEvent),this._reorderGhost=this.shadowRoot.querySelector('[part="reorder-ghost"]'),this.addEventListener("touchstart",this._onTouchStart.bind(this)),this.addEventListener("touchmove",this._onTouchMove.bind(this)),this.addEventListener("touchend",this._onTouchEnd.bind(this)),this.addEventListener("contextmenu",this._onContextMenu.bind(this))}_onContextMenu(t){this.hasAttribute("reordering")&&(t.preventDefault(),Zn||this._onTrackEnd())}_onTouchStart(t){this._startTouchReorderTimeout=setTimeout((()=>{this._onTrackStart({detail:{x:t.touches[0].clientX,y:t.touches[0].clientY}})}),100)}_onTouchMove(t){this._draggedColumn&&t.preventDefault(),clearTimeout(this._startTouchReorderTimeout)}_onTouchEnd(){clearTimeout(this._startTouchReorderTimeout),this._onTrackEnd()}_onTrackEvent(t){if("start"===t.detail.state){const e=t.composedPath(),i=e[e.indexOf(this.$.header)-2];if(!i||!i._content)return;if(i._content.contains(this.getRootNode().activeElement))return;if(this.$.scroller.hasAttribute("column-resizing"))return;this._touchDevice||this._onTrackStart(t)}else"track"===t.detail.state?this._onTrack(t):"end"===t.detail.state&&this._onTrackEnd(t)}_onTrackStart(t){if(!this.columnReorderingAllowed)return;const e=t.composedPath&&t.composedPath();if(e&&e.some((t=>t.hasAttribute&&t.hasAttribute("draggable"))))return;const i=this._cellFromPoint(t.detail.x,t.detail.y);if(i&&i.getAttribute("part").includes("header-cell")){for(this.toggleAttribute("reordering",!0),this._draggedColumn=i._column;1===this._draggedColumn.parentElement.childElementCount;)this._draggedColumn=this._draggedColumn.parentElement;this._setSiblingsReorderStatus(this._draggedColumn,"allowed"),this._draggedColumn._reorderStatus="dragging",this._updateGhost(i),this._reorderGhost.style.visibility="visible",this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._autoScroller()}}_onTrack(t){if(!this._draggedColumn)return;const e=this._cellFromPoint(t.detail.x,t.detail.y);if(!e)return;const i=this._getTargetColumn(e,this._draggedColumn);if(this._isSwapAllowed(this._draggedColumn,i)&&this._isSwappableByPosition(i,t.detail.x)){const t=this._columnTree.findIndex((t=>t.includes(i))),e=this._getColumnsInOrder(t),o=e.indexOf(this._draggedColumn),n=e.indexOf(i),s=o<n?1:-1;for(let t=o;t!==n;t+=s)this._swapColumnOrders(this._draggedColumn,e[t+s])}this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._lastDragClientX=t.detail.x}_onTrackEnd(){this._draggedColumn&&(this.toggleAttribute("reordering",!1),this._draggedColumn._reorderStatus="",this._setSiblingsReorderStatus(this._draggedColumn,""),this._draggedColumn=null,this._lastDragClientX=null,this._reorderGhost.style.visibility="hidden",this.dispatchEvent(new CustomEvent("column-reorder",{detail:{columns:this._getColumnsInOrder()}})))}_getColumnsInOrder(t=this._columnTree.length-1){return this._columnTree[t].filter((t=>!t.hidden)).sort(((t,e)=>t._order-e._order))}_cellFromPoint(t,e){t=t||0,e=e||0,this._draggedColumn||this.$.scroller.toggleAttribute("no-content-pointer-events",!0);const i=this.shadowRoot.elementFromPoint(t,e);if(this.$.scroller.toggleAttribute("no-content-pointer-events",!1),i&&i._column)return i}_updateGhostPosition(t,e){const i=this._reorderGhost.getBoundingClientRect(),o=t-i.width/2,n=e-i.height/2,s=parseInt(this._reorderGhost._left||0),r=parseInt(this._reorderGhost._top||0);this._reorderGhost._left=s-(i.left-o),this._reorderGhost._top=r-(i.top-n),this._reorderGhost.style.transform=`translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`}_updateGhost(t){const e=this._reorderGhost;e.textContent=t._content.innerText;const i=window.getComputedStyle(t);return["boxSizing","display","width","height","background","alignItems","padding","border","flex-direction","overflow"].forEach((t=>{e.style[t]=i[t]})),e}_updateOrders(t){void 0!==t&&(t[0].forEach((t=>{t._order=0})),function(t,e,i){let o=1;t.forEach((t=>{o%10==0&&(o+=1),t._order=i+o*e,o+=1}))}(t[0],this._orderBaseScope,0))}_setSiblingsReorderStatus(t,e){Array.from(t.parentNode.children).filter((e=>/column/.test(e.localName)&&this._isSwapAllowed(e,t))).forEach((t=>{t._reorderStatus=e}))}_autoScroller(){if(this._lastDragClientX){const t=this._lastDragClientX-this.getBoundingClientRect().right+50,e=this.getBoundingClientRect().left-this._lastDragClientX+50;t>0?this.$.table.scrollLeft+=t/10:e>0&&(this.$.table.scrollLeft-=e/10)}this._draggedColumn&&setTimeout((()=>this._autoScroller()),10)}_isSwapAllowed(t,e){if(t&&e){const i=t!==e,o=t.parentElement===e.parentElement,n=t.frozen&&e.frozen||t.frozenToEnd&&e.frozenToEnd||!t.frozen&&!t.frozenToEnd&&!e.frozen&&!e.frozenToEnd;return i&&o&&n}}_isSwappableByPosition(t,e){const i=Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find((e=>t.contains(e._column))),o=this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(),n=i.getBoundingClientRect();return n.left>o.left?e>n.right-o.width:e<n.left+o.width}_swapColumnOrders(t,e){[t._order,e._order]=[e._order,t._order],this._debounceUpdateFrozenColumn(),this._updateFirstAndLastColumn()}_getTargetColumn(t,e){if(t&&e){let i=t._column;for(;i.parentElement!==e.parentElement&&i!==this;)i=i.parentElement;return i.parentElement===e.parentElement?i:t._column}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Rn=t=>class extends t{ready(){super.ready();const t=this.$.scroller;go(t,"track",this._onHeaderTrack.bind(this)),t.addEventListener("touchmove",(e=>t.hasAttribute("column-resizing")&&e.preventDefault())),t.addEventListener("contextmenu",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault())),t.addEventListener("mousedown",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault()))}_onHeaderTrack(t){const e=t.target;if("resize-handle"===e.getAttribute("part")){let i=e.parentElement._column;for(this.$.scroller.toggleAttribute("column-resizing",!0);"vaadin-grid-column-group"===i.localName;)i=i._childColumns.slice(0).sort(((t,e)=>t._order-e._order)).filter((t=>!t.hidden)).pop();const o=t.detail.x,n=Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')),s=n.find((t=>t._column===i));if(s.offsetWidth){const t=getComputedStyle(s._content),e=10+parseInt(t.paddingLeft)+parseInt(t.paddingRight)+parseInt(t.borderLeftWidth)+parseInt(t.borderRightWidth)+parseInt(t.marginLeft)+parseInt(t.marginRight);let n;const r=s.offsetWidth,a=s.getBoundingClientRect();n=s.hasAttribute("frozen-to-end")?r+(this.__isRTL?o-a.right:a.left-o):r+(this.__isRTL?a.left-o:o-a.right),i.width=`${Math.max(e,n)}px`,i.flexGrow=0}n.sort(((t,e)=>t._column._order-e._column._order)).forEach(((t,e,i)=>{e<i.indexOf(s)&&(t._column.width=`${t.offsetWidth}px`,t._column.flexGrow=0)}));const r=this._frozenToEndCells[0];if(r&&this.$.table.scrollWidth>this.$.table.offsetWidth){const t=r.getBoundingClientRect(),e=o-(this.__isRTL?t.right:t.left);(this.__isRTL&&e<=0||!this.__isRTL&&e>=0)&&(this.$.table.scrollLeft+=e)}"end"===t.detail.state&&(this.$.scroller.toggleAttribute("column-resizing",!1),this.dispatchEvent(new CustomEvent("column-resize",{detail:{resizedColumn:i}}))),this._resizeHandler()}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Yn=class t{constructor(t,e,i){this.grid=t,this.parentCache=e,this.parentItem=i,this.itemCaches={},this.items={},this.effectiveSize=0,this.size=0,this.pendingRequests={}}isLoading(){return Boolean(Object.keys(this.pendingRequests).length||Object.keys(this.itemCaches).filter((t=>this.itemCaches[t].isLoading()))[0])}getItemForIndex(t){const{cache:e,scaledIndex:i}=this.getCacheAndIndex(t);return e.items[i]}updateSize(){this.effectiveSize=!this.parentItem||this.grid._isExpanded(this.parentItem)?this.size+Object.keys(this.itemCaches).reduce(((t,e)=>{const i=this.itemCaches[e];return i.updateSize(),t+i.effectiveSize}),0):0}ensureSubCacheForScaledIndex(e){if(!this.itemCaches[e]){const i=new t(this.grid,this,this.items[e]);this.itemCaches[e]=i,this.grid._loadPage(0,i)}}getCacheAndIndex(t){let e=t;const i=Object.keys(this.itemCaches);for(let t=0;t<i.length;t++){const o=Number(i[t]),n=this.itemCaches[o];if(e<=o)return{cache:this,scaledIndex:e};if(e<=o+n.effectiveSize)return n.getCacheAndIndex(e-o-1);e-=n.effectiveSize}return{cache:this,scaledIndex:e}}},Hn=t=>class extends t{static get properties(){return{size:{type:Number,notify:!0},pageSize:{type:Number,value:50,observer:"_pageSizeChanged"},dataProvider:{type:Object,notify:!0,observer:"_dataProviderChanged"},loading:{type:Boolean,notify:!0,readOnly:!0,reflectToAttribute:!0},_cache:{type:Object,value(){return new Yn(this)}},_hasData:{type:Boolean,value:!1},itemHasChildrenPath:{type:String,value:"children"},itemIdPath:{type:String,value:null},expandedItems:{type:Object,notify:!0,value:()=>[]},__expandedKeys:{type:Object,computed:"__computeExpandedKeys(itemIdPath, expandedItems.*)"}}}static get observers(){return["_sizeChanged(size)","_expandedItemsChanged(expandedItems.*)"]}_sizeChanged(t){const e=t-this._cache.size;this._cache.size+=e,this._cache.effectiveSize+=e,this._effectiveSize=this._cache.effectiveSize}_getItem(t,e){if(t>=this._effectiveSize)return;e.index=t;const{cache:i,scaledIndex:o}=this._cache.getCacheAndIndex(t),n=i.items[o];n?(e.toggleAttribute("loading",!1),this._updateItem(e,n),this._isExpanded(n)&&i.ensureSubCacheForScaledIndex(o)):(e.toggleAttribute("loading",!0),this._loadPage(this._getPageForIndex(o),i))}getItemId(t){return this.itemIdPath?this.get(this.itemIdPath,t):t}_isExpanded(t){return this.__expandedKeys.has(this.getItemId(t))}_expandedItemsChanged(){this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,this.__updateVisibleRows()}__computeExpandedKeys(t,e){const i=e.base||[],o=new Set;return i.forEach((t=>{o.add(this.getItemId(t))})),o}expandItem(t){this._isExpanded(t)||(this.expandedItems=[...this.expandedItems,t])}collapseItem(t){this._isExpanded(t)&&(this.expandedItems=this.expandedItems.filter((e=>!this._itemsEqual(e,t))))}_getIndexLevel(t){let{cache:e}=this._cache.getCacheAndIndex(t),i=0;for(;e.parentCache;)e=e.parentCache,i+=1;return i}_loadPage(t,e){if(!e.pendingRequests[t]&&this.dataProvider){this._setLoading(!0),e.pendingRequests[t]=!0;const i={page:t,pageSize:this.pageSize,sortOrders:this._mapSorters(),filters:this._mapFilters(),parentItem:e.parentItem};this.dataProvider(i,((o,n)=>{void 0!==n?e.size=n:i.parentItem&&(e.size=o.length);const s=Array.from(this.$.items.children).map((t=>t._item));o.forEach(((i,o)=>{const n=t*this.pageSize+o;e.items[n]=i,this._isExpanded(i)&&s.indexOf(i)>-1&&e.ensureSubCacheForScaledIndex(n)})),this._hasData=!0,delete e.pendingRequests[t],this._debouncerApplyCachedData=vo.debounce(this._debouncerApplyCachedData,Gi.after(0),(()=>{this._setLoading(!1),this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._cache.getItemForIndex(t.index)&&this._getItem(t.index,t)})),this.__scrollToPendingIndex(),this.__dispatchPendingBodyCellFocus()})),this._cache.isLoading()||this._debouncerApplyCachedData.flush(),this.__itemsReceived()}))}}_getPageForIndex(t){return Math.floor(t/this.pageSize)}clearCache(){this._cache=new Yn(this),this._cache.size=this.size||0,this._cache.updateSize(),this._hasData=!1,this.__updateVisibleRows(),this._effectiveSize||this._loadPage(0,this._cache)}_pageSizeChanged(t,e){void 0!==e&&t!==e&&this.clearCache()}_checkSize(){void 0===this.size&&0===this._effectiveSize&&console.warn("The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.")}_dataProviderChanged(t,e){void 0!==e&&this.clearCache(),this._ensureFirstPageLoaded(),this._debouncerCheckSize=vo.debounce(this._debouncerCheckSize,Gi.after(2e3),this._checkSize.bind(this))}_ensureFirstPageLoaded(){this._hasData||this._loadPage(0,this._cache)}_itemsEqual(t,e){return this.getItemId(t)===this.getItemId(e)}_getItemIndexInArray(t,e){let i=-1;return e.forEach(((e,o)=>{this._itemsEqual(e,t)&&(i=o)})),i}scrollToIndex(t){super.scrollToIndex(t),isNaN(t)||!this._cache.isLoading()&&this.clientHeight||(this.__pendingScrollToIndex=t)}__scrollToPendingIndex(){if(this.__pendingScrollToIndex&&this.$.items.children.length){const t=this.__pendingScrollToIndex;delete this.__pendingScrollToIndex,this.scrollToIndex(t)}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,Bn="between",En="on-top-or-between",_n="on-grid",Xn="on-top",Pn="above",Jn="below",Vn="empty",Un=!("draggable"in document.createElement("div")),Kn=t=>class extends t{static get properties(){return{dropMode:String,rowsDraggable:Boolean,dragFilter:Function,dropFilter:Function,__dndAutoScrollThreshold:{value:50}}}static get observers(){return["_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)"]}ready(){super.ready(),this.$.table.addEventListener("dragstart",this._onDragStart.bind(this)),this.$.table.addEventListener("dragend",this._onDragEnd.bind(this)),this.$.table.addEventListener("dragover",this._onDragOver.bind(this)),this.$.table.addEventListener("dragleave",this._onDragLeave.bind(this)),this.$.table.addEventListener("drop",this._onDrop.bind(this)),this.$.table.addEventListener("dragenter",(t=>{this.dropMode&&(t.preventDefault(),t.stopPropagation())}))}_onDragStart(t){if(this.rowsDraggable){let e=t.target;if("vaadin-grid-cell-content"===e.localName&&(e=e.assignedSlot.parentNode.parentNode),e.parentNode!==this.$.items)return;if(t.stopPropagation(),this.toggleAttribute("dragging-rows",!0),this._safari){const t=e.style.transform;e.style.top=/translateY\((.*)\)/.exec(t)[1],e.style.transform="none",requestAnimationFrame((()=>{e.style.top="",e.style.transform=t}))}const i=e.getBoundingClientRect();Un?t.dataTransfer.setDragImage(e):t.dataTransfer.setDragImage(e,t.clientX-i.left,t.clientY-i.top);let o=[e];this._isSelected(e._item)&&(o=this.__getViewportRows().filter((t=>this._isSelected(t._item))).filter((t=>!this.dragFilter||this.dragFilter(this.__getRowModel(t))))),t.dataTransfer.setData("text",this.__formatDefaultTransferData(o)),e.setAttribute("dragstart",o.length>1?o.length:""),this.style.setProperty("--_grid-drag-start-x",t.clientX-i.left+20+"px"),this.style.setProperty("--_grid-drag-start-y",t.clientY-i.top+10+"px"),requestAnimationFrame((()=>{e.removeAttribute("dragstart"),this.updateStyles({"--_grid-drag-start-x":"","--_grid-drag-start-y":""})}));const n=new CustomEvent("grid-dragstart",{detail:{draggedItems:o.map((t=>t._item)),setDragData:(e,i)=>t.dataTransfer.setData(e,i),setDraggedItemsCount:t=>e.setAttribute("dragstart",t)}});n.originalEvent=t,this.dispatchEvent(n)}}_onDragEnd(t){this.toggleAttribute("dragging-rows",!1),t.stopPropagation();const e=new CustomEvent("grid-dragend");e.originalEvent=t,this.dispatchEvent(e)}_onDragLeave(t){t.stopPropagation(),this._clearDragStyles()}_onDragOver(t){if(this.dropMode){if(this._dropLocation=void 0,this._dragOverItem=void 0,this.__dndAutoScroll(t.clientY))return void this._clearDragStyles();let e=t.composedPath().find((t=>"tr"===t.localName));if(this._effectiveSize&&this.dropMode!==_n)if(e&&e.parentNode===this.$.items){const i=e.getBoundingClientRect();if(this._dropLocation=Xn,this.dropMode===Bn){const e=t.clientY-i.top<i.bottom-t.clientY;this._dropLocation=e?Pn:Jn}else this.dropMode===En&&(t.clientY-i.top<i.height/3?this._dropLocation=Pn:t.clientY-i.top>i.height/3*2&&(this._dropLocation=Jn))}else{if(e)return;if(this.dropMode!==Bn&&this.dropMode!==En)return;e=Array.from(this.$.items.children).filter((t=>!t.hidden)).pop(),this._dropLocation=Jn}else this._dropLocation=Vn;if(e&&e.hasAttribute("drop-disabled"))return void(this._dropLocation=void 0);t.stopPropagation(),t.preventDefault(),this._dropLocation===Vn?this.toggleAttribute("dragover",!0):e?(this._dragOverItem=e._item,e.getAttribute("dragover")!==this._dropLocation&&e.setAttribute("dragover",this._dropLocation)):this._clearDragStyles()}}__dndAutoScroll(t){if(this.__dndAutoScrolling)return!0;const e=this.$.header.getBoundingClientRect().bottom,i=this.$.footer.getBoundingClientRect().top,o=e-t+this.__dndAutoScrollThreshold,n=t-i+this.__dndAutoScrollThreshold;let s=0;if(n>0?s=2*n:o>0&&(s=2*-o),s){const t=this.$.table.scrollTop;this.$.table.scrollTop+=s;if(t!==this.$.table.scrollTop)return this.__dndAutoScrolling=!0,setTimeout((()=>{this.__dndAutoScrolling=!1}),20),!0}}__getViewportRows(){const t=this.$.header.getBoundingClientRect().bottom,e=this.$.footer.getBoundingClientRect().top;return Array.from(this.$.items.children).filter((i=>{const o=i.getBoundingClientRect();return o.bottom>t&&o.top<e}))}_clearDragStyles(){this.removeAttribute("dragover"),Array.from(this.$.items.children).forEach((t=>t.removeAttribute("dragover")))}_onDrop(t){if(this.dropMode){t.stopPropagation(),t.preventDefault();const e=t.dataTransfer.types&&Array.from(t.dataTransfer.types).map((e=>({type:e,data:t.dataTransfer.getData(e)})));this._clearDragStyles();const i=new CustomEvent("grid-drop",{bubbles:t.bubbles,cancelable:t.cancelable,detail:{dropTargetItem:this._dragOverItem,dropLocation:this._dropLocation,dragData:e}});i.originalEvent=t,this.dispatchEvent(i)}}__formatDefaultTransferData(t){return t.map((t=>Array.from(t.children).filter((t=>!t.hidden&&-1===t.getAttribute("part").indexOf("details-cell"))).sort(((t,e)=>t._column._order>e._column._order?1:-1)).map((t=>t._content.textContent.trim())).filter((t=>t)).join("\t"))).join("\n")}_dragDropAccessChanged(){this.filterDragAndDrop()}filterDragAndDrop(){Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._filterDragAndDrop(t,this.__getRowModel(t))}))}_filterDragAndDrop(t,e){const i=this.loading||t.hasAttribute("loading"),o=!this.rowsDraggable||i||this.dragFilter&&!this.dragFilter(e),n=!this.dropMode||i||this.dropFilter&&!this.dropFilter(e);Array.from(t.children).map((t=>t._content)).forEach((t=>{o?t.removeAttribute("draggable"):t.setAttribute("draggable",!0)})),t.toggleAttribute("drag-disabled",!!o),t.toggleAttribute("drop-disabled",!!n)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;function Qn(t,e){if(!t||!e||t.length!==e.length)return!1;for(let i=0,o=t.length;i<o;i++)if(t[i]instanceof Array&&e[i]instanceof Array){if(!Qn(t[i],e[i]))return!1}else if(t[i]!==e[i])return!1;return!0}const Fn=t=>class extends t{static get properties(){return{_columnTree:Object}}ready(){super.ready(),this._addNodeObserver()}_hasColumnGroups(t){for(let e=0;e<t.length;e++)if("vaadin-grid-column-group"===t[e].localName)return!0;return!1}_getChildColumns(t){return p.getFlattenedNodes(t).filter(this._isColumnElement)}_flattenColumnGroups(t){return t.map((t=>"vaadin-grid-column-group"===t.localName?this._getChildColumns(t):[t])).reduce(((t,e)=>t.concat(e)),[])}_getColumnTree(){const t=p.getFlattenedNodes(this).filter(this._isColumnElement),e=[t];let i=t;for(;this._hasColumnGroups(i);)i=this._flattenColumnGroups(i),e.push(i);return e}_updateColumnTree(){const t=this._getColumnTree();Qn(t,this._columnTree)||(this._columnTree=t)}_addNodeObserver(){this._observer=new p(this,(t=>{const e=t=>t.filter(this._isColumnElement).length>0;if(e(t.addedNodes)||e(t.removedNodes)){const e=t.removedNodes.flatMap((t=>t._allCells)),i=t=>e.filter((e=>e&&e._content.contains(t))).length;this.__removeSorters(this._sorters.filter(i)),this.__removeFilters(this._filters.filter(i)),this._updateColumnTree()}this._debouncerCheckImports=vo.debounce(this._debouncerCheckImports,Gi.after(2e3),this._checkImports.bind(this)),this._ensureFirstPageLoaded()}))}_checkImports(){["vaadin-grid-column-group","vaadin-grid-filter","vaadin-grid-filter-column","vaadin-grid-tree-toggle","vaadin-grid-selection-column","vaadin-grid-sort-column","vaadin-grid-sorter"].forEach((t=>{const e=this.querySelector(t);!e||e instanceof ji||console.warn(`Make sure you have imported the required module for <${t}> element.`)}))}_updateFirstAndLastColumn(){Array.from(this.shadowRoot.querySelectorAll("tr")).forEach((t=>this._updateFirstAndLastColumnForRow(t)))}_updateFirstAndLastColumnForRow(t){Array.from(t.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort(((t,e)=>t._column._order-e._column._order)).forEach(((t,e,i)=>{t.toggleAttribute("first-column",0===e),t.toggleAttribute("last-column",e===i.length-1)}))}_isColumnElement(t){return t.nodeType===Node.ELEMENT_NODE&&/\bcolumn\b/.test(t.localName)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,$n=t=>class extends t{getEventContext(t){const e={},i=t.__composedPath||t.composedPath(),o=i[i.indexOf(this.$.table)-3];return o?(e.section=["body","header","footer","details"].find((t=>o.getAttribute("part").indexOf(t)>-1)),o._column&&(e.column=o._column),"body"!==e.section&&"details"!==e.section||Object.assign(e,this.__getRowModel(o.parentElement)),e):e}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,qn=t=>class extends t{static get properties(){return{_filters:{type:Array,value:()=>[]}}}ready(){super.ready(),this.addEventListener("filter-changed",this._filterChanged.bind(this))}_filterChanged(t){t.stopPropagation(),this.__addFilter(t.target),this.__applyFilters()}__removeFilters(t){0!==t.length&&(this._filters=this._filters.filter((e=>t.indexOf(e)<0)),this.__applyFilters())}__addFilter(t){-1===this._filters.indexOf(t)&&this._filters.push(t)}__applyFilters(){this.dataProvider&&this.isAttached&&this.clearCache()}_mapFilters(){return this._filters.map((t=>({path:t.path,value:t.value})))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;function ts(t){return t?new Set(t.split(" ")):new Set}function es(t){return[...t].join(" ")}function is(t,e,i){const o=ts(t.getAttribute(e));o.add(i),t.setAttribute(e,es(o))}function os(t,e,i){const o=ts(t.getAttribute(e));o.delete(i),0!==o.size?t.setAttribute(e,es(o)):t.removeAttribute(e)}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const ns=t=>class extends t{static get properties(){return{_headerFocusable:{type:Object,observer:"_focusableChanged"},_itemsFocusable:{type:Object,observer:"_focusableChanged"},_footerFocusable:{type:Object,observer:"_focusableChanged"},_navigatingIsHidden:Boolean,_focusedItemIndex:{type:Number,value:0},_focusedColumnOrder:Number,_focusedCell:{type:Object,observer:"_focusedCellChanged"},interacting:{type:Boolean,value:!1,reflectToAttribute:!0,readOnly:!0,observer:"_interactingChanged"}}}ready(){super.ready(),this._ios||this._android||(this.addEventListener("keydown",this._onKeyDown),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("focusin",this._onFocusIn),this.addEventListener("focusout",this._onFocusOut),this.$.table.addEventListener("focusin",this._onContentFocusIn.bind(this)),this.addEventListener("mousedown",(()=>{this.toggleAttribute("navigating",!1),this._isMousedown=!0,this._focusedColumnOrder=void 0})),this.addEventListener("mouseup",(()=>{this._isMousedown=!1})))}get __rowFocusMode(){return this.__isRow(this._itemsFocusable)||this.__isRow(this._headerFocusable)||this.__isRow(this._footerFocusable)}set __rowFocusMode(t){["_itemsFocusable","_footerFocusable","_headerFocusable"].forEach((e=>{const i=this[e];if(t){const t=i&&i.parentElement;this.__isCell(i)?this[e]=t:this.__isCell(t)&&(this[e]=t.parentElement)}else if(!t&&this.__isRow(i)){const t=i.firstElementChild;this[e]=t._focusButton||t}}))}_focusableChanged(t,e){e&&e.setAttribute("tabindex","-1"),t&&this._updateGridSectionFocusTarget(t)}_focusedCellChanged(t,e){e&&os(e,"part","focused-cell"),t&&is(t,"part","focused-cell")}_interactingChanged(){this._updateGridSectionFocusTarget(this._headerFocusable),this._updateGridSectionFocusTarget(this._itemsFocusable),this._updateGridSectionFocusTarget(this._footerFocusable)}__updateItemsFocusable(){if(!this._itemsFocusable)return;const t=this.shadowRoot.activeElement===this._itemsFocusable;this._getVisibleRows().forEach((t=>{if(t.index===this._focusedItemIndex)if(this.__rowFocusMode)this._itemsFocusable=t;else{let e=this._itemsFocusable.parentElement,i=this._itemsFocusable;if(e){this.__isCell(e)&&(i=e,e=e.parentElement);const o=[...e.children].indexOf(i);this._itemsFocusable=this.__getFocusable(t,t.children[o])}}})),t&&this._itemsFocusable.focus()}_onKeyDown(t){const e=t.key;let i;switch(e){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"PageUp":case"PageDown":case"Home":case"End":i="Navigation";break;case"Enter":case"Escape":case"F2":i="Interaction";break;case"Tab":i="Tab";break;case" ":i="Space"}this._detectInteracting(t),this.interacting&&"Interaction"!==i&&(i=void 0),i&&this[`_on${i}KeyDown`](t,e)}_ensureScrolledToIndex(t){[...this.$.items.children].find((e=>e.index===t))?this.__scrollIntoViewport(t):this.scrollToIndex(t)}__isRowExpandable(t){if(this.itemHasChildrenPath){const e=t._item;return e&&this.get(this.itemHasChildrenPath,e)&&!this._isExpanded(e)}}__isRowCollapsible(t){return this._isExpanded(t._item)}__isDetailsCell(t){return t.matches('[part~="details-cell"]')}__isCell(t){return t instanceof HTMLTableCellElement}__isRow(t){return t instanceof HTMLTableRowElement}__getIndexOfChildElement(t){return Array.prototype.indexOf.call(t.parentNode.children,t)}_onNavigationKeyDown(t,e){t.preventDefault();const i=this._lastVisibleIndex-this._firstVisibleIndex-1;let o=0,n=0;switch(e){case"ArrowRight":o=this.__isRTL?-1:1;break;case"ArrowLeft":o=this.__isRTL?1:-1;break;case"Home":this.__rowFocusMode||t.ctrlKey?n=-1/0:o=-1/0;break;case"End":this.__rowFocusMode||t.ctrlKey?n=1/0:o=1/0;break;case"ArrowDown":n=1;break;case"ArrowUp":n=-1;break;case"PageDown":n=i;break;case"PageUp":n=-i}const s=t.composedPath().find((t=>this.__isRow(t))),r=t.composedPath().find((t=>this.__isCell(t)));if(this.__rowFocusMode&&!s||!this.__rowFocusMode&&!r)return;const a=this.__isRTL?"ArrowLeft":"ArrowRight",l=this.__isRTL?"ArrowRight":"ArrowLeft";if(e===a){if(this.__rowFocusMode)return this.__isRowExpandable(s)?void this.expandItem(s._item):(this.__rowFocusMode=!1,void this._onCellNavigation(s.firstElementChild,0,0))}else if(e===l)if(this.__rowFocusMode){if(this.__isRowCollapsible(s))return void this.collapseItem(s._item)}else{const t=[...s.children].sort(((t,e)=>t._order-e._order));if(r===t[0]||this.__isDetailsCell(r))return this.__rowFocusMode=!0,void this._onRowNavigation(s,0)}this.__rowFocusMode?this._onRowNavigation(s,n):this._onCellNavigation(r,o,n)}_onRowNavigation(t,e){const{dstRow:i}=this.__navigateRows(e,t);i&&i.focus()}__getIndexInGroup(t,e){return t.parentNode===this.$.items?void 0!==e?e:t.index:this.__getIndexOfChildElement(t)}__navigateRows(t,e,i){const o=this.__getIndexInGroup(e,this._focusedItemIndex),n=e.parentNode,s=(n===this.$.items?this._effectiveSize:n.children.length)-1;let r=Math.max(0,Math.min(o+t,s));if(n!==this.$.items){if(r>o)for(;r<s&&n.children[r].hidden;)r+=1;else if(r<o)for(;r>0&&n.children[r].hidden;)r-=1;return this.toggleAttribute("navigating",!0),{dstRow:n.children[r]}}let a=!1;if(i){const s=this.__isDetailsCell(i);if(n===this.$.items){const i=e._item,n=this._cache.getItemForIndex(r);a=s?0===t:1===t&&this._isDetailsOpened(i)||-1===t&&r!==o&&this._isDetailsOpened(n),a!==s&&(1===t&&a||-1===t&&!a)&&(r=o)}}return this._ensureScrolledToIndex(r),this._focusedItemIndex=r,this.toggleAttribute("navigating",!0),{dstRow:[...n.children].find((t=>!t.hidden&&t.index===r)),dstIsRowDetails:a}}_onCellNavigation(t,e,i){const o=t.parentNode,{dstRow:n,dstIsRowDetails:s}=this.__navigateRows(i,o,t);if(!n)return;const r=this.__getIndexOfChildElement(t),a=this.__isDetailsCell(t),l=o.parentNode,g=this.__getIndexInGroup(o,this._focusedItemIndex);if(void 0===this._focusedColumnOrder&&(this._focusedColumnOrder=a?0:this._getColumns(l,g).filter((t=>!t.hidden))[r]._order),s){[...n.children].find((t=>this.__isDetailsCell(t))).focus()}else{const t=this.__getIndexInGroup(n,this._focusedItemIndex),o=this._getColumns(l,t).filter((t=>!t.hidden)),s=o.map((t=>t._order)).sort(((t,e)=>t-e)),r=s.length-1,g=s.indexOf(s.slice(0).sort(((t,e)=>Math.abs(t-this._focusedColumnOrder)-Math.abs(e-this._focusedColumnOrder)))[0]),c=0===i&&a?g:Math.max(0,Math.min(g+e,r));c!==g&&(this._focusedColumnOrder=void 0);const I=o.reduce(((t,e,i)=>(t[e._order]=i,t)),{}),d=I[s[c]],h=n.children[d];this._scrollHorizontallyToCell(h),h.focus()}}_onInteractionKeyDown(t,e){const i=t.composedPath()[0],o="input"===i.localName&&!/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(i.type);let n;switch(e){case"Enter":n=!this.interacting||!o;break;case"Escape":n=!1;break;case"F2":n=!this.interacting}const{cell:s}=this._getGridEventLocation(t);if(this.interacting!==n&&null!==s)if(n){const e=s._content.querySelector("[focus-target]")||[...s._content.querySelectorAll("*")].find((t=>this._isFocusable(t)));e&&(t.preventDefault(),e.focus(),this._setInteracting(!0),this.toggleAttribute("navigating",!1))}else t.preventDefault(),this._focusedColumnOrder=void 0,s.focus(),this._setInteracting(!1),this.toggleAttribute("navigating",!0);"Escape"===e&&this._hideTooltip(!0)}_predictFocusStepTarget(t,e){const i=[this.$.table,this._headerFocusable,this._itemsFocusable,this._footerFocusable,this.$.focusexit];let o=i.indexOf(t);for(o+=e;o>=0&&o<=i.length-1;){let t=i[o];if(t&&!this.__rowFocusMode&&(t=i[o].parentNode),t&&!t.hidden)break;o+=e}let n=i[o];if(n&&!this.__isHorizontallyInViewport(n)){const t=this._getColumnsInOrder().find((t=>this.__isColumnInViewport(t)));if(t)if(n===this._headerFocusable)n=t._headerCell;else if(n===this._itemsFocusable){const e=n._column._cells.indexOf(n);n=t._cells[e]}else n===this._footerFocusable&&(n=t._footerCell)}return n}__isColumnInViewport(t){return!(!t.frozen&&!t.frozenToEnd)||this.__isHorizontallyInViewport(t._sizerCell)}__isHorizontallyInViewport(t){return t.offsetLeft+t.offsetWidth>=this._scrollLeft&&t.offsetLeft<=this._scrollLeft+this.clientWidth}_onTabKeyDown(t){const e=this._predictFocusStepTarget(t.composedPath()[0],t.shiftKey?-1:1);if(e){if(t.stopPropagation(),e===this.$.table)this.$.table.focus();else if(e===this.$.focusexit)this.$.focusexit.focus();else if(e===this._itemsFocusable){let i=e;const o=this.__isRow(e)?e:e.parentNode;if(this._ensureScrolledToIndex(this._focusedItemIndex),o.index!==this._focusedItemIndex&&this.__isCell(e)){const t=Array.from(o.children).indexOf(this._itemsFocusable),e=Array.from(this.$.items.children).find((t=>!t.hidden&&t.index===this._focusedItemIndex));e&&(i=e.children[t])}t.preventDefault(),i.focus()}else t.preventDefault(),e.focus();this.toggleAttribute("navigating",!0)}}_onSpaceKeyDown(t){t.preventDefault();const e=t.composedPath()[0],i=this.__isRow(e);!i&&e._content&&e._content.firstElementChild||this.dispatchEvent(new CustomEvent(i?"row-activate":"cell-activate",{detail:{model:this.__getRowModel(i?e:e.parentElement)}}))}_onKeyUp(t){if(!/^( |SpaceBar)$/.test(t.key)||this.interacting)return;t.preventDefault();const e=t.composedPath()[0];if(e._content&&e._content.firstElementChild){const i=this.hasAttribute("navigating");e._content.firstElementChild.dispatchEvent(new MouseEvent("click",{shiftKey:t.shiftKey,bubbles:!0,composed:!0,cancelable:!0})),this.toggleAttribute("navigating",i)}}_onFocusIn(t){this._isMousedown||this.toggleAttribute("navigating",!0);const e=t.composedPath()[0];e===this.$.table||e===this.$.focusexit?(this._isMousedown||this._predictFocusStepTarget(e,e===this.$.table?1:-1).focus(),this._setInteracting(!1)):this._detectInteracting(t)}_onFocusOut(t){this.toggleAttribute("navigating",!1),this._detectInteracting(t),this._hideTooltip(),this._focusedCell=null}_onContentFocusIn(t){const{section:e,cell:i,row:o}=this._getGridEventLocation(t);if(i||this.__rowFocusMode){if(this._detectInteracting(t),e&&(i||o))if(this._activeRowGroup=e,this.$.header===e?this._headerFocusable=this.__getFocusable(o,i):this.$.items===e?this._itemsFocusable=this.__getFocusable(o,i):this.$.footer===e&&(this._footerFocusable=this.__getFocusable(o,i)),i){const e=this.getEventContext(t);this.__pendingBodyCellFocus=this.loading&&"body"===e.section,this.__pendingBodyCellFocus||i.dispatchEvent(new CustomEvent("cell-focus",{bubbles:!0,composed:!0,detail:{context:e}})),this._focusedCell=i._focusButton||i,Xo()&&t.target===i&&this._showTooltip(t)}else this._focusedCell=null;this._detectFocusedItemIndex(t)}}__dispatchPendingBodyCellFocus(){this.__pendingBodyCellFocus&&this.shadowRoot.activeElement===this._itemsFocusable&&this._itemsFocusable.dispatchEvent(new Event("focusin",{bubbles:!0,composed:!0}))}__getFocusable(t,e){return this.__rowFocusMode?t:e._focusButton||e}_detectInteracting(t){const e=t.composedPath().some((t=>"vaadin-grid-cell-content"===t.localName));this._setInteracting(e),this.__updateHorizontalScrollPosition()}_detectFocusedItemIndex(t){const{section:e,row:i}=this._getGridEventLocation(t);e===this.$.items&&(this._focusedItemIndex=i.index)}_updateGridSectionFocusTarget(t){if(!t)return;const e=this._getGridSectionFromFocusTarget(t),i=this.interacting&&e===this._activeRowGroup;t.tabIndex=i?-1:0}_preventScrollerRotatingCellFocus(t,e){t.index===this._focusedItemIndex&&this.hasAttribute("navigating")&&this._activeRowGroup===this.$.items&&(this._navigatingIsHidden=!0,this.toggleAttribute("navigating",!1)),e===this._focusedItemIndex&&this._navigatingIsHidden&&(this._navigatingIsHidden=!1,this.toggleAttribute("navigating",!0))}_getColumns(t,e){let i=this._columnTree.length-1;return t===this.$.header?i=e:t===this.$.footer&&(i=this._columnTree.length-1-e),this._columnTree[i]}__isValidFocusable(t){return this.$.table.contains(t)&&t.offsetHeight}_resetKeyboardNavigation(){if(["header","footer"].forEach((t=>{if(!this.__isValidFocusable(this[`_${t}Focusable`])){const e=[...this.$[t].children].find((t=>t.offsetHeight)),i=e?[...e.children].find((t=>!t.hidden)):null;e&&i&&(this[`_${t}Focusable`]=this.__getFocusable(e,i))}})),!this.__isValidFocusable(this._itemsFocusable)&&this.$.items.firstElementChild){const t=this.__getFirstVisibleItem(),e=t?[...t.children].find((t=>!t.hidden)):null;e&&t&&(delete this._focusedColumnOrder,this._itemsFocusable=this.__getFocusable(t,e))}else this.__updateItemsFocusable()}_scrollHorizontallyToCell(t){if(t.hasAttribute("frozen")||t.hasAttribute("frozen-to-end")||this.__isDetailsCell(t))return;const e=t.getBoundingClientRect(),i=t.parentNode,o=Array.from(i.children).indexOf(t),n=this.$.table.getBoundingClientRect();let s=n.left,r=n.right;for(let t=o-1;t>=0;t--){const e=i.children[t];if(!e.hasAttribute("hidden")&&!this.__isDetailsCell(e)&&(e.hasAttribute("frozen")||e.hasAttribute("frozen-to-end"))){s=e.getBoundingClientRect().right;break}}for(let t=o+1;t<i.children.length;t++){const e=i.children[t];if(!e.hasAttribute("hidden")&&!this.__isDetailsCell(e)&&(e.hasAttribute("frozen")||e.hasAttribute("frozen-to-end"))){r=e.getBoundingClientRect().left;break}}e.left<s&&(this.$.table.scrollLeft+=Math.round(e.left-s)),e.right>r&&(this.$.table.scrollLeft+=Math.round(e.right-r))}_getGridEventLocation(t){const e=t.composedPath(),i=e.indexOf(this.$.table);return{section:i>=1?e[i-1]:null,row:i>=2?e[i-2]:null,cell:i>=3?e[i-3]:null}}_getGridSectionFromFocusTarget(t){return t===this._headerFocusable?this.$.header:t===this._itemsFocusable?this.$.items:t===this._footerFocusable?this.$.footer:null}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,ss=t=>class extends t{static get properties(){return{detailsOpenedItems:{type:Array,value:()=>[]},rowDetailsRenderer:Function,_detailsCells:{type:Array}}}static get observers(){return["_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)","_rowDetailsRendererChanged(rowDetailsRenderer)"]}ready(){super.ready(),this._detailsCellResizeObserver=new ResizeObserver((t=>{t.forEach((({target:t})=>{this._updateDetailsCellHeight(t.parentElement)})),this.__virtualizer.__adapter._resizeHandler()}))}_rowDetailsRendererChanged(t){t&&this._columnTree&&Array.from(this.$.items.children).forEach((t=>{if(!t.querySelector("[part~=details-cell]")){this._updateRow(t,this._columnTree[this._columnTree.length-1]);const e=this._isDetailsOpened(t._item);this._toggleDetailsCell(t,e)}}))}_detailsOpenedItemsChanged(t,e){"detailsOpenedItems.length"!==t.path&&t.value&&[...this.$.items.children].forEach((t=>{(t.hasAttribute("details-opened")||e&&this._isDetailsOpened(t._item))&&this._updateItem(t,t._item)}))}_configureDetailsCell(t){t.setAttribute("part","cell details-cell"),t.toggleAttribute("frozen",!0),this._detailsCellResizeObserver.observe(t)}_toggleDetailsCell(t,e){const i=t.querySelector('[part~="details-cell"]');i&&(i.hidden=!e,i.hidden||this.rowDetailsRenderer&&(i._renderer=this.rowDetailsRenderer))}_updateDetailsCellHeight(t){const e=t.querySelector('[part~="details-cell"]');e&&(this.__updateDetailsRowPadding(t,e),requestAnimationFrame((()=>this.__updateDetailsRowPadding(t,e))))}__updateDetailsRowPadding(t,e){e.hidden?t.style.removeProperty("padding-bottom"):t.style.setProperty("padding-bottom",`${e.offsetHeight}px`)}_updateDetailsCellHeights(){[...this.$.items.children].forEach((t=>{this._updateDetailsCellHeight(t)}))}_isDetailsOpened(t){return this.detailsOpenedItems&&-1!==this._getItemIndexInArray(t,this.detailsOpenedItems)}openItemDetails(t){this._isDetailsOpened(t)||(this.detailsOpenedItems=[...this.detailsOpenedItems,t])}closeItemDetails(t){this._isDetailsOpened(t)&&(this.detailsOpenedItems=this.detailsOpenedItems.filter((e=>!this._itemsEqual(e,t))))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,rs=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.resizables?t.target.resizables.forEach((e=>{e._onResize(t.contentRect)})):t.target._onResize(t.contentRect)}))}))})),as=M((t=>class extends t{connectedCallback(){if(super.connectedCallback(),rs.observe(this),this._observeParent){const t=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;t.resizables||(t.resizables=new Set,rs.observe(t)),t.resizables.add(this),this.__parent=t}}disconnectedCallback(){super.disconnectedCallback(),rs.unobserve(this);const t=this.__parent;if(this._observeParent&&t){const e=t.resizables;e&&(e.delete(this),0===e.size&&rs.unobserve(t)),this.__parent=null}}get _observeParent(){return!1}_onResize(t){}notifyResize(){console.warn("WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}})),ls=500,gs=t=>class extends(as(t)){static get properties(){return{_frozenCells:{type:Array,value:()=>[]},_frozenToEndCells:{type:Array,value:()=>[]},_rowWithFocusedElement:Element}}get _scrollTop(){return this.$.table.scrollTop}set _scrollTop(t){this.$.table.scrollTop=t}get _scrollLeft(){return this.$.table.scrollLeft}ready(){super.ready(),this.scrollTarget=this.$.table,this.$.items.addEventListener("focusin",(t=>{const e=t.composedPath().indexOf(this.$.items);this._rowWithFocusedElement=t.composedPath()[e-1]})),this.$.items.addEventListener("focusout",(()=>{this._rowWithFocusedElement=void 0})),this.$.table.addEventListener("scroll",(()=>this._afterScroll()))}_onResize(){if(this._updateOverflow(),this.__updateHorizontalScrollPosition(),this._firefox){const t=!Po(this);t&&!1===this.__previousVisible&&(this._scrollTop=this.__memorizedScrollTop||0),this.__previousVisible=t}}scrollToIndex(t){t=Math.min(this._effectiveSize-1,Math.max(0,t)),this.__virtualizer.scrollToIndex(t),this.__scrollIntoViewport(t)}__scrollIntoViewport(t){const e=[...this.$.items.children].find((e=>e.index===t));if(e){const t=e.getBoundingClientRect(),i=this.$.footer.getBoundingClientRect().top,o=this.$.header.getBoundingClientRect().bottom;t.bottom>i?this.$.table.scrollTop+=t.bottom-i:t.top<o&&(this.$.table.scrollTop-=o-t.top)}}_scheduleScrolling(){this._scrollingFrame||(this._scrollingFrame=requestAnimationFrame((()=>this.$.scroller.toggleAttribute("scrolling",!0)))),this._debounceScrolling=vo.debounce(this._debounceScrolling,Gi.after(ls),(()=>{cancelAnimationFrame(this._scrollingFrame),delete this._scrollingFrame,this.$.scroller.toggleAttribute("scrolling",!1)}))}_afterScroll(){if(this.__updateHorizontalScrollPosition(),this.hasAttribute("reordering")||this._scheduleScrolling(),this.hasAttribute("navigating")||this._hideTooltip(!0),this._updateOverflow(),this._firefox){!Po(this)&&!1!==this.__previousVisible&&(this.__memorizedScrollTop=this._scrollTop)}}_updateOverflow(){let t="";const e=this.$.table;e.scrollTop<e.scrollHeight-e.clientHeight&&(t+=" bottom"),e.scrollTop>0&&(t+=" top");const i=this.__getNormalizedScrollLeft(e);i>0&&(t+=" start"),i<e.scrollWidth-e.clientWidth&&(t+=" end"),this.__isRTL&&(t=t.replace(/start|end/gi,(t=>"start"===t?"end":"start"))),e.scrollLeft<e.scrollWidth-e.clientWidth&&(t+=" right"),e.scrollLeft>0&&(t+=" left"),this._debounceOverflow=vo.debounce(this._debounceOverflow,Si,(()=>{const e=t.trim();e.length>0&&this.getAttribute("overflow")!==e?this.setAttribute("overflow",e):0===e.length&&this.hasAttribute("overflow")&&this.removeAttribute("overflow")}))}_frozenCellsChanged(){this._debouncerCacheElements=vo.debounce(this._debouncerCacheElements,Yi,(()=>{Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((t=>{t.style.transform=""})),this._frozenCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")),this._frozenToEndCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")),this.__updateHorizontalScrollPosition()})),this._debounceUpdateFrozenColumn()}_debounceUpdateFrozenColumn(){this.__debounceUpdateFrozenColumn=vo.debounce(this.__debounceUpdateFrozenColumn,Yi,(()=>this._updateFrozenColumn()))}_updateFrozenColumn(){if(!this._columnTree)return;const t=this._columnTree[this._columnTree.length-1].slice(0);let e,i;t.sort(((t,e)=>t._order-e._order));for(let o=0;o<t.length;o++){const n=t[o];n._lastFrozen=!1,n._firstFrozenToEnd=!1,void 0===i&&n.frozenToEnd&&!n.hidden&&(i=o),n.frozen&&!n.hidden&&(e=o)}void 0!==e&&(t[e]._lastFrozen=!0),void 0!==i&&(t[i]._firstFrozenToEnd=!0)}__updateHorizontalScrollPosition(){const t=this.$.table.scrollWidth,e=this.$.table.clientWidth,i=Math.max(0,this.$.table.scrollLeft),o=this.__getNormalizedScrollLeft(this.$.table),n=`translate(${-i}px, 0)`;this.$.header.style.transform=n,this.$.footer.style.transform=n,this.$.items.style.transform=n;const s=this.__isRTL?o+e-t:i,r=`translate(${s}px, 0)`;for(let t=0;t<this._frozenCells.length;t++)this._frozenCells[t].style.transform=r;const a=`translate(${this.__isRTL?o:i+e-t}px, 0)`;for(let t=0;t<this._frozenToEndCells.length;t++)this._frozenToEndCells[t].style.transform=a;this.hasAttribute("navigating")&&this.__rowFocusMode&&this.$.table.style.setProperty("--_grid-horizontal-scroll-position",-s+"px")}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,cs=t=>class extends t{static get properties(){return{selectedItems:{type:Object,notify:!0,value:()=>[]},__selectedKeys:{type:Object,computed:"__computeSelectedKeys(itemIdPath, selectedItems.*)"}}}static get observers(){return["__selectedItemsChanged(itemIdPath, selectedItems.*)"]}_isSelected(t){return this.__selectedKeys.has(this.getItemId(t))}selectItem(t){this._isSelected(t)||(this.selectedItems=[...this.selectedItems,t])}deselectItem(t){this._isSelected(t)&&(this.selectedItems=this.selectedItems.filter((e=>!this._itemsEqual(e,t))))}_toggleItem(t){this._isSelected(t)?this.deselectItem(t):this.selectItem(t)}__selectedItemsChanged(){this.requestContentUpdate()}__computeSelectedKeys(t,e){const i=e.base||[],o=new Set;return i.forEach((t=>{o.add(this.getItemId(t))})),o}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;let Is="prepend";const ds=t=>class extends t{static get properties(){return{multiSort:{type:Boolean,value:!1},multiSortPriority:{type:String,value:()=>Is},multiSortOnShiftClick:{type:Boolean,value:!1},_sorters:{type:Array,value:()=>[]},_previousSorters:{type:Array,value:()=>[]}}}static setDefaultMultiSortPriority(t){Is=["append","prepend"].includes(t)?t:"prepend"}ready(){super.ready(),this.addEventListener("sorter-changed",this._onSorterChanged)}_onSorterChanged(t){const e=t.target;t.stopPropagation(),e._grid=this,this.__updateSorter(e,t.detail.shiftClick,t.detail.fromSorterClick),this.__applySorters()}__removeSorters(t){0!==t.length&&(this._sorters=this._sorters.filter((e=>t.indexOf(e)<0)),this.multiSort&&this.__updateSortOrders(),this.__applySorters())}__updateSortOrders(){this._sorters.forEach(((t,e)=>{t._order=this._sorters.length>1?e:null}))}__appendSorter(t){t.direction?this._sorters.includes(t)||this._sorters.push(t):this._removeArrayItem(this._sorters,t),this.__updateSortOrders()}__prependSorter(t){this._removeArrayItem(this._sorters,t),t.direction&&this._sorters.unshift(t),this.__updateSortOrders()}__updateSorter(t,e,i){if(t.direction||-1!==this._sorters.indexOf(t))if(t._order=null,this.multiSort&&(!this.multiSortOnShiftClick||!i)||this.multiSortOnShiftClick&&e)"append"===this.multiSortPriority?this.__appendSorter(t):this.__prependSorter(t);else if(t.direction||this.multiSortOnShiftClick){const e=this._sorters.filter((e=>e!==t));this._sorters=t.direction?[t]:[],e.forEach((t=>{t._order=null,t.direction=null}))}}__applySorters(){this.dataProvider&&this.isAttached&&JSON.stringify(this._previousSorters)!==JSON.stringify(this._mapSorters())&&this.clearCache(),this._a11yUpdateSorters(),this._previousSorters=this._mapSorters()}_mapSorters(){return this._sorters.map((t=>({path:t.path,direction:t.direction})))}_removeArrayItem(t,e){const i=t.indexOf(e);i>-1&&t.splice(i,1)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,hs=t=>class extends t{static get properties(){return{cellClassNameGenerator:Function}}static get observers(){return["__cellClassNameGeneratorChanged(cellClassNameGenerator)"]}__cellClassNameGeneratorChanged(){this.generateCellClassNames()}generateCellClassNames(){Array.from(this.$.items.children).filter((t=>!t.hidden&&!t.hasAttribute("loading"))).forEach((t=>this._generateCellClassNames(t,this.__getRowModel(t))))}_generateCellClassNames(t,e){Array.from(t.children).forEach((t=>{if(t.__generatedClasses&&t.__generatedClasses.forEach((e=>t.classList.remove(e))),this.cellClassNameGenerator){const i=this.cellClassNameGenerator(t._column,e);t.__generatedClasses=i&&i.split(" ").filter((t=>t.length>0)),t.__generatedClasses&&t.__generatedClasses.forEach((e=>t.classList.add(e)))}}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;class Cs extends(Yo(Lt(Hn(Gn(Fn(On(gs(cs(ds(ss(ns(jn(qn(Sn(Rn(Mo($n(Kn(hs(Qo(ji))))))))))))))))))))){static get template(){return vi`
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
    `}static get is(){return"vaadin-grid"}static get observers(){return["_columnTreeChanged(_columnTree, _columnTree.*)","_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)"]}static get properties(){return{_safari:{type:Boolean,value:Mn},_ios:{type:Boolean,value:bn},_firefox:{type:Boolean,value:An},_android:{type:Boolean,value:un},_touchDevice:{type:Boolean,value:Zn},allRowsVisible:{type:Boolean,value:!1,reflectToAttribute:!0},_recalculateColumnWidthOnceLoadingFinished:{type:Boolean,value:!0},isAttached:{value:!1},__gridElement:{type:Boolean,value:!0}}}constructor(){super(),this.addEventListener("animationend",this._onAnimationEnd)}connectedCallback(){super.connectedCallback(),this.isAttached=!0,this.recalculateColumnWidths()}disconnectedCallback(){super.disconnectedCallback(),this.isAttached=!1,this._hideTooltip(!0)}__getFirstVisibleItem(){return this._getVisibleRows().find((t=>this._isInViewport(t)))}get _firstVisibleIndex(){const t=this.__getFirstVisibleItem();return t?t.index:void 0}__getLastVisibleItem(){return this._getVisibleRows().reverse().find((t=>this._isInViewport(t)))}get _lastVisibleIndex(){const t=this.__getLastVisibleItem();return t?t.index:void 0}_isInViewport(t){const e=this.$.table.getBoundingClientRect(),i=t.getBoundingClientRect(),o=this.$.header.getBoundingClientRect().height,n=this.$.footer.getBoundingClientRect().height;return i.bottom>e.top+o&&i.top<e.bottom-n}_getVisibleRows(){return Array.from(this.$.items.children).filter((t=>!t.hidden)).sort(((t,e)=>t.index-e.index))}ready(){super.ready(),this.__virtualizer=new Tn({createElements:this._createScrollerRows.bind(this),updateElement:this._updateScrollerItem.bind(this),scrollContainer:this.$.items,scrollTarget:this.$.table,reorderElements:!0}),new ResizeObserver((()=>setTimeout((()=>{this.__updateFooterPositioning(),this._recalculateColumnWidthOnceVisible&&(this._recalculateColumnWidthOnceVisible=!1,this.recalculateColumnWidths())})))).observe(this.$.table),sn(this),this._tooltipController=new Eo(this),this.addController(this._tooltipController),this._tooltipController.setManual(!0)}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),"dir"===t&&(this.__isRTL="rtl"===i)}__getBodyCellCoordinates(t){if(this.$.items.contains(t)&&"td"===t.localName)return{item:t.parentElement._item,column:t._column}}__focusBodyCell({item:t,column:e}){const i=this._getVisibleRows().find((e=>e._item===t)),o=i&&[...i.children].find((t=>t._column===e));o&&o.focus()}_effectiveSizeChanged(t,e,i,o){if(e&&i&&o){const i=this.shadowRoot.activeElement,o=this.__getBodyCellCoordinates(i);e.size=t,e.update(),e.flush(),o&&i.parentElement.hidden&&this.__focusBodyCell(o),this._resetKeyboardNavigation()}}__itemsReceived(){if(!this._recalculateColumnWidthOnceLoadingFinished||this._cache.isLoading())return;if([...this.$.items.children].some((t=>void 0===t.index)))return;[...this.$.items.children].some((t=>t.clientHeight>0))&&(this._recalculateColumnWidthOnceLoadingFinished=!1,this.recalculateColumnWidths())}__getIntrinsicWidth(t){if(this.__intrinsicWidthCache.has(t))return this.__intrinsicWidthCache.get(t);const e=this.__calculateIntrinsicWidth(t);return this.__intrinsicWidthCache.set(t,e),e}__calculateIntrinsicWidth(t){const e=t.width,i=t.flexGrow;t.width="auto",t.flexGrow=0;const o=t._allCells.filter((t=>!this.$.items.contains(t)||this._isInViewport(t.parentElement))).reduce(((t,e)=>Math.max(t,e.offsetWidth+1)),0);return t.flexGrow=i,t.width=e,o}__getDistributedWidth(t,e){if(null==t||t===this)return 0;const i=Math.max(this.__getIntrinsicWidth(t),this.__getDistributedWidth((t.assignedSlot||t).parentElement,t));if(!e)return i;const o=i,n=t._visibleChildColumns.map((t=>this.__getIntrinsicWidth(t))).reduce(((t,e)=>t+e),0),s=Math.max(0,o-n),r=this.__getIntrinsicWidth(e)/n*s;return this.__getIntrinsicWidth(e)+r}_recalculateColumnWidths(t){this.__virtualizer.flush(),[...this.$.header.children,...this.$.footer.children].forEach((t=>{t.__debounceUpdateHeaderFooterRowVisibility&&t.__debounceUpdateHeaderFooterRowVisibility.flush()})),this._debouncerHiddenChanged&&this._debouncerHiddenChanged.flush(),this.__intrinsicWidthCache=new Map,t.forEach((t=>{t.width=`${this.__getDistributedWidth(t)}px`}))}recalculateColumnWidths(){if(!this._columnTree)return;if(Po(this))return void(this._recalculateColumnWidthOnceVisible=!0);if(this._cache.isLoading())return void(this._recalculateColumnWidthOnceLoadingFinished=!0);const t=this._getColumns().filter((t=>!t.hidden&&t.autoWidth));this._recalculateColumnWidths(t)}_createScrollerRows(t){const e=[];for(let i=0;i<t;i++){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this._columnTree&&this._updateRow(t,this._columnTree[this._columnTree.length-1],"body",!1,!0),e.push(t)}var i,o,n;return this._columnTree&&this._columnTree[this._columnTree.length-1].forEach((t=>t.isConnected&&t.notifyPath&&t.notifyPath("_cells.*",t._cells))),i=this,o=()=>{this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._afterScroll(),this.__itemsReceived()},ln||In(),gn.push([i,o,n]),e}_createCell(t,e){const i=`vaadin-grid-cell-content-${this._contentIndex=this._contentIndex+1||0}`,o=document.createElement("vaadin-grid-cell-content");o.setAttribute("slot",i);const n=document.createElement(t);n.id=i.replace("-content-","-"),n.setAttribute("role","td"===t?"gridcell":"columnheader"),un||bn||(n.addEventListener("mouseenter",(t=>{this.$.scroller.hasAttribute("scrolling")||this._showTooltip(t)})),n.addEventListener("mouseleave",(()=>{this._hideTooltip()})),n.addEventListener("mousedown",(()=>{this._hideTooltip(!0)})));const s=document.createElement("slot");if(s.setAttribute("name",i),e&&e._focusButtonMode){const t=document.createElement("div");t.setAttribute("role","button"),t.setAttribute("tabindex","-1"),n.appendChild(t),n._focusButton=t,n.focus=function(){n._focusButton.focus()},t.appendChild(s)}else n.setAttribute("tabindex","-1"),n.appendChild(s);return n._content=o,o.addEventListener("mousedown",(()=>{if(mn){const t=e=>{const i=o.contains(this.getRootNode().activeElement),s=e.composedPath().includes(o);!i&&s&&n.focus(),document.removeEventListener("mouseup",t,!0)};document.addEventListener("mouseup",t,!0)}else setTimeout((()=>{o.contains(this.getRootNode().activeElement)||n.focus()}))})),n}_updateRow(t,e,i,o,n){i=i||"body";const s=document.createDocumentFragment();Array.from(t.children).forEach((t=>{t._vacant=!0})),t.innerHTML="",e.filter((t=>!t.hidden)).forEach(((e,r,a)=>{let l;if("body"===i){if(e._cells=e._cells||[],l=e._cells.find((t=>t._vacant)),l||(l=this._createCell("td",e),e._cells.push(l)),l.setAttribute("part","cell body-cell"),t.appendChild(l),t===this.$.sizer&&(e._sizerCell=l),r===a.length-1&&this.rowDetailsRenderer){this._detailsCells=this._detailsCells||[];const e=this._detailsCells.find((t=>t._vacant))||this._createCell("td");-1===this._detailsCells.indexOf(e)&&this._detailsCells.push(e),e._content.parentElement||s.appendChild(e._content),this._configureDetailsCell(e),t.appendChild(e),this._a11ySetRowDetailsCell(t,e),e._vacant=!1}e.notifyPath&&!n&&e.notifyPath("_cells.*",e._cells)}else{const n="header"===i?"th":"td";o||"vaadin-grid-column-group"===e.localName?(l=e[`_${i}Cell`]||this._createCell(n),l._column=e,t.appendChild(l),e[`_${i}Cell`]=l):(e._emptyCells=e._emptyCells||[],l=e._emptyCells.find((t=>t._vacant))||this._createCell(n),l._column=e,t.appendChild(l),-1===e._emptyCells.indexOf(l)&&e._emptyCells.push(l)),l.setAttribute("part",`cell ${i}-cell`)}l._content.parentElement||s.appendChild(l._content),l._vacant=!1,l._column=e})),"body"!==i&&this.__debounceUpdateHeaderFooterRowVisibility(t),this.appendChild(s),this._frozenCellsChanged(),this._updateFirstAndLastColumnForRow(t)}__debounceUpdateHeaderFooterRowVisibility(t){t.__debounceUpdateHeaderFooterRowVisibility=vo.debounce(t.__debounceUpdateHeaderFooterRowVisibility,Yi,(()=>this.__updateHeaderFooterRowVisibility(t)))}__updateHeaderFooterRowVisibility(t){if(!t)return;const e=Array.from(t.children).filter((e=>{const i=e._column;if(i._emptyCells&&i._emptyCells.indexOf(e)>-1)return!1;if(t.parentElement===this.$.header){if(i.headerRenderer)return!0;if(null===i.header)return!1;if(i.path||void 0!==i.header)return!0}else if(i.footerRenderer)return!0;return!1}));t.hidden!==!e.length&&(t.hidden=!e.length),this._resetKeyboardNavigation()}_updateScrollerItem(t,e){this._preventScrollerRotatingCellFocus(t,e),this._columnTree&&(t.toggleAttribute("first",0===e),t.toggleAttribute("last",e===this._effectiveSize-1),t.toggleAttribute("odd",e%2),this._a11yUpdateRowRowindex(t,e),this._getItem(e,t))}_columnTreeChanged(t){this._renderColumnTree(t),this.recalculateColumnWidths()}_renderColumnTree(t){for(Array.from(this.$.items.children).forEach((e=>this._updateRow(e,t[t.length-1],null,!1,!0)));this.$.header.children.length<t.length;){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this.$.header.appendChild(t);const e=document.createElement("tr");e.setAttribute("part","row"),e.setAttribute("role","row"),e.setAttribute("tabindex","-1"),this.$.footer.appendChild(e)}for(;this.$.header.children.length>t.length;)this.$.header.removeChild(this.$.header.firstElementChild),this.$.footer.removeChild(this.$.footer.firstElementChild);Array.from(this.$.header.children).forEach(((e,i)=>this._updateRow(e,t[i],"header",i===t.length-1))),Array.from(this.$.footer.children).forEach(((e,i)=>this._updateRow(e,t[t.length-1-i],"footer",0===i))),this._updateRow(this.$.sizer,t[t.length-1]),this._resizeHandler(),this._frozenCellsChanged(),this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows(),this.__updateFooterPositioning(),this.generateCellClassNames(),this.__updateHeaderAndFooter()}__updateFooterPositioning(){this._firefox&&parseFloat(navigator.userAgent.match(/Firefox\/(\d{2,3}.\d)/)[1])<99&&(this.$.items.style.paddingBottom=0,this.allRowsVisible||(this.$.items.style.paddingBottom=`${this.$.footer.offsetHeight}px`))}_updateItem(t,e){t._item=e;const i=this.__getRowModel(t);this._toggleDetailsCell(t,i.detailsOpened),this._a11yUpdateRowLevel(t,i.level),this._a11yUpdateRowSelected(t,i.selected),t.toggleAttribute("expanded",i.expanded),t.toggleAttribute("selected",i.selected),t.toggleAttribute("details-opened",i.detailsOpened),this._generateCellClassNames(t,i),this._filterDragAndDrop(t,i),Array.from(t.children).forEach((t=>{if(t._renderer){const e=t._column||this;t._renderer.call(e,t._content,e,i)}})),this._updateDetailsCellHeight(t),this._a11yUpdateRowExpanded(t,i.expanded)}_resizeHandler(){this._updateDetailsCellHeights(),this.__updateFooterPositioning(),this.__updateHorizontalScrollPosition()}_onAnimationEnd(t){0===t.animationName.indexOf("vaadin-grid-appear")&&(t.stopPropagation(),this.__itemsReceived(),requestAnimationFrame((()=>{this.__scrollToPendingIndex()})))}__getRowModel(t){return{index:t.index,item:t._item,level:this._getIndexLevel(t.index),expanded:this._isExpanded(t._item),selected:this._isSelected(t._item),detailsOpened:!!this.rowDetailsRenderer&&this._isDetailsOpened(t._item)}}_showTooltip(t){const e=this._tooltipController.node;e&&e.isConnected&&(this._tooltipController.setTarget(t.target),this._tooltipController.setContext(this.getEventContext(t)),e._stateController.open({focus:"focusin"===t.type,hover:"mouseenter"===t.type}))}_hideTooltip(t){const e=this._tooltipController.node;e&&e._stateController.close(t)}requestContentUpdate(){this.__updateHeaderAndFooter(),this.__updateVisibleRows()}__updateHeaderAndFooter(){(this._columnTree||[]).forEach((t=>{t.forEach((t=>{t._renderHeaderAndFooter&&t._renderHeaderAndFooter()}))}))}__updateVisibleRows(t,e){this.__virtualizer&&this.__virtualizer.update(t,e)}notifyResize(){console.warn("WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}}customElements.define(Cs.is,Cs),jt("vaadin-grid-sorter",T`
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
const us=document.createElement("template");us.innerHTML="\n  <style>\n    @font-face {\n      font-family: 'vaadin-grid-sorter-icons';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');\n      font-weight: normal;\n      font-style: normal;\n    }\n  </style>\n",document.head.appendChild(us.content);class ms extends(Lt(Go(ji))){static get template(){return vi`
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
    `}static get is(){return"vaadin-grid-sorter"}static get properties(){return{path:String,direction:{type:String,reflectToAttribute:!0,notify:!0,value:null},_order:{type:Number,value:null},_isConnected:{type:Boolean,observer:"__isConnectedChanged"}}}static get observers(){return["_pathOrDirectionChanged(path, direction)"]}ready(){super.ready(),this.addEventListener("click",this._onClick.bind(this))}connectedCallback(){super.connectedCallback(),this._isConnected=!0}disconnectedCallback(){super.disconnectedCallback(),this._isConnected=!1,!this.parentNode&&this._grid&&this._grid.__removeSorters([this])}_pathOrDirectionChanged(){this.__dispatchSorterChangedEvenIfPossible()}__isConnectedChanged(t,e){!1!==e&&this.__dispatchSorterChangedEvenIfPossible()}__dispatchSorterChangedEvenIfPossible(){void 0!==this.path&&void 0!==this.direction&&this._isConnected&&(this.dispatchEvent(new CustomEvent("sorter-changed",{detail:{shiftClick:Boolean(this._shiftClick),fromSorterClick:Boolean(this._fromSorterClick)},bubbles:!0,composed:!0})),this._fromSorterClick=!1,this._shiftClick=!1)}_getDisplayOrder(t){return null===t?"":t+1}_onClick(t){if(t.defaultPrevented)return;const e=this.getRootNode().activeElement;this!==e&&this.contains(e)||(t.preventDefault(),this._shiftClick=t.shiftKey,this._fromSorterClick=!0,"asc"===this.direction?this.direction="desc":"desc"===this.direction?this.direction=null:this.direction="asc")}}customElements.define(ms.is,ms);
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
class As extends an{static get is(){return"vaadin-grid-sort-column"}static get properties(){return{path:String,direction:{type:String,notify:!0}}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)"]}constructor(){super(),this.__boundOnDirectionChanged=this.__onDirectionChanged.bind(this)}_defaultHeaderRenderer(t,e){let i=t.firstElementChild;i||(i=document.createElement("vaadin-grid-sorter"),i.addEventListener("direction-changed",this.__boundOnDirectionChanged),t.appendChild(i)),i.path=this.path,i.__rendererDirection=this.direction,i.direction=this.direction,i.textContent=this.__getHeader(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}__onDirectionChanged(t){t.detail.value!==t.target.__rendererDirection&&(this.direction=t.detail.value)}__getHeader(t,e){return t||(e?this._generateHeader(e):void 0)}}customElements.define(As.is,As);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const ps="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,bs=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},Ms=`{{lit-${String(Math.random()).slice(2)}}}`,Zs=`\x3c!--${Ms}--\x3e`,Ns=new RegExp(`${Ms}|${Zs}`),ys="$lit$";class fs{constructor(t,e){this.parts=[],this.element=e;const i=[],o=[],n=document.createTreeWalker(e.content,133,null,!1);let s=0,r=-1,a=0;const{strings:l,values:{length:g}}=t;for(;a<g;){const t=n.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let o=0;for(let t=0;t<i;t++)ws(e[t].name,ys)&&o++;for(;o-- >0;){const e=l[a],i=js.exec(e)[2],o=i.toLowerCase()+ys,n=t.getAttribute(o);t.removeAttribute(o);const s=n.split(Ns);this.parts.push({type:"attribute",index:r,name:i,strings:s}),a+=s.length-1}}"TEMPLATE"===t.tagName&&(o.push(t),n.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(Ms)>=0){const o=t.parentNode,n=e.split(Ns),s=n.length-1;for(let e=0;e<s;e++){let i,s=n[e];if(""===s)i=Ts();else{const t=js.exec(s);null!==t&&ws(t[2],ys)&&(s=s.slice(0,t.index)+t[1]+t[2].slice(0,-5)+t[3]),i=document.createTextNode(s)}o.insertBefore(i,t),this.parts.push({type:"node",index:++r})}""===n[s]?(o.insertBefore(Ts(),t),i.push(t)):t.data=n[s],a+=s}}else if(8===t.nodeType)if(t.data===Ms){const e=t.parentNode;null!==t.previousSibling&&r!==s||(r++,e.insertBefore(Ts(),t)),s=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(i.push(t),r--),a++}else{let e=-1;for(;-1!==(e=t.data.indexOf(Ms,e+1));)this.parts.push({type:"node",index:-1}),a++}}else n.currentNode=o.pop()}for(const t of i)t.parentNode.removeChild(t)}}const ws=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},vs=t=>-1!==t.index,Ts=()=>document.createComment(""),js=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function Os(t,e){const{element:{content:i},parts:o}=t,n=document.createTreeWalker(i,133,null,!1);let s=ks(o),r=o[s],a=-1,l=0;const g=[];let c=null;for(;n.nextNode();){a++;const t=n.currentNode;for(t.previousSibling===c&&(c=null),e.has(t)&&(g.push(t),null===c&&(c=t)),null!==c&&l++;void 0!==r&&r.index===a;)r.index=null!==c?-1:r.index-l,s=ks(o,s),r=o[s]}g.forEach((t=>t.parentNode.removeChild(t)))}const Ds=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,133,null,!1);for(;i.nextNode();)e++;return e},ks=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(vs(e))return i}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const xs=new WeakMap,zs=t=>"function"==typeof t&&xs.has(t),Ls={},Ws={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class Gs{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=ps?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,o=document.createTreeWalker(t,133,null,!1);let n,s=0,r=0,a=o.nextNode();for(;s<i.length;)if(n=i[s],vs(n)){for(;r<n.index;)r++,"TEMPLATE"===a.nodeName&&(e.push(a),o.currentNode=a.content),null===(a=o.nextNode())&&(o.currentNode=e.pop(),a=o.nextNode());if("node"===n.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(a.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(a,n.name,n.strings,this.options));s++}else this.__parts.push(void 0),s++;return ps&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const Ss=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),Rs=` ${Ms} `;class Ys{constructor(t,e,i,o){this.strings=t,this.values=e,this.type=i,this.processor=o}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let o=0;o<t;o++){const t=this.strings[o],n=t.lastIndexOf("\x3c!--");i=(n>-1||i)&&-1===t.indexOf("--\x3e",n+1);const s=js.exec(t);e+=null===s?t+(i?Rs:Zs):t.substr(0,s.index)+s[1]+s[2]+ys+s[3]+Ms}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==Ss&&(e=Ss.createHTML(e)),t.innerHTML=e,t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const Hs=t=>null===t||!("object"==typeof t||"function"==typeof t),Bs=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class Es{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new _s(this)}_getValue(){const t=this.strings,e=t.length-1,i=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=i[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!Bs(t))return t}let o="";for(let n=0;n<e;n++){o+=t[n];const e=i[n];if(void 0!==e){const t=e.value;if(Hs(t)||!Bs(t))o+="string"==typeof t?t:String(t);else for(const e of t)o+="string"==typeof e?e:String(e)}}return o+=t[e],o}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class _s{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===Ls||Hs(t)&&t===this.value||(this.value=t,zs(t)||(this.committer.dirty=!0))}commit(){for(;zs(this.value);){const t=this.value;this.value=Ls,t(this)}this.value!==Ls&&this.committer.commit()}}class Xs{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(Ts()),this.endNode=t.appendChild(Ts())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=Ts()),t.__insert(this.endNode=Ts())}insertAfterPart(t){t.__insert(this.startNode=Ts()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;zs(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=Ls,t(this)}const t=this.__pendingValue;t!==Ls&&(Hs(t)?t!==this.value&&this.__commitText(t):t instanceof Ys?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Bs(t)?this.__commitIterable(t):t===Ws?(this.value=Ws,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof Gs&&this.value.template===e)this.value.update(t.values);else{const i=new Gs(e,t.processor,this.options),o=i._clone();i.update(t.values),this.__commitNode(o),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,o=0;for(const n of t)i=e[o],void 0===i&&(i=new Xs(this.options),e.push(i),0===o?i.appendIntoPart(this):i.insertAfterPart(e[o-1])),i.setValue(n),i.commit(),o++;o<e.length&&(e.length=o,this.clear(i&&i.endNode))}clear(t=this.startNode){bs(this.startNode.parentNode,t.nextSibling,this.endNode)}}class Ps{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;zs(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=Ls,t(this)}if(this.__pendingValue===Ls)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=Ls}}class Js extends Es{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new Vs(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class Vs extends _s{}let Us=!1;(()=>{try{const t={get capture(){return Us=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class Ks{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;zs(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=Ls,t(this)}if(this.__pendingValue===Ls)return;const t=this.__pendingValue,e=this.value,i=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),o=null!=t&&(null==e||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),o&&(this.__options=Qs(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=Ls}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const Qs=t=>t&&(Us?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function Fs(t){let e=$s.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},$s.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const o=t.strings.join(Ms);return i=e.keyString.get(o),void 0===i&&(i=new fs(t,t.getTemplateElement()),e.keyString.set(o,i)),e.stringsArray.set(t.strings,i),i}const $s=new Map,qs=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const tr=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,i,o){const n=e[0];if("."===n){return new Js(t,e.slice(1),i).parts}if("@"===n)return[new Ks(t,e.slice(1),o.eventContext)];if("?"===n)return[new Ps(t,e.slice(1),i)];return new Es(t,e,i).parts}handleTextExpression(t){return new Xs(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const er=(t,...e)=>new Ys(t,e,"html",tr)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,ir=(t,e)=>`${t}--${e}`;let or=!0;void 0===window.ShadyCSS?or=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),or=!1);const nr=t=>e=>{const i=ir(e.type,t);let o=$s.get(i);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},$s.set(i,o));let n=o.stringsArray.get(e.strings);if(void 0!==n)return n;const s=e.strings.join(Ms);if(n=o.keyString.get(s),void 0===n){const i=e.getTemplateElement();or&&window.ShadyCSS.prepareTemplateDom(i,t),n=new fs(e,i),o.keyString.set(s,n)}return o.stringsArray.set(e.strings,n),n},sr=["html","svg"],rr=new Set,ar=(t,e,i)=>{rr.add(t);const o=i?i.element:document.createElement("template"),n=e.querySelectorAll("style"),{length:s}=n;if(0===s)return void window.ShadyCSS.prepareTemplateStyles(o,t);const r=document.createElement("style");for(let t=0;t<s;t++){const e=n[t];e.parentNode.removeChild(e),r.textContent+=e.textContent}(t=>{sr.forEach((e=>{const i=$s.get(ir(e,t));void 0!==i&&i.keyString.forEach((t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{i.add(t)})),Os(t,i)}))}))})(t);const a=o.content;i?function(t,e,i=null){const{element:{content:o},parts:n}=t;if(null==i)return void o.appendChild(e);const s=document.createTreeWalker(o,133,null,!1);let r=ks(n),a=0,l=-1;for(;s.nextNode();)for(l++,s.currentNode===i&&(a=Ds(e),i.parentNode.insertBefore(e,i));-1!==r&&n[r].index===l;){if(a>0){for(;-1!==r;)n[r].index+=a,r=ks(n,r);return}r=ks(n,r)}}(i,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(o,t);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)e.insertBefore(l.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(r,a.firstChild);const t=new Set;t.add(r),Os(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const lr={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},gr=(t,e)=>e!==t&&(e==e||t==t),cr={attribute:!0,type:String,converter:lr,reflect:!1,hasChanged:gr},Ir="finalized";class dr extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,i)=>{const o=this._attributeNameForProperty(i,e);void 0!==o&&(this._attributeToPropertyMap.set(o,i),t.push(o))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=cr){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const n=this[t];this[e]=o,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||cr}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(Ir)||t.finalize(),this[Ir]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=gr){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,o=e.converter||lr,n="function"==typeof o?o:o.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,o=e.converter;return(o&&o.toAttribute||lr.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=cr){const o=this.constructor,n=o._attributeNameForProperty(t,i);if(void 0!==n){const t=o._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(n):this.setAttribute(n,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const i=this.constructor,o=i._attributeToPropertyMap.get(t);if(void 0!==o){const t=i.getPropertyOptions(o);this._updateState=16|this._updateState,this[o]=i._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,i){let o=!0;if(void 0!==t){const n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==i.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):o=!1}!this._hasRequestedUpdate&&o&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}dr[Ir]=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const hr=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Cr=Symbol();class ur{constructor(t,e){if(e!==Cr)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(hr?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const mr=(t,...e)=>{const i=e.reduce(((e,i,o)=>e+(t=>{if(t instanceof ur)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[o+1]),t[0]);return new ur(i,Cr)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const Ar={};class pr extends dr{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,i)=>t.reduceRight(((t,i)=>Array.isArray(i)?e(i,t):(t.add(i),t)),i),i=e(t,new Set),o=[];i.forEach((t=>o.unshift(t))),this._styles=o}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!hr){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return new ur(String(e),Cr)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?hr?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==Ar&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return Ar}}pr.finalized=!0,pr.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const o=i.scopeName,n=qs.has(e),s=or&&11===e.nodeType&&!!e.host,r=s&&!rr.has(o),a=r?document.createDocumentFragment():e;if(((t,e,i)=>{let o=qs.get(e);void 0===o&&(bs(e,e.firstChild),qs.set(e,o=new Xs(Object.assign({templateFactory:Fs},i))),o.appendInto(e)),o.setValue(t),o.commit()})(t,a,Object.assign({templateFactory:nr(o)},i)),r){const t=qs.get(a);qs.delete(a);const i=t.value instanceof Gs?t.value.template:void 0;ar(o,a,i),bs(e,e.firstChild),e.appendChild(a),qs.set(e,t)}!n&&s&&window.ShadyCSS.styleElement(e.host)},pr.shadowRootOptions={mode:"open"};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var br,Mr=(br=function(t,e){return br=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])},br(t,e)},function(t,e){function i(){this.constructor=t}br(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),Zr=Object.prototype.hasOwnProperty;function Nr(t,e){return Zr.call(t,e)}function yr(t){if(Array.isArray(t)){for(var e=new Array(t.length),i=0;i<e.length;i++)e[i]=""+i;return e}if(Object.keys)return Object.keys(t);var o=[];for(var n in t)Nr(t,n)&&o.push(n);return o}function fr(t){switch(typeof t){case"object":return JSON.parse(JSON.stringify(t));case"undefined":return null;default:return t}}function wr(t){for(var e,i=0,o=t.length;i<o;){if(!((e=t.charCodeAt(i))>=48&&e<=57))return!1;i++}return!0}function vr(t){return-1===t.indexOf("/")&&-1===t.indexOf("~")?t:t.replace(/~/g,"~0").replace(/\//g,"~1")}function Tr(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}function jr(t){if(void 0===t)return!0;if(t)if(Array.isArray(t)){for(var e=0,i=t.length;e<i;e++)if(jr(t[e]))return!0}else if("object"==typeof t)for(var o=yr(t),n=o.length,s=0;s<n;s++)if(jr(t[o[s]]))return!0;return!1}function Or(t,e){var i=[t];for(var o in e){var n="object"==typeof e[o]?JSON.stringify(e[o],null,2):e[o];void 0!==n&&i.push(o+": "+n)}return i.join("\n")}var Dr=function(t){function e(e,i,o,n,s){var r=this.constructor,a=t.call(this,Or(e,{name:i,index:o,operation:n,tree:s}))||this;return a.name=i,a.index=o,a.operation=n,a.tree=s,Object.setPrototypeOf(a,r.prototype),a.message=Or(e,{name:i,index:o,operation:n,tree:s}),a}return Mr(e,t),e}(Error),kr=Dr,xr=fr,zr={add:function(t,e,i){return t[e]=this.value,{newDocument:i}},remove:function(t,e,i){var o=t[e];return delete t[e],{newDocument:i,removed:o}},replace:function(t,e,i){var o=t[e];return t[e]=this.value,{newDocument:i,removed:o}},move:function(t,e,i){var o=Wr(i,this.path);o&&(o=fr(o));var n=Gr(i,{op:"remove",path:this.from}).removed;return Gr(i,{op:"add",path:this.path,value:n}),{newDocument:i,removed:o}},copy:function(t,e,i){var o=Wr(i,this.from);return Gr(i,{op:"add",path:this.path,value:fr(o)}),{newDocument:i}},test:function(t,e,i){return{newDocument:i,test:Hr(t[e],this.value)}},_get:function(t,e,i){return this.value=t[e],{newDocument:i}}},Lr={add:function(t,e,i){return wr(e)?t.splice(e,0,this.value):t[e]=this.value,{newDocument:i,index:e}},remove:function(t,e,i){return{newDocument:i,removed:t.splice(e,1)[0]}},replace:function(t,e,i){var o=t[e];return t[e]=this.value,{newDocument:i,removed:o}},move:zr.move,copy:zr.copy,test:zr.test,_get:zr._get};function Wr(t,e){if(""==e)return t;var i={op:"_get",path:e};return Gr(t,i),i.value}function Gr(t,e,i,o,n,s){if(void 0===i&&(i=!1),void 0===o&&(o=!0),void 0===n&&(n=!0),void 0===s&&(s=0),i&&("function"==typeof i?i(e,0,t,e.path):Rr(e,0)),""===e.path){var r={newDocument:t};if("add"===e.op)return r.newDocument=e.value,r;if("replace"===e.op)return r.newDocument=e.value,r.removed=t,r;if("move"===e.op||"copy"===e.op)return r.newDocument=Wr(t,e.from),"move"===e.op&&(r.removed=t),r;if("test"===e.op){if(r.test=Hr(t,e.value),!1===r.test)throw new kr("Test operation failed","TEST_OPERATION_FAILED",s,e,t);return r.newDocument=t,r}if("remove"===e.op)return r.removed=t,r.newDocument=null,r;if("_get"===e.op)return e.value=t,r;if(i)throw new kr("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",s,e,t);return r}o||(t=fr(t));var a=(e.path||"").split("/"),l=t,g=1,c=a.length,I=void 0,d=void 0,h=void 0;for(h="function"==typeof i?i:Rr;;){if((d=a[g])&&-1!=d.indexOf("~")&&(d=Tr(d)),n&&("__proto__"==d||"prototype"==d&&g>0&&"constructor"==a[g-1]))throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(i&&void 0===I&&(void 0===l[d]?I=a.slice(0,g).join("/"):g==c-1&&(I=e.path),void 0!==I&&h(e,0,t,I)),g++,Array.isArray(l)){if("-"===d)d=l.length;else{if(i&&!wr(d))throw new kr("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",s,e,t);wr(d)&&(d=~~d)}if(g>=c){if(i&&"add"===e.op&&d>l.length)throw new kr("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",s,e,t);if(!1===(r=Lr[e.op].call(e,l,d,t)).test)throw new kr("Test operation failed","TEST_OPERATION_FAILED",s,e,t);return r}}else if(g>=c){if(!1===(r=zr[e.op].call(e,l,d,t)).test)throw new kr("Test operation failed","TEST_OPERATION_FAILED",s,e,t);return r}if(l=l[d],i&&g<c&&(!l||"object"!=typeof l))throw new kr("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",s,e,t)}}function Sr(t,e,i,o,n){if(void 0===o&&(o=!0),void 0===n&&(n=!0),i&&!Array.isArray(e))throw new kr("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");o||(t=fr(t));for(var s=new Array(e.length),r=0,a=e.length;r<a;r++)s[r]=Gr(t,e[r],i,!0,n,r),t=s[r].newDocument;return s.newDocument=t,s}function Rr(t,e,i,o){if("object"!=typeof t||null===t||Array.isArray(t))throw new kr("Operation is not an object","OPERATION_NOT_AN_OBJECT",e,t,i);if(!zr[t.op])throw new kr("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",e,t,i);if("string"!=typeof t.path)throw new kr("Operation `path` property is not a string","OPERATION_PATH_INVALID",e,t,i);if(0!==t.path.indexOf("/")&&t.path.length>0)throw new kr('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",e,t,i);if(("move"===t.op||"copy"===t.op)&&"string"!=typeof t.from)throw new kr("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",e,t,i);if(("add"===t.op||"replace"===t.op||"test"===t.op)&&void 0===t.value)throw new kr("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",e,t,i);if(("add"===t.op||"replace"===t.op||"test"===t.op)&&jr(t.value))throw new kr("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",e,t,i);if(i)if("add"==t.op){var n=t.path.split("/").length,s=o.split("/").length;if(n!==s+1&&n!==s)throw new kr("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",e,t,i)}else if("replace"===t.op||"remove"===t.op||"_get"===t.op){if(t.path!==o)throw new kr("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",e,t,i)}else if("move"===t.op||"copy"===t.op){var r=Yr([{op:"_get",path:t.from,value:void 0}],i);if(r&&"OPERATION_PATH_UNRESOLVABLE"===r.name)throw new kr("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",e,t,i)}}function Yr(t,e,i){try{if(!Array.isArray(t))throw new kr("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(e)Sr(fr(e),fr(t),i||!0);else{i=i||Rr;for(var o=0;o<t.length;o++)i(t[o],o,e,void 0)}}catch(t){if(t instanceof kr)return t;throw t}}function Hr(t,e){if(t===e)return!0;if(t&&e&&"object"==typeof t&&"object"==typeof e){var i,o,n,s=Array.isArray(t),r=Array.isArray(e);if(s&&r){if((o=t.length)!=e.length)return!1;for(i=o;0!=i--;)if(!Hr(t[i],e[i]))return!1;return!0}if(s!=r)return!1;var a=Object.keys(t);if((o=a.length)!==Object.keys(e).length)return!1;for(i=o;0!=i--;)if(!e.hasOwnProperty(a[i]))return!1;for(i=o;0!=i--;)if(!Hr(t[n=a[i]],e[n]))return!1;return!0}return t!=t&&e!=e}var Br=Object.freeze({__proto__:null,JsonPatchError:kr,_areEquals:Hr,applyOperation:Gr,applyPatch:Sr,applyReducer:function(t,e,i){var o=Gr(t,e);if(!1===o.test)throw new kr("Test operation failed","TEST_OPERATION_FAILED",i,e,t);return o.newDocument},deepClone:xr,getValueByPointer:Wr,validate:Yr,validator:Rr}),Er=new WeakMap,_r=function(t){this.observers=new Map,this.obj=t},Xr=function(t,e){this.callback=t,this.observer=e};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 * Selectr 2.4.0
 * https://github.com/Mobius1/Selectr
 *
 * Released under the MIT license
 */.selectr-container{position:relative}.selectr-container li{list-style:none}.selectr-hidden{position:absolute;overflow:hidden;clip:rect(0,0,0,0);width:1px;height:1px;margin:-1px;padding:0;border:0 none}.selectr-visible{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;z-index:11}.selectr-desktop.multiple .selectr-visible{display:none}.selectr-desktop.multiple.native-open .selectr-visible{top:100%;min-height:200px!important;height:auto;opacity:1;display:block}.selectr-container.multiple.selectr-mobile .selectr-selected{z-index:0}.selectr-selected{position:relative;z-index:1;box-sizing:border-box;width:100%;padding:7px 28px 7px 14px;cursor:pointer;border:1px solid #999;border-radius:3px;background-color:#fff}.selectr-selected::before{position:absolute;top:50%;right:10px;width:0;height:0;content:'';-o-transform:rotate(0) translate3d(0,-50%,0);-ms-transform:rotate(0) translate3d(0,-50%,0);-moz-transform:rotate(0) translate3d(0,-50%,0);-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0);border-width:4px 4px 0 4px;border-style:solid;border-color:#6c7a86 transparent transparent}.selectr-container.native-open .selectr-selected::before,.selectr-container.open .selectr-selected::before{border-width:0 4px 4px 4px;border-style:solid;border-color:transparent transparent #6c7a86}.selectr-label{display:none;overflow:hidden;width:100%;white-space:nowrap;text-overflow:ellipsis}.selectr-placeholder{color:#6c7a86}.selectr-tags{margin:0;padding:0;white-space:normal}.has-selected .selectr-tags{margin:0 0 -2px}.selectr-tag{list-style:none;position:relative;float:left;padding:2px 25px 2px 8px;margin:0 2px 2px 0;cursor:default;color:#fff;border:medium none;border-radius:10px;background:#acb7bf none repeat scroll 0 0}.selectr-container.multiple.has-selected .selectr-selected{padding:5px 28px 5px 5px}.selectr-options-container{position:absolute;z-index:10000;top:calc(100% - 1px);left:0;display:none;box-sizing:border-box;width:100%;border-width:0 1px 1px;border-style:solid;border-color:transparent #999 #999;border-radius:0 0 3px 3px;background-color:#fff}.selectr-container.open .selectr-options-container{display:block}.selectr-input-container{position:relative;display:none}.selectr-clear,.selectr-input-clear,.selectr-tag-remove{position:absolute;top:50%;right:22px;width:20px;height:20px;padding:0;cursor:pointer;-o-transform:translate3d(0,-50%,0);-ms-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);border:medium none;background-color:transparent;z-index:11}.selectr-clear,.selectr-input-clear{display:none}.selectr-container.has-selected .selectr-clear,.selectr-input-container.active .selectr-input-clear{display:block}.selectr-selected .selectr-tag-remove{right:2px}.selectr-clear::after,.selectr-clear::before,.selectr-input-clear::after,.selectr-input-clear::before,.selectr-tag-remove::after,.selectr-tag-remove::before{position:absolute;top:5px;left:9px;width:2px;height:10px;content:' ';background-color:#6c7a86}.selectr-tag-remove::after,.selectr-tag-remove::before{top:4px;width:3px;height:12px;background-color:#fff}.selectr-clear:before,.selectr-input-clear::before,.selectr-tag-remove::before{-o-transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);transform:rotate(45deg)}.selectr-clear:after,.selectr-input-clear::after,.selectr-tag-remove::after{-o-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.selectr-input-container.active,.selectr-input-container.active .selectr-clear{display:block}.selectr-input{top:5px;left:5px;box-sizing:border-box;width:calc(100% - 30px);margin:10px 15px;padding:7px 30px 7px 9px;border:1px solid #999;border-radius:3px}.selectr-notice{display:none;box-sizing:border-box;width:100%;padding:8px 16px;border-top:1px solid #999;border-radius:0 0 3px 3px;background-color:#fff}.selectr-container.notice .selectr-notice{display:block}.selectr-container.notice .selectr-selected{border-radius:3px 3px 0 0}.selectr-options{position:relative;top:calc(100% + 2px);display:none;overflow-x:auto;overflow-y:scroll;max-height:200px;margin:0;padding:0}.selectr-container.notice .selectr-options-container,.selectr-container.open .selectr-input-container,.selectr-container.open .selectr-options{display:block}.selectr-option{position:relative;display:block;padding:5px 20px;list-style:outside none none;cursor:pointer;font-weight:400}.selectr-options.optgroups>.selectr-option{padding-left:25px}.selectr-optgroup{font-weight:700;padding:0}.selectr-optgroup--label{font-weight:700;margin-top:10px;padding:5px 15px}.selectr-match{text-decoration:underline}.selectr-option.selected{background-color:#ddd}.selectr-option.active{color:#fff;background-color:#5897fb}.selectr-option.disabled{opacity:.4}.selectr-option.excluded{display:none}.selectr-container.open .selectr-selected{border-color:#999 #999 transparent #999;border-radius:3px 3px 0 0}.selectr-container.open .selectr-selected::after{-o-transform:rotate(180deg) translate3d(0,50%,0);-ms-transform:rotate(180deg) translate3d(0,50%,0);-moz-transform:rotate(180deg) translate3d(0,50%,0);-webkit-transform:rotate(180deg) translate3d(0,50%,0);transform:rotate(180deg) translate3d(0,50%,0)}.selectr-disabled{opacity:.6}.has-selected .selectr-placeholder,.selectr-empty{display:none}.has-selected .selectr-label{display:block}.taggable .selectr-selected{padding:4px 28px 4px 4px}.taggable .selectr-selected::after{display:table;content:" ";clear:both}.taggable .selectr-label{width:auto}.taggable .selectr-tags{float:left;display:block}.taggable .selectr-placeholder{display:none}.input-tag{float:left;min-width:90px;width:auto}.selectr-tag-input{border:medium none;padding:3px 10px;width:100%;font-family:inherit;font-weight:inherit;font-size:inherit}.selectr-input-container.loading::after{position:absolute;top:50%;right:20px;width:20px;height:20px;content:'';-o-transform:translate3d(0,-50%,0);-ms-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);-o-transform-origin:50% 0 0;-ms-transform-origin:50% 0 0;-moz-transform-origin:50% 0 0;-webkit-transform-origin:50% 0 0;transform-origin:50% 0 0;-moz-animation:.5s linear 0s normal forwards infinite running spin;-webkit-animation:.5s linear 0s normal forwards infinite running spin;animation:.5s linear 0s normal forwards infinite running spin;border-width:3px;border-style:solid;border-color:#aaa #ddd #ddd;border-radius:50%}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0)}100%{-webkit-transform:rotate(360deg) translate3d(0,-50%,0);transform:rotate(360deg) translate3d(0,-50%,0)}}@keyframes spin{0%{-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0)}100%{-webkit-transform:rotate(360deg) translate3d(0,-50%,0);transform:rotate(360deg) translate3d(0,-50%,0)}}.selectr-container.open.inverted .selectr-selected{border-color:transparent #999 #999;border-radius:0 0 3px 3px}.selectr-container.inverted .selectr-options-container{border-width:1px 1px 0;border-color:#999 #999 transparent;border-radius:3px 3px 0 0;background-color:#fff}.selectr-container.inverted .selectr-options-container{top:auto;bottom:calc(100% - 1px)}.selectr-container ::-webkit-input-placeholder{color:#6c7a86;opacity:1}.selectr-container ::-moz-placeholder{color:#6c7a86;opacity:1}.selectr-container :-ms-input-placeholder{color:#6c7a86;opacity:1}.selectr-container ::placeholder{color:#6c7a86;opacity:1}`;const ta=["set","setMode","setName","setText","get","getMode","getName","getText"];window.customElements.define("fleshy-jsoneditor",class extends pr{static get styles(){return[qr,mr`
        :host {
          display: block;
        }

        #jsonEditorContainer {
          height: 100%;
        }
      `]}static get properties(){return{json:{type:Object},mode:{type:String},modes:{type:Array},name:{type:String},search:{type:Boolean,reflect:!0},indentation:{type:Number},history:{type:Boolean}}}constructor(){super(),this.json={},this.modes=[],this.search=!1,this.history=!1}firstUpdated(){this.shadowRoot&&(this._injectTheme("#ace_editor\\.css"),this._injectTheme("#ace-tm"),this._injectTheme("#ace_searchbox"),ace.config.loadModule(["theme","ace/theme/jsoneditor"],(()=>{this._injectTheme("#ace-jsoneditor")}))),this._initializeEditor()}updated(t){super.updated(t),t.has("mode")&&this.editor.setMode(this.mode),t.has("name")&&this.editor.setName(this.name),t.has("json")&&(this._observer&&Pr(t.get("json"),this._observer),this.json&&(this._observer=Jr(this.json,this._refresh.bind(this))),this._refresh())}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this.editor&&(this._observer=Jr(this.json,this._refresh))}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this._observer&&Pr(this.json,this._observer)}render(){return er`<div id="jsonEditorContainer"></div> `}_initializeEditor(){this._jsonEditorContainer=this.shadowRoot.querySelector("#jsonEditorContainer");const t={mode:this.mode,history:this.history,name:this.name,modes:this.modes,search:this.search,indentation:this.indentation,onChange:()=>{if(this.editor)try{const t=Kr(this.json,this.editor.get());this.dispatchEvent(new CustomEvent("change",{detail:{json:this.json,patches:t}})),this._observer&&Pr(this.json,this._observer),Sr(this.json,t),this._observer=Jr(this.json,this._refresh)}catch(t){this.dispatchEvent(new CustomEvent("error",{detail:{level:"fleshy",error:t}}))}},onError:t=>{this.dispatchEvent(new CustomEvent("error",{detail:{level:"upstream",error:t}}))}};this.editor=new JSONEditor(this._jsonEditorContainer,t),this.editor.set(this.json);let e=ta.length-1;for(;e;)this[ta[e]]=this.editor[ta[e]].bind(this.editor),e-=1}_refresh(){this.editor.set(this.json)}_injectTheme(t){const e=document.querySelector(t);this.shadowRoot.appendChild(this._cloneStyle(e))}_cloneStyle(t){const e=document.createElement("style");return e.id=t.id,e.textContent=t.textContent,e}});export{Mo as C,Go as D,Yo as E,Cs as G,Vo as I,po as K,tn as L,ji as P,Bo as S,Lt as T,go as a,an as b,os as c,is as d,M as e,Jo as f,Fo as g,vi as h,T as i,Zn as j,vo as k,$o as l,en as m,Eo as n,jt as r,Gi as t};