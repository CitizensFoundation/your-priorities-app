/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import 'blocking-elements';
import 'wicg-inert';
import { MDCDrawerAdapter } from '@material/drawer/adapter.js';
import MDCDismissibleDrawerFoundation from '@material/drawer/dismissible/foundation.js';
import { BaseElement } from '@material/mwc-base/base-element.js';
import { PropertyValues } from 'lit';
interface InertableHTMLElement extends HTMLElement {
    inert: boolean;
}
export declare class DrawerBase extends BaseElement {
    protected mdcRoot: HTMLElement;
    protected appContent: InertableHTMLElement;
    protected mdcFoundation: MDCDismissibleDrawerFoundation;
    protected get mdcFoundationClass(): typeof MDCDismissibleDrawerFoundation;
    protected createAdapter(): MDCDrawerAdapter;
    protected _previousFocus: HTMLElement | null;
    protected _handleScrimClick(): void;
    open: boolean;
    hasHeader: boolean;
    type: string;
    protected render(): import("lit-html").TemplateResult<1>;
    protected firstUpdated(): void;
    protected updated(changedProperties: PropertyValues): void;
}
export {};
