/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation.js';
import { property } from 'lit/decorators.js';
import { passiveEventOptionsIfSupported, TopAppBarBaseBase } from './mwc-top-app-bar-base-base.js';
export class TopAppBarBase extends TopAppBarBaseBase {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCTopAppBarFoundation;
        this.prominent = false;
        this.dense = false;
        this.handleResize = () => {
            this.mdcFoundation.handleWindowResize();
        };
    }
    barClasses() {
        return {
            'mdc-top-app-bar--dense': this.dense,
            'mdc-top-app-bar--prominent': this.prominent,
            'center-title': this.centerTitle,
        };
    }
    contentClasses() {
        return {
            'mdc-top-app-bar--fixed-adjust': !this.dense && !this.prominent,
            'mdc-top-app-bar--dense-fixed-adjust': this.dense && !this.prominent,
            'mdc-top-app-bar--prominent-fixed-adjust': !this.dense && this.prominent,
            'mdc-top-app-bar--dense-prominent-fixed-adjust': this.dense && this.prominent,
        };
    }
    registerListeners() {
        super.registerListeners();
        window.addEventListener('resize', this.handleResize, passiveEventOptionsIfSupported);
    }
    unregisterListeners() {
        super.unregisterListeners();
        window.removeEventListener('resize', this.handleResize);
    }
}
__decorate([
    property({ type: Boolean, reflect: true })
], TopAppBarBase.prototype, "prominent", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TopAppBarBase.prototype, "dense", void 0);
//# sourceMappingURL=mwc-top-app-bar-base.js.map