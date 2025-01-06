# YpAppStyles

This module defines the CSS styles for the YpApp web component, which is part of the Citizens Foundation's application. The styles are implemented using the `lit` library's `css` function, providing a structured and maintainable way to apply styles to the component.

## Properties

| Name                          | Type   | Description                                                                 |
|-------------------------------|--------|-----------------------------------------------------------------------------|
| `:host`                       | CSS    | Styles applied to the host element, setting the minimum height and layout.  |
| `main`                        | CSS    | Styles for the main content area, allowing it to grow and fill available space. |
| `.activeBadge`                | CSS    | Styles for the active badge, including color variables for different states. |
| `yp-user-info`                | CSS    | Styles for the user info component, adding a top margin.                    |
| `yp-language-selector`        | CSS    | Styles for the language selector component, adding margin around it.        |
| `.userImageNotificationContainer` | CSS | Styles for the container holding user image notifications, with side margins. |
| `yp-user-image`               | CSS    | Styles for the user image, setting its dimensions.                          |
| `#leftDrawer`                 | CSS    | Styles for the left drawer, adjusting its left margin.                      |
| `.loadingAppSpinnerPage`      | CSS    | Styles for the loading spinner page, centering content and setting full-screen dimensions. |
| `#userDrawer`                 | CSS    | Styles for the user drawer, fixing its position and setting dimensions.     |
| `#dialog`                     | CSS    | Styles for the dialog, using color variables for customization.             |
| `.errorText`                  | CSS    | Styles for error text, including padding and font size.                     |
| `#errorCloseButton`           | CSS    | Styles for the error close button, using color variables for customization. |
| `yp-admin-app`                | CSS    | Styles for the admin app, setting initial hidden state and transition effects. |
| `yp-promotion-app`            | CSS    | Styles for the promotion app, similar to admin app with transition effects. |
| `.mainPage`                   | CSS    | Styles for the main page, adjusting top margin based on attributes.         |
| `#helpIconButton`             | CSS    | Styles for the help icon button, adding right margin.                       |
| `#navIconButton`              | CSS    | Styles for the navigation icon button, adjusting right margin based on attributes. |
| `.closeButton`                | CSS    | Styles for the close button, controlling visibility and opacity transitions. |
| `yp-top-app-bar`              | CSS    | Styles for the top app bar, centering it and setting maximum width.         |

## Methods

This module does not define any methods.

## Events

This module does not emit any events.

## Examples

```typescript
// Import the styles into a LitElement component
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