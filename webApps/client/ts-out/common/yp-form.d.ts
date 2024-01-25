/**
@license
Copyright (c) 2015 The Polymer Community Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer community is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import { YpBaseElement } from './yp-base-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
/**
`<yp-form>` is a wrapper around the HTML `<form>` element, that can
validate and submit both custom and native HTML elements. Note that this
is a breaking change from yp-form 1.0, which was a type extension.


@element yp-form
@demo demo/index.html
*/
export declare class YpForm extends YpBaseElement {
    /**
     * HTTP request headers to send. See PolymerElements/iron-ajax for
     * more details. Only works when `allowRedirect` is false.
     */
    headers: Record<string, string>;
    _form: HTMLFormElement | undefined;
    _defaults: WeakMap<HTMLInputElement | HTMLFormElement, object> | undefined;
    _nodeObserver: FlattenedNodesObserver | undefined;
    static get style(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
    /**
     * Fired if the form cannot be submitted because it's invalid.
     *
     * @event yp-form-invalid
     */
    /**
     * Fired after the form is submitted.
     *
     * @event yp-form-submit
     */
    /**
     * Fired before the form is submitted.
     *
     * @event yp-form-presubmit
     */
    /**
     * Fired after the form is reset.
     *
     * @event yp-form-reset
     */
    /**
     * Fired after the form is submitted and a response is received. An
     * IronRequestElement is included as the event.detail object.
     *
     * @event yp-form-response
     */
    /**
     * Fired after the form is submitted and an error is received. An
     * error message is included in event.detail.error and an
     * IronRequestElement is included in event.detail.request.
     *
     * @event yp-form-error
     */
    /**
     * @return {void}
     * @override
     */
    connectedCallback(): void;
    _formError(event: CustomEvent): void;
    /**
     * @return {void}
     * @override
     */
    disconnectedCallback(): void;
    _init(): void;
    /**
     * Saves the values of all form elements that will be used when resetting
     * the form. Initially called asynchronously on attach. Any time you
     * call this function, the previously saved values for a form element will
     * be overwritten.
     *
     * This function is useful if you are dynamically adding elements to
     * the form, or if your elements are asynchronously setting their values.
     * @return {void}
     */
    saveResetValues(): void;
    /**
     * @param {boolean=} overwriteValues
     * @return {void}
     */
    _saveInitialValues(overwriteValues?: boolean): void;
    /**
     * Validates all the required elements (custom and native) in the form.
     * @return {boolean} True if all the elements are valid.
     */
    validate(): boolean;
    /**
     * Submits the form.
     *
     * @param {Event=} event
     * @return {void}
     */
    submit(event?: CustomEvent | undefined): Promise<void>;
    /**
     * Resets the form to the default values.
     *
     * @param {Event=} event
     * @return {void}
     */
    reset(event: CustomEvent): void;
    /**
     * Serializes the form as will be used in submission. Note that `serialize`
     * is a Polymer reserved keyword, so calling `someIronForm`.serialize()`
     * will give you unexpected results.
     * @return {!Object<string, *>} An object containing name-value pairs for elements that
     *                  would be submitted.
     */
    serializeForm(): {};
    _makeAjaxRequest(json: Record<string, string>): Promise<void>;
    _getValidatableElements(): HTMLInputElement[];
    _getSubmittableElements(): HTMLInputElement[];
    /**
     * Traverse the parent element to find and add all submittable nodes to
     * `submittable`.
     * @param  {!Node} parent The parent node
     * @param  {!boolean} ignoreName  Whether the name of the submittable nodes should be disregarded
     * @param  {!boolean} skipSlots  Whether to skip traversing of slot elements
     * @param  {!Array<!Node>=} submittable Reference to the array of submittables
     * @return {!Array<!Node>}
     * @private
     */
    _findElements(parent: HTMLElement, ignoreName: boolean, skipSlots: boolean, submittable?: HTMLInputElement[] | undefined): HTMLInputElement[];
    /**
     * Traverse the distributed nodes of a slot or content element
     * and add all submittable nodes to `submittable`.
     * @param  {!Array<!Node>} submittable Reference to the array of submittables
     * @param  {!Node} node The slot or content node
     * @param  {!boolean} ignoreName  Whether the name of the submittable nodes should be disregarded
     * @return {void}
     * @private
     */
    _searchSubmittableInSlot(submittable: HTMLInputElement[], node: HTMLElement, ignoreName: boolean): void;
    /**
     * Traverse the distributed nodes of a slot or content element
     * and add all submittable nodes to `submittable`.
     * @param  {!Array<!Node>} submittable Reference to the array of submittables
     * @param  {!Node} node The node to be
     * @param  {!boolean} ignoreName  Whether the name of the submittable nodes should be disregarded
     * @return {void}
     * @private
     */
    _searchSubmittable(submittable: HTMLInputElement[] | undefined, node: HTMLInputElement, ignoreName: boolean): void;
    /**
     * An element is submittable if it is not disabled, and if it has a
     * 'name' attribute. If we ignore the name, check if is validatable.
     * This allows `_findElements` to decide if to explore an element's shadowRoot
     * or not: an element implementing `validate()` is considered validatable, and
     * we don't search for validatables in its shadowRoot.
     * @param {!Node} node
     * @param {!boolean} ignoreName
     * @return {boolean}
     * @private
     */
    _isSubmittable(node: HTMLInputElement, ignoreName: boolean): string | boolean;
    _serializeElementValues(element: HTMLInputElement): any[];
    _serializeSelectValues(element: YpHTMLInputElement): any[];
    _serializeInputValues(element: HTMLInputElement): string[];
    _createHiddenElement(name: string, value: string): HTMLInputElement;
    _addSerializedElement(json: Record<string, Array<string> | string | string[] | Array<Array<string>>>, name: string, value: string): void;
}
//# sourceMappingURL=yp-form.d.ts.map