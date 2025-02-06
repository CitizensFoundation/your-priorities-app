# YpAppStyles

This module exports a set of CSS styles for a web component, designed to provide a consistent and responsive layout for the application. The styles are defined using the `lit` library's `css` function.

## Properties

| Name                             | Type   | Description                                                                 |
|----------------------------------|--------|-----------------------------------------------------------------------------|
| `:host`                          | CSS    | Styles applied to the host element, setting minimum height and flex layout. |
| `.userIcon`                      | CSS    | Styles for user icon size.                                                  |
| `main`                           | CSS    | Styles for the main content area to grow and fill available space.          |
| `.topActionItem`                 | CSS    | Margin styles for top action items.                                         |
| `.activeBadge`                   | CSS    | Styles for active badge elements.                                           |
| `yp-user-info`                   | CSS    | Margin styles for user info component.                                      |
| `yp-language-selector`           | CSS    | Margin styles for language selector component.                              |
| `.userImageNotificationContainer`| CSS    | Margin styles for user image notification container.                        |
| `yp-user-image`                  | CSS    | Dimensions for user image component.                                        |
| `#leftDrawer`                    | CSS    | Margin styles for left drawer.                                              |
| `.loadingAppSpinnerPage`         | CSS    | Styles for loading spinner page, including positioning and visibility.      |
| `#userDrawer`                    | CSS    | Styles for user drawer, including fixed positioning and dimensions.         |
| `#dialog`                        | CSS    | Color styles for dialog components.                                         |
| `.errorText`                     | CSS    | Padding and font styles for error text.                                     |
| `#errorCloseButton`              | CSS    | Color styles for error close button.                                        |
| `yp-admin-app`                   | CSS    | Positioning and transition styles for admin app component.                  |
| `yp-promotion-app`               | CSS    | Positioning and transition styles for promotion app component.              |
| `.mainPage`                      | CSS    | Margin styles for main page, with conditional styling for agent bundle.     |
| `#helpIconButton`                | CSS    | Margin styles for help icon button.                                         |
| `#navIconButton`                 | CSS    | Margin styles for navigation icon button, conditional on organization state.|
| `.closeButton`                   | CSS    | Visibility and transition styles for close button.                          |
| `yp-top-app-bar`                 | CSS    | Max-width and margin styles for top app bar, with responsive adjustments.   |

## Methods

This module does not define any methods.

## Events

This module does not emit any events.

## Examples

```typescript
// Importing and using the YpAppStyles in a LitElement component
import { LitElement, html } from 'lit';
import { YpAppStyles } from './YpAppStyles.js';

class MyApp extends LitElement {
  static styles = [YpAppStyles];

  render() {
    return html`
      <div class="mainPage">
        <yp-top-app-bar></yp-top-app-bar>
        <main>
          <!-- Main content goes here -->
        </main>
      </div>
    `;
  }
}

customElements.define('my-app', MyApp);
```