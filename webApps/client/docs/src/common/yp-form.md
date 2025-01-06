# YpForm

`<yp-form>` is a web component that acts as a wrapper around the HTML `<form>` element. It is designed to validate and submit both custom and native HTML elements. This component is a breaking change from yp-form 1.0, which was a type extension.

## Properties

| Name    | Type                  | Description                                                                 |
|---------|-----------------------|-----------------------------------------------------------------------------|
| headers | Record<string, string> | HTTP request headers to send. Only works when `allowRedirect` is false.     |

## Methods

| Name                | Parameters                      | Return Type | Description                                                                 |
|---------------------|---------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback   |                                 | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback|                                 | void        | Lifecycle method called when the element is removed from the document.      |
| saveResetValues     |                                 | void        | Saves the values of all form elements for resetting the form.               |
| validate            |                                 | boolean     | Validates all required elements in the form. Returns true if all are valid. |
| submit              | event?: CustomEvent             | Promise<void> | Submits the form.                                                           |
| reset               | event: CustomEvent              | void        | Resets the form to the default values.                                      |
| serializeForm       |                                 | Record<string, *> | Serializes the form as it will be used in submission.                       |

## Events

- **yp-form-invalid**: Fired if the form cannot be submitted because it's invalid.
- **yp-form-submit**: Fired after the form is submitted.
- **yp-form-presubmit**: Fired before the form is submitted.
- **yp-form-reset**: Fired after the form is reset.
- **yp-form-response**: Fired after the form is submitted and a response is received. An IronRequestElement is included as the event.detail object.
- **yp-form-error**: Fired after the form is submitted and an error is received. An error message is included in event.detail.error and an IronRequestElement is included in event.detail.request.

## Examples

```typescript
import { html, LitElement } from 'lit';
import './yp-form.js';

class MyFormComponent extends LitElement {
  render() {
    return html`
      <yp-form>
        <input type="text" name="username" required>
        <input type="password" name="password" required>
        <button type="submit">Submit</button>
      </yp-form>
    `;
  }
}

customElements.define('my-form-component', MyFormComponent);
```

This example demonstrates how to use the `<yp-form>` component to wrap a form with input fields for username and password, and a submit button.