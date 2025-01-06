# YpDomain

The `YpDomain` class is a custom web component that extends the `YpCollection` class. It is designed to manage and display domain-specific data, including handling user login, rendering domain headers, and managing domain-specific configurations.

## Properties

| Name                | Type      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| customWelcomeHtml   | string \| undefined | Custom HTML content to display as a welcome message instead of the communities list. |
| useEvenOddItemLayout | boolean   | Determines if the even-odd item layout should be used. Defaults to `true`.  |

## Methods

| Name                          | Parameters | Return Type | Description                                                                 |
|-------------------------------|------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | None       | void        | Initializes a new instance of the `YpDomain` class with default settings.   |
| static get styles             | None       | CSSResult[] | Returns the styles specific to the `YpDomain` component.                    |
| refresh                       | None       | Promise<void> | Refreshes the domain data and updates the component state accordingly.      |
| scrollToCommunityItem         | None       | void        | Scrolls to a specific community item based on the current tab selection.    |
| scrollToCollectionItemSubClass | None       | void        | Scrolls to a specific collection item within the subclass.                  |
| _forgotPassword               | None       | void        | Opens the forgot password dialog.                                           |
| renderHeader                  | None       | TemplateResult | Renders the domain header if applicable.                                    |
| renderAssistantTab            | None       | TemplateResult | Renders the assistant tab with an icon.                                     |
| renderDomainLogin             | None       | TemplateResult | Renders the domain login interface if the user is not logged in.            |
| render                        | None       | TemplateResult | Renders the component based on the current state and configuration.         |

## Examples

```typescript
// Example usage of the YpDomain component
import './yp-domain.js';

const domainElement = document.createElement('yp-domain');
document.body.appendChild(domainElement);

// Set custom welcome HTML
domainElement.customWelcomeHtml = '<h1>Welcome to our community!</h1>';
```