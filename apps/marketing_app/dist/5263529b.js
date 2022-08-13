import{_ as t,i as e,e as i,b as o,t as s,s as r,p as a,o as n,c as d,l as h,r as l,n as p,a as c,T as g,d as u,S as m}from"./6c888b0e.js";class v extends r{constructor(){super(...arguments),this.indeterminate=!1,this.progress=0,this.buffer=1,this.reverse=!1,this.closed=!1,this.stylePrimaryHalf="",this.stylePrimaryFull="",this.styleSecondaryQuarter="",this.styleSecondaryHalf="",this.styleSecondaryFull="",this.animationReady=!0,this.closedAnimationOff=!1,this.resizeObserver=null}connectedCallback(){super.connectedCallback(),this.rootEl&&this.attachResizeObserver()}render(){const t={"mdc-linear-progress--closed":this.closed,"mdc-linear-progress--closed-animation-off":this.closedAnimationOff,"mdc-linear-progress--indeterminate":this.indeterminate,"mdc-linear-progress--animation-ready":this.animationReady},e={"--mdc-linear-progress-primary-half":this.stylePrimaryHalf,"--mdc-linear-progress-primary-half-neg":""!==this.stylePrimaryHalf?`-${this.stylePrimaryHalf}`:"","--mdc-linear-progress-primary-full":this.stylePrimaryFull,"--mdc-linear-progress-primary-full-neg":""!==this.stylePrimaryFull?`-${this.stylePrimaryFull}`:"","--mdc-linear-progress-secondary-quarter":this.styleSecondaryQuarter,"--mdc-linear-progress-secondary-quarter-neg":""!==this.styleSecondaryQuarter?`-${this.styleSecondaryQuarter}`:"","--mdc-linear-progress-secondary-half":this.styleSecondaryHalf,"--mdc-linear-progress-secondary-half-neg":""!==this.styleSecondaryHalf?`-${this.styleSecondaryHalf}`:"","--mdc-linear-progress-secondary-full":this.styleSecondaryFull,"--mdc-linear-progress-secondary-full-neg":""!==this.styleSecondaryFull?`-${this.styleSecondaryFull}`:""},i={"flex-basis":this.indeterminate?"100%":100*this.buffer+"%"},o={transform:this.indeterminate?"scaleX(1)":`scaleX(${this.progress})`};return a`
      <div
          role="progressbar"
          class="mdc-linear-progress ${n(t)}"
          style="${d(e)}"
          dir="${h(this.reverse?"rtl":void 0)}"
          aria-label="${h(this.ariaLabel)}"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow="${h(this.indeterminate?void 0:this.progress)}"
        @transitionend="${this.syncClosedState}">
        <div class="mdc-linear-progress__buffer">
          <div
            class="mdc-linear-progress__buffer-bar"
            style=${d(i)}>
          </div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div
            class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
            style=${d(o)}>
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`}update(t){!t.has("closed")||this.closed&&void 0!==t.get("closed")||this.syncClosedState(),super.update(t)}async firstUpdated(t){super.firstUpdated(t),this.attachResizeObserver()}syncClosedState(){this.closedAnimationOff=this.closed}updated(t){!t.has("indeterminate")&&t.has("reverse")&&this.indeterminate&&this.restartAnimation(),t.has("indeterminate")&&void 0!==t.get("indeterminate")&&this.indeterminate&&window.ResizeObserver&&this.calculateAndSetAnimationDimensions(this.rootEl.offsetWidth),super.updated(t)}disconnectedCallback(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),super.disconnectedCallback()}attachResizeObserver(){if(window.ResizeObserver)return this.resizeObserver=new window.ResizeObserver((t=>{if(this.indeterminate)for(const e of t)if(e.contentRect){const t=e.contentRect.width;this.calculateAndSetAnimationDimensions(t)}})),void this.resizeObserver.observe(this.rootEl);this.resizeObserver=null}calculateAndSetAnimationDimensions(t){const e=.8367142*t,i=2.00611057*t,o=.37651913*t,s=.84386165*t,r=1.60277782*t;this.stylePrimaryHalf=`${e}px`,this.stylePrimaryFull=`${i}px`,this.styleSecondaryQuarter=`${o}px`,this.styleSecondaryHalf=`${s}px`,this.styleSecondaryFull=`${r}px`,this.restartAnimation()}async restartAnimation(){this.animationReady=!1,await this.updateComplete,await new Promise(requestAnimationFrame),this.animationReady=!0,await this.updateComplete}open(){this.closed=!1}close(){this.closed=!0}}t([e(".mdc-linear-progress")],v.prototype,"rootEl",void 0),t([i({type:Boolean,reflect:!0})],v.prototype,"indeterminate",void 0),t([i({type:Number})],v.prototype,"progress",void 0),t([i({type:Number})],v.prototype,"buffer",void 0),t([i({type:Boolean,reflect:!0})],v.prototype,"reverse",void 0),t([i({type:Boolean,reflect:!0})],v.prototype,"closed",void 0),t([o,i({attribute:"aria-label"})],v.prototype,"ariaLabel",void 0),t([s()],v.prototype,"stylePrimaryHalf",void 0),t([s()],v.prototype,"stylePrimaryFull",void 0),t([s()],v.prototype,"styleSecondaryQuarter",void 0),t([s()],v.prototype,"styleSecondaryHalf",void 0),t([s()],v.prototype,"styleSecondaryFull",void 0),t([s()],v.prototype,"animationReady",void 0),t([s()],v.prototype,"closedAnimationOff",void 0);const y=l`@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half, 83.67142%))}100%{transform:translateX(200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full, 200.611057%))}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter, 37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half, 84.386165%))}100%{transform:translateX(160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full, 160.277782%))}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(-10px)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half-neg, -83.67142%))}100%{transform:translateX(-200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full-neg, -200.611057%))}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter-neg, -37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half-neg, -84.386165%))}100%{transform:translateX(-160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full-neg, -160.277782%))}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}.mdc-linear-progress{position:relative;width:100%;height:4px;transform:translateZ(0);outline:1px solid transparent;overflow:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar{position:absolute;width:100%;height:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top:4px solid}.mdc-linear-progress__buffer{display:flex;position:absolute;width:100%;height:100%}.mdc-linear-progress__buffer-dots{background-repeat:repeat-x;background-size:10px 4px;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__bar{right:0;-webkit-transform-origin:center right;transform-origin:center right}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__buffer-dots,.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;transform:rotate(0)}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar,.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}.mdc-linear-progress--closed{opacity:0}.mdc-linear-progress--closed-animation-off .mdc-linear-progress__buffer-dots{animation:none}.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar,.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar .mdc-linear-progress__bar-inner{animation:none}.mdc-linear-progress__bar-inner{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E")}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6}:host{display:block}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6;background-color:var(--mdc-linear-progress-buffer-color, #e6e6e6)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E");background-image:var(--mdc-linear-progress-buffering-dots-image, url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E"))}`;let f,_,w=class extends v{};w.styles=[y],w=t([p("mwc-linear-progress")],w);class b{constructor(t){this._map=new Map,this._roundAverageSize=!0,this.totalSize=0,!1===(null==t?void 0:t.roundAverageSize)&&(this._roundAverageSize=!1)}set(t,e){const i=this._map.get(t)||0;this._map.set(t,e),this.totalSize+=e-i}get averageSize(){if(this._map.size>0){const t=this.totalSize/this._map.size;return this._roundAverageSize?Math.round(t):t}return 0}getSize(t){return this._map.get(t)}clear(){this._map.clear(),this.totalSize=0}}async function x(){return _||async function(){f=window.EventTarget;try{new f}catch(t){f=(await import("./998afe45.js")).EventTarget}return _=f}()}function I(t){return"horizontal"===t?"width":"height"}function $(t){return"horizontal"===t?"height":"width"}class C{constructor(t){this._latestCoords={left:0,top:0},this._direction=null,this._viewportSize={width:0,height:0},this._pendingReflow=!1,this._pendingLayoutUpdate=!1,this._scrollToIndex=-1,this._scrollToAnchor=0,this._firstVisible=0,this._lastVisible=0,this._eventTargetPromise=x().then((t=>{this._eventTarget=new t})),this._physicalMin=0,this._physicalMax=0,this._first=-1,this._last=-1,this._sizeDim="height",this._secondarySizeDim="width",this._positionDim="top",this._secondaryPositionDim="left",this._scrollPosition=0,this._scrollError=0,this._totalItems=0,this._scrollSize=1,this._overhang=1e3,this._eventTarget=null,Promise.resolve().then((()=>this.config=t||this._defaultConfig))}get _defaultConfig(){return{direction:"vertical"}}set config(t){Object.assign(this,Object.assign({},this._defaultConfig,t))}get config(){return{direction:this.direction}}get totalItems(){return this._totalItems}set totalItems(t){const e=Number(t);e!==this._totalItems&&(this._totalItems=e,this._scheduleReflow())}get direction(){return this._direction}set direction(t){(t="horizontal"===t?t:"vertical")!==this._direction&&(this._direction=t,this._sizeDim="horizontal"===t?"width":"height",this._secondarySizeDim="horizontal"===t?"height":"width",this._positionDim="horizontal"===t?"left":"top",this._secondaryPositionDim="horizontal"===t?"top":"left",this._triggerReflow())}get viewportSize(){return this._viewportSize}set viewportSize(t){const{_viewDim1:e,_viewDim2:i}=this;Object.assign(this._viewportSize,t),i!==this._viewDim2?this._scheduleLayoutUpdate():e!==this._viewDim1&&this._checkThresholds()}get viewportScroll(){return this._latestCoords}set viewportScroll(t){Object.assign(this._latestCoords,t);const e=this._scrollPosition;this._scrollPosition=this._latestCoords[this._positionDim],e!==this._scrollPosition&&(this._scrollPositionChanged(e,this._scrollPosition),this._updateVisibleIndices({emit:!0})),this._checkThresholds()}reflowIfNeeded(t=!1){(t||this._pendingReflow)&&(this._pendingReflow=!1,this._reflow())}scrollToIndex(t,e="start"){if(Number.isFinite(t)){switch(t=Math.min(this.totalItems,Math.max(0,t)),this._scrollToIndex=t,"nearest"===e&&(e=t>this._first+this._num/2?"end":"start"),e){case"start":this._scrollToAnchor=0;break;case"center":this._scrollToAnchor=.5;break;case"end":this._scrollToAnchor=1;break;default:throw new TypeError("position must be one of: start, center, end, nearest")}this._scheduleReflow()}}async dispatchEvent(t){await this._eventTargetPromise,this._eventTarget.dispatchEvent(t)}async addEventListener(t,e,i){await this._eventTargetPromise,this._eventTarget.addEventListener(t,e,i)}async removeEventListener(t,e,i){await this._eventTargetPromise,this._eventTarget.removeEventListener(t,e,i)}_updateLayout(){}get _viewDim1(){return this._viewportSize[this._sizeDim]}get _viewDim2(){return this._viewportSize[this._secondarySizeDim]}_scheduleReflow(){this._pendingReflow=!0}_scheduleLayoutUpdate(){this._pendingLayoutUpdate=!0,this._scheduleReflow()}_triggerReflow(){this._scheduleLayoutUpdate(),Promise.resolve().then((()=>this.reflowIfNeeded()))}_reflow(){this._pendingLayoutUpdate&&(this._updateLayout(),this._pendingLayoutUpdate=!1),this._updateScrollSize(),this._getActiveItems(),this._scrollIfNeeded(),this._updateVisibleIndices(),this._emitScrollSize(),this._emitRange(),this._emitChildPositions(),this._emitScrollError()}_scrollIfNeeded(){if(-1===this._scrollToIndex)return;const t=this._scrollToIndex,e=this._scrollToAnchor,i=this._getItemPosition(t)[this._positionDim],o=this._getItemSize(t)[this._sizeDim],s=this._scrollPosition+this._viewDim1*e,r=i+o*e,a=Math.floor(Math.min(this._scrollSize-this._viewDim1,Math.max(0,this._scrollPosition-s+r)));this._scrollError+=this._scrollPosition-a,this._scrollPosition=a}_emitRange(t){const e=Object.assign({first:this._first,last:this._last,num:this._num,stable:!0,firstVisible:this._firstVisible,lastVisible:this._lastVisible},t);this.dispatchEvent(new CustomEvent("rangechange",{detail:e}))}_emitScrollSize(){const t={[this._sizeDim]:this._scrollSize};this.dispatchEvent(new CustomEvent("scrollsizechange",{detail:t}))}_emitScrollError(){if(this._scrollError){const t={[this._positionDim]:this._scrollError,[this._secondaryPositionDim]:0};this.dispatchEvent(new CustomEvent("scrollerrorchange",{detail:t})),this._scrollError=0}}_emitChildPositions(){const t={};for(let e=this._first;e<=this._last;e++)t[e]=this._getItemPosition(e);this.dispatchEvent(new CustomEvent("itempositionchange",{detail:t}))}get _num(){return-1===this._first||-1===this._last?0:this._last-this._first+1}_checkThresholds(){if(0===this._viewDim1&&this._num>0)this._scheduleReflow();else{const t=Math.max(0,this._scrollPosition-this._overhang),e=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang);(this._physicalMin>t||this._physicalMax<e)&&this._scheduleReflow()}}_updateVisibleIndices(t){if(-1===this._first||-1===this._last)return;let e=this._first;for(;e<this._last&&Math.round(this._getItemPosition(e)[this._positionDim]+this._getItemSize(e)[this._sizeDim])<=Math.round(this._scrollPosition);)e++;let i=this._last;for(;i>this._first&&Math.round(this._getItemPosition(i)[this._positionDim])>=Math.round(this._scrollPosition+this._viewDim1);)i--;e===this._firstVisible&&i===this._lastVisible||(this._firstVisible=e,this._lastVisible=i,t&&t.emit&&this._emitRange())}_scrollPositionChanged(t,e){const i=this._scrollSize-this._viewDim1;(t<i||e<i)&&(this._scrollToIndex=-1)}}function S(t){return"horizontal"===t?"marginLeft":"marginTop"}function P(t){return"horizontal"===t?"marginRight":"marginBottom"}function z(t,e){const i=[t,e].sort();return i[1]<=0?Math.min(...i):i[0]>=0?Math.max(...i):i[0]+i[1]}class T{constructor(){this._childSizeCache=new b,this._marginSizeCache=new b,this._metricsCache=new Map}update(t,e){var i,o;const s=new Set;Object.keys(t).forEach((i=>{const o=Number(i);this._metricsCache.set(o,t[o]),this._childSizeCache.set(o,t[o][I(e)]),s.add(o),s.add(o+1)}));for(const t of s){const s=(null===(i=this._metricsCache.get(t))||void 0===i?void 0:i[S(e)])||0,r=(null===(o=this._metricsCache.get(t-1))||void 0===o?void 0:o[P(e)])||0;this._marginSizeCache.set(t,z(s,r))}}get averageChildSize(){return this._childSizeCache.averageSize}get totalChildSize(){return this._childSizeCache.totalSize}get averageMarginSize(){return this._marginSizeCache.averageSize}get totalMarginSize(){return this._marginSizeCache.totalSize}getLeadingMarginValue(t,e){var i;return(null===(i=this._metricsCache.get(t))||void 0===i?void 0:i[S(e)])||0}getChildSize(t){return this._childSizeCache.getSize(t)}getMarginSize(t){return this._marginSizeCache.getSize(t)}clear(){this._childSizeCache.clear(),this._marginSizeCache.clear(),this._metricsCache.clear()}}class A extends C{constructor(){super(...arguments),this._itemSize={width:100,height:100},this._physicalItems=new Map,this._newPhysicalItems=new Map,this._metricsCache=new T,this._anchorIdx=null,this._anchorPos=null,this._stable=!0,this._needsRemeasure=!1,this._measureChildren=!0,this._estimate=!0}get measureChildren(){return this._measureChildren}updateItemSizes(t){this._metricsCache.update(t,this.direction),this._scheduleReflow()}_getPhysicalItem(t){var e;return null!==(e=this._newPhysicalItems.get(t))&&void 0!==e?e:this._physicalItems.get(t)}_getSize(t){return this._getPhysicalItem(t)&&this._metricsCache.getChildSize(t)}_getAverageSize(){return this._metricsCache.averageChildSize||this._itemSize[this._sizeDim]}_getPosition(t){var e;const i=this._getPhysicalItem(t),{averageMarginSize:o}=this._metricsCache;return 0===t?null!==(e=this._metricsCache.getMarginSize(0))&&void 0!==e?e:o:i?i.pos:o+t*(o+this._getAverageSize())}_calculateAnchor(t,e){return t<=0?0:e>this._scrollSize-this._viewDim1?this._totalItems-1:Math.max(0,Math.min(this._totalItems-1,Math.floor((t+e)/2/this._delta)))}_getAnchor(t,e){if(0===this._physicalItems.size)return this._calculateAnchor(t,e);if(this._first<0)return console.error("_getAnchor: negative _first"),this._calculateAnchor(t,e);if(this._last<0)return console.error("_getAnchor: negative _last"),this._calculateAnchor(t,e);const i=this._getPhysicalItem(this._first),o=this._getPhysicalItem(this._last),s=i.pos;if(o.pos+this._metricsCache.getChildSize(this._last)<t)return this._calculateAnchor(t,e);if(s>e)return this._calculateAnchor(t,e);let r=this._firstVisible-1,a=-1/0;for(;a<t;){a=this._getPhysicalItem(++r).pos+this._metricsCache.getChildSize(r)}return r}_getActiveItems(){0===this._viewDim1||0===this._totalItems?this._clearItems():this._getItems()}_clearItems(){this._first=-1,this._last=-1,this._physicalMin=0,this._physicalMax=0;const t=this._newPhysicalItems;this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=t,this._stable=!0}_getItems(){var t,e;const i=this._newPhysicalItems;let o,s;if(this._stable=!0,this._scrollToIndex>=0&&(this._anchorIdx=Math.min(this._scrollToIndex,this._totalItems-1),this._anchorPos=this._getPosition(this._anchorIdx),this._scrollIfNeeded()),o=this._scrollPosition-this._overhang,s=this._scrollPosition+this._viewDim1+this._overhang,s<0||o>this._scrollSize)return void this._clearItems();null!==this._anchorIdx&&null!==this._anchorPos||(this._anchorIdx=this._getAnchor(o,s),this._anchorPos=this._getPosition(this._anchorIdx));let r=this._getSize(this._anchorIdx);void 0===r&&(this._stable=!1,r=this._getAverageSize());let a=null!==(t=this._metricsCache.getMarginSize(this._anchorIdx))&&void 0!==t?t:this._metricsCache.averageMarginSize,n=null!==(e=this._metricsCache.getMarginSize(this._anchorIdx+1))&&void 0!==e?e:this._metricsCache.averageMarginSize;0===this._anchorIdx&&(this._anchorPos=a),this._anchorIdx===this._totalItems-1&&(this._anchorPos=this._scrollSize-n-r);let d=0;for(this._anchorPos+r+n<o&&(d=o-(this._anchorPos+r+n)),this._anchorPos-a>s&&(d=s-(this._anchorPos-a)),d&&(this._scrollPosition-=d,o-=d,s-=d,this._scrollError+=d),i.set(this._anchorIdx,{pos:this._anchorPos,size:r}),this._first=this._last=this._anchorIdx,this._physicalMin=this._anchorPos,this._physicalMax=this._anchorPos+r;this._physicalMin>o&&this._first>0;){let t=this._getSize(--this._first);void 0===t&&(this._stable=!1,t=this._getAverageSize());let e=this._metricsCache.getMarginSize(this._first+1);void 0===e&&(this._stable=!1,e=this._metricsCache.averageMarginSize),this._physicalMin-=t+e;const o=this._physicalMin;if(i.set(this._first,{pos:o,size:t}),!1===this._stable&&!1===this._estimate)break}for(;this._physicalMax<s&&this._last<this._totalItems-1;){let t=this._metricsCache.getMarginSize(++this._last);void 0===t&&(this._stable=!1,t=this._metricsCache.averageMarginSize);let e=this._getSize(this._last);void 0===e&&(this._stable=!1,e=this._getAverageSize());const o=this._physicalMax+t;if(i.set(this._last,{pos:o,size:e}),this._physicalMax+=t+e,!1===this._stable&&!1===this._estimate)break}const h=this._calculateError();h&&(this._physicalMin-=h,this._physicalMax-=h,this._anchorPos-=h,this._scrollPosition-=h,i.forEach((t=>t.pos-=h)),this._scrollError+=h),this._stable&&(this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=i)}_calculateError(){var t,e;const{averageMarginSize:i}=this._metricsCache;return 0===this._first?this._physicalMin-(null!==(t=this._metricsCache.getMarginSize(0))&&void 0!==t?t:i):this._physicalMin<=0?this._physicalMin-this._first*this._delta:this._last===this._totalItems-1?this._physicalMax+(null!==(e=this._metricsCache.getMarginSize(this._totalItems))&&void 0!==e?e:i)-this._scrollSize:this._physicalMax>=this._scrollSize?this._physicalMax-this._scrollSize+(this._totalItems-1-this._last)*this._delta:0}_reflow(){const{_first:t,_last:e,_scrollSize:i}=this;this._updateScrollSize(),this._getActiveItems(),this._scrollSize!==i&&this._emitScrollSize(),this._updateVisibleIndices(),this._emitRange(),-1===this._first&&-1===this._last?this._resetReflowState():this._first!==t||this._last!==e||this._needsRemeasure?(this._emitChildPositions(),this._emitScrollError()):(this._emitChildPositions(),this._emitScrollError(),this._resetReflowState())}_resetReflowState(){this._anchorIdx=null,this._anchorPos=null,this._stable=!0}_updateScrollSize(){const{averageMarginSize:t}=this._metricsCache;this._scrollSize=Math.max(1,this._totalItems*(t+this._getAverageSize())+t)}get _delta(){const{averageMarginSize:t}=this._metricsCache;return this._getAverageSize()+t}_getItemPosition(t){var e,i;return{[this._positionDim]:this._getPosition(t),[this._secondaryPositionDim]:0,[(i=this.direction,"horizontal"===i?"xOffset":"yOffset")]:-(null!==(e=this._metricsCache.getLeadingMarginValue(t,this.direction))&&void 0!==e?e:this._metricsCache.averageMarginSize)}}_getItemSize(t){var e;return{[this._sizeDim]:(this._getSize(t)||this._getAverageSize())+(null!==(e=this._metricsCache.getMarginSize(t+1))&&void 0!==e?e:this._metricsCache.averageMarginSize),[this._secondarySizeDim]:this._itemSize[this._secondarySizeDim]}}_viewDim2Changed(){this._needsRemeasure=!0,this._scheduleReflow()}_emitRange(){const t=this._needsRemeasure,e=this._stable;this._needsRemeasure=!1,super._emitRange({remeasure:t,stable:e})}}var k=Object.freeze({__proto__:null,flow:t=>Object.assign({type:A},t),FlowLayout:A});function M(t){return"horizontal"===t?"row":"column"}class D extends C{constructor(){super(...arguments),this._itemSize={},this._gaps={},this._padding={}}get _defaultConfig(){return Object.assign({},super._defaultConfig,{itemSize:{width:"300px",height:"300px"},gap:"8px",padding:"match-gap"})}get _gap(){return this._gaps.row}get _idealSize(){return this._itemSize[I(this.direction)]}get _idealSize1(){return this._itemSize[I(this.direction)]}get _idealSize2(){return this._itemSize[$(this.direction)]}get _gap1(){return this._gaps[(t=this.direction,"horizontal"===t?"column":"row")];var t}get _gap2(){return this._gaps[M(this.direction)]}get _padding1(){const t=this._padding,[e,i]="horizontal"===this.direction?["left","right"]:["top","bottom"];return[t[e],t[i]]}get _padding2(){const t=this._padding,[e,i]="horizontal"===this.direction?["top","bottom"]:["left","right"];return[t[e],t[i]]}set itemSize(t){const e=this._itemSize,i=parseInt(t.width),o=parseInt(t.height);i!==e.width&&(e.width=i,this._triggerReflow()),o!==e.height&&(e.height=o,this._triggerReflow())}_setGap(t){const e=t.split(" ").map((t=>function(t){return"auto"===t?1/0:parseInt(t)}(t))),i=this._gaps;e[0]!==i.row&&(i.row=e[0],this._triggerReflow()),void 0===e[1]?e[0]!==i.column&&(i.column=e[0],this._triggerReflow()):e[1]!==i.column&&(i.column=e[1],this._triggerReflow())}set padding(t){const e=this._padding,i=t.split(" ").map((t=>function(t){return"match-gap"===t?1/0:parseInt(t)}(t)));1===i.length?e.top=e.right=e.bottom=e.left=i[0]:2===i.length?(e.top=e.bottom=i[0],e.right=e.left=i[1]):3===i.length?(e.top=i[0],e.right=e.left=i[1],e.bottom=i[2]):4===i.length&&["top","right","bottom","left"].forEach(((t,o)=>e[t]=i[o]))}}class L extends D{constructor(){super(...arguments),this._metrics=null,this.flex=null,this.justify=null}get _defaultConfig(){return Object.assign({},super._defaultConfig,{flex:!1,justify:"start"})}set gap(t){this._setGap(t)}_updateLayout(){const t=this.justify,[e,i]=this._padding1,[o,s]=this._padding2;["_gap1","_gap2"].forEach((e=>{const i=this[e];if(i===1/0&&!["space-between","space-around","space-evenly"].includes(t))throw new Error("grid layout: gap can only be set to 'auto' when justify is set to 'space-between', 'space-around' or 'space-evenly'");if(i===1/0&&"_gap2"===e)throw new Error(`grid layout: ${M(this.direction)}-gap cannot be set to 'auto' when direction is set to ${this.direction}`)}));const r={rolumns:-1,itemSize1:-1,itemSize2:-1,gap1:this._gap1===1/0?-1:this._gap1,gap2:this._gap2,padding1:{start:e===1/0?this._gap1:e,end:i===1/0?this._gap1:i},padding2:{start:o===1/0?this._gap2:o,end:s===1/0?this._gap2:s},positions:[]};let a=this._viewDim2;this.flex||["start","center","end"].includes(t)?(a-=r.padding2.start,a-=r.padding2.end):"space-between"===t?a+=r.gap2:"space-evenly"===t&&(a-=r.gap2);const n=a/(this._idealSize2+r.gap2);if(this.flex){switch(r.rolumns=Math.round(n),r.itemSize2=Math.round((a-r.gap2*(r.rolumns-1))/r.rolumns),!0===this.flex?"area":this.flex.preserve){case"aspect-ratio":r.itemSize1=Math.round(this._idealSize1/this._idealSize2*r.itemSize2);break;case I(this.direction):r.itemSize1=Math.round(this._idealSize1);break;case"area":default:r.itemSize1=Math.round(this._idealSize1*this._idealSize2/r.itemSize2)}}else r.itemSize1=this._idealSize1,r.itemSize2=this._idealSize2,r.rolumns=Math.floor(n);let d,h;if(this.flex||["start","center","end"].includes(t)){const e=r.rolumns*r.itemSize2+(r.rolumns-1)*r.gap2;d=this.flex||"start"===t?r.padding2.start:"end"===t?this._viewDim2-r.padding2.end-e:Math.round(this._viewDim2/2-e/2),h=r.gap2}else{const o=a-r.rolumns*r.itemSize2;"space-between"===t?(h=Math.round(o/(r.rolumns-1)),d=0):"space-around"===t?(h=Math.round(o/r.rolumns),d=Math.round(h/2)):(h=Math.round(o/(r.rolumns+1)),d=h),this._gap1===1/0&&(r.gap1=h,e===1/0&&(r.padding1.start=d),i===1/0&&(r.padding1.end=d))}for(let t=0;t<r.rolumns;t++)r.positions.push(d),d+=r.itemSize2+h;this._metrics=r}get _delta(){return this._metrics.itemSize1+this._metrics.gap1}_getItemSize(t){return{[this._sizeDim]:this._metrics.itemSize1,[this._secondarySizeDim]:this._metrics.itemSize2}}_getActiveItems(){const{padding1:t}=this._metrics,e=Math.max(0,this._scrollPosition-this._overhang),i=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang),o=Math.max(0,Math.floor((e-t.start)/this._delta)),s=Math.max(0,Math.ceil((i-t.start)/this._delta));this._first=o*this._metrics.rolumns,this._last=Math.min(s*this._metrics.rolumns-1,this._totalItems-1),this._physicalMin=t.start+this._delta*o,this._physicalMax=t.start+this._delta*s}_getItemPosition(t){const{rolumns:e,padding1:i,positions:o,itemSize1:s,itemSize2:r}=this._metrics;return{[this._positionDim]:i.start+Math.floor(t/e)*this._delta,[this._secondaryPositionDim]:o[t%e],[I(this.direction)]:s,[$(this.direction)]:r}}_updateScrollSize(){this._scrollSize=Math.max(1,Math.ceil(this._totalItems/this._metrics.rolumns)*this._delta+this._gap)}}class V{static _checkVideoLongPlayTimeAndReset(t,e){const i=e.getAttribute("data-id");if(t.playStartedAt&&i){const e=((new Date).getTime()-t.playStartedAt.getTime())/1e3;e>5&&window.appGlobals.sendLongVideoView(i),window.appGlobals.activity("completed","video",e),t.playStartedAt=void 0}else t.playStartedAt&&(console.error("Got long view check without id"),t.playStartedAt=void 0)}static _checkAudioLongPlayTimeAndReset(t,e){const i=e.getAttribute("data-id");if(t.playStartedAt&&i){const e=((new Date).getTime()-t.playStartedAt.getTime())/1e3;e>5&&window.appGlobals.sendLongAudioListen(i),window.appGlobals.activity("completed","audio",e),t.playStartedAt=void 0}else t.playStartedAt&&(console.error("Got long view check without audio id"),t.playStartedAt=void 0)}static getImageFormatUrl(t,e=0){if(!(t&&t.length>0))return"";{const i=JSON.parse(t[t.length-1].formats);if(i&&i.length>0)return i[e]}}static setupTopHeaderImage(t,e){if(t.wide){let t;t=e?"url("+this.getImageFormatUrl(e,0)+")":"none",window.appGlobals.theme.updateStyles({"--top-area-background-image":t})}}static attachMediaListeners(t){setTimeout((()=>{const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");if(e){const i=e.getAttribute("data-id");i&&(t.videoPlayListener=()=>{t.playStartedAt=new Date,window.appGlobals.sendVideoView(parseInt(i))},t.videoPauseListener=()=>{this._checkVideoLongPlayTimeAndReset(t,e)},t.videoEndedListener=()=>{this._checkVideoLongPlayTimeAndReset(t,e)},e.addEventListener("play",t.videoPlayListener.bind(t)),e.addEventListener("pause",t.videoPauseListener.bind(t)),e.addEventListener("ended",t.videoEndedListener.bind(t)))}if(i){const e=i.getAttribute("data-id");e&&(t.audioPlayListener=()=>{t.playStartedAt=new Date,window.appGlobals.sendAudioListen(e)},t.audioPauseListener=()=>{this._checkAudioLongPlayTimeAndReset(t,i)},t.audioEndedListener=()=>{this._checkAudioLongPlayTimeAndReset(t,i)},i.addEventListener("play",t.audioPlayListener.bind(t)),i.addEventListener("pause",t.audioPauseListener.bind(t)),i.addEventListener("ended",t.audioEndedListener.bind(t)))}}),200)}static detachMediaListeners(t){const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");e&&(t.videoPlayListener&&(e.removeEventListener("play",t.videoPlayListener),t.videoPlayListener=void 0),t.videoPauseListener&&(e.removeEventListener("pause",t.videoPauseListener),t.videoPauseListener=void 0),t.videoEndedListener&&(e.removeEventListener("ended",t.videoEndedListener),t.videoEndedListener=void 0),this._checkVideoLongPlayTimeAndReset(t,e)),i&&(t.audioPlayListener&&(i.removeEventListener("play",t.audioPlayListener),t.audioPlayListener=void 0),t.audioPauseListener&&(i.removeEventListener("pause",t.audioPauseListener),t.audioPauseListener=void 0),t.audioEndedListener&&(i.removeEventListener("ended",t.audioEndedListener),t.audioEndedListener=void 0),this._checkVideoLongPlayTimeAndReset(t,i))}static pauseMediaPlayback(t){const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");e&&e.pause(),i&&i.pause()}static getVideoURL(t){return t&&t.length>0&&t[0].formats&&t[0].formats.length>0?t[0].formats[0]:null}static isPortraitVideo(t){return!!(t&&t.length>0&&t[0].formats&&t[0].formats.length>0)&&!(!t[0].public_meta||!t[0].public_meta.aspect||"portrait"!==t[0].public_meta.aspect)}static getAudioURL(t){return t&&t.length>0&&t[0].formats&&t[0].formats.length>0?t[0].formats[0]:null}static getVideoPosterURL(t,e,i=0){return t&&t.length>0&&t[0].VideoImages&&t[0].VideoImages.length>0?(t[0].public_meta&&t[0].public_meta.selectedVideoFrameIndex&&(i=t[0].public_meta.selectedVideoFrameIndex),i>t[0].VideoImages.length-1&&(i=0),-2===i&&e?this.getImageFormatUrl(e,0):(i<0&&(i=0),JSON.parse(t[0].VideoImages[i].formats)[0])):null}}let U=class extends r{constructor(){super(...arguments),this.src="",this.alt=void 0,this.crossorigin=void 0,this.preventLoad=!1,this.sizing=void 0,this.position="center",this.preload=!1,this.placeholder=void 0,this.fade=!1,this.loaded=!1,this.loading=!1,this.error=!1,this.width=void 0,this.height=void 0,this._resolvedSrc=void 0,this.ABS_URL=/(^\/[^\/])|(^#)|(^[\w-\d]*:)/,this.workingURL=void 0,this.resolveDoc=void 0}static get styles(){return[l`
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }

        #baseURIAnchor {
          display: none;
        }

        #sizedImgDiv {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          display: none;
        }

        #img {
          display: block;
          width: var(--yp-image-width, auto);
          height: var(--yp-image-height, auto);
        }

        :host([sizing]) #sizedImgDiv {
          display: block;
        }

        :host([sizing]) #img {
          display: none;
        }

        #placeholder {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          background-color: inherit;
          opacity: 1;
        }

        #placeholder.faded-out {
          transition: opacity 0.5s linear;
          opacity: 0;
        }
      `]}render(){return a`
      <a id="baseURIAnchor" href="#"></a>
      <div
        id="sizedImgDiv"
        role="img"
        ?hidden="${this._computeImgDivHidden}"
        aria-hidden="${this._computeImgDivARIAHidden}"
        aria-label="${h(this._computeImgDivARIALabel)}"></div>
      <img
        id="img"
        alt="${this.alt?this.alt:""}"
        ?hidden="${this._computeImgHidden}"
        crossorigin="${h(this.crossorigin)}"
        @load="${this._imgOnLoad}"
        @error="${this._imgOnError}" />
      <div
        id="placeholder"
        ?hidden="${this.computePlaceholderHidden}"
        class="${this._computePlaceholderClassName}"></div>
    `}$$(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}connectedCallback(){super.connectedCallback(),this._resolvedSrc=""}_imgOnLoad(){this.$$("img").src===this._resolveSrc(this.src)&&(this.loading=!1,this.loaded=!0,this.error=!1)}_imgOnError(){this.$$("img").src===this._resolveSrc(this.src)&&(this.$$("img").removeAttribute("src"),this.$$("#sizedImgDiv").style.backgroundImage="",this.loading=!1,this.loaded=!1,this.error=!0)}get computePlaceholderHidden(){return!this.preload||!this.fade&&!this.loading&&this.loaded}_computePlaceholderClassName(){return this.preload&&this.fade&&!this.loading&&this.loaded?"faded-out":""}get _computeImgDivHidden(){return!this.sizing}get _computeImgDivARIAHidden(){return""===this.alt}get _computeImgDivARIALabel(){if(null!==this.alt)return this.alt;if(""===this.src)return"";const t=this._resolveSrc(this.src);return t?t.replace(/[?|#].*/g,"").split("/").pop():""}get _computeImgHidden(){return!!this.sizing}_widthChanged(){this.width&&(this.style.width=this.width+"px")}_heightChanged(){this.style.height=this.height+"px"}_loadStateObserver(){const t=this._resolveSrc(this.src);t!==this._resolvedSrc&&(this._resolvedSrc="",this.$$("img").removeAttribute("src"),this.$$("#sizedImgDiv").style.backgroundImage="",""===this.src||this.preventLoad?(this.loading=!1,this.loaded=!1,this.error=!1):(this._resolvedSrc=t,this._resolvedSrc&&(this.$$("img").src=this._resolvedSrc),this.$$("#sizedImgDiv").style.backgroundImage='url("'+this._resolvedSrc+'")',this.loading=!0,this.loaded=!1,this.error=!1))}_placeholderChanged(){this.$$("#placeholder").style.backgroundImage=this.placeholder?'url("'+this.placeholder+'")':""}_transformChanged(){const t=this.$$("#sizedImgDiv").style,e=this.$$("#placeholder").style;this.sizing&&(t.backgroundSize=e.backgroundSize=this.sizing),t.backgroundPosition=e.backgroundPosition=this.sizing?this.position:"",t.backgroundRepeat=e.backgroundRepeat=this.sizing?"no-repeat":""}_resolveSrc(t){let e=this.resolveUrl(t,this.$$("#baseURIAnchor").href);return e&&e.length>=2&&"/"===e[0]&&"/"!==e[1]&&(e=(location.origin||location.protocol+"//"+location.host)+e),e}resolveUrl(t,e){if(t&&this.ABS_URL.test(t))return t;if("//"===t)return t;if(void 0===this.workingURL){this.workingURL=!1;try{const t=new URL("b","http://a");t.pathname="c%20d",this.workingURL="http://a/c%20d"===t.href}catch(t){}}if(e||(e=document.baseURI||window.location.href),this.workingURL)try{return new URL(t,e).href}catch(e){return t}}updated(t){super.updated(t),t.has("placeHolder")&&this._placeholderChanged(),t.has("width")&&this._widthChanged(),t.has("height")&&this._widthChanged(),(t.has("sizing")||t.has("position"))&&this._transformChanged(),(t.has("src")||t.has("preventLoad"))&&this._loadStateObserver()}};t([i({type:String})],U.prototype,"src",void 0),t([i({type:String})],U.prototype,"alt",void 0),t([i({type:String})],U.prototype,"crossorigin",void 0),t([i({type:Boolean})],U.prototype,"preventLoad",void 0),t([i({type:String,reflect:!0})],U.prototype,"sizing",void 0),t([i({type:String})],U.prototype,"position",void 0),t([i({type:Boolean})],U.prototype,"preload",void 0),t([i({type:String})],U.prototype,"placeholder",void 0),t([i({type:Boolean})],U.prototype,"fade",void 0),t([i({type:Boolean})],U.prototype,"loaded",void 0),t([i({type:Boolean})],U.prototype,"loading",void 0),t([i({type:Boolean})],U.prototype,"error",void 0),t([i({type:String})],U.prototype,"width",void 0),t([i({type:String})],U.prototype,"height",void 0),U=t([p("yp-image")],U);let F=class extends c{constructor(){super(...arguments),this.filter="newest",this.subTitle="",this.showFilter=!0,this.allPostCount=0}static get styles(){return[super.styles,l`
        :host {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }

        .filterIcon {
          padding-right: 8px;
        }

        .filterIconTransform {
          -moz-transform: scaleY(-1);
          -o-transform: scaleY(-1);
          -webkit-transform: scaleY(-1);
          transform: scaleY(-1);
          filter: FlipV;
          -ms-filter: 'FlipV';
        }

        .dropdown-trigger {
          margin-bottom: 16px;
          margin-left: 16px;
        }

        .clear-search-trigger {
          width: 55px;
          height: 55px;
          margin-bottom: 16px;
        }

        mwc-list-item {
          min-height: 32px;
        }

        .subTitle {
          font-size: 22px;
          margin-top: 10px;
          margin-right: 8px;
        }

        #filterDropdown {
          padding-left: 0;
          margin-left: 0;
        }

        #dropDownTrigger {
          background-color: #fff;
          margin-left: 16px;
          color: #111;
        }

        @media (max-width: 600px) {
          .subTitle {
            font-size: 17px;
            padding-top: 0;
            margin-top: 16px;
          }

          .dropdown-trigger {
            padding-left: 0;
            margin-left: 0;
            margin-bottom: 0;
            margin-top: 0;
          }

          .clear-search-trigger {
            width: 50px;
            height: 50px;
            margin-top: 5px;
            margin-bottom: 0;
            margin-top: 0;
          }

          #dropDownTrigger {
            margin-left: 0;
            margin-right: 0;
          }
        }

        mwc-select {
          padding-left: 8px;
          padding-right: 8px;
        }

        .filterHeader {
          margin-top: 16px;
          padding-bottom: 0;
          margin-bottom: 0;
          font-weight: bold;
          font-size: 18px;
        }

        .categoriesDropdownMenu {
          padding-left: 16px;
          padding-right: 16px;
        }

        .dropdownIcon {
          color: #000;
          margin-right: 8px;
          margin-left: 8px;
        }

        .catImage {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }

        .filterText {
          margin-right: 8px;
        }

        .dropDownContent,
        #mainListMenu,
        .categoriesDropdownMenu,
        .catDropDown {
          background-color: #fff !important;
        }
      `]}render(){return a`
      <div class="layout horizontal center-center mainContainer wrap">
        ${this.showFilter?a`
              <div>
                <mwc-select
                  id="mainListMenu"
                  icon="reorder"
                  outlined
                  index="1"
                  @selected="${this._changeFilter}">
                  <mwc-list-item
                    graphic="icon"
                    value="top">
                    <span>${this.t("post.top")}</span>
                  </mwc-list-item>
                  <mwc-list-item value="newest" graphic="icon">
                    <span>${this.t("post.newest")}</span>
                  </mwc-list-item>
                  <mwc-list-item value="most_debated" graphic="icon">
                    <span>${this.t("post.most_debated")}</span>
                  </mwc-list-item>
                  <mwc-list-item value="random" graphic="icon">
                    <span>${this.t("post.random")}</span>
                  </mwc-list-item>
                </mwc-select>
              </div>
            `:g}
        ${this.categoriesWithCount?a`
              <div class="layout vertical">
                <mwc-select
                  id="categoriesMenu"
                  outlined
                  @selected="${this._changeCategory}"
                  class="dropdown-content wrap categoriesDropdownMenu">
                  <mwc-list-item data-category-id="-1" name="-1">
                    <mwc-icon icon="select-all" class="filterIcon"></mwc-icon>
                    <span
                      >${this.t("categories.the_all")}
                      (${this.allPostCount})</span
                    >
                  </mwc-list-item>

                  ${this.categoriesWithCount.map((t=>a`
                      <mwc-list-item
                        data-category-id="${t.id}"
                        data-category-name="${t.name}">
                        <yp-image
                          sizing="cover"
                          class="catImage"
                          height="24"
                          width="24"
                          src="${this._categoryImageSrc(t)}"></yp-image>
                        ${t.name} (${t.count})
                      </mwc-list-item>
                    `))}
                </mwc-select>
              </div>
            `:g}
      </div>
    `}_getCategoryCount(t,e){const i=e.find((e=>e.category_id==t));return i?i.count:0}_oldCategory(t){return!t||t.id<804}_openDropDown(){const t=this.$$("#dropDownTrigger");t&&t.click()}openFilter(){window.appGlobals.activity("open","filter")}_languageEvent(t){super._languageEvent(t),this._updateTitle()}searchFor(t){this.searchingFor=t;const e="/group/"+this.group.id+"/open/"+this.group.name+"/search/"+this.searchingFor;window.appGlobals.activity("change","filter",e),u.redirectTo(e),this.fire("refresh-group")}_updateTitle(){if(this.searchingFor)this.subTitle=this.t("post.searchingFor")+this.searchingFor;else if(this.filterName){const t=this.t(this.filterName);let e;e=this.categoryName?this.categoryName:this.t("categories.the_all"),this.t("short_word.in"),this._ifCategories()?this.subTitle=t+" - "+e:this.subTitle=t}}async _changeFilter(t){switch(t.detail.index){case 0:this.filter="top";break;case 1:this.filter="newest";break;case 2:this.filter="most_debated";break;case 3:this.filter="random"}await this.updateComplete,this._updateAfterFiltering()}_changeCategory(t){const e=this.categoryId,i=t.detail.index;if(this.categoriesWithCount){const t=0==i?-1:this.categoriesWithCount[i-1].id;-1!=t?(this.categoryId=t,this.categoryName=this.categoriesWithCount[i-1].name):(this.categoryId=void 0,this.categoryName=void 0,this.resetSelection()),this.fire("yp-filter-category-change",this.categoryId?this.categoryId:null),this._updateTitle(),e!==this.categoryId&&this._updateAfterFiltering()}else console.error("Trying to change category without one")}buildPostsUrlPath(){let t="/group/"+this.group.id+"/"+this.tabName;return this.filter&&(t+="/posts/"+this.filter),this.categoryId&&(t+="/"+this.categoryId+"/"+this.categoryName),t}_updateAfterFiltering(){const t=this.buildPostsUrlPath();window.appGlobals.activity("change","filter",t),this.fire("refresh-group")}_ifCategories(){return!!this.group&&(this.group.Categories&&this.group.Categories.length>0)}resetSelection(t){this.$$("#categoryMenu")&&(this.$$("#categoryMenu").value=t||"")}async _setupCategories(){var t;this.categoriesWithCount=void 0;const e=await window.serverApi.getCategoriesCount(this.group.id,this.tabName);if(e){const i=e.categoriesCount;this.allPostCount=e.allPostCount;const o=[];o.push({id:-1,name:this.t("categories.the_all"),count:this.allPostCount}),null===(t=this.group.Categories)||void 0===t||t.forEach((t=>{t.count=this._getCategoryCount(t.id,i),t.count>0&&o.push(t)})),o.length>1?(this.categoriesWithCount=o,setTimeout((()=>{this.resetSelection(this.categoryId?this.categoryId.toString():"")}))):console.error("Unexpected categories count")}}_updateMainListMenuValue(){this.$$("#mainListMenu")?setTimeout((()=>{this.$$("#mainListMenu").value=this.filter,this.$$("#mainListMenu").layout()}),20):console.error("Cant find mainListMenu menu")}updated(t){super.updated(t),t.has("group")&&this.group&&(this.categoriesWithCount=void 0,this.allPostCount=0,this._updateTitle(),this.group.Categories&&this.group.Categories.length>0&&this._setupCategories(),this.resetSelection()),t.has("filter")&&this.filter&&(this.filterName="post."+this.filter,this._updateTitle(),this._updateMainListMenuValue()),t.has("categoryId")&&this.categoryId&&this._updateTitle(),t.has("filter")&&this.filter&&this.fire("yp-filter-changed",this.filter),t.has("searchingFor")&&(this.searchingFor,this.showFilter=!0)}chunk(t,e){return t.reduce(((t,i,o)=>o%e==0?[...t,[i]]:[...t.slice(0,-1),[...t.slice(-1)[0],i]]),[])}_categoryItems(){return this.group.Categories?this.chunk(this.group.Categories,7):[]}_categoryImageSrc(t){return V.getImageFormatUrl(t.CategoryIconImages,0)}};t([i({type:Object})],F.prototype,"group",void 0),t([i({type:String})],F.prototype,"filterName",void 0),t([i({type:String})],F.prototype,"filter",void 0),t([i({type:Number})],F.prototype,"categoryId",void 0),t([i({type:String})],F.prototype,"categoryName",void 0),t([i({type:String})],F.prototype,"subTitle",void 0),t([i({type:String})],F.prototype,"searchingFor",void 0),t([i({type:Boolean})],F.prototype,"showFilter",void 0),t([i({type:Number})],F.prototype,"postsCount",void 0),t([i({type:Number})],F.prototype,"allPostCount",void 0),t([i({type:String})],F.prototype,"tabName",void 0),t([i({type:Object})],F.prototype,"category",void 0),t([i({type:Array})],F.prototype,"categoriesWithCount",void 0),F=t([p("yp-posts-filter")],F);let G=class extends c{constructor(){super(...arguments),this.topRadius=!1,this.topLeftRadius=!1,this.headerMode=!1,this.disableMaps=!1,this.mapActivated=!1,this.streetViewActivated=!1,this.tiny=!1,this.staticMapsApiKey="AIzaSyBYy8UvdDD650mz7k1pY0j2hBFQmCPVnxA",this.defaultPostImageEnabled=!1,this.showVideo=!1,this.showAudio=!1,this.portraitVideo=!1}connectedCallback(){super.connectedCallback(),this.headerMode&&(V.attachMediaListeners(this),this.addGlobalListener("yp-pause-media-playback",V.pauseMediaPlayback.bind(this)))}disconnectedCallback(){super.connectedCallback(),this.headerMode&&(V.attachMediaListeners(this),this.removeGlobalListener("yp-pause-media-playback",V.pauseMediaPlayback.bind(this)))}updated(t){super.updated(t),t.has("post")&&(this.post.Group&&this.post.Group.configuration&&this.post.Group.configuration.uploadedDefaultPostImageId?(this.uploadedDefaultPostImageId=this.post.Group.configuration.uploadedDefaultPostImageId,this.defaultImageGroupId=this.post.Group.id,this.defaultPostImageEnabled=!0):(this.defaultPostImageEnabled=!1,this.defaultImageGroupId=void 0,this.uploadedDefaultPostImageId=void 0)),t.has("headerMode")&&this.headerMode&&(this.mapActivated=!0,this.streetViewActivated=!0)}static get styles(){return[super.styles,l`
        :host {
          display: block;
        }

        .topContainer {
          height: 100%;
        }

        .topContainer[top-radius] > yp-image,
        #videoPreviewImage {
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
        }

        video {
          outline: none !important;
        }

        .topContainer[top-left-radius] > yp-image,
        #videoPreviewImage,
        google-streetview-pano,
        google-map {
          border-top-left-radius: 4px;
        }

        .topContainer[top-left-radius] > video {
          border-top-left-radius: 4px;
        }

        google-streetview-pano {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        google-map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .main-image,
        video {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .mapCanvas {
          width: 100%;
          height: 100%;
        }

        .category-icon {
          width: 200px;
          height: 200px;
          padding-top: 32px;
        }

        .category-icon[tiny] {
          width: 100px;
          height: 100px;
          padding-top: 24px;
        }

        .category-icon[large] {
          width: 100%;
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 960px) {
          .topContainer[top-left-radius] > yp-image {
            border-top-left-radius: 0;
          }
        }

        @media (max-width: 600px) {
          .category-icon {
            width: 130px;
            height: 130px;
          }

          .category-icon[large] {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .main-image[header-mode] {
            height: 100%;
          }

          video {
            height: 100%;
          }
        }

        .pointer {
          cursor: pointer;
        }

        .pointer[header-mode] {
          cursor: default;
        }

        [hidden] {
          display: none !important;
        }

        .videoCamStatic {
          width: 32px;
          height: 32px;
          color: var(--primary-background-color);
          margin-top: -68px;
          margin-left: 8px;
        }

        .voiceIcon {
          height: 42px;
          width: 42px;
          color: #333;
          margin-top: 96px;
        }

        @media (max-width: 600px) {
          .voiceIcon {
            height: 42px;
            width: 42px;
            color: #333;
            margin-top: 35px;
          }
        }

        audio {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .playInfo {
          font-style: italic;
        }

        @media (max-width: 960px) {
          .voiceIcon {
            margin-top: 35px;
          }
        }

        @media (max-width: 430px) {
          .voiceIcon {
            margin-top: 28px;
          }
        }

        video {
          background-color: #777;
        }

        #videoPlayer[portrait] {
          width: 100% !important;
          height: 100%;
        }

        .topContainer[portrait] {
          background-color: #777;
        }

        #videoPreviewImage[portrait] {
          width: 40%;
        }

        .videoPreviewContainer {
          width: 100%;
          height: 100%;
        }

        .videoPreviewContainer[portrait] {
          background-color: #777;
        }
      `]}render(){var t,e;return a`
      <div
        class="topContainer"
        top-radius="${this.topRadius}"
        top-left-radius="${this.topLeftRadius}">
        ${this.isNoneActive?a`
              <yp-image
                ?header-mode="${this.headerMode}"
                sizing="cover"
                ?hidden="${this.defaultPostImageEnabled}"
                class="main-image pointer"
                src="https://i.imgur.com/sdsFAoT.png"
                @click="${this._goToPost}"></yp-image>

              ${this.activeDefaultImageUrl?a`
                    <yp-image
                      ?headerMode="${this.headerMode}"
                      alt="${h(this.altTag)}"
                      sizing="cover"
                      class="main-image pointer"
                      src="${this.activeDefaultImageUrl}"
                      @click="${this._goToPost}"></yp-image>
                  `:g}
            `:g}
        ${this.isCategoryActive?a`
              <div id="categoryImageId" class="layout horizontal center-center">
                <yp-image
                  ?header-mode="${this.headerMode}"
                  alt="${h(this.altTag)}"
                  ?tiny="${this.tiny}"
                  @click="${this._goToPost}"
                  class="category-icon pointer"
                  title="${h(null===(t=this.post.Category)||void 0===t?void 0:t.name)}"
                  sizing="contain"
                  src="${this.categoryImagePath}"></yp-image>
              </div>
            `:g}
        ${this.isCategoryLargeActive?a`
              <yp-image
                ?header-mode="${this.headerMode}"
                alt="${h(this.altTag)}"
                large
                @click="${this._goToPost}"
                class="category-icon pointer"
                title="${h(null===(e=this.post.Category)||void 0===e?void 0:e.name)}"
                sizing="cover"
                src="${this.categoryImagePath}"></yp-image>
            `:g}
        ${this.isImageActive?a`
              <yp-image
                .header-mode="${this.headerMode}"
                @click="${this._goToPost}"
                .sizing="${this.sizingMode}"
                class="main-image pointer"
                src="${this.postImagePath}"></yp-image>
            `:g}
        ${this.isVideoActive?a`
              ${this.showVideo?a`
                    <video
                      id="videoPlayer"
                      ?portrait="${this.portraitVideo}"
                      data-id="${h(this.postVideoId)}"
                      ?header-mode="${this.headerMode}"
                      controls
                      @click="${this._goToPost}"
                      preload="metadata"
                      class="pointer"
                      src="${h(this.postVideoPath)}"
                      playsinline
                      poster="${this.postVideoPosterPath}"></video>
                  `:a`
                    <div
                      class="layout vertical center-center videoPreviewContainer"
                      .portrait="${this.portraitVideo}">
                      <yp-image
                        id="videoPreviewImage layout-self-center"
                        .portrait="${this.portraitVideo}"
                        ?headerMode="${this.headerMode}"
                        @click="${this._goToPost}"
                        sizing="cover"
                        class="main-image pointer"
                        src="${this.postVideoPosterPath}"></yp-image>
                    </div>
                    <mwc-icon
                      class="videoCamStatic">videocam</mwc-icon>
                  `}
            `:g}
        ${this.showAudio?a`
              <div class="layout vertical center-center">
                <audio
                  id="audioPlayer"
                  data-id="${h(this.postAudioId)}"
                  ?header-mode="${this.headerMode}"
                  controls
                  preload="metadata"
                  class="pointer"
                  src="${h(this.postAudioPath)}"
                  ?hidden="${!this.postAudioPath}"
                  playsinline></audio>
              </div>
            `:g}
        ${this.isAudioActive?a`
              <div class="layout vertical center-center">
                <audio
                  id="audioPlayer"
                  .data-id="${this.postAudioId}"
                  .header-mode="${this.headerMode}"
                  controls
                  preload="metadata"
                  class="pointer"
                  src="${h(this.postAudioPath)}"
                  ?hidden="${!this.postAudioPath}"
                  playsinline></audio>
              </div>
              <div
                ?hidden="${this.showAudio}"
                class="layout horizontal center-center pointer"
                @click="${this._goToPost}">
                <mwc-icon class="voiceIcon">keyboard_voice</mwc-icon>
              </div>
            `:g}
        ${this.disableMaps?g:a`
              ${this.isStreetViewActive?a`
                    <yp-image
                      @click="${this._goToPost}"
                      class="main-image pointer"
                      sizing="cover"
                      src="https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&amp;zoom=${this.zoomLevel}&amp;size=432x243&amp;maptype=hybrid&amp;markers=color:red%7Clabel:%7C${this.latitude},${this.longitude}&amp;key=${this.staticMapsApiKey}"
                      ?hidden="${this.streetViewActivated}"></yp-image>

                    ${this.streetViewActivated?a`
                          <google-streetview-pano
                            .position="${this.mapPosition}"
                            heading="330"
                            api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0"
                            pitch="2"
                            zoom="0.8"
                            disable-default-ui=""></google-streetview-pano>
                        `:g}
                  `:g}
              ${this.isMapActive?a`
                    <yp-image
                      @click="${this._goToPost}"
                      class="main-image pointer"
                      ?hidden="${this.mapActivated}"
                      sizing="cover"
                      src="https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&amp;size=432x243&amp;zoom=${this.zoomLevel}&amp;maptype=${this.mapType}&amp;markers=color:red%7Clabel:%7C${this.latitude},${this.longitude}&amp;key=${this.staticMapsApiKey}"></yp-image>

                    ${this.mapActivated?a`
                          <google-map
                            additional-map-options="{keyboardShortcuts:false}"
                            id="coverMediaMap"
                            class="map"
                            libraries="places"
                            fit-to-markers
                            .zoom="${this.zoomLevel}"
                            .map-type="${this.mapType}"
                            api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0">
                            <google-map-marker
                              slot="markers"
                              .latitude="${this.latitude}"
                              .longitude="${this.longitude}"></google-map-marker>
                          </google-map>
                        `:g}
                  `:g}
            `}
      </div>
    `}get sizingMode(){return this.post&&this.post.Group&&this.post.Group.configuration&&this.post.Group.configuration.useContainImageMode?"contain":"cover"}get activeDefaultImageUrl(){return this.defaultPostImageEnabled&&this.defaultImageGroupId&&this.uploadedDefaultPostImageId?"/api/groups/"+this.defaultImageGroupId+"/default_post_image/"+this.uploadedDefaultPostImageId:void 0}_goToPost(){this.post&&this.post.Group.configuration&&this.post.Group.configuration.resourceLibraryLinkMode||(this.post?this.headerMode?u.goToPost(this.post.id):u.goToPost(this.post.id,void 0,void 0,this.post):console.error("No post in post cover media on goToPost"))}get latitude(){return this.post.location?this.post.location.latitude:0}get longitude(){return this.post.location?this.post.location.longitude:0}get isNoneActive(){return!!this._withCoverMediaType(this.post,"none")}get isCategoryActive(){return!!(this.post&&this._withCoverMediaType(this.post,"category")&&this.post.id<=11e3&&this._isDomainWithOldCategories())}_isDomainWithOldCategories(){const t=window.location.hostname;return t.indexOf("betrireykjavik.is")>-1||t.indexOf("betraisland.is")>-1||t.indexOf("yrpri.org")>-1}get isCategoryLargeActive(){return!(!this.post||!this._withCoverMediaType(this.post,"category")||!(this.post.id>11e3)&&this._isDomainWithOldCategories())}get isImageActive(){return!!this._withCoverMediaType(this.post,"image")}get isVideoActive(){return!!this._withCoverMediaType(this.post,"video")}get isAudioActive(){return!!this._withCoverMediaType(this.post,"audio")}get isMapActive(){return!!(this.post&&this.post.location&&this.post.location.latitude&&this._withCoverMediaType(this.post,"map"))}get isStreetViewActive(){return!!(this.post&&this.post.location&&this.post.location.latitude&&this._withCoverMediaType(this.post,"streetView"))}get zoomLevel(){return this.post.location&&this.post.location.map_zoom?this.post.location.map_zoom:"10"}get mapType(){return this.post.location&&this.post.location.mapType&&""!=this.post.location.mapType?this.post.location.mapType:"roadmap"}_withCoverMediaType(t,e){return t?"none"==e?!(t.Category||t.cover_media_type&&"none"!=t.cover_media_type):!("category"!=e||!t.Category||t.cover_media_type&&"none"!=t.cover_media_type)||t&&t.cover_media_type==e:(console.info("No post for "+e),!1)}get mapPosition(){return this.post.location?{lat:this.post.location.latitude,lng:this.post.location.longitude}:{lat:0,lng:0}}get postImagePath(){return this.post?V.getImageFormatUrl(this.post.PostHeaderImages,0):""}get postVideoPath(){if(this.post&&this.post.PostVideos){const t=V.getVideoURL(this.post.PostVideos);return this.portraitVideo=V.isPortraitVideo(this.post.PostVideos),t?(this.postVideoId=this.post.PostVideos[0].id,t):void 0}}get postAudioPath(){if(this.post&&this.post.PostAudios){const t=V.getAudioURL(this.post.PostAudios);return t?(this.postAudioId=this.post.PostAudios[0].id,t):void 0}}get postVideoPosterPath(){if(this.post&&this.post.PostVideos){const t=V.getVideoPosterURL(this.post.PostVideos,this.post.PostHeaderImages);return t||void 0}}get categoryImagePath(){return this.post&&this.post.Category&&this.post.Category.CategoryIconImages?V.getImageFormatUrl(this.post.Category.CategoryIconImages,0):""}};t([i({type:Object})],G.prototype,"post",void 0),t([i({type:Boolean})],G.prototype,"topRadius",void 0),t([i({type:Boolean})],G.prototype,"topLeftRadius",void 0),t([i({type:String})],G.prototype,"altTag",void 0),t([i({type:Number})],G.prototype,"postAudioId",void 0),t([i({type:Number})],G.prototype,"postVideoId",void 0),t([i({type:Boolean})],G.prototype,"headerMode",void 0),t([i({type:Boolean})],G.prototype,"disableMaps",void 0),t([i({type:Boolean})],G.prototype,"mapActivated",void 0),t([i({type:Boolean})],G.prototype,"streetViewActivated",void 0),t([i({type:Boolean})],G.prototype,"tiny",void 0),t([i({type:String})],G.prototype,"staticMapsApiKey",void 0),t([i({type:Number})],G.prototype,"uploadedDefaultPostImageId",void 0),t([i({type:Number})],G.prototype,"defaultImageGroupId",void 0),t([i({type:Boolean})],G.prototype,"defaultPostImageEnabled",void 0),t([i({type:Boolean})],G.prototype,"showVideo",void 0),t([i({type:Boolean})],G.prototype,"showAudio",void 0),t([i({type:Boolean})],G.prototype,"portraitVideo",void 0),G=t([p("yp-post-cover-media")],G);class R{static number(t){return t?t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","):"0"}static removeClass(t,e){let i="";if(t){const o=t.className.split(" ");for(let t=0;t<o.length;t++)o[t]!==e&&(i+=o[t]+" ");t.className=i}else console.error("Trying to remove class from a non exisisting element")}static truncate(t,e,i,o){if(e=e||255,t.length<=e)return t;if(i)t=t.substring(0,e);else{let i=t.lastIndexOf(" ",e);-1===i&&(i=e),t=t.substring(0,i)}return t+=null!=o?o:"..."}static trim(t){return t.replace(/^\s*|\s*$/g,"")}}let E=class extends c{constructor(){super(...arguments),this.endorsementButtons="hearts",this.headerMode=!1,this.forceSmall=!1,this.endorseValue=0,this.allDisabled=!1,this.floating=!1,this.votingDisabled=!1,this.smallerIcons=!1,this.forceShowDebate=!1}connectedCallback(){super.connectedCallback(),this.addGlobalListener("yp-got-endorsements-and-qualities",this._updateEndorsementsFromSignal.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-got-endorsements-and-qualities",this._updateEndorsementsFromSignal.bind(this))}firstUpdated(t){super.firstUpdated(t),this.endorsementButtons&&(this.$$("#actionDown").className+=" default-buttons-color",this.$$("#actionUp").className+=" default-buttons-color")}static get styles(){return[super.styles,l`
        :host {
          display: block;
        }

        .action-bar {
          position: absolute;
          background-color: #fff;
        }

        .action-bar[floating] {
          position: relative;
          background-color: #fff;
        }

        .action-bar-small {
          margin-top: 8px;
          position: absolute;
          width: 100%;
          bottom: -32px;
          vertical-align: bottom !important;
        }

        .action-text {
          font-size: 16px;
          text-align: left;
          vertical-align: bottom;
          padding-top: 8px;
          margin-top: 4px;
        }

        .action-icon {
        }

        .action-up {
          color: var(--primary-up-color-lighter, rgba(0, 153, 0, 0.55));
        }

        .action-down {
          color: var(--primary-down-color-lighter, rgba(153, 0, 0, 0.55));
        }

        .default-buttons-color {
          color: var(--default-endorsement-buttons-color, #656565);
        }

        .default-buttons-up-selected {
          color: var(--accent-color, rgba(0, 0, 0, 1));
        }

        .default-buttons-down-selected {
          color: var(--accent-color, rgba(0, 0, 0, 1));
        }

        .hearts-up-selected {
          color: var(--primary-hearts-color-up, rgba(168, 0, 0, 0.72));
        }

        .hearts-down-selected {
          color: var(--primary-hearts-color-up, rgba(168, 0, 0, 0.72));
        }

        .action-debate {
          color: #757575;
        }

        .debate-text {
          padding-top: 10px;
          padding-right: 6px;
          color: #757575;
        }

        .down-text {
          padding-right: 0px;
          padding-top: 10px;
        }

        .up-text {
          padding-top: 10px;
          margin-right: 8px;
        }

        .up-text[rtl] {
          margin-right: -8px;
        }

        .down-vote-icon {
          margin-right: 0px;
        }

        mwc-icon-button.mainIcons {
          width: 48px;
          height: 48px;
        }

        mwc-icon-button.debateIcon {
          width: 46px;
          height: 46px;
          margin-top: 2px;
        }

        mwc-icon-button[smaller-icons] {
          height: 48px;
          width: 48px;
        }

        .debate-icon {
          color: #757575;
        }

        .up-vote-icon {
          margin-left: 8px;
        }

        @media (max-width: 320px) {
          :host {
            width: 250px;
          }
        }

        .shareButtonContainer {
          position: absolute;
          bottom: 55px;
          right: -32px;
          padding: 0;
          margin: 0;
          margin-bottom: 8px;
        }

        .shareButton {
          padding: 2px;
        }

        .shareShare {
          padding: 0;
          margin: 0;
          background-color: #fff;
        }

        @media screen and (-ms-high-contrast: active),
          (-ms-high-contrast: none) {
          .action-debate {
            display: none;
          }
        }

        [hidden] {
          display: none !important;
        }

        div[rtl] {
          direction: rtl;
        }

        action-up[only-up-vote-showing] {
          margin-right: -16px;
        }
      `]}render(){return a`
      <div
        ?rtl="${this.rtl}"
        title="${h(this.disabledTitle)}"
        floating="${this.floating}"
        class="action-bar layout horizontal"
      >
        <div
          id="actionUp"
          ?only-up-vote-showing="${this.onlyUpVoteShowing}"
          class="action-up layout horizontal layout start justified"
        >
          <mwc-icon-button
            id="iconUpButton"
            .smaller-icons="${this.smallerIcons}"
            ?disabled="${this.votingStateDisabled}"
            .title="${this.customVoteUpHoverText}"
            icon="${h(this.endorseModeIcon(this.endorsementButtons,"up"))}"
            class="action-icon up-vote-icon largeButton"
            @click="${this.upVote}"
          ></mwc-icon-button>
          <div
            ?rtl="${this.rtl}"
            class="action-text up-text"
            ?hidden="${this.post.Group.configuration.hideVoteCount}"
          >
            ${R.number(this.post.counter_endorsements_up)}
          </div>
        </div>

        <div
          class="action-debate layout horizontal"
          ?hidden="${this.hideDebate}"
        >
          <mwc-icon-button
            ?disabled="${this.allDisabled}"
            title="${this.t("post.debate")}"
            icon="chat_bubble_outline"
            class="action-icon debate-icon mainIcons debateIcon"
            @click="${this._goToPostIfNotHeader}"
          ></mwc-icon-button>
          <div class="action-text debate-text">
            ${R.number(this.post.counter_points)}
          </div>
        </div>

        <div
          id="actionDown"
          class="action-down layout horizontal layout center justified"
          ?hidden="${this.post.Group.configuration.hideDownVoteForPost}"
        >
          <mwc-icon-button
            smaller-icons="${this.smallerIcons}"
            ?disabled="${this.votingStateDisabled}"
            title="${this.customVoteDownHoverText}"
            icon="${h(this.endorseModeIconDown)}"
            class="action-icon down-vote-icon mainIcons"
            @click="${this.downVote}"
          ></mwc-icon-button>
          <div
            class="action-text down-text"
            ?hidden="${this.post.Group.configuration.hideVoteCount}"
          >
            ${R.number(this.post.counter_endorsements_down)}
          </div>
        </div>
      </div>
    `}get isEndorsed(){return this.endorseValue>0}get votingStateDisabled(){return!!this.allDisabled||!(this.isEndorsed||!this.maxNumberOfGroupVotes||!this.numberOfGroupVotes)&&this.maxNumberOfGroupVotes<=this.numberOfGroupVotes}get onlyUpVoteShowing(){return!!(this.post&&this.post.Group&&this.post.Group.configuration)&&(this.post.Group.configuration.hideDownVoteForPost&&this.post.Group.configuration.hideDebateIcon)}get endorseModeIconUp(){return this.endorseModeIcon(this.endorsementButtons,"up")}get endorseModeIconDown(){return this.endorseModeIcon(this.endorsementButtons,"down")}get customVoteUpHoverText(){return this.post&&this.post.Group&&this.post.Group.configuration&&this.post.Group.configuration.customVoteUpHoverText?this.post.Group.configuration.customVoteUpHoverText:this.t("post.up_vote")}get customVoteDownHoverText(){return this.post&&this.post.Group&&this.post.Group.configuration&&this.post.Group.configuration.customVoteDownHoverText?this.post.Group.configuration.customVoteDownHoverText:this.t("post.down_vote")}_goToPostIfNotHeader(){this.headerMode||u.goToPost(this.post.id)}get hideDebate(){return!this.forceShowDebate&&(!this.wide||this.forceSmall||this.headerMode||this.post&&this.post.Group&&this.post.Group.configuration&&this.post.Group.configuration.hideDebateIcon)}updated(t){super.updated(t),t.has("post")&&this.post&&(R.removeClass(this.$$("#actionUp"),"hearts-up-selected"),R.removeClass(this.$$("#actionDown"),"hearts-down-selected"),R.removeClass(this.$$("#actionUp"),"default-buttons-up-selected"),R.removeClass(this.$$("#actionDown"),"default-buttons-down-selected"),this.endorseValue=0,this.post.Group.configuration&&null!=this.post.Group.configuration.canVote&&0==this.post.Group.configuration.canVote?(this.votingDisabled=!0,this.allDisabled=!0,this.disabledTitle=this.t("votingDisabled")):(this.votingDisabled=!1,this.allDisabled=!1),this.post.Group.configuration&&null!=this.post.Group.configuration.endorsementButtons?this.endorsementButtons=this.post.Group.configuration.endorsementButtons:this.endorsementButtons="hearts",this.post.Group.configuration&&(this.post.Group.configuration.originalHideVoteCount=this.post.Group.configuration.hideVoteCount,this.post.Group.configuration.hideVoteCountUntilVoteCompleted&&(this.post.Group.configuration.hideVoteCount=!0,this.requestUpdate())),this.post.Group.configuration.maxNumberOfGroupVotes?(this.maxNumberOfGroupVotes=this.post.Group.configuration.maxNumberOfGroupVotes,this.numberOfGroupVotes=window.appUser.groupCurrentVoteCountIndex[this.post.Group.id]):(this.maxNumberOfGroupVotes=void 0,this.numberOfGroupVotes=void 0),this._updateEndorsements())}_updateEndorsementsFromSignal(t){this.post&&this._updateEndorsements(t)}_updateEndorsements(t){if(window.appUser&&window.appUser.loggedIn()&&window.appUser.user&&window.appUser.user.Endorsements){const e=window.appUser.endorsementPostsIndex[this.post.id];e?this._setEndorsement(e.value):this._setEndorsement(0),t&&t.detail&&t.detail.maxGroupId===this.post.Group.id&&(this.numberOfGroupVotes=t.detail.groupCurrentVoteCount)}}endorseModeIcon(t,e){return this.smallerIcons="hearts"!=t&&"hats"!=t,"thumbs"==t&&"up"==e?"thumb_up":"thumbs"==t&&"down"==e?"thumb_down":"hearts"==t&&"up"==e?"favorite_border":"hearts"==t&&"down"==e?"do_not_disturb":"hats"==t&&"up"==e?"keyboard_arrow_up":"hats"==t&&"down"==e?"keyboard_arrow_down":"arrows"==t&&"up"==e?"arrow_upward":"arrows"==t&&"down"==e?"arrow_downward":void 0}_setEndorsement(t){this.endorseValue=t,0!==t&&this.post.Group.configuration&&this.post.Group.configuration.hideVoteCount&&!this.post.Group.configuration.originalHideVoteCount&&(this.post.Group.configuration.hideVoteCount=!1),"hearts"==this.endorsementButtons?t>0?(this.$$("#actionUp").className+=" hearts-up-selected",R.removeClass(this.$$("#actionDown"),"hearts-down-selected"),this.$$("#iconUpButton").icon="favorite"):t<0?(this.$$("#actionDown").className+=" hearts-down-selected",R.removeClass(this.$$("#actionUp"),"hearts-up-selected"),this.$$("#iconUpButton").icon="favoriate_border"):(R.removeClass(this.$$("#actionUp"),"hearts-up-selected"),R.removeClass(this.$$("#actionDown"),"hearts-down-selected"),this.$$("#iconUpButton").icon="favorite_border"):t>0?(this.$$("#actionUp").className+=" default-buttons-up-selected",R.removeClass(this.$$("#actionDown"),"default-buttons-down-selected")):t<0?(this.$$("#actionDown").className+=" default-buttons-down-selected",R.removeClass(this.$$("#actionUp"),"default-buttons-up-selected")):(R.removeClass(this.$$("#actionUp"),"default-buttons-up-selected"),R.removeClass(this.$$("#actionDown"),"default-buttons-down-selected"))}_enableVoting(){this.votingDisabled||(this.allDisabled=!1)}generateEndorsementFromLogin(t){window.appUser.endorsementPostsIndex[this.post.id]||this.generateEndorsement(t)}async generateEndorsement(t){if(!0===window.appUser.loggedIn()){let e;e=this.endorseValue===t?"DELETE":"POST";const i=await window.serverApi.endorsePost(this.post.id,e,{post_id:this.post.id,value:t});if(i){this._enableVoting();const t=i.endorsement,e=i.oldEndorsementValue;window.appUser.updateEndorsementForPost(this.post.id,t,this.post.Group),this._setEndorsement(t.value),e&&(e>0?this.post.counter_endorsements_up=this.post.counter_endorsements_up-1:e<0&&(this.post.counter_endorsements_down=this.post.counter_endorsements_down-1)),t.value>0?this.post.counter_endorsements_up=this.post.counter_endorsements_up+1:t.value<0&&(this.post.counter_endorsements_down=this.post.counter_endorsements_down+1)}}else this._enableVoting(),window.appUser.loginForEndorse(this,{value:t})}upVote(){this.allDisabled=!0,this.generateEndorsement(1),window.appGlobals.activity("clicked","endorse_up",this.post?this.post.id:-1),this._setVoteHidingStatus()}downVote(){this.allDisabled=!0,this.generateEndorsement(-1),window.appGlobals.activity("clicked","endorse_down",this.post?this.post.id:-1),this._setVoteHidingStatus()}_setVoteHidingStatus(){this.post.Group.configuration&&this.post.Group.configuration.hideVoteCountUntilVoteCompleted&&!this.post.Group.configuration.originalHideVoteCount&&(this.post.Group.configuration.hideVoteCount=!1,this.requestUpdate())}};t([i({type:Object})],E.prototype,"post",void 0),t([i({type:String})],E.prototype,"endorsementButtons",void 0),t([i({type:Boolean})],E.prototype,"headerMode",void 0),t([i({type:Boolean})],E.prototype,"forceSmall",void 0),t([i({type:Number})],E.prototype,"endorseValue",void 0),t([i({type:Boolean})],E.prototype,"allDisabled",void 0),t([i({type:String})],E.prototype,"disabledTitle",void 0),t([i({type:Boolean})],E.prototype,"floating",void 0),t([i({type:Boolean})],E.prototype,"votingDisabled",void 0),t([i({type:Boolean})],E.prototype,"smallerIcons",void 0),t([i({type:Number})],E.prototype,"maxNumberOfGroupVotes",void 0),t([i({type:Number})],E.prototype,"numberOfGroupVotes",void 0),t([i({type:Boolean})],E.prototype,"forceShowDebate",void 0),E=t([p("yp-post-actions")],E);let N=class extends c{constructor(){super(...arguments),this.autoTranslate=!1}static get styles(){return[super.styles,m,l`
        .tagContainer {
          max-width: 480px;
          font-size: 14px;
          margin-left: 8px;
          vertical-align: middle;
          padding-left: 16px;
          color: var(--app-tags-text-color, #111) !important;
          font-weight: var(--app-tags-font-weight, 500);
        }

        .middleDot {
          padding-left: 2px;
          padding-right: 2px;
          vertical-align: middle;
          color: var(--app-tags-color, #656565);
        }

        .tagItem {
          vertical-align: middle;
        }

        @media (max-width: 800px) {
          .middleDot {
            font-size: 14px;
            margin-bottom: 8px;
          }

          .tagContainer {
            font-size: 17px;
            padding-left: 16px;
            padding-right: 16px;
            padding-bottom: 16px;
          }
        }

        [hidden] {
          display: none !important;
        }
      `]}render(){var t;return a`
      <div class="tagContainer wrap">
        ${this.postTags.map(((t,e)=>a`
            <span class="tagItem">${this._trimmedItem(t)}</span
            ><span
              class="middleDot"
              ?hidden="${this.computeSpanHidden(this.postTags,e)}"
              >&#9679;</span
            >
          `))}
      </div>

      <yp-magic-text
        id="postTagsTranslations"
        hidden
        content-id="${this.post.id}"
        text-only
        content="${h(null===(t=this.post.public_data)||void 0===t?void 0:t.tags)}"
        content-language="${h(this.post.language)}"
        @new-translation="${this._newTranslation}"
        text-type="postTags"
      >
      </yp-magic-text>
    `}_trimmedItem(t){return t?t.trim():""}_autoTranslateEvent(t){this.autoTranslate=t.detail}computeSpanHidden(t,e){return t.length-1===e}_newTranslation(){setTimeout((()=>{const t=this.$$("#postTagsTranslations");t&&t.finalContent&&(this.translatedTags=t.finalContent)}))}get postTags(){return this.translatedTags&&this.autoTranslate?this.translatedTags.split(","):this.post&&this.post.public_data&&this.post.public_data.tags?this.post.public_data.tags.split(","):[]}};t([i({type:Object})],N.prototype,"post",void 0),t([i({type:String})],N.prototype,"translatedTags",void 0),t([i({type:Boolean})],N.prototype,"autoTranslate",void 0),N=t([p("yp-post-tags")],N);let B=class extends c{constructor(){super(...arguments),this.mini=!1,this.isAudioCover=!1}static get propersties(){return{post:{type:Object,observer:"_postChanged"}}}static get styles(){return[super.styles,m,l`
        .post-name {
          margin: 0;
          padding: 16px;
          padding-top: 20px;
          padding-bottom: 14px;
          cursor: pointer;
          vertical-align: middle !important;
          font-size: 20px;
          background-color: #fff;
          color: #000;
          font-weight: 500;
        }

        .post-name[largefont] {
          font-size: 19px;
        }

        .postCardCursor {
          cursor: pointer;
        }

        .postCard {
          background-color: #fff;
          width: 420px;
        }

        :host {
          display: block;
        }

        .postCard {
          width: 416px;
          border-radius: 4px;
        }

        .postCard[hide-post-cover] {
          height: 190px;
        }

        .postCard[hide-post-cover][hide-actions] {
          height: 165px;
        }

        .postCard[hide-post-cover][hide-description] {
          height: 140px;
        }

        .postCard[hide-description] {
          height: 372px;
        }

        .postCard[hide-description][hide-actions] {
          height: 331px;
        }

        .postCard[hide-description][hide-post-cover][hide-actions] {
          height: 110px;
        }

        .postCard[hide-actions] {
          height: 402px;
        }

        .postCard[mini] {
          width: 210px;
          height: 100%;
          margin: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        yp-post-cover-media {
          width: 416px;
          height: 234px;
        }

        yp-post-cover-media[mini] {
          width: 210px;
          height: 118px;
          min-height: 118px;
        }

        .post-name[mini] {
          padding: 16px;
        }

        .description {
          font-size: 17px;
          padding: 16px;
          padding-top: 0;
          cursor: pointer;
          color: #555;
        }

        .description[widetext] {
          font-size: 16px;
          line-height: 1.3;
        }

        .description[largefont] {
          font-size: 15px;
        }

        .postActions {
        }

        .shareIcon {
          position: absolute;
          left: 8px;
          bottom: 2px;
          text-align: right;
          width: 48px;
          height: 48px;
        }

        .customRatings {
          position: absolute;
          bottom: 10px;
          right: 6px;
        }

        :host {
          width: 100%;
        }

        @media (max-width: 960px) {
          .customRatings {
            bottom: 12px;
          }

          :host {
            width: 100%;
            max-width: 423px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 28px;
          }

          .postCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .postCard[mini] {
            width: 210px;
            height: 100%;
          }

          .card {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .card[mini] {
            width: 210px;
            height: 100%;
          }

          yp-post-cover-media {
            width: 100%;
            height: 230px;
          }

          yp-post-cover-media[mini] {
            width: 210px;
            height: 118px;
            min-height: 118px;
          }

          .card {
            height: 100%;
            padding-bottom: 48px;
          }

          .postCard {
            height: 100% !important;
          }

          yp-post-cover-media[audio-cover] {
            width: 100%;
            height: 100px;
          }
        }

        @media (max-width: 420px) {
          yp-post-cover-media {
            height: 225px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 375px) {
          yp-post-cover-media {
            height: 207px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 360px) {
          yp-post-cover-media {
            height: 200px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (max-width: 320px) {
          yp-post-cover-media {
            height: 180px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }

        .share[mini] {
          display: none;
        }
      `]}renderDescription(){var t;return a`
      ${(null===(t=this.post.public_data)||void 0===t?void 0:t.structuredAnswersJson)?a`
            <yp-magic-text
              id="description"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              ?hidden="${this.hideDescription}"
              .content="${this.structuredAnswersFormatted}"
              .contentId="${this.post.id}"
              class="description"
              truncate="120"
            >
            </yp-magic-text>
          `:a`
            <yp-magic-text
              class="description layout horizontal"
              ?hasCustomRatings="${this.post.Group.configuration.customRatings}"
              ?hidden="${this.hideDescription}"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              text-only
              .content="${this.post.description}"
              .contentId="${this.post.id}"
              truncate="220"
            >
            </yp-magic-text>
          `}
    `}renderTags(){return a` <yp-post-tags .post="${this.post}"></yp-post-tags> `}render(){var t,e;return this.post?a`
          <div class="layout vertical center-center">
            <div
              ?mini="${this.mini}"
              .hide-post-cover="${this.post.Group.configuration.hidePostCover}"
              .hide-description="${this.post.Group.configuration.hidePostDescription}"
              ?hide-actions="${this.post.Group.configuration.hidePostActionsInGrid}"
              audio-cover="${this.isAudioCover}"
              class="card postCard layout vertical shadow-elevation-2dp shadow-transition"
              animated
            >
              <div class="layout vertical">
                <a
                  href="${h(this._getPostLink(this.post))}"
                  @click="${this.goToPostIfNotHeader}"
                  id="mainArea"
                >
                  <yp-post-cover-media
                    ?mini="${this.mini}"
                    top-radius
                    ?audioCover="${this.isAudioCover}"
                    .altTag="${this.post.name}"
                    .post="${this.post}"
                    ?hidden="${this.post.Group.configuration.hidePostCover}"
                  ></yp-post-cover-media>
                  <div class="postNameContainer">
                    <div
                      class="post-name"
                      ?mini="${this.mini}"
                      id="postName"
                      ?largeFont="${this.largeFont}"
                    >
                      <yp-magic-text
                        id="postNameMagicText"
                        textType="postName"
                        ?largeFont="${this.largeFont}"
                        .contentLanguage="${this.post.language}"
                        text-only
                        .content="${this.post.name}"
                        .contentId="${this.post.id}"
                      >
                      </yp-magic-text>
                    </div>
                  </div>
                  ${(null===(t=this.post.Group.configuration)||void 0===t?void 0:t.usePostTagsForPostCards)?this.renderTags():this.renderDescription()}
                </a>
                <div
                  ?hidden="${this.post.Group.configuration.hidePostActionsInGrid}"
                  @click="${this._onBottomClick}"
                >
                  ${this.mini?g:a`
                        <div class="layout horizontal">
                          ${(null===(e=this.post.Group.configuration)||void 0===e?void 0:e.hideSharing)?g:a`
                        <div class="share">
                          <mwc-icon-button
                            icon="share" .label="${this.t("post.shareInfo")}"
                            @click="${this._shareTap}"></mwc-icon-button>
                          </mwc-icon-button>
                        </div>

                        `}
                          ${this.post.Group.configuration.customRatings?a`
                                <yp-post-ratings-info
                                  class="customRatings"
                                  .post="${this.post}"
                                ></yp-post-ratings-info>
                              `:a`
                                <yp-post-actions
                                  class="postActions"
                                  .post="${this.post}"
                                  .forceShowDebate="${this.post.Group.configuration.forceShowDebateCountOnPost}"
                                  ?hidden="${this.mini}"
                                >
                                </yp-post-actions>
                              `}
                        </div>
                      `}
                </div>
              </div>
            </div>
          </div>
        `:g}_sharedContent(t){const e=t.detail;window.appGlobals.activity("postShared",e.social,this.post?this.post.id:-1)}get _fullPostUrl(){return encodeURIComponent("https://"+window.location.host+"/post/"+this.post.id)}get structuredAnswersFormatted(){if(this.post&&this.post.public_data&&this.post.public_data.structuredAnswersJson&&this.post.Group.configuration&&this.post.Group.configuration.structuredQuestionsJson){const t={};let e="";this.post.Group.configuration.structuredQuestionsJson.forEach((e=>{e.uniqueId&&(t[e.uniqueId]=e)}));for(let i=0;i<this.post.public_data.structuredAnswersJson.length;i++){const o=this.post.public_data.structuredAnswersJson[i];if(o&&o.value){const i=t[o.uniqueId];if(i&&(e+=i.text+": ",e+=o.value+" "),e.length>120)break}}return e}return""}_onBottomClick(t){t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()}clickOnA(){var t;null===(t=this.$$("#mainArea"))||void 0===t||t.click()}_getPostLink(t){if(t)return t.Group.configuration&&t.Group.configuration.disablePostPageLink?"#":t.Group.configuration&&t.Group.configuration.resourceLibraryLinkMode?t.description.trim():"/post/"+t.id;console.warn("Trying to get empty post link")}_shareTap(t){window.appGlobals.activity("postShareCardOpen",t.detail.brand,this.post?this.post.id:-1),window.appDialogs.getDialogAsync("shareDialog",(t=>{t.open(this._fullPostUrl,this.t("post.shareInfo"),this._sharedContent)}))}get hideDescription(){return this.mini||this.post&&this.post.Group.configuration&&this.post.Group.configuration.hidePostDescription}goToPostIfNotHeader(t){t.preventDefault(),this.post.Group.configuration&&this.post.Group.configuration.disablePostPageLink?console.log("goToPostDisabled"):this.post.Group.configuration&&this.post.Group.configuration.resourceLibraryLinkMode||u.goToPost(this.post.id),this.post&&!this.mini&&(window.appGlobals.cache.cachedPostItem=this.post)}updated(t){super.updated(t),t.has("post")&&this.post&&("audio"===this.post.cover_media_type?this.isAudioCover=!0:this.isAudioCover=!1)}updateDescriptionIfEmpty(t){this.post.description&&""!=this.post.description||(this.post.description=t)}_refresh(){window.appDialogs.getDialogAsync("postEdit",(t=>{t.selected=0,this.fire("refresh")}))}_openReport(){window.appGlobals.activity("open","post.report"),window.appDialogs.getDialogAsync("apiActionDialog",(t=>{t.setup("/api/posts/"+this.post.id+"/report",this.t("reportConfirmation"),this._onReport.bind(this),this.t("post.report"),"PUT"),t.open()}))}_onReport(){window.appGlobals.notifyUserViaToast(this.t("post.report")+": "+this.post.name)}};t([i({type:String})],B.prototype,"selectedMenuItem",void 0),t([i({type:Boolean})],B.prototype,"mini",void 0),t([i({type:Boolean})],B.prototype,"isAudioCover",void 0),t([i({type:Object})],B.prototype,"post",void 0),B=t([p("yp-post-card")],B);let O=class extends c{constructor(){super(...arguments),this.filter="newest",this.statusFilter="open",this.noPosts=!1,this.showSearchIcon=!1,this.grid=!0,this.moreToLoad=!1,this.moreFromScrollTriggerActive=!1,this.skipIronListWidth=!1}static get styles(){return[super.styles,m,l`
        .cardContainer {
          width: 100%;
          margin: 8px;
        }

        .postsFilter {
          padding-left: 16px;
          height: 36px;
        }

        .objectives {
          padding-bottom: 40px;
          max-width: 432px;
        }

        .description {
          padding: 12px;
        }

        yp-post-card {
          padding-bottom: 52px;
        }

        #outerRegion {
          position: relative;
        }

        #scrollableRegion {
        }

        lit-virtualizer {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        yp-posts-filter {
          margin-bottom: 8px;
          margin-left: 8px;
          margin-top: 16px;
        }

        #ironList {
        }

        .searchButton {
          padding: 8px;
          margin: 8px;
        }

        .searchContainer {
          margin-top: 8px;
        }

        yp-posts-filter {
          padding-right: 16px;
        }

        .half {
          width: 50%;
        }

        .searchBox {
          margin-bottom: 22px;
          margin-right: 8px;
        }

        .card {
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          height: 435px !important;
          width: 416px !important;
          border-radius: 4px;
        }

        yp-post-card {
          height: 435px !important;
          width: 416px !important;
        }

        .card[mini] {
          width: 210px;
          height: 100%;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        .card[desktop-list] {
          padding: 0 !important;
          padding-top: 16px !important;
        }

        .card[is-last-item] {
          padding-bottom: 128px;
        }



        @media (max-width: 800px) {
          .searchBox {
            margin-bottom: 8px;
          }

          .searchBox {
            margin-top: 8px;
          }

          .half {
            width: 100%;
          }

          .searchContainer {
            margin-top: 0;
          }

          .postsFilter {
            padding-left: 16px;
            width: 215px !important;
          }
        }

        .noIdeas {
          background-color: #fff;
          max-width: 200px;
          padding: 16px;
          margin: 16px;
          margin-top: 32px;
        }

        .noIdeasText {
          font-weight: bold;
        }

        .card {
          padding: 0;
          padding-top: 8px;
        }

        yp-post-cover-media {
          width: 100%;
          height: 230px;
        }

        #searchInput {
          margin-left: 8px;
        }

        [hidden] {
          display: none !important;
        }

        :focus {
        }

        .largeAjax {
          position: absolute;
          bottom: 32px;
        }

        a {
          text-decoration: none;
        }
      `]}_searchKey(t){13===t.keyCode&&this._search(),this.showSearchIcon=!0}render(){return a`
      <div class="layout vertical center-center topMost">
        ${this.noPosts?a`
              <div class="layout horiztonal center-center">
                <div
                  class="noIdeas layout horizontal center-center shadow-elevation-6dp shadow-transition"
                  ?hidden="${this.group.configuration.allPostsBlockedByDefault}"
                >
                  <div class="noIdeasText">${this.t("noIdeasHere")}</div>
                </div>
              </div>
            `:g}
        <div
          class="searchContainer layout horizontal center-center wrap"
          ?hidden="${this.group.configuration.hidePostFilterAndSearch||this.noPosts}"
        >
          <div class="layout horizontal center-center">
            <yp-posts-filter
              @click="${this._tapOnFilter}"
              .subTitle="${this.subTitle?this.subTitle:""}"
              class="filter"
              id="postsFilter"
              .tabName="${this.statusFilter}"
              @refresh-group="${this.refreshGroupFromFilter}"
              .group="${this.group}"
              .filter="${this.filter}"
              .statusFilter="${this.statusFilter}"
              .searchingFor="${this.searchingFor}"
              .categoryId="${this.categoryId}"
              .postsCount="${this.postsCount}"
            >
            </yp-posts-filter>
          </div>
          <div class="layout horizontal center-center">
            ${this.searchingFor?a`
                  <mwc-icon-button
                    aria-label="${this.t("clearSearchInput")}"
                    icon="clear"
                    @click="${this._clearSearch}"
                    class="clear-search-trigger"
                  ></mwc-icon-button>
                `:g}
            <mwc-textfield
              id="searchInput"
              @keydown="${this._searchKey}"
              .label="${this.t("searchFor")}"
              .value="${this.searchingFor?this.searchingFor:""}"
              class="searchBox"
            >
            </mwc-textfield>
            <mwc-icon-button
              .label="${this.t("startSearch")}"
              icon="search"
              @click="${this._search}"
              ?hidden="${!this.showSearchIcon}"
            ></mwc-icon-button>
          </div>
        </div>
        ${this.posts?a`
              <lit-virtualizer
                id="list"
                .items=${this.posts}
                .layout="${this.grid?{type:L,itemSize:{width:"424px",height:"435px"},flex:{preserve:"aspect-ratio"},justify:"space-around",padding:"0"}:A}"
                .scrollTarget="${window}"
                .renderItem=${this.renderPostItem.bind(this)}
                @rangeChanged=${this.scrollEvent}
              ></lit-virtualizer>
            `:g}
      </div>
    `}renderPostItem(t,e){const i=void 0!==e?e+1:0;return a`
        <yp-post-card
          aria-label="${t.name}"
          ?is-last-item="${this._isLastItem(e)}"
          @keypress="${this._keypress.bind(this)}"
          @click="${this._selectedItemChanged.bind(this)}"
          tabindex="${i}"
          id="postCard${t.id}"
          class="csard"
          .post="${t}"
        >
        </yp-post-card>
      `}get desktopListFormat(){return this.wide&&null!=this.group&&null!=this.posts}get wideNotListFormat(){return this.wide&&!this.desktopListFormat&&null!=this.group&&null!=this.posts}_isLastItem(t){return this.posts&&t>=this.posts.length-1}_keypress(t){13==t.keyCode&&this._selectedItemChanged(t)}_categoryChanged(t){t.detail?this.categoryId=t.detail:this.categoryId=void 0}_filterChanged(t){this.filter=t.detail}firstUpdated(t){super.firstUpdated(t)}_clearSearch(){this.searchingFor=void 0,this.filter="newest",this.$$("#postsFilter")._updateAfterFiltering()}scrollEvent(t){this.posts&&!this.moreFromScrollTriggerActive&&-1!=t.last&&t.last<this.posts.length&&t.last+5>=this.posts.length&&(this.moreFromScrollTriggerActive=!0,this._loadMoreData())}async connectedCallback(){super.connectedCallback(),this.addListener("yp-filter-category-change",this._categoryChanged),this.addListener("yp-filter-changed",this._filterChanged),this.addListener("refresh",this._refreshPost),this.posts&&(void 0!==window.appGlobals.cache.cachedPostItem&&(this.scrollToPost(window.appGlobals.cache.cachedPostItem),window.appGlobals.cache.cachedPostItem=void 0),window.appGlobals.groupLoadNewPost&&(window.appGlobals.groupLoadNewPost=!1,this.refreshGroupFromFilter()))}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-filter-category-change",this._categoryChanged),this.removeListener("yp-filter-changed",this._filterChanged),this.removeListener("refresh",this._refreshPost)}_selectedItemChanged(t){t.target.clickOnA()}async _refreshPost(t){const e=t.detail.id;if(e){const t=await window.serverApi.getPost(e);if(t&&this.posts)for(let e=0;e<this.posts.length;e++)if(this.posts[e].id==t.id){this.posts[e]=t,window.appGlobals.cache.updatePostInCache(t),this.requestUpdate,await this.updateComplete,setTimeout((()=>{}));break}}}_getPostLink(t){if(t)return t.Group&&t.Group.configuration&&t.Group.configuration.disablePostPageLink?"#":t.Group&&t.Group.configuration&&t.Group.configuration.resourceLibraryLinkMode?t.description.trim():"/post/"+t.id;console.warn("Trying to get empty post link")}get scrollOffset(){const t=this.$$("ironList");if(t){let e=t.offsetTop;return e-=75,t.offsetTop>0&&e>0?(console.info("Post list scroll offset: "+e),e):(e=this.wide?550:700,this.group&&this.group.configuration&&(this.group.configuration.hideAllTabs&&(e-=60),this.group.configuration.hideNewPost&&(e-=100),this.group.configuration.hidePostFilterAndSearch&&(e-=100)),console.info("Post list (manual) scroll offset: "+e),e)}return console.warn("No list for scroll offset"),null}_tapOnFilter(){window.appGlobals.activity("click","filter")}_search(){window.appGlobals.activity("click","search"),this.searchingFor=this.$$("#searchInput").value,this.searchingFor&&""!=this.searchingFor&&this.refreshGroupFromFilter()}buildPostsUrlPath(){return this.$$("#postsFilter").buildPostsUrlPath()}async scrollToPost(t){if(t&&this.posts){console.info("Scrolling to post: "+t.id);for(let e=0;e<this.posts.length;e++)if(this.posts[e]==t){this.$$("#list").scrollToIndex(e);break}this.fireGlobal("yp-refresh-activities-scroll-threshold")}else console.error("No post id on goToPostId")}updated(t){if(super.updated(t),t.has("statusFilter")&&this.group&&this.statusFilter){const t=["oldest","newest","top","most_debated","random","alphabetical"];this.randomSeed=Math.random(),this.posts=void 0,this.noPosts=!1,this.group&&(this.moreToLoad=!0,window.appGlobals.originalQueryParameters&&window.appGlobals.originalQueryParameters.categoryId?(this.categoryId=window.appGlobals.originalQueryParameters.categoryId,window.appGlobals.originalQueryParameters.categoryId=void 0):this.categoryId=void 0,this.group.configuration&&this.group.configuration.forcePostSortMethodAs&&t.indexOf(this.group.configuration.forcePostSortMethodAs)>-1?this.filter=this.group.configuration.forcePostSortMethodAs:this.group.configuration&&null!=this.group.configuration.canAddNewPosts?!0===this.group.configuration.canAddNewPosts?this.filter="newest":!1===this.group.configuration.canAddNewPosts&&!1===this.group.configuration.canVote?this.filter="top":this.filter="random":this.filter||(this.filter="newest"),console.info("LOADMORE FOR CONTAINER"),this._loadMoreData())}else this.group&&t.has("filter")&&this.filter||this.group&&t.has("categoryId")&&this.categoryId&&this._loadMoreData();t.has("searchingFor")&&(this.searchingFor&&""!=this.searchingFor?(this.moreToLoad=!0,this.showSearchIcon=!0):this.showSearchIcon=!1)}refreshGroupFromFilter(){this.posts=void 0,this.moreToLoad=!0,this._loadMoreData()}async _loadMoreData(){if(this.moreToLoad&&this.group){let t,e,i;this.moreToLoad=!1,this.noPosts=!1,this.userId?(t=this.userId+"/posts",e="users"):(t=`${this.group.id}`,e="groups"),this.searchingFor?i="/api/"+e+"/"+t+"/search/"+this.searchingFor:(i="/api/"+e+"/"+t+"/posts/"+this.filter,this.categoryId?i+="/"+this.categoryId:i+="/null",i+="/"+this.statusFilter);i+="?offset="+(this.posts?this.posts.length:0),"random"==this.filter&&this.randomSeed&&(i+="&randomSeed="+this.randomSeed);const o=await window.serverApi.getGroupPosts(i);if(o){if(this.postsCount=o.totalPostsCount,this.fire("yp-post-count",{type:this.statusFilter,count:this.postsCount}),this.posts)for(let t=0;t<o.posts.length;t++)this.posts.push(o.posts[t]);else this.posts=o.posts;0==o.posts.length&&0==this.posts.length&&(this.noPosts=!0),(o.posts.length>0||this.searchingFor&&""!=this.searchingFor)&&(this.noPosts=!1),setTimeout((()=>{const t=this.$$("#postsFilter");t&&t._updateTitle()}),20),o.posts.length>0&&o.posts.length!=this.postsCount&&(this.moreToLoad=!0),this.fireGlobal("yp-refresh-activities-scroll-threshold"),this._processCategories(),this._checkForMultipleLanguages(o.posts),window.appGlobals.cache.addPostsToCacheLater(o.posts),this.requestUpdate()}}this.moreFromScrollTriggerActive=!1}_checkForMultipleLanguages(t){if(!localStorage.getItem("dontPromptForAutoTranslation")&&!sessionStorage.getItem("dontPromptForAutoTranslation")){let e,i=!1;t.forEach((function(t){t.language&&!i&&(e||"??"===t.language?e&&e!==t.language&&"??"!==t.language&&(i=!0,console.info("Multiple post languages: "+e+" and "+t.language)):e=t.language)}))}}_processCategories(){if(this.categoryId&&this.group.Categories)for(let t=0;t<this.group.Categories.length;t++)this.group.Categories[t].id==this.categoryId&&(this.selectedCategoryName=this.group.Categories[t].name);else this.selectedCategoryName="categories.all"}};t([i({type:String})],O.prototype,"searchingFor",void 0),t([i({type:String})],O.prototype,"subTitle",void 0),t([i({type:String})],O.prototype,"filter",void 0),t([i({type:String})],O.prototype,"statusFilter",void 0),t([i({type:Array})],O.prototype,"posts",void 0),t([i({type:Number})],O.prototype,"userId",void 0),t([i({type:Object})],O.prototype,"group",void 0),t([i({type:Number})],O.prototype,"categoryId",void 0),t([i({type:Number})],O.prototype,"postsCount",void 0),t([i({type:String})],O.prototype,"selectedCategoryName",void 0),t([i({type:Number})],O.prototype,"selectedGroupTab",void 0),t([i({type:Boolean})],O.prototype,"noPosts",void 0),t([i({type:Boolean})],O.prototype,"showSearchIcon",void 0),t([i({type:Boolean,reflect:!0})],O.prototype,"grid",void 0),t([s()],O.prototype,"randomSeed",void 0),O=t([p("yp-posts-list")],O);let H=class extends c{render(){return a`
      <mwc-icon-button
        .label="${this.t("addEmoji")}"
        id="trigger"
        icon="sentiment_satisfied_alt"
        @click="${this.togglePicker}"></mwc-icon-button>
    `}togglePicker(){window.appDialogs.getDialogAsync("emojiDialog",(t=>{t.open(this.$$("#trigger"),this.inputTarget)}))}};t([i({type:Object})],H.prototype,"inputTarget",void 0),H=t([p("yp-emoji-selector")],H);let X=class extends c{constructor(){super(...arguments),this.disableNewPosts=!1}static get styles(){return[super.styles,m,l`
        :host {
          margin-top: 8px;
          margin-bottom: 8px;
          width: 100%;
        }

        .postCard {
          width: 100%;
          min-height: 75px;
          margin-top: 8px;
          padding: 16px;
          background-color: var(--mdc-theme-secondary);
          color: var(--mdc-theme-on-secondary);
          font-size: var(--mdc-typography-headline1-font-size);
          cursor: pointer;
          margin-bottom: 8px;
          text-align: center;
          max-width: 310px;
        }

        mwc-icon {
          --mdc-icon-size: 64px;
          color: var(--mdc-theme-on-secondary);
        }

        .header {
          padding: 0;
          margin: 0;
          padding-top: 16px;
        }

        .half {
          width: 50%;
        }

        .addText {
          padding-left: 0;
          padding-right: 8px;
        }

        mwc-icon {
          width: 64px;
          height: 64px;
          margin-right: 8px;
          margin-left: 0;
        }

        .addNewIdeaText {
          font-size: 26px;
        }

        .closed {
          font-size: 22px;
        }

        div[disabled] {
          background-color: #888;
          cursor: initial;
        }

        mwc-icon[disabled] {
        }

        @media (max-width: 420px) {
          :host {
            margin-top: 0;
          }

          .postCard {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 4px;
            padding: 16px;
          }

          .addNewIdeaText {
            font-size: 24px;
            width: auto;
          }

          mwc-icon {
            height: 48px;
            width: 48px;
          }

          .closed {
            font-size: 20px;
          }
        }

        @media (max-width: 420px) {
          .postCard {
            max-width: 300px;
          }
        }

        .container {
          width: 100%;
        }
      `]}render(){return this.group?a`
          <div
            ?disabled="${this.disableNewPosts}"
            class="postCard shadow-elevation-8dp shadow-transaction layout vertical center-center"
            aria-disabled="${this.disableNewPosts}"
            role="button"
            aria-label="${this.t("post.add_new")}"
            tabindex="0"
            @keydown="${this._keyDown}"
            @click="${this._newPost}">
            <div class="layout horizontal center-center addNewIdeaText">
              <mwc-icon>lightbulb_outline</mwc-icon>
              ${this.disableNewPosts?a`
                    <div class="flex addText closed">
                      ${this.group.configuration.alternativeTextForNewIdeaButtonClosed?a`
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              text-only
                              .content="${this.group.configuration.alternativeTextForNewIdeaButtonClosed}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButtonClosed"></yp-magic-text>
                          `:a` ${this.t("closedForNewPosts")} `}
                    </div>
                  `:a`
                    <div class="flex addText">
                      ${this.group.configuration.alternativeTextForNewIdeaButtonClosed?a`
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              text-only
                              .content="${this.group.configuration.alternativeTextForNewIdeaButton}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButton"></yp-magic-text>
                          `:a` ${this.t("post.add_new")} `}
                    </div>
                  `}
            </div>
          </div>
        `:g}_keyDown(t){13===t.keyCode&&this._newPost()}_newPost(){this.disableNewPosts||this.fire("new-post")}};t([i({type:Boolean})],X.prototype,"disableNewPosts",void 0),t([i({type:Object})],X.prototype,"group",void 0),t([i({type:Number})],X.prototype,"index",void 0),X=t([p("yp-post-card-add")],X);let j=class extends c{constructor(){super(...arguments),this.selectedVideoCoverIndex=0,this.useMainPhotoForVideoCover=!1,this.noDefaultCoverImage=!1}static get styles(){return[super.styles,l`
        .previewFrame {
          max-height: 50px;
          max-width: 89px;
          height: 50px;
          width: 89px;
          cursor: pointer;
        }

        .videoImages {
          overflow-x: auto;
          width: 200px;
          max-height: 70px;
          height: 70px;
        }

        .selectedCover {
          border-top: 2px solid var(--accent-color);
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .coverImage {
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .limitInfo {
          margin-top: 0;
          color: #656565;
          text-align: center;
          font-size: 14px;
        }

        .mainPhotoCheckbox {
          margin-top: 4px;
          margin-bottom: 4px;
        }
      `]}render(){return this.videoImages?a`
          <video
            hidden
            controls
            class="previewVideo"
            .url="${this.previewVideoUrl}"></video>
          <div class="layout horizontal videoImages videoPreviewContainer">
            <div style="white-space: nowrap">
              ${this.videoImages.map(((t,e)=>a`
                  <img
                    .class="${this._classFromImageIndex(e)}"
                    data-index="${e}"
                    @click="${this._selectVideoCover}"
                    sizing="cover"
                    class="previewFrame"
                    src="${t}" />
                `))}

              <div
                class="layout horizontal mainPhotoCheckbox"
                ?hidden="${this.noDefaultCoverImage}">
                <mwc-formfield .label="${this.t("useMainPhoto")}">
                  <mwc-radio
                    @click="${this._selectVideoCoverMainPhoto}"
                    name="useMainPhoto"></mwc-radio>
                </mwc-formfield>
              </div>
            </div>
          </div>

        `:g}_classFromImageIndex(t){return t==this.selectedVideoCoverIndex?"selectedCover":"coverImage"}updated(t){super.updated(t),t.has("videoId")&&this._getVideoMeta()}async _getVideoMeta(){if(this.videoId){const t=await window.serverApi.getVideoFormatsAndImages(this.videoId);t.previewVideoUrl&&t.videoImages&&(this.previewVideoUrl=t.previewVideoUrl,this.videoImages=t.videoImages)}else console.error("_getVideoImages no video id")}_selectVideoCover(t){const e=t.target.getAttribute("data-index");this.fire("set-cover",e),this.fire("set-default-cover",!1),window.serverApi.setVideoCover(this.videoId,{frameIndex:e})}_selectVideoCoverMainPhoto(){setTimeout((()=>{this.$$("#useMainPhotoId").checked?(window.serverApi.setVideoCover(this.videoId,{frameIndex:-2}),this.fire("set-default-cover",!0)):this.fire("set-default-cover",!1)}))}};t([i({type:Number})],j.prototype,"videoId",void 0),t([i({type:String})],j.prototype,"previewVideoUrl",void 0),t([i({type:Array})],j.prototype,"videoImages",void 0),t([i({type:Number})],j.prototype,"selectedVideoCoverIndex",void 0),t([i({type:Boolean})],j.prototype,"useMainPhotoForVideoCover",void 0),t([i({type:Boolean})],j.prototype,"noDefaultCoverImage",void 0),j=t([p("yp-set-video-cover")],j);let q=class extends c{constructor(){super(...arguments),this.target="",this.progressHidden=!1,this.droppable=!1,this.dropText="",this.multi=!1,this.files=[],this.method="PUT",this.raised=!1,this.noink=!1,this.headers={},this.retryText="Retry Upload",this.removeText="Remove",this.successText="Success",this.errorText="Error uploading file...",this.noDefaultCoverImage=!1,this.shownDropText=!1,this.videoUpload=!1,this.audioUpload=!1,this.attachmentUpload=!1,this.transcodingComplete=!1,this.isPollingForTranscoding=!1,this.indeterminateProgress=!1,this.accept="image/*",this.capture=!1,this.selectedVideoCoverIndex=0,this.useMainPhotoForVideoCover=!1,this.buttonText="",this.buttonIcon="file_upload"}static get styles(){return[super.styles,l`
        .enabled {
          border: 1px dashed #555;
        }

        .hover {
          opacity: 0.7;
          border: 1px dashed #111;
        }

        #UploadBorder {
          vertical-align: middle;
          color: #555;
          padding: 8px;
          padding-right: 16px;
          max-height: 200px;
          overflow-y: auto;
          display: inline-block;
        }

        #dropArea {
          text-align: center;
        }

        mwc-button {
          margin-bottom: 8px;
        }

        .file {
          padding: 10px 0px;
        }

        .commands {
          float: right;
        }

        .commands iron-icon:not([icon='check-circle']) {
          cursor: pointer;
          opacity: 0.9;
        }

        .commands iron-icon:hover {
          opacity: 1;
        }

        [hidden] {
          display: none;
        }

        .error {
          color: #f40303;
          font-size: 11px;
          margin: 2px 0px -3px;
        }

        [hidden] {
          display: none !important;
        }
        ::slotted(iron-icon) {
          padding-right: 6px;
        }

        .mainContainer {
          width: 100%;
        }

        .removeButton {
          margin-bottom: 18px;
        }

        .limitInfo {
          margin-top: 0;
          color: #656565;
          text-align: center;
          font-size: 14px;
        }

        mwc-button {
          min-width: 100px;
        }

        .subText {
          font-size: 12px;
          font-style: italic;
        }
      `]}render(){return a`

      <div class="layout vertical center-center mainContainer">
        <div class="layout vertical center-center">
          <div class="layout horizontal center-center">
            <mwc-button
              id="button"
              .icon="${this.buttonIcon}"
              class="blue"
              ?raised="${this.raised}"
              .label="${this.buttonText}"
              @click="${this._fileClick}">
            </mwc-button>
            <mwc-icon-button
              .ariaLabel="${this.t("deleteFile")}"
              class="removeButton layout self-start"
              icon="delete"
              @click="${this.clear}"
              ?hidden="${!this.currentFile}"></mwc-icon-button>
          </div>
          <div class="subText" ?hidden="${!this.subText}">${this.subText}</div>
          <div
            ?hidden="${!this.uploadLimitSeconds}"
            class="limitInfo layout horizontal center-center">
            <em ?hidden="${null!=this.currentFile}"
              >${this.uploadLimitSeconds} ${this.t("seconds")}</em
            >
          </div>
        </div>
        <div id="UploadBorder">
          ${this.files.map((t=>a`
              <div class="file">
                <div class="name">
                  <span>${this.uploadStatus}</span>
                  <div class="commands">
                    <mwc-icon
                      .title="${this.retryText}"
                      @click="${this._retryUpload}"
                      ?hidden="${!t.error}"
                      >autorenew</mwc-icon
                    >
                    <mwc-icon
                      icon="cancel"
                      .title="${this.removeText}"
                      @click="${this._cancelUpload}"
                      ?hidden="${t.complete}"
                      >cancel</mwc-icon
                    >
                    <mwc-icon
                      icon="check_circle"
                      .title="${this.successText}"
                      ?hidden="${!t.complete}"
                      >check_circle</mwc-icon
                    >
                  </div>
                </div>
                <div class="error" ?hidden="${!t.error}">
                  ${this.errorText}
                </div>
                <div ?hidden="${t.complete}">
                  <mwc-linear-progress
                    .value="${t.progress}"
                    ?indeterminate="${this.indeterminateProgress}"
                    .error="${t.error}"></mwc-linear-progress>
                </div>
              </div>
            `))}
        </div>
        ${this.currentVideoId&&this.transcodingComplete?a`<yp-set-video-cover
              .noDefaultCoverImage="${this.noDefaultCoverImage}"
              .videoId="${this.currentVideoId}"
              @set-cover="${this._setVideoCover}"
              @set-default-cover="${this._setDefaultImageAsVideoCover}"></yp-set-video-cover> `:g}
      </div>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}" />
    `}clear(){this.files=[],this._showDropText(),this.uploadStatus=void 0,this.currentVideoId=void 0,this.currentAudioId=void 0,this.currentFile=void 0,this.transcodingJobId=void 0,this.indeterminateProgress=!1,this.transcodingComplete=!1,this.capture=!1,this.isPollingForTranscoding=!1,this.useMainPhotoForVideoCover=!1;const t=this.$$("#fileInput");t&&(t.value=""),this.videoUpload?this.fire("success",{detail:null,videoId:null}):this.audioUpload&&this.fire("success",{detail:null,audioId:null})}connectedCallback(){var t;super.connectedCallback(),this.raised&&(null===(t=this.$$("#button"))||void 0===t||t.toggleAttribute("raised",!0)),this.droppable&&(this._showDropText(),this.setupDrop()),this.videoUpload?(this.accept="video/*",this.capture=!0):this.audioUpload&&(this.accept="audio/*",this.capture=!0),this.uploadLimitSeconds||!this.videoUpload&&!this.audioUpload||(this.uploadLimitSeconds=600)}setupDrop(){this.$$("#UploadBorder"),this.ondragover=t=>(t.stopPropagation(),!1),this.ondragleave=()=>!1,this.ondrop=t=>{if(t.preventDefault(),t.dataTransfer){const e=t.dataTransfer.files.length;for(let i=0;i<e;i++){const e=t.dataTransfer.files[i];e.progress=0,e.error=!1,e.complete=!1,this.files.push(e),this.uploadFile(e)}}}}_hasRecorderApp(){const t=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,e=/Android/.test(navigator.userAgent)&&!window.MSStream;return this.videoUpload?!(!t&&!e):!this.audioUpload}_fileClick(){const t=/firefox/.test(navigator.userAgent.toLowerCase())&&!window.MSStream,e=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./),i=!!e&&parseInt(e[2],10),o=/SamsungBrowser/.test(navigator.userAgent),s=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;this._hasRecorderApp()?this._openFileInput():s&&this.audioUpload||t||i&&!o?this._openMediaRecorder():this._openFileInput()}_openFileInput(t){t&&(this.videoAspect=t);const e=this.$$("#fileInput");if(e&&document.createEvent){const t=document.createEvent("MouseEvents");t.initEvent("click",!0,!1),e.dispatchEvent(t)}}_openMediaRecorder(){window.appGlobals.activity("open","mediaRecorder"),window.appDialogs.getMediaRecorderAsync((t=>{t.open({callbackFunction:this._dataFromMediaRecorder.bind(this),videoRecording:this.videoUpload,audioRecording:this.audioUpload,uploadFileFunction:this._openFileInput.bind(this),maxLength:this.uploadLimitSeconds||600})}))}_dataFromMediaRecorder(t){t.progress=0,t.error=!1,t.complete=!1,this.files.push(t),this.uploadFile(t)}_fileChange(t){const e=t.target.files.length;for(let i=0;i<e;i++){const e=t.target.files[i];e.progress=0,e.error=!1,e.complete=!1,this.files.push(e),this.uploadFile(e)}}cancel(t){t&&t.xhr&&(t.xhr.abort(),this.files.splice(this.files.indexOf(t),1),this._showDropText())}_cancelUpload(t){this.cancel(t.model.__data__.item)}_retryUpload(t){t.model.item.error=!1,t.model.item.progress=0,setTimeout((()=>{this.uploadFile(t.model.__data__.item)}),50)}_showDropText(){this.shownDropText=!this.files.length&&this.droppable}async uploadFile(t){if(this.videoUpload||this.audioUpload||this.attachmentUpload){let e;this.indeterminateProgress=!0,this.currentFile=t;let i={};if(this.videoUpload)window.appGlobals.activity("starting","videoUpload"),this.uploadStatus=this.t("uploadingVideo"),this.headers={"Content-Type":"video/mp4"},e=this.group?"/api/videos/"+this.group.id+"/createAndGetPreSignedUploadUrl":"/api/videos/createAndGetPreSignedUploadUrlLoggedIn";else if(this.audioUpload)window.appGlobals.activity("starting","audioUpload"),this.uploadStatus=this.t("uploadingAudio"),this.headers={"Content-Type":"audio/mp4"},e=this.group?"/api/audios/"+this.group.id+"/createAndGetPreSignedUploadUrl":"/api/audios/createAndGetPreSignedUploadUrlLoggedIn";else if(this.attachmentUpload){if(window.appGlobals.activity("starting","attachmentUpload"),this.uploadStatus=this.t("attachmentUpload"),!this.group)return void console.error("No group for attachment upload");i={filename:t.name,contentType:t.type},e="/api/groups/"+this.group.id+"/getPresignedAttachmentURL"}const o=await window.serverApi.createPresignUrl(e,i);this.target=o.presignedUrl,this.videoUpload?this.currentVideoId=o.videoId:this.currentAudioId=o.audioId,this.method="PUT",this.indeterminateProgress=!1,this.reallyUploadFile(this.currentFile)}else window.appGlobals.activity("starting","imageUpload"),this.uploadStatus=this.t("uploadingImage"),this.reallyUploadFile(t)}_checkTranscodingJob(t){setTimeout((async()=>{let e,i;if(this.videoUpload?(e="videos",i=this.currentVideoId):(e="audios",i=this.currentAudioId),i){const o=await window.serverApi.getTranscodingJobStatus(e,i,t);if(this.currentFile){const e=this.files.indexOf(this.currentFile);"Complete"===o.status?(this.files[e].complete=!0,this.uploadStatus=this.t("uploadCompleted"),this.transcodingComplete=!0,this.videoUpload?(this.fire("success",{detail:o,videoId:this.currentVideoId}),this.uploadStatus=this.t("selectCoverImage")):this.fire("success",{detail:o,audioId:this.currentAudioId}),this.fire("file-upload-complete"),window.appGlobals.activity("complete","mediaTranscoding")):o.error?(this.files[e].error=!0,this.files[e].complete=!1,this.files[e].progress=100,this.requestUpdate(),this.fire("error",{xhr:event}),this.fire("file-upload-complete"),window.appGlobals.activity("error","mediaTranscoding")):this._checkTranscodingJob(t)}else console.error("Trying to process non file")}else console.error("No media edit for transcoding check")}),1e3)}_setVideoCover(t){this.selectedVideoCoverIndex=t.detail}_setDefaultImageAsVideoCover(t){this.useMainPhotoForVideoCover=t.detail}reallyUploadFile(t){if(!t)return;let e=this.videoAspect;e||(e=window.innerHeight>window.innerWidth?"portrait":"landscape"),this.fire("file-upload-starting"),this._showDropText();const i=this.files.indexOf(t),o=t.xhr=new XMLHttpRequest;o.upload.onprogress=t=>{const e=t.loaded,o=t.total;this.files[i].progress=Math.floor(e/o*1e3)/10};const s=this.target.replace("<name>",t.name);o.open(this.method,s,!0);for(const t in this.headers)this.headers.hasOwnProperty(t)&&o.setRequestHeader(t,this.headers[t]);if(o.onload=async()=>{if(200===o.status)if(this.videoUpload&&this.currentVideoId){let t,i;this.indeterminateProgress=!0,this.uploadStatus=this.t("transcodingVideo"),t=this.group?"startTranscoding":"startTranscodingLoggedIn",i="posts"===this.containerType&&this.group?{videoPostUploadLimitSec:this.group.configuration.videoPostUploadLimitSec,aspect:""}:"points"===this.containerType&&this.group?{videoPointUploadLimitSec:this.group.configuration.videoPointUploadLimitSec,aspect:""}:{},i.aspect=e;const o=await window.serverApi.startTranscoding("videos",this.currentVideoId,t,i);this._checkTranscodingJob(o.transcodingJobId),window.appGlobals.activity("complete","videoUpload"),window.appGlobals.activity("start","mediaTranscoding")}else if(this.audioUpload&&this.currentAudioId){let t,e;this.indeterminateProgress=!0,this.uploadStatus=this.t("transcodingAudio"),t=this.group?"startTranscoding":"startTranscodingLoggedIn",e="posts"===this.containerType&&this.group?{audioPostUploadLimitSec:this.group.configuration.audioPostUploadLimitSec}:"points"===this.containerType&&this.group?{audioPointUploadLimitSec:this.group.configuration.audioPointUploadLimitSec}:{};const i=await window.serverApi.startTranscoding("audios",this.currentAudioId,t,e);this._checkTranscodingJob(i.transcodingJobId),window.appGlobals.activity("complete","audioUpload"),window.appGlobals.activity("start","mediaTranscoding")}else this.attachmentUpload?(this.uploadStatus=this.t("uploadCompleted"),this.fire("file-upload-complete"),this.files[i].complete=!0,this.fire("success",{xhr:o,filename:t.name}),window.appGlobals.activity("complete","attachmentUpload")):(this.uploadStatus=this.t("uploadCompleted"),this.fire("file-upload-complete"),this.files[i].complete=!0,this.fire("success",{xhr:o,videoId:this.currentVideoId}),window.appGlobals.activity("complete","imageUpload"));else this.fire("file-upload-complete"),this.files[i].error=!0,this.files[i].complete=!1,this.files[i].progress=100,this.requestUpdate(),this.fire("error",{xhr:o}),window.appGlobals.activity("error","mediaUpload")},this.videoUpload||this.audioUpload||this.attachmentUpload)o.send(t);else{const e=new FormData;e.append("file",t,t.name),o.send(e)}}};t([i({type:String})],q.prototype,"target",void 0),t([i({type:Number})],q.prototype,"uploadLimitSeconds",void 0),t([i({type:Boolean})],q.prototype,"progressHidden",void 0),t([i({type:Boolean})],q.prototype,"droppable",void 0),t([i({type:String})],q.prototype,"dropText",void 0),t([i({type:Boolean})],q.prototype,"multi",void 0),t([i({type:Array})],q.prototype,"files",void 0),t([i({type:String})],q.prototype,"method",void 0),t([i({type:Boolean})],q.prototype,"raised",void 0),t([i({type:String})],q.prototype,"subText",void 0),t([i({type:Boolean})],q.prototype,"noink",void 0),t([i({type:Object})],q.prototype,"headers",void 0),t([i({type:String})],q.prototype,"retryText",void 0),t([i({type:String})],q.prototype,"removeText",void 0),t([i({type:String})],q.prototype,"successText",void 0),t([i({type:String})],q.prototype,"errorText",void 0),t([i({type:Boolean})],q.prototype,"noDefaultCoverImage",void 0),t([i({type:Boolean})],q.prototype,"shownDropText",void 0),t([i({type:Boolean})],q.prototype,"videoUpload",void 0),t([i({type:Boolean})],q.prototype,"audioUpload",void 0),t([i({type:Boolean})],q.prototype,"attachmentUpload",void 0),t([i({type:Number})],q.prototype,"currentVideoId",void 0),t([i({type:Number})],q.prototype,"currentAudioId",void 0),t([i({type:Number})],q.prototype,"transcodingJobId",void 0),t([i({type:Boolean})],q.prototype,"transcodingComplete",void 0),t([i({type:Object})],q.prototype,"currentFile",void 0),t([i({type:Boolean})],q.prototype,"isPollingForTranscoding",void 0),t([i({type:Boolean})],q.prototype,"indeterminateProgress",void 0),t([i({type:String})],q.prototype,"uploadStatus",void 0),t([i({type:String})],q.prototype,"accept",void 0),t([i({type:Object})],q.prototype,"group",void 0),t([i({type:Boolean})],q.prototype,"capture",void 0),t([i({type:String})],q.prototype,"containerType",void 0),t([i({type:Number})],q.prototype,"selectedVideoCoverIndex",void 0),t([i({type:Boolean})],q.prototype,"videoAspect",void 0),t([i({type:Boolean})],q.prototype,"useMainPhotoForVideoCover",void 0),t([i({type:String})],q.prototype,"buttonText",void 0),t([i({type:String})],q.prototype,"buttonIcon",void 0),q=t([p("yp-file-upload")],q);export{A as F,L as G,V as Y,R as a,k as f};
