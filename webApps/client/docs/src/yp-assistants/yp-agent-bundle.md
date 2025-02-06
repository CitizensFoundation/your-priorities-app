# YpAgentBundle

The `YpAgentBundle` class is a custom web component that extends `YpBaseElementWithLogin`. It is designed to manage the display and functionality of an agent bundle, including handling user login and rendering a logo.

## Properties

| Name            | Type     | Description                                                                 |
|-----------------|----------|-----------------------------------------------------------------------------|
| domainId        | number   | The domain ID associated with the agent bundle.                             |
| subRoute        | string   | An optional sub-route string used to determine the domain ID.               |
| loggedInChecked | boolean  | A flag indicating whether the login status has been checked. Default is `false`. |

## Methods

| Name         | Parameters                                      | Return Type | Description                                                                 |
|--------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated      | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Updates the domain ID based on the `subRoute`. |
| _loggedIn    | event: CustomEvent                              | void        | Handles the login event, checking access tokens and updating login status.  |
| renderLogo   |                                                 | TemplateResult | Renders the logo based on the theme mode.                                    |
| render       |                                                 | TemplateResult | Renders the main layout of the component, including the assistant or a placeholder. |

## Examples

```typescript
// Example usage of the YpAgentBundle web component
import './path/to/yp-agent-bundle.js';

const agentBundle = document.createElement('yp-agent-bundle');
agentBundle.domainId = 123;
agentBundle.subRoute = '/some/sub/route';
document.body.appendChild(agentBundle);
```

This component is styled using CSS to provide a consistent layout and appearance, including a fixed position for certain elements and a responsive design for the assistant and logo. The component also includes a temporary access ID mechanism for managing user access during the alpha phase.