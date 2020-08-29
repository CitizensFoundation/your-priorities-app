/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/

// Originally from https://github.com/cimmwolf/yp-form

import { YpBaseElement } from './yp-base-element.js';
import { property, customElement, html, css } from 'lit-element';
import { dom, DomApi, EventApi } from './domUtils/dom.js';

/**
`<yp-form>` is a wrapper around the HTML `<form>` element, that can
validate and submit both custom and native HTML elements. Note that this
is a breaking change from yp-form 1.0, which was a type extension.

It has two modes: if `allow-redirect` is true, then after the form submission
you will be redirected to the server response. Otherwise, if it is false, it
will use an `iron-ajax` element to submit the form contents to the server.

  Example:

    <yp-form>
      <form method="get" action="/form/handler">
        <input type="text" name="name" value="Batman">
        <input type="checkbox" name="donuts" checked> I like donuts<br>
        <paper-checkbox name="cheese" value="yes" checked></paper-checkbox>
      </form>
    </yp-form>

By default, a native `<button>` element will submit this form. However, if you
want to submit it from a custom element's click handler, you need to explicitly
call the `yp-form`'s `submit` method.

  Example (using `<paper-button>` for the form `<yp-form id="myForm">`):

    <paper-button raised on-click="submitForm">Submit</paper-button>

    function submitForm() {
      this.$.myForm.submit();
    }

  or (using `<button>` for a form in the same document):

    <button raised onclick="submitForm()">Submit</button>

    function submitForm() {
      document.getElementById('myForm').submit();
    }

If you are not using the `allow-redirect` mode, then you also have the option of
customizing the request sent to the server. To do so, you can listen to the
`yp-form-presubmit` event, and modify the form's
[`iron-ajax`](https://elements.polymer-project.org/elements/iron-ajax) object.
However, If you want to not use `iron-ajax` at all, you can cancel the event and
do your own custom submission:

  Example of modifying the request, but still using the build-in form
submission:

    form.addEventListener('yp-form-presubmit', function() {
      this.request.method = 'put';
      this.request.params['extraParam'] = 'someValue';
    });

  Example of bypassing the build-in form submission:

    form.addEventListener('yp-form-presubmit', function(event) {
      event.preventDefault();
      var firebase = new Firebase(form.getAttribute('action'));
      firebase.set(form.serializeForm());
    });

Note that if you're dynamically creating this element, it's mandatory that you
first create the contained `<form>` element and all its children, and only then
attach it to the `<yp-form>`:

  var wrapper = document.createElement('yp-form');
  var form = document.createElement('form');
  var input = document.createElement('input');
  form.appendChild(input);
  document.body.appendChild(wrapper);
  wrapper.appendChild(form);

@element yp-form
@demo demo/index.html
*/

@customElement('yp-form')
export class YpForm extends YpBaseElement {
  /*
   * Set this to true if you don't want the form to be submitted through an
   * ajax request, and you want the page to redirect to the action URL
   * after the form has been submitted.
   */
  @property({ type: Boolean })
  allowRedirect = false;

  /**
   * HTTP request headers to send. See PolymerElements/iron-ajax for
   * more details. Only works when `allowRedirect` is false.
   */
  @property({ type: Object })
  headers = {};

  @property({ type: Boolean })
  withCredentials = false;

  @property({ type: String })
  action: string | undefined;

  _form: HTMLFormElement | undefined;
  _defaults: WeakMap<HTMLInputElement | HTMLFormElement, object> | undefined;

  static get style() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  render() {
    return html`
      <!-- This form is used to collect the elements that should be submitted -->
      <slot></slot>

      <!-- This form is used for submission -->
      <form id="helper"></form>
    `;
  }

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
  connectedCallback() {
    super.connectedCallback();
    // We might have been detached then re-attached.
    // Avoid searching again for the <form> if we already found it.
    if (this._form) {
      return;
    }
    // Search for the `<form>`, if we don't find it, observe for
    // mutations.
    this._form = this.$$('form') as HTMLFormElement;
    if (this._form) {
      this._init();
      // Since some elements might not be upgraded yet at this time,
      // we won't be able to look into their shadowRoots for submittables.
      // We wait a tick and check again for any missing submittable default
      // values.
      window.setTimeout(this._saveInitialValues.bind(this), 1);
    } else {
      console.error('No form element found');
    }
  }

  /**
   * @return {void}
   * @override
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _init() {
    this._form!.addEventListener('submit', this.submit.bind(this));
    this._form!.addEventListener('reset', this.reset.bind(this));

    // Save the initial values.
    this._defaults = this._defaults || new WeakMap();
    this._saveInitialValues();
  }

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
  saveResetValues() {
    this._saveInitialValues(true);
  }

  /**
   * @param {boolean=} overwriteValues
   * @return {void}
   */
  _saveInitialValues(overwriteValues = false) {
    const nodes = this._getValidatableElements();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!this._defaults!.has(node) || overwriteValues) {
        // Submittables are expected to have `value` property,
        // that's what gets serialized.
        const defaults = { value: node.value, checked: false, invalid: false };
        if ('checked' in node) {
          defaults.checked = node.checked;
        }
        // In 1.x yp-form would reset `invalid`, so
        // keep it here for backwards compat.
        if ('invalid' in node) {
          defaults.invalid = node.invalid;
        }
        this._defaults!.set(node, defaults);
      }
    }
  }

  /**
   * Validates all the required elements (custom and native) in the form.
   * @return {boolean} True if all the elements are valid.
   */
  validate() {
    // If you've called this before distribution happened, bail out.
    if (!this._form) {
      return false;
    }

    if (this._form.getAttribute('novalidate') === '') return true;

    // Start by making the form check the native elements it knows about.
    let valid = this._form.checkValidity();
    const elements = this._getValidatableElements();

    // Go through all the elements, and validate the custom ones.
    for (let el, i = 0; (el = elements[i]), i < elements.length; i++) {
      // This is weird to appease the compiler. We assume the custom element
      // has a validate() method, otherwise we can't check it.
      const validatable = /** @type {{validate: (function() : boolean)}} */ el;
      if (validatable.validate) {
        valid = !!validatable.validate() && valid;
      }
    }
    return valid;
  }

  /**
   * Submits the form.
   *
   * @param {Event=} event
   * @return {void}
   */
  submit(event: CustomEvent) {
    // We are not using this form for submission, so always cancel its event.
    if (event) {
      event.preventDefault();
    }

    // If you've called this before distribution happened, bail out.
    if (!this._form) {
      return;
    }

    if (!this.validate()) {
      this.dispatchEvent(
        new CustomEvent('yp-form-invalid', { bubbles: true, composed: true })
      );
      return;
    }

    // Remove any existing children in the submission form (from a previous
    // submit).
    this.$$('#helper')!.textContent = '';

    const json = this.serializeForm();

    // If we want a redirect, submit the form natively.
    if (this.allowRedirect) {
      // If we're submitting the form natively, then create a hidden element for
      // each of the values.
      for (const element in json) {
        this.$$('#helper')!.appendChild(
          this._createHiddenElement(element, json[element])
        );
      }

      // Copy the original form attributes.
      const formHelper = this.$$('#helper') as HTMLFormElement;
      formHelper.action = this._form.getAttribute('action') || '';
      formHelper.method = this._form.getAttribute('method') || 'GET';
      formHelper.contentType =
        this._form.getAttribute('enctype') ||
        'application/x-www-form-urlencoded';

      formHelper.submit();
      this.dispatchEvent(
        new CustomEvent('yp-form-submit', { bubbles: true, composed: true })
      );
    } else {
      this._makeAjaxRequest(json);
    }
  }

  /**
   * Resets the form to the default values.
   *
   * @param {Event=} event
   * @return {void}
   */
  reset(event: CustomEvent) {
    // We are not using this form for submission, so always cancel its event.
    if (event) event.preventDefault();

    // If you've called this before distribution happened, bail out.
    if (!this._form) {
      return;
    }

    // Ensure the native form fired the `reset` event.
    // User might have bound `<button on-click="_resetIronForm">`, or directly
    // called `ironForm.reset()`. In these cases we want to first reset the
    // native form.
    if (!event || event.type !== 'reset' || event.target !== this._form) {
      this._form.reset();
      return;
    }

    // Load the initial values.
    const nodes = this._getValidatableElements();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (this._defaults!.has(node)) {
        const defaults = this._defaults!.get(node);
        for (const propName in defaults) {
          node[propName] = defaults[propName];
        }
      }
    }

    this.dispatchEvent(
      new CustomEvent('yp-form-reset', { bubbles: true, composed: true })
    );
  }

  /**
   * Serializes the form as will be used in submission. Note that `serialize`
   * is a Polymer reserved keyword, so calling `someIronForm`.serialize()`
   * will give you unexpected results.
   * @return {!Object<string, *>} An object containing name-value pairs for elements that
   *                  would be submitted.
   */
  serializeForm() {
    // Only elements that have a `name` and are not disabled are submittable.
    const elements = this._getSubmittableElements();
    const json = {};
    for (let i = 0; i < elements.length; i++) {
      const values = this._serializeElementValues(elements[i]);
      for (let v = 0; v < values.length; v++) {
        this._addSerializedElement(json, elements[i].name, values[v]);
      }
    }
    return json;
  }

  _handleFormResponse(event: CustomEvent) {
    this.fire('yp-form-response', event.detail);
  }

  _handleFormError(event: CustomEvent) {
    this.fire('yp-form-error', event.detail);
  }

  _makeAjaxRequest(json) {
    // Initialize the iron-ajax element if we haven't already.
    if (!this.request) {
      this.request = document.createElement('iron-ajax');
      this.request.addEventListener(
        'response',
        this._handleFormResponse.bind(this)
      );
      this.request.addEventListener('error', this._handleFormError.bind(this));
    }

    // Native forms can also index elements magically by their name (can't make
    // this up if I tried) so we need to get the correct attributes, not the
    // elements with those names.
    this.request.url = this._form.getAttribute('action');
    this.request.method = this._form.getAttribute('method') || 'GET';
    this.request.contentType =
      this._form.getAttribute('enctype') || 'application/x-www-form-urlencoded';
    this.request.withCredentials = this.withCredentials;
    this.request.headers = this.headers;

    if (this._form.method.toUpperCase() === 'POST') {
      this.request.body = json;
    } else {
      this.request.params = json;
    }

    this.request.generateRequest();

    this.dispatchEvent(
      new CustomEvent('yp-form-submit', {
        detail: json,
        bubbles: true,
        composed: true,
      })
    );
  }

  _getValidatableElements() {
    return this._findElements(
      this._form,
      true /* ignoreName */,
      false /* skipSlots */
    );
  }

  _getSubmittableElements() {
    return this._findElements(
      this._form,
      false /* ignoreName */,
      false /* skipSlots */
    );
  }

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
  _findElements(
    parent: HTMLElement,
    ignoreName: boolean,
    skipSlots: boolean,
    submittable: HTMLInputElement[] | undefined
  ) {
    submittable = submittable || [];
    const nodes = (dom(parent) as DomApi).querySelectorAll('*');
    for (let i = 0; i < nodes.length; i++) {
      // An element is submittable if it is not disabled, and if it has a
      // name attribute.
      if (
        !skipSlots &&
        (nodes[i].localName === 'slot' || nodes[i].localName === 'content')
      ) {
        this._searchSubmittableInSlot(submittable, nodes[i], ignoreName);
      } else {
        this._searchSubmittable(submittable, nodes[i], ignoreName);
      }
    }
    return submittable;
  }

  /**
   * Traverse the distributed nodes of a slot or content element
   * and add all submittable nodes to `submittable`.
   * @param  {!Array<!Node>} submittable Reference to the array of submittables
   * @param  {!Node} node The slot or content node
   * @param  {!boolean} ignoreName  Whether the name of the submittable nodes should be disregarded
   * @return {void}
   * @private
   */
  _searchSubmittableInSlot(
    submittable: HTMLInputElement[],
    node: HTMLElement,
    ignoreName: boolean
  ) {
    const assignedNodes = (dom(node) as DomApi).getDistributedNodes();

    for (let i = 0; i < assignedNodes.length; i++) {
      if (assignedNodes[i].nodeType === Node.TEXT_NODE) {
        continue;
      }

      // Note: assignedNodes does not contain <slot> or <content> because
      // getDistributedNodes flattens the tree.
      this._searchSubmittable(submittable, assignedNodes[i], ignoreName);
      const nestedAssignedNodes = (dom(assignedNodes[i]) as DomApi).querySelectorAll('*');
      for (let j = 0; j < nestedAssignedNodes.length; j++) {
        this._searchSubmittable(
          submittable,
          nestedAssignedNodes[j],
          ignoreName
        );
      }
    }
  }

  /**
   * Traverse the distributed nodes of a slot or content element
   * and add all submittable nodes to `submittable`.
   * @param  {!Array<!Node>} submittable Reference to the array of submittables
   * @param  {!Node} node The node to be
   * @param  {!boolean} ignoreName  Whether the name of the submittable nodes should be disregarded
   * @return {void}
   * @private
   */
  _searchSubmittable(
    submittable: HTMLInputElement[] | undefined,
    node: HTMLInputElement,
    ignoreName: boolean
  ) {
    if (this._isSubmittable(node, ignoreName)) {
      submittable!.push(node);
    } else if (node.root) {
      this._findElements(
        node.root,
        ignoreName,
        true /* skipSlots */,
        submittable
      );
    }
  }

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
  _isSubmittable(node: HTMLInputElement, ignoreName: boolean) {
    return (
      !node.disabled &&
      (ignoreName
        ? node.name || typeof node.validate === 'function'
        : node.name)
    );
  }

  _serializeElementValues(element: HTMLInputElement) {
    // We will assume that every custom element that needs to be serialized
    // has a `value` property, and it contains the correct value.
    // The only weird one is an element that implements
    // IronCheckedElementBehaviour, in which case like the native checkbox/radio
    // button, it's only used when checked. For native elements, from
    // https://www.w3.org/TR/html5/forms.html#the-form-element. Native
    // submittable elements: button, input, keygen, object, select, textarea;
    // 1. We will skip `keygen and `object` for this iteration, and deal with
    // them if they're actually required.
    // 2. <button> and <textarea> have a `value` property, so they behave like
    //    the custom elements.
    // 3. <select> can have multiple options selected, in which case its
    //    `value` is incorrect, and we must use the values of each of its
    //    `selectedOptions`
    // 4. <input> can have a whole bunch of behaviours, so it's handled
    // separately.
    // 5. Buttons are hard. The button that was clicked to submit the form
    //    is the one who's name/value gets sent to the server.
    const tag = element.tagName.toLowerCase();
    if (
      tag === 'button' ||
      (tag === 'input' &&
        (element.type === 'submit' || element.type === 'reset'))
    ) {
      return [];
    }

    if (tag === 'select') {
      return this._serializeSelectValues(element);
    } else if (tag === 'input') {
      return this._serializeInputValues(element);
    } else {
      if (!element.checked) return [];
      return [element.value];
    }
  }

  _serializeSelectValues(element: HTMLInputElement) {
    const values = [];

    // A <select multiple> has an array of options, some of which can be
    // selected.
    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].selected) {
        values.push(element.options[i].value);
      }
    }
    return values;
  }

  _serializeInputValues(element: HTMLInputElement) {
    // Most of the inputs use their 'value' attribute, with the exception
    // of radio buttons, checkboxes and file.
    const type = element.type.toLowerCase();

    // Don't do anything for unchecked checkboxes/radio buttons.
    // Don't do anything for file, since that requires a different request.
    if (
      ((type === 'checkbox' || type === 'radio') && !element.checked) ||
      type === 'file'
    ) {
      return [];
    }
    return [element.value];
  }

  _createHiddenElement(name: string, value: string) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    return input;
  }

  _addSerializedElement(json: Record<string, Array<string> | string | string[] | Array<Array<string>>  >, name: string, value: string) {
    // If the name doesn't exist, add it. Otherwise, serialize it to
    // an array,
    if (json[name] === undefined) {
      json[name] = value;
    } else {
      if (!Array.isArray(json[name])) {
        const ar = [];
        ar.push(json[name]);
        json[name] = ar as Array<string>;
      }
      (json[name] as Array<string>).push(value);
    }
  }
}
