var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../pl-base-element';
function barWidth(count, all, plot) {
    let maxVal = all[0][plot];
    for (const val of all) {
        // @ts-ignore
        if (val > maxVal)
            maxVal = val[plot];
    }
    return (count / maxVal) * 100;
}
let PlausibleBar = class PlausibleBar extends PlausibleBaseElement {
    constructor() {
        super(...arguments);
        this.plot = 'visitors';
    }
    static get styles() {
        return [
            ...super.styles,
            css `
        :host {
          width: 90%;
        }

        .faviconMargin {
          margin-left: 30px;
        }

        .rounded {
          border-radius: 12px;
        }
      `,
            css ``,
        ];
    }
    render() {
        const width = barWidth(this.count, this.all, this.plot);
        return html `
      <div
        class="w-full relative"
        .not-used-old-style="max-width: calc(100% - ${this.maxWidthDeduction});"
      >
        <div
          class="${`absolute top-0 left-0 h-full test rounded ${this.bg || ''}`}"
          .style="width: ${width}%;"
        ></div>
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: Number })
], PlausibleBar.prototype, "count", void 0);
__decorate([
    property({ type: Array })
], PlausibleBar.prototype, "all", void 0);
__decorate([
    property({ type: String })
], PlausibleBar.prototype, "maxWidthDeduction", void 0);
__decorate([
    property({ type: String })
], PlausibleBar.prototype, "plot", void 0);
__decorate([
    property({ type: String })
], PlausibleBar.prototype, "bg", void 0);
PlausibleBar = __decorate([
    customElement('pl-bar')
], PlausibleBar);
export { PlausibleBar };
//# sourceMappingURL=pl-bar.js.map