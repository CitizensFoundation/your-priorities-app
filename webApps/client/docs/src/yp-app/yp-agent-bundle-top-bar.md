# YpAgentBundleTopBar

A top bar web component for the agent bundle, providing branding, user login, and notification access. Extends `YpBaseElementWithLogin` and uses Material Web Components for UI elements.

## Properties

| Name                         | Type                        | Description                                                                                 |
|------------------------------|-----------------------------|---------------------------------------------------------------------------------------------|
| domain                       | YpDomainData \| undefined   | The current domain data, updated when the `yp-domain-changed` event is received.            |
| numberOfUnViewedNotifications| string \| undefined         | The number of unviewed notifications to display in the badge.                               |
| page                         | string \| undefined         | The current page identifier, used to determine if the bar is in the agent bundle context.    |
| hasStaticBadgeTheme          | boolean                     | Whether the notification badge uses a static theme. Defaults to `false`.                    |

## Methods

| Name                | Parameters                | Return Type     | Description                                                                                 |
|---------------------|--------------------------|-----------------|---------------------------------------------------------------------------------------------|
| inForAgentBundle    | none                     | boolean         | Returns `true` if the top bar is being shown for the agent bundle context.                  |
| updated             | changedProperties: PropertyValues | void            | Lifecycle method called when properties are updated. Calls super and handles title changes.  |
| connectedCallback   | none                     | void            | Lifecycle method called when the element is added to the DOM. Adds a global event listener.  |
| renderLogo          | none                     | TemplateResult  | Renders the agent bundle logo, switching based on theme.                                     |
| disconnectedCallback| none                     | void            | Lifecycle method called when the element is removed from the DOM. Removes event listeners.   |
| _onDomainChanged    | event: CustomEvent       | void            | Handles the `yp-domain-changed` event and updates the domain property if changed.            |
| _login              | none                     | void            | Handles login logic, redirecting or opening the login dialog as appropriate.                 |
| renderUser          | none                     | TemplateResult \| typeof nothing | Renders the user section: login button or user icon with notification badge.                |
| render              | none                     | TemplateResult  | Main render method for the component.                                                        |

## Events

- **open-notification-drawer**: Fired when the notification icon is clicked, to open the notification drawer.
- **open-user-drawer**: Fired when the user icon is clicked, to open the user drawer.

## Examples

```typescript
import './yp-agent-bundle-top-bar.js';

html`
  <yp-agent-bundle-top-bar
    .numberOfUnViewedNotifications=${"3"}
    .page=${"dashboard"}
    .hasStaticBadgeTheme=${true}
  ></yp-agent-bundle-top-bar>
`;
```
