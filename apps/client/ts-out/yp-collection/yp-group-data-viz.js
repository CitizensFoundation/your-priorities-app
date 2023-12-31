var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import './yp-group.js';
import "@material/web/icon/icon.js";
import { YpGroup } from './yp-group.js';
let YpGroupDataViz = class YpGroupDataViz extends YpGroup {
    render() {
        return html `
      ${this.renderHeader()}
      ${this.collection
            ? html `
            <yp-data-visualization
              .group="${this.collection}"
            ></yp-data-visualization>
          `
            : nothing}
    `;
    }
};
YpGroupDataViz = __decorate([
    customElement('yp-group-data-viz')
], YpGroupDataViz);
export { YpGroupDataViz };
//# sourceMappingURL=yp-group-data-viz.js.map