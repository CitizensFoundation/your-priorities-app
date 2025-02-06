# YpAgentBundleTopBar

`YpAgentBundleTopBar` is a custom web component that extends `YpBaseElementWithLogin`. It represents a top bar for an agent bundle interface, providing functionalities such as displaying a logo, handling user login, and showing notifications.

## Properties

| Name                        | Type      | Description                                                                 |
|-----------------------------|-----------|-----------------------------------------------------------------------------|
| `numberOfUnViewedNotifications` | `string \| undefined` | The number of notifications that have not been viewed by the user.          |
| `page`                      | `string \| undefined` | The current page identifier.                                                |
| `hasStaticBadgeTheme`       | `boolean` | Determines if the badge should have a static theme. Default is `false`.     |

## Methods

| Name                | Parameters                  | Return Type   | Description                                                                 |
|---------------------|-----------------------------|---------------|-----------------------------------------------------------------------------|
| `get inForAgentBundle` | None                        | `boolean`     | Checks if the component is in the context of an agent bundle.               |
| `updated`           | `changedProperties: PropertyValues` | `void`        | Lifecycle method called when properties are updated.                        |
| `connectedCallback` | None                        | `void`        | Lifecycle method called when the component is added to the DOM.             |
| `renderLogo`        | None                        | `TemplateResult` | Renders the logo of the agent bundle.                                       |
| `disconnectedCallback` | None                        | `void`        | Lifecycle method called when the component is removed from the DOM.         |
| `_onDomainChanged`  | `event: CustomEvent`        | `void`        | Handles the `yp-domain-changed` event to update the domain property.        |
| `_login`            | None                        | `void`        | Handles the login process based on the domain configuration.                |
| `renderUser`        | None                        | `TemplateResult \| typeof nothing` | Renders the user interface elements based on the login state.               |
| `render`            | None                        | `TemplateResult` | Renders the entire component.                                               |

## Events

- **`yp-domain-changed`**: Triggered when the domain changes, updating the internal domain state.

## Examples

```typescript
// Example usage of the YpAgentBundleTopBar component
import './yp-agent-bundle-top-bar.js';

const topBar = document.createElement('yp-agent-bundle-top-bar');
document.body.appendChild(topBar);

// Set properties
topBar.numberOfUnViewedNotifications = '5';
topBar.page = 'home';
topBar.hasStaticBadgeTheme = true;
```