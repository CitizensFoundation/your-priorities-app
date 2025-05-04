# YpAgentBundle

A web component that serves as a bundle for the Evoly AI agent interface, handling authentication, domain routing, and rendering the assistant UI. Inherits from `YpBaseElementWithLogin`.

## Properties

| Name                  | Type      | Description                                                                                  |
|-----------------------|-----------|----------------------------------------------------------------------------------------------|
| domainId              | number    | The current domain ID, parsed from the subRoute or set directly.                             |
| subRoute              | string \| undefined | The sub-route string, typically from the URL, used to extract the domain ID.         |
| loggedInChecked       | boolean   | Indicates whether the login check has been performed. Defaults to `false`.                   |
| temporaryAccessIds    | string[]  | List of valid temporary access IDs for alpha access.                                         |
| temporaryAccessIdsOld | string[]  | List of old/legacy temporary access IDs for alpha access.                                    |

## Methods

| Name         | Parameters                | Return Type | Description                                                                                                   |
|--------------|---------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| updated      | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties are updated. Parses `subRoute` to set `domainId` if changed.          |
| _loggedIn    | event: CustomEvent        | void        | Handles login events. Checks for valid access tokens and manages temporary access logic and redirects.         |
| renderLogo   | none                      | unknown     | Renders the Evoly AI logo based on the current theme.                                                         |
| render       | none                      | unknown     | Renders the main layout, including the assistant or a placeholder if `domainId` is not set.                   |

## Examples

```typescript
import "./yp-agent-bundle.js";

const agentBundle = document.createElement("yp-agent-bundle");
agentBundle.domainId = 123;
document.body.appendChild(agentBundle);
```

```html
<yp-agent-bundle domainId="123"></yp-agent-bundle>
```
