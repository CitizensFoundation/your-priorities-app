/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseElement } from '@material/mwc-base/base-element.js';
import { MDCSnackbarAdapter } from '@material/snackbar/adapter.js';
import MDCSnackbarFoundation from '@material/snackbar/foundation.js';
export declare class SnackbarBase extends BaseElement {
    protected mdcFoundation: MDCSnackbarFoundation;
    protected readonly mdcFoundationClass: typeof MDCSnackbarFoundation;
    protected mdcRoot: HTMLElement;
    protected labelElement: HTMLElement;
    open: boolean;
    timeoutMs: number;
    closeOnEscape: boolean;
    labelText: string;
    stacked: boolean;
    leading: boolean;
    protected reason: string;
    protected render(): import("lit-html").TemplateResult<1>;
    protected createAdapter(): MDCSnackbarAdapter;
    /** @export */
    show(): void;
    /** @export */
    close(reason?: string): void;
    protected firstUpdated(): void;
    protected _handleKeydown(e: KeyboardEvent): void;
    protected _handleActionClick(e: MouseEvent): void;
    protected _handleDismissClick(e: MouseEvent): void;
}
