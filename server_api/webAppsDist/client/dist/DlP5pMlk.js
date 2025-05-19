import{m as a,_ as e,n as t,o as i,s as o,x as r,T as n,f as s,i as d,t as c,e as v}from"./CiPgXroU.js";
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const l=a(o);class b extends l{constructor(){super(...arguments),this.activeIndex=0,this.hideInactiveLabels=!1,this.tabs=[]}render(){const{ariaLabel:a}=this;return r`<div
      class="md3-navigation-bar"
      role="tablist"
      aria-label=${a||n}
      @keydown="${this.handleKeydown}"
      @navigation-tab-interaction="${this.handleNavigationTabInteraction}"
      @navigation-tab-rendered=${this.handleNavigationTabConnected}
      ><md-elevation part="elevation"></md-elevation
      ><div class="md3-navigation-bar__tabs-slot-container"><slot></slot></div
    ></div>`}updated(a){a.has("activeIndex")&&(this.onActiveIndexChange(this.activeIndex),this.dispatchEvent(new CustomEvent("navigation-bar-activated",{detail:{tab:this.tabs[this.activeIndex],activeIndex:this.activeIndex},bubbles:!0,composed:!0}))),a.has("hideInactiveLabels")&&this.onHideInactiveLabelsChange(this.hideInactiveLabels),a.has("tabs")&&(this.onHideInactiveLabelsChange(this.hideInactiveLabels),this.onActiveIndexChange(this.activeIndex))}firstUpdated(a){super.firstUpdated(a),this.layout()}layout(){if(!this.tabsElement)return;const a=[];for(const e of this.tabsElement)a.push(e);this.tabs=a}handleNavigationTabConnected(a){const e=a.target;-1===this.tabs.indexOf(e)&&this.layout()}handleNavigationTabInteraction(a){this.activeIndex=this.tabs.indexOf(a.detail.state)}handleKeydown(a){const e=a.key,t=this.tabs.findIndex((a=>a.matches(":focus-within"))),i=s(this),o=this.tabs.length-1;if("Enter"===e||" "===e)return void(this.activeIndex=t);if("Home"===e)return void this.tabs[0].focus();if("End"===e)return void this.tabs[o].focus();const r="ArrowRight"===e&&!i||"ArrowLeft"===e&&i;if(r&&t===o)return void this.tabs[0].focus();if(r)return void this.tabs[t+1].focus();const n="ArrowLeft"===e&&!i||"ArrowRight"===e&&i;n&&0===t?this.tabs[o].focus():n&&this.tabs[t-1].focus()}onActiveIndexChange(a){if(!this.tabs[a])throw new Error("NavigationBar: activeIndex is out of bounds.");for(let e=0;e<this.tabs.length;e++)this.tabs[e].active=e===a}onHideInactiveLabelsChange(a){for(const e of this.tabs)e.hideInactiveLabel=a}}e([t({type:Number,attribute:"active-index"})],b.prototype,"activeIndex",void 0),e([t({type:Boolean,attribute:"hide-inactive-labels"})],b.prototype,"hideInactiveLabels",void 0),e([i({flatten:!0})],b.prototype,"tabsElement",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const m=d`:host{--_active-indicator-color: var(--md-navigation-bar-active-indicator-color, var(--md-sys-color-secondary-container, #e8def8));--_active-indicator-height: var(--md-navigation-bar-active-indicator-height, 32px);--_active-indicator-shape: var(--md-navigation-bar-active-indicator-shape, var(--md-sys-shape-corner-full, 9999px));--_active-indicator-width: var(--md-navigation-bar-active-indicator-width, 64px);--_active-focus-icon-color: var(--md-navigation-bar-active-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-focus-label-text-color: var(--md-navigation-bar-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-focus-state-layer-color: var(--md-navigation-bar-active-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-icon-color: var(--md-navigation-bar-active-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-hover-label-text-color: var(--md-navigation-bar-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-color: var(--md-navigation-bar-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-icon-color: var(--md-navigation-bar-active-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-label-text-color: var(--md-navigation-bar-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-label-text-weight: var(--md-navigation-bar-active-label-text-weight, var(--md-sys-typescale-label-medium-weight-prominent, var(--md-ref-typeface-weight-bold, 700)));--_active-pressed-icon-color: var(--md-navigation-bar-active-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-pressed-label-text-color: var(--md-navigation-bar-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-color: var(--md-navigation-bar-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-color: var(--md-navigation-bar-container-color, var(--md-sys-color-surface-container, #f3edf7));--_container-elevation: var(--md-navigation-bar-container-elevation, 2);--_container-height: var(--md-navigation-bar-container-height, 80px);--_container-shape: var(--md-navigation-bar-container-shape, var(--md-sys-shape-corner-none, 0px));--_focus-state-layer-opacity: var(--md-navigation-bar-focus-state-layer-opacity, 0.12);--_hover-state-layer-opacity: var(--md-navigation-bar-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-navigation-bar-icon-size, 24px);--_inactive-focus-icon-color: var(--md-navigation-bar-inactive-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-label-text-color: var(--md-navigation-bar-inactive-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-state-layer-color: var(--md-navigation-bar-inactive-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-icon-color: var(--md-navigation-bar-inactive-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-label-text-color: var(--md-navigation-bar-inactive-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-state-layer-color: var(--md-navigation-bar-inactive-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-icon-color: var(--md-navigation-bar-inactive-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-label-text-color: var(--md-navigation-bar-inactive-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-pressed-icon-color: var(--md-navigation-bar-inactive-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-label-text-color: var(--md-navigation-bar-inactive-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-state-layer-color: var(--md-navigation-bar-inactive-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-navigation-bar-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-navigation-bar-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem));--_label-text-size: var(--md-navigation-bar-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem));--_label-text-tracking: var(--md-navigation-bar-label-text-tracking, );--_label-text-type: var(--md-navigation-bar-label-text-type, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-label-medium-size, 0.75rem) / var(--md-sys-typescale-label-medium-line-height, 1rem) var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-weight: var(--md-navigation-bar-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-state-layer-opacity: var(--md-navigation-bar-pressed-state-layer-opacity, 0.12);--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color);width:100%}.md3-navigation-bar{display:flex;position:relative;width:100%;background-color:var(--_container-color);border-radius:var(--_container-shape);height:var(--_container-height)}.md3-navigation-bar .md3-navigation-bar__tabs-slot-container{display:inherit;width:inherit}md-elevation{transition-duration:280ms;z-index:0}
`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let h=class extends b{};h.styles=[m],h=e([c("md-navigation-bar")],h);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const g=a(o);class p extends g{constructor(){super(...arguments),this.opened=!1,this.pivot="end"}render(){const a=this.opened?"true":"false",e=this.opened?"false":"true",{ariaLabel:t,ariaModal:i}=this;return r`
      <div
        aria-expanded="${a}"
        aria-hidden="${e}"
        aria-label=${t||n}
        aria-modal="${i||n}"
        class="md3-navigation-drawer ${this.getRenderClasses()}"
        role="dialog">
        <md-elevation part="elevation"></md-elevation>
        <div class="md3-navigation-drawer__slot-content">
          <slot></slot>
        </div>
      </div>
    `}getRenderClasses(){return v({"md3-navigation-drawer--opened":this.opened,"md3-navigation-drawer--pivot-at-start":"start"===this.pivot})}updated(a){a.has("opened")&&setTimeout((()=>{this.dispatchEvent(new CustomEvent("navigation-drawer-changed",{detail:{opened:this.opened},bubbles:!0,composed:!0}))}),250)}}e([t({type:Boolean})],p.prototype,"opened",void 0),e([t()],p.prototype,"pivot",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const y=d`:host{--_container-color: var(--md-navigation-drawer-container-color, #fff);--_container-height: var(--md-navigation-drawer-container-height, 100%);--_container-shape: var(--md-navigation-drawer-container-shape, 0 16px 16px 0);--_container-width: var(--md-navigation-drawer-container-width, 360px);--_divider-color: var(--md-navigation-drawer-divider-color, #000);--_modal-container-elevation: var(--md-navigation-drawer-modal-container-elevation, 1);--_standard-container-elevation: var(--md-navigation-drawer-standard-container-elevation, 0);--md-elevation-level: var(--_standard-container-elevation);--md-elevation-shadow-color: var(--_divider-color)}:host{display:flex}.md3-navigation-drawer{inline-size:0;box-sizing:border-box;display:flex;justify-content:flex-end;overflow:hidden;overflow-y:auto;visibility:hidden;transition:inline-size .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) .25s}md-elevation{z-index:0}.md3-navigation-drawer--opened{visibility:visible;transition:inline-size .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) 0s}.md3-navigation-drawer--pivot-at-start{justify-content:flex-start}.md3-navigation-drawer__slot-content{display:flex;flex-direction:column;position:relative}
`,f=d`.md3-navigation-drawer-modal,.md3-navigation-drawer{background-color:var(--_container-color);border-radius:var(--_container-shape);height:var(--_container-height)}.md3-navigation-drawer-modal.md3-navigation-drawer-modal--opened,.md3-navigation-drawer.md3-navigation-drawer--opened{inline-size:var(--_container-width)}.md3-navigation-drawer-modal .md3-navigation-drawer-modal__slot-content,.md3-navigation-drawer .md3-navigation-drawer__slot-content{min-inline-size:var(--_container-width);max-inline-size:var(--_container-width)}
`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let u=class extends p{};u.styles=[f,y],u=e([c("md-navigation-drawer")],u);
