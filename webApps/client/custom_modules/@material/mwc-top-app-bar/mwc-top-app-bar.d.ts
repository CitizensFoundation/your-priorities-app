/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { TopAppBarBase } from './mwc-top-app-bar-base.js';
declare global {
    interface HTMLElementTagNameMap {
        'mwc-top-app-bar': TopAppBar;
    }
}
export declare class TopAppBar extends TopAppBarBase {
    static styles: import("lit").CSSResult[];
}
