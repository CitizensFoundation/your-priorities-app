/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
import { customElement } from 'lit/decorators.js';
import { SnackbarBase } from './mwc-snackbar-base.js';
import { styles } from './mwc-snackbar.css.js';
let Snackbar = class Snackbar extends SnackbarBase {
};
Snackbar.styles = [styles];
Snackbar = __decorate([
    customElement('mwc-snackbar')
], Snackbar);
export { Snackbar };
//# sourceMappingURL=mwc-snackbar.js.map