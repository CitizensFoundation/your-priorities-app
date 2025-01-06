# YpAgentBundle

The `YpAgentBundle` class is a custom web component that extends `YpBaseElementWithLogin`. It is designed to manage user login states and render a user interface with specific styles and behaviors.

## Properties

| Name            | Type    | Description                                                                 |
|-----------------|---------|-----------------------------------------------------------------------------|
| domainId        | number  | The domain ID associated with the component, extracted from the `subRoute`. |
| subRoute        | string  | An optional sub-route string used to determine the `domainId`.               |
| loggedInChecked | boolean | A flag indicating whether the login state has been checked.                 |

## Methods

| Name         | Parameters                                      | Return Type | Description                                                                                     |
|--------------|-------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------|
| updated      | changedProperties: Map<string \| number \| symbol, unknown> | void        | Overrides the `updated` lifecycle method to update the `domainId` based on changes to `subRoute`. |
| _loggedIn    | event: CustomEvent                              | void        | Handles the login event, checking access tokens and updating the login state.                   |
| renderLogo   |                                                 | TemplateResult | Renders the logo based on the current theme mode.                                               |
| render       |                                                 | TemplateResult | Renders the component's HTML structure.                                                         |

## Examples

```typescript
import './yp-agent-bundle.js';

const agentBundle = document.createElement('yp-agent-bundle');
agentBundle.domainId = 123;
agentBundle.subRoute = '/path/to/resource';
document.body.appendChild(agentBundle);
```

This example demonstrates how to create and use the `YpAgentBundle` component, setting its `domainId` and `subRoute` properties.