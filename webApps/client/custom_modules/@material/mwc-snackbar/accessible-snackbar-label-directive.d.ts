/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { TemplateResult } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { ChildPart, DirectiveParameters, PartInfo } from 'lit/directive.js';
/**
 * A lit directive implementation of @material/mdc-snackbar/util.ts#announce,
 * which does some tricks to ensure that snackbar labels will be handled
 * correctly by screen readers.
 *
 * The existing MDC announce util function is difficult to use directly here,
 * because Lit can crash when DOM that it is managing changes outside of its
 * purvue. In this case, we would render our labelText as the text content of
 * the label div, but the MDC announce function then clears that text content,
 * and resets it after a timeout (see below for why). We do the same thing here,
 * but in a way that fits into Lit's lifecycle.
 *
 * TODO(aomarks) Investigate whether this can be simplified; but to do that we
 * first need testing infrastructure to verify that it remains compatible with
 * screen readers. For example, can we just create an entirely new label node
 * every time we open or labelText changes? If not, and the async text/::before
 * swap is strictly required, can we at elast make this directive more generic
 * (e.g. so that we don't hard-code the name of the label class).
 */
declare class AccessibleSnackbarLabel extends AsyncDirective {
    protected labelEl: HTMLElement | null;
    protected timerId: number | null;
    protected previousPart: ChildPart | null;
    constructor(partInfo: PartInfo);
    update(part: ChildPart, [labelText, isOpen]: DirectiveParameters<this>): HTMLElement | undefined;
    render(labelText: string, isOpen: boolean): TemplateResult;
}
export declare const accessibleSnackbarLabel: (labelText: string, isOpen: boolean) => import("lit-html/directive").DirectiveResult<typeof AccessibleSnackbarLabel>;
export {};
