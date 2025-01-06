# PsAgentConnector

The `PsAgentConnector` class is a custom web component that extends `PsOperationsBaseNode`. It represents a connector node with various properties and methods to manage and render the connector's data and links.

## Properties

| Name                      | Type                          | Description                                                                 |
|---------------------------|-------------------------------|-----------------------------------------------------------------------------|
| hasStaticTheme            | boolean                       | Reflects whether the component has a static theme.                          |
| connector                 | PsAgentConnectorAttributes    | The attributes of the connector.                                            |
| connectorId               | number                        | The unique identifier for the connector.                                    |
| groupId                   | number                        | The unique identifier for the group associated with the connector.          |
| agentName                 | string                        | The name of the agent associated with the connector.                        |
| internalLink              | string \| undefined           | The internal link associated with the connector, if any.                    |
| externalLink              | string \| undefined           | The external link associated with the connector, if any.                    |
| openInternalLinkInNewTab  | boolean                       | Determines if the internal link should open in a new tab. Defaults to true. |

## Methods

| Name               | Parameters | Return Type | Description                                                                 |
|--------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback  | None       | void        | Lifecycle method called when the component is added to the document.        |
| editNode           | None       | void        | Fires an event to edit the node with the current connector data.            |
| toggleMenu         | None       | void        | Toggles the visibility of the menu associated with the component.           |
| renderImage        | None       | TemplateResult | Renders the image associated with the connector.                            |
| openInternalLink   | None       | void        | Opens the internal link in a new tab or redirects within the same tab.      |
| openExternalLink   | None       | void        | Opens the external link in a new tab.                                       |
| render             | None       | TemplateResult | Renders the component's HTML template.                                      |

## Examples

```typescript
// Example usage of the PsAgentConnector web component
import './ps-connector-node.js';

const connectorNode = document.createElement('ps-connector-node');
connectorNode.connectorId = 123;
connectorNode.groupId = 456;
connectorNode.agentName = 'Agent Smith';
document.body.appendChild(connectorNode);
```