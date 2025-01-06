# YpConfigurationSubmitted

The `YpConfigurationSubmitted` class is a custom web component that extends `YpBaseElement`. It is used to display a confirmation message when a configuration is submitted.

## Properties

| Name | Type | Description |
|------|------|-------------|
| None |      |             |

## Methods

| Name   | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| render |            | TemplateResult | Renders the HTML template for the component. |

## Examples

```typescript
// Example usage of the yp-configuration-submitted component
import './path/to/yp-configuration-submitted.js';

const element = document.createElement('yp-configuration-submitted');
document.body.appendChild(element);
```

This component does not have any properties or events. It primarily focuses on rendering a styled confirmation message using the Lit library. The styles are defined using the `static styles` getter, and the HTML structure is defined in the `render` method.