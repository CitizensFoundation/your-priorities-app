/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
import { addHasRemoveClass, BaseElement } from '@material/mwc-base/base-element.js';
import { observer } from '@material/mwc-base/observer.js';
import MDCSnackbarFoundation from '@material/snackbar/foundation.js';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { accessibleSnackbarLabel } from './accessible-snackbar-label-directive.js';
const { OPENING_EVENT, OPENED_EVENT, CLOSING_EVENT, CLOSED_EVENT, } = MDCSnackbarFoundation.strings;
export class SnackbarBase extends BaseElement {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCSnackbarFoundation;
        this.open = false;
        this.timeoutMs = 5000;
        this.closeOnEscape = false;
        this.labelText = '';
        this.stacked = false;
        this.leading = false;
        this.reason = '';
    }
    render() {
        const classes = {
            'mdc-snackbar--stacked': this.stacked,
            'mdc-snackbar--leading': this.leading,
        };
        return html `
      <div class="mdc-snackbar ${classMap(classes)}" @keydown="${this._handleKeydown}">
        <div class="mdc-snackbar__surface">
          ${accessibleSnackbarLabel(this.labelText, this.open)}
          <div class="mdc-snackbar__actions">
            <slot name="action" @click="${this._handleActionClick}"></slot>
            <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
          </div>
        </div>
      </div>`;
    }
    createAdapter() {
        return Object.assign(Object.assign({}, addHasRemoveClass(this.mdcRoot)), { announce: () => {
                /* We handle announce ourselves with the accessible directive. */
            }, notifyClosed: (reason) => {
                this.dispatchEvent(new CustomEvent(CLOSED_EVENT, { bubbles: true, cancelable: true, detail: { reason: reason } }));
            }, notifyClosing: (reason) => {
                this.open = false;
                this.dispatchEvent(new CustomEvent(CLOSING_EVENT, { bubbles: true, cancelable: true, detail: { reason: reason } }));
            }, notifyOpened: () => {
                this.dispatchEvent(new CustomEvent(OPENED_EVENT, { bubbles: true, cancelable: true }));
            }, notifyOpening: () => {
                this.open = true;
                this.dispatchEvent(new CustomEvent(OPENING_EVENT, { bubbles: true, cancelable: true }));
            } });
    }
    /** @export */
    show() {
        this.open = true;
    }
    /** @export */
    close(reason = '') {
        this.reason = reason;
        this.open = false;
    }
    firstUpdated() {
        super.firstUpdated();
        if (this.open) {
            this.mdcFoundation.open();
        }
    }
    _handleKeydown(e) {
        this.mdcFoundation.handleKeyDown(e);
    }
    _handleActionClick(e) {
        this.mdcFoundation.handleActionButtonClick(e);
    }
    _handleDismissClick(e) {
        this.mdcFoundation.handleActionIconClick(e);
    }
}
__decorate([
    query('.mdc-snackbar')
], SnackbarBase.prototype, "mdcRoot", void 0);
__decorate([
    query('.mdc-snackbar__label')
], SnackbarBase.prototype, "labelElement", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (value) {
        if (this.mdcFoundation) {
            if (value) {
                this.mdcFoundation.open();
            }
            else {
                this.mdcFoundation.close(this.reason);
                this.reason = '';
            }
        }
    })
], SnackbarBase.prototype, "open", void 0);
__decorate([
    observer(function (value) {
        this.mdcFoundation.setTimeoutMs(value);
    }),
    property({ type: Number })
], SnackbarBase.prototype, "timeoutMs", void 0);
__decorate([
    observer(function (value) {
        this.mdcFoundation.setCloseOnEscape(value);
    }),
    property({ type: Boolean })
], SnackbarBase.prototype, "closeOnEscape", void 0);
__decorate([
    property({ type: String })
], SnackbarBase.prototype, "labelText", void 0);
__decorate([
    property({ type: Boolean })
], SnackbarBase.prototype, "stacked", void 0);
__decorate([
    property({ type: Boolean })
], SnackbarBase.prototype, "leading", void 0);
//# sourceMappingURL=mwc-snackbar-base.js.map