# YpForm

`<yp-form>` is a wrapper around the HTML `<form>` element, that can validate and submit both custom and native HTML elements. Note that this is a breaking change from yp-form 1.0, which was a type extension.

## Properties

| Name     | Type                      | Description                                                                 |
|----------|---------------------------|-----------------------------------------------------------------------------|
| headers  | Record<string, string>    | HTTP request headers to send. Only works when `allowRedirect` is false.     |

## Methods

| Name             | Parameters            | Return Type | Description                                                                 |
|------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback|                       | void        | Lifecycle method that is called when the element is added to the document's DOM. |
| disconnectedCallback|                     | void        | Lifecycle method that is called when the element is removed from the document's DOM. |
| saveResetValues  |                       | void        | Saves the values of all form elements that will be used when resetting the form. |
| validate         |                       | boolean     | Validates all the required elements (custom and native) in the form.       |
| submit           | event?: CustomEvent   | void        | Submits the form.                                                           |
| reset            | event?: CustomEvent   | void        | Resets the form to the default values.                                      |
| serializeForm    |                       | Object      | Serializes the form as will be used in submission.                          |

## Events

- **yp-form-invalid**: Fired if the form cannot be submitted because it's invalid.
- **yp-form-submit**: Fired after the form is submitted.
- **yp-form-presubmit**: Fired before the form is submitted.
- **yp-form-reset**: Fired after the form is reset.
- **yp-form-response**: Fired after the form is submitted and a response is received.
- **yp-form-error**: Fired after the form is submitted and an error is received.

## Examples

```typescript
// Example usage of the web component
<yp-form>
  <!-- Custom and native form elements go here -->
</yp-form>
```

Note: The actual usage of the component would involve more detailed setup including form elements, event listeners, and potentially additional configuration for submission handling.