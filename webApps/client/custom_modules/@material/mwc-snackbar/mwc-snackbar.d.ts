/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { SnackbarBase } from './mwc-snackbar-base.js';
declare global {
    interface HTMLElementTagNameMap {
        'mwc-snackbar': Snackbar;
    }
}
export declare class Snackbar extends SnackbarBase {
    static styles: import("lit").CSSResult[];
}
