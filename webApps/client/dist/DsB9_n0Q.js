import{m as t,_ as a,n as e,h as i,s as o,x as r,e as n,T as s,i as l,t as c,j as d,k as v,l as m,N as b,o as p,L as g}from"./BIgKkzsj.js";
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const h=t(o);class y extends h{constructor(){super(...arguments),this.disabled=!1,this.active=!1,this.hideInactiveLabel=!1,this.badgeValue="",this.showBadge=!1}render(){const{ariaLabel:t}=this;return r` <button
      class="md3-navigation-tab ${n(this.getRenderClasses())}"
      role="tab"
      aria-selected="${this.active}"
      aria-label=${t||s}
      tabindex="${this.active?0:-1}"
      @click="${this.handleClick}">
      <md-focus-ring part="focus-ring" inward></md-focus-ring>
      <md-ripple
        ?disabled="${this.disabled}"
        class="md3-navigation-tab__ripple"></md-ripple>
      <span aria-hidden="true" class="md3-navigation-tab__icon-content"
        ><span class="md3-navigation-tab__active-indicator"></span
        ><span class="md3-navigation-tab__icon"
          ><slot name="inactive-icon"></slot
        ></span>
        <span class="md3-navigation-tab__icon md3-navigation-tab__icon--active"
          ><slot name="active-icon"></slot></span
        >${this.renderBadge()}</span
      >${this.renderLabel()}
    </button>`}getRenderClasses(){return{"md3-navigation-tab--hide-inactive-label":this.hideInactiveLabel,"md3-navigation-tab--active":this.active}}renderBadge(){return this.showBadge?r`<md-badge .value="${this.badgeValue}"></md-badge>`:s}renderLabel(){const{ariaLabel:t}=this,a=t?"true":"false";return this.label?r` <span
          aria-hidden="${a}"
          class="md3-navigation-tab__label-text"
          >${this.label}</span
        >`:s}firstUpdated(t){super.firstUpdated(t);const a=new Event("navigation-tab-rendered",{bubbles:!0,composed:!0});this.dispatchEvent(a)}focus(){const t=this.buttonElement;t&&t.focus()}blur(){const t=this.buttonElement;t&&t.blur()}handleClick(){this.dispatchEvent(new CustomEvent("navigation-tab-interaction",{detail:{state:this},bubbles:!0,composed:!0}))}}a([e({type:Boolean})],y.prototype,"disabled",void 0),a([e({type:Boolean,reflect:!0})],y.prototype,"active",void 0),a([e({type:Boolean,attribute:"hide-inactive-label"})],y.prototype,"hideInactiveLabel",void 0),a([e()],y.prototype,"label",void 0),a([e({attribute:"badge-value"})],y.prototype,"badgeValue",void 0),a([e({type:Boolean,attribute:"show-badge"})],y.prototype,"showBadge",void 0),a([i("button")],y.prototype,"buttonElement",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const u=l`:host{--_active-indicator-color: var(--md-navigation-bar-active-indicator-color, var(--md-navigation-bar-active-indicator-color, var(--md-sys-color-secondary-container, #e8def8)));--_active-indicator-height: var(--md-navigation-bar-active-indicator-height, var(--md-navigation-bar-active-indicator-height, 32px));--_active-indicator-shape: var(--md-navigation-bar-active-indicator-shape, var(--md-navigation-bar-active-indicator-shape, var(--md-sys-shape-corner-full, 9999px)));--_active-indicator-width: var(--md-navigation-bar-active-indicator-width, var(--md-navigation-bar-active-indicator-width, 64px));--_active-focus-icon-color: var(--md-navigation-bar-active-focus-icon-color, var(--md-navigation-bar-active-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b)));--_active-focus-label-text-color: var(--md-navigation-bar-active-focus-label-text-color, var(--md-navigation-bar-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-focus-state-layer-color: var(--md-navigation-bar-active-focus-state-layer-color, var(--md-navigation-bar-active-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-hover-icon-color: var(--md-navigation-bar-active-hover-icon-color, var(--md-navigation-bar-active-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b)));--_active-hover-label-text-color: var(--md-navigation-bar-active-hover-label-text-color, var(--md-navigation-bar-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-hover-state-layer-color: var(--md-navigation-bar-active-hover-state-layer-color, var(--md-navigation-bar-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-icon-color: var(--md-navigation-bar-active-icon-color, var(--md-navigation-bar-active-icon-color, var(--md-sys-color-on-secondary-container, #1d192b)));--_active-label-text-color: var(--md-navigation-bar-active-label-text-color, var(--md-navigation-bar-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-label-text-weight: var(--md-navigation-bar-active-label-text-weight, var(--md-navigation-bar-active-label-text-weight, var(--md-sys-typescale-label-medium-weight-prominent, var(--md-ref-typeface-weight-bold, 700))));--_active-pressed-icon-color: var(--md-navigation-bar-active-pressed-icon-color, var(--md-navigation-bar-active-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b)));--_active-pressed-label-text-color: var(--md-navigation-bar-active-pressed-label-text-color, var(--md-navigation-bar-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_active-pressed-state-layer-color: var(--md-navigation-bar-active-pressed-state-layer-color, var(--md-navigation-bar-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_container-color: var(--md-navigation-bar-container-color, var(--md-navigation-bar-container-color, var(--md-sys-color-surface-container, #f3edf7)));--_container-elevation: var(--md-navigation-bar-container-elevation, var(--md-navigation-bar-container-elevation, 2));--_container-height: var(--md-navigation-bar-container-height, var(--md-navigation-bar-container-height, 80px));--_container-shape: var(--md-navigation-bar-container-shape, var(--md-navigation-bar-container-shape, var(--md-sys-shape-corner-none, 0px)));--_focus-state-layer-opacity: var(--md-navigation-bar-focus-state-layer-opacity, var(--md-navigation-bar-focus-state-layer-opacity, 0.12));--_hover-state-layer-opacity: var(--md-navigation-bar-hover-state-layer-opacity, var(--md-navigation-bar-hover-state-layer-opacity, 0.08));--_icon-size: var(--md-navigation-bar-icon-size, var(--md-navigation-bar-icon-size, 24px));--_inactive-focus-icon-color: var(--md-navigation-bar-inactive-focus-icon-color, var(--md-navigation-bar-inactive-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-focus-label-text-color: var(--md-navigation-bar-inactive-focus-label-text-color, var(--md-navigation-bar-inactive-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-focus-state-layer-color: var(--md-navigation-bar-inactive-focus-state-layer-color, var(--md-navigation-bar-inactive-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-hover-icon-color: var(--md-navigation-bar-inactive-hover-icon-color, var(--md-navigation-bar-inactive-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-hover-label-text-color: var(--md-navigation-bar-inactive-hover-label-text-color, var(--md-navigation-bar-inactive-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-hover-state-layer-color: var(--md-navigation-bar-inactive-hover-state-layer-color, var(--md-navigation-bar-inactive-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-icon-color: var(--md-navigation-bar-inactive-icon-color, var(--md-navigation-bar-inactive-icon-color, var(--md-sys-color-on-surface-variant, #49454f)));--_inactive-label-text-color: var(--md-navigation-bar-inactive-label-text-color, var(--md-navigation-bar-inactive-label-text-color, var(--md-sys-color-on-surface-variant, #49454f)));--_inactive-pressed-icon-color: var(--md-navigation-bar-inactive-pressed-icon-color, var(--md-navigation-bar-inactive-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-pressed-label-text-color: var(--md-navigation-bar-inactive-pressed-label-text-color, var(--md-navigation-bar-inactive-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20)));--_inactive-pressed-state-layer-color: var(--md-navigation-bar-inactive-pressed-state-layer-color, var(--md-navigation-bar-inactive-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20)));--_label-text-font: var(--md-navigation-bar-label-text-font, var(--md-navigation-bar-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto))));--_label-text-line-height: var(--md-navigation-bar-label-text-line-height, var(--md-navigation-bar-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem)));--_label-text-size: var(--md-navigation-bar-label-text-size, var(--md-navigation-bar-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem)));--_label-text-tracking: var(--md-navigation-bar-label-text-tracking, var(--md-navigation-bar-label-text-tracking, ));--_label-text-type: var(--md-navigation-bar-label-text-type, var(--md-navigation-bar-label-text-type, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-label-medium-size, 0.75rem) / var(--md-sys-typescale-label-medium-line-height, 1rem) var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto))));--_label-text-weight: var(--md-navigation-bar-label-text-weight, var(--md-navigation-bar-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500))));--_pressed-state-layer-opacity: var(--md-navigation-bar-pressed-state-layer-opacity, var(--md-navigation-bar-pressed-state-layer-opacity, 0.12));display:flex;flex-grow:1}md-focus-ring{--md-focus-ring-shape: var(--md-sys-shape-corner-small, 8px);--md-focus-ring-inward-offset: -1px}.md3-navigation-tab{align-items:center;appearance:none;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:center;min-height:48px;min-width:48px;outline:none;padding:8px 0px 12px;position:relative;text-align:center;width:100%;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-transform:inherit}.md3-navigation-tab::-moz-focus-inner{border:0;padding:0}.md3-navigation-tab__icon-content{align-items:center;box-sizing:border-box;display:flex;justify-content:center;position:relative;z-index:1}.md3-navigation-tab__label-text{height:16px;margin-top:4px;opacity:1;transition:opacity 100ms cubic-bezier(0.4, 0, 0.2, 1),height 100ms cubic-bezier(0.4, 0, 0.2, 1);z-index:1}.md3-navigation-tab--hide-inactive-label:not(.md3-navigation-tab--active) .md3-navigation-tab__label-text{height:0;opacity:0}.md3-navigation-tab__active-indicator{display:flex;justify-content:center;opacity:0;position:absolute;transition:width 100ms cubic-bezier(0.4, 0, 0.2, 1),opacity 100ms cubic-bezier(0.4, 0, 0.2, 1);width:32px;background-color:var(--_active-indicator-color);border-radius:var(--_active-indicator-shape)}.md3-navigation-tab--active .md3-navigation-tab__active-indicator{opacity:1}.md3-navigation-tab__active-indicator,.md3-navigation-tab__icon-content{height:var(--_active-indicator-height)}.md3-navigation-tab--active .md3-navigation-tab__active-indicator,.md3-navigation-tab__icon-content{width:var(--_active-indicator-width)}.md3-navigation-tab__icon{fill:currentColor;align-self:center;display:inline-block;position:relative;width:var(--_icon-size);height:var(--_icon-size);font-size:var(--_icon-size)}.md3-navigation-tab__icon.md3-navigation-tab__icon--active{display:none}.md3-navigation-tab--active .md3-navigation-tab__icon{display:none}.md3-navigation-tab--active .md3-navigation-tab__icon.md3-navigation-tab__icon--active{display:inline-block}.md3-navigation-tab__ripple{z-index:0}.md3-navigation-tab--active{--md-ripple-hover-color: var(--_active-hover-state-layer-color);--md-ripple-pressed-color: var(--_active-pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-navigation-tab--active .md3-navigation-tab__icon{color:var(--_active-icon-color)}.md3-navigation-tab--active .md3-navigation-tab__label-text{color:var(--_active-label-text-color)}.md3-navigation-tab--active:hover .md3-navigation-tab__icon{color:var(--_active-hover-icon-color)}.md3-navigation-tab--active:hover .md3-navigation-tab__label-text{color:var(--_active-hover-label-text-color)}.md3-navigation-tab--active:focus .md3-navigation-tab__icon{color:var(--_active-focus-icon-color)}.md3-navigation-tab--active:focus .md3-navigation-tab__label-text{color:var(--_active-focus-label-text-color)}.md3-navigation-tab--active:active .md3-navigation-tab__icon{color:var(--_active-pressed-icon-color)}.md3-navigation-tab--active:active .md3-navigation-tab__label-text{color:var(--_active-pressed-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active){--md-ripple-hover-color: var(--_inactive-hover-state-layer-color);--md-ripple-pressed-color: var(--_inactive-pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-navigation-tab:not(.md3-navigation-tab--active) .md3-navigation-tab__icon{color:var(--_inactive-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active) .md3-navigation-tab__label-text{color:var(--_inactive-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):hover .md3-navigation-tab__icon{color:var(--_inactive-hover-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):hover .md3-navigation-tab__label-text{color:var(--_inactive-hover-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):focus .md3-navigation-tab__icon{color:var(--_inactive-focus-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):focus .md3-navigation-tab__label-text{color:var(--_inactive-focus-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):active .md3-navigation-tab__icon{color:var(--_inactive-pressed-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):active .md3-navigation-tab__label-text{color:var(--_inactive-pressed-label-text-color)}
`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let f=class extends y{};f.styles=[u],f=a([c("md-navigation-tab")],f);
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const x=t(o);class _ extends x{constructor(){super(...arguments),this.disabled=!1,this.type="text",this.isListItem=!0,this.href="",this.target=""}get isDisabled(){return this.disabled&&"link"!==this.type}willUpdate(t){this.href&&(this.type="link"),super.willUpdate(t)}render(){return this.renderListItem(r`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(t){const a="link"===this.type;let e;switch(this.type){case"link":e=d`a`;break;case"button":e=d`button`;break;default:e=d`li`}const i="text"!==this.type,o=a&&this.target?this.target:s;return v`
      <${e}
        id="item"
        tabindex="${this.isDisabled||!i?-1:0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected||s}
        aria-checked=${this.ariaChecked||s}
        aria-expanded=${this.ariaExpanded||s}
        aria-haspopup=${this.ariaHasPopup||s}
        class="list-item ${n(this.getRenderClasses())}"
        href=${this.href||s}
        target=${o}
        @focus=${this.onFocus}
      >${t}</${e}>
    `}renderRipple(){return"text"===this.type?s:r` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`}renderFocusRing(){return"text"===this.type?s:r` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}onFocusRingVisibilityChanged(t){}getRenderClasses(){return{disabled:this.isDisabled}}renderBody(){return r`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}onFocus(){-1===this.tabIndex&&this.dispatchEvent(m())}focus(){this.listItemRoot?.focus()}}_.shadowRootOptions={...o.shadowRootOptions,delegatesFocus:!0},a([e({type:Boolean,reflect:!0})],_.prototype,"disabled",void 0),a([e({reflect:!0})],_.prototype,"type",void 0),a([e({type:Boolean,attribute:"md-list-item",reflect:!0})],_.prototype,"isListItem",void 0),a([e()],_.prototype,"href",void 0),a([e()],_.prototype,"target",void 0),a([i(".list-item")],_.prototype,"listItemRoot",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const w=l`:host{display:flex;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let z=class extends _{};z.styles=[w],z=a([c("md-list-item")],z);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const $=new Set(Object.values(b));class k extends o{get items(){return this.listController.items}constructor(){super(),this.listController=new g({isItem:t=>t.hasAttribute("md-list-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>"rtl"===getComputedStyle(this).direction,deactivateItem:t=>{t.tabIndex=-1},activateItem:t=>{t.tabIndex=0},isNavigableKey:t=>$.has(t),isActivatable:t=>!t.disabled&&"text"!==t.type}),this.internals=this.attachInternals(),this.internals.role="list",this.addEventListener("keydown",this.listController.handleKeydown)}render(){return r`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `}activateNextItem(){return this.listController.activateNextItem()}activatePreviousItem(){return this.listController.activatePreviousItem()}}a([p({flatten:!0})],k.prototype,"slotItems",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const I=l`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let C=class extends k{};C.styles=[I],C=a([c("md-list")],C);
