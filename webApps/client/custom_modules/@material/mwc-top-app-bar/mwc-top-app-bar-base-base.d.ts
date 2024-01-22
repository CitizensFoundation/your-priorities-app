/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseElement } from '@material/mwc-base/base-element.js';
import { MDCTopAppBarAdapter } from '@material/top-app-bar/adapter.js';
import MDCTopAppBarBaseFoundation from '@material/top-app-bar/foundation.js';
export declare const passiveEventOptionsIfSupported: {
    passive: boolean;
} | undefined;
interface ClassInfo {
    [key: string]: boolean;
}
export declare abstract class TopAppBarBaseBase extends BaseElement {
    protected abstract mdcFoundation: MDCTopAppBarBaseFoundation;
    protected abstract mdcFoundationClass: typeof MDCTopAppBarBaseFoundation;
    protected mdcRoot: HTMLElement;
    protected _actionItemsSlot: HTMLElement;
    protected _scrollTarget: HTMLElement | Window;
    centerTitle: boolean;
    get scrollTarget(): HTMLElement | Window;
    set scrollTarget(value: HTMLElement | Window);
    protected updateRootPosition(): void;
    /**
     * classMap map for classes on the bar
     */
    protected abstract barClasses(): ClassInfo;
    /**
     * classMap map for classes on the content slot
     */
    protected abstract contentClasses(): ClassInfo;
    protected render(): import("lit-html").TemplateResult<1>;
    protected createAdapter(): MDCTopAppBarAdapter;
    protected handleTargetScroll: () => void;
    protected handleNavigationClick: () => void;
    protected registerListeners(): void;
    protected unregisterListeners(): void;
    protected registerScrollListener(): void;
    protected unregisterScrollListener(): void;
    protected firstUpdated(): void;
    disconnectedCallback(): void;
}
export {};
