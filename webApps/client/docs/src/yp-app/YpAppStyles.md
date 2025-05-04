# YpAppStyles

A set of global CSS styles for the Yp web application, defined using the Lit `css` template tag. These styles are intended to be shared across the application to provide consistent layout, theming, and component appearance.

## Properties

| Name         | Type   | Description                                                                                 |
|--------------|--------|---------------------------------------------------------------------------------------------|
| YpAppStyles  | CSSResult | A Lit `css` template literal containing the global styles for the Yp application.         |

## Methods

_None_

## Events

_None_

## Examples

```typescript
import { YpAppStyles } from './YpAppStyles.js';
import { css, LitElement } from 'lit';

class MyComponent extends LitElement {
  static styles = [
    YpAppStyles,
    css`
      /* Additional component-specific styles */
    `
  ];
}
```

---

**Style Highlights:**
- Sets up a flex column layout for the root host with `min-height: 100vh`.
- Provides utility classes such as `.userIcon`, `.activeBadge`, `.closeButton`, and `.loadingAppSpinnerPage`.
- Styles for custom elements like `yp-user-info`, `yp-language-selector`, `yp-user-image`, `yp-top-app-bar`, `yp-admin-app`, and `yp-promotion-app`.
- Responsive adjustments for `yp-top-app-bar` on small screens.
- Theming variables for Material Design components (e.g., dialog, badge, button).
- Transition effects for loading spinners and app switching.
- Hides elements with the `[hidden]` attribute.

**Note:**  
This export is a CSSResult object and is intended to be used in the `static styles` property of LitElement-based components.