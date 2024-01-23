# ShadowStyles

The `ShadowStyles` is a CSS module that provides shadow effect styles that can be applied to elements to give them elevation and depth using box shadows. These styles are designed to be used with the `lit` library's `css` tagged template literal for styling web components.

## Properties

There are no properties for this module as it is a collection of CSS class styles.

## Methods

There are no methods for this module as it is a collection of CSS class styles.

## Events

There are no events for this module as it is a collection of CSS class styles.

## Examples

```typescript
import { ShadowStyles } from './path-to-ShadowStyles';

// Apply the shadow style to a LitElement
class MyCustomElement extends LitElement {
  static styles = [ShadowStyles];

  render() {
    return html`
      <div class="shadow-elevation-4dp">This element has a shadow.</div>
    `;
  }
}
```

In the example above, the `MyCustomElement` class imports the `ShadowStyles` and applies it to its static `styles` property. The `render` method then uses the class `shadow-elevation-4dp` to apply a shadow effect to a `div` element.