# YpAgentBundleTopBar

`YpAgentBundleTopBar` is a custom web component that extends `YpBaseElementWithLogin`. It represents a top bar for an agent bundle interface, providing functionalities such as displaying a logo, handling user login, and showing notifications.

## Properties

| Name                        | Type     | Description                                                                 |
|-----------------------------|----------|-----------------------------------------------------------------------------|
| `numberOfUnViewedNotifications` | `string \| undefined` | The number of notifications that have not been viewed by the user.          |
| `page`                      | `string \| undefined` | The current page identifier.                                                |
| `hasStaticBadgeTheme`       | `boolean`| Indicates if the static badge theme is applied. Default is `false`.         |

## Methods

| Name                | Parameters                  | Return Type   | Description                                                                 |
|---------------------|-----------------------------|---------------|-----------------------------------------------------------------------------|
| `get inForAgentBundle` | None                        | `boolean`     | Determines if the component is in the context of an agent bundle.           |
| `updated`           | `changedProperties: PropertyValues` | `void`        | Lifecycle method called when properties are updated.                        |
| `connectedCallback` | None                        | `void`        | Lifecycle method called when the component is added to the document.        |
| `renderLogo`        | None                        | `TemplateResult` | Renders the logo of the agent bundle.                                       |
| `disconnectedCallback` | None                        | `void`        | Lifecycle method called when the component is removed from the document.    |
| `_onDomainChanged`  | `event: CustomEvent`        | `void`        | Handles the domain change event and updates the domain property.            |
| `_login`            | None                        | `void`        | Handles the login action based on the domain configuration and user state.  |
| `renderUser`        | None                        | `TemplateResult \| typeof nothing` | Renders the user interface or login button based on the login state.        |
| `render`            | None                        | `TemplateResult` | Renders the entire top bar component.                                       |

## Events

- **yp-domain-changed**: Triggered when the domain changes, updating the internal domain state.

## Examples

```typescript
// Example usage of the YpAgentBundleTopBar component
import './path/to/yp-agent-bundle-top-bar.js';

const topBar = document.createElement('yp-agent-bundle-top-bar');
document.body.appendChild(topBar);

// Set properties
topBar.numberOfUnViewedNotifications = '5';
topBar.page = 'home';
topBar.hasStaticBadgeTheme = true;
```