/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation.js';
import { TopAppBarBaseBase } from './mwc-top-app-bar-base-base.js';
export declare class TopAppBarBase extends TopAppBarBaseBase {
    protected mdcFoundationClass: typeof MDCTopAppBarFoundation;
    protected mdcFoundation: MDCTopAppBarFoundation;
    prominent: boolean;
    dense: boolean;
    protected handleResize: () => void;
    protected barClasses(): {
        'mdc-top-app-bar--dense': boolean;
        'mdc-top-app-bar--prominent': boolean;
        'center-title': boolean;
    };
    protected contentClasses(): {
        'mdc-top-app-bar--fixed-adjust': boolean;
        'mdc-top-app-bar--dense-fixed-adjust': boolean;
        'mdc-top-app-bar--prominent-fixed-adjust': boolean;
        'mdc-top-app-bar--dense-prominent-fixed-adjust': boolean;
    };
    protected registerListeners(): void;
    protected unregisterListeners(): void;
}
