# YpOrganizationGrid

The `YpOrganizationGrid` class is a web component that extends `YpBaseElement` and provides a grid interface for managing organizations. It allows users to view, edit, create, and delete organizations within a specified domain.

## Properties

| Name                | Type                     | Description                                                                 |
|---------------------|--------------------------|-----------------------------------------------------------------------------|
| organizations       | Array<any> \| undefined  | An array of organization data to be displayed in the grid.                  |
| headerText          | string \| undefined      | The text to be displayed in the header of the grid.                         |
| domainId            | string \| undefined      | The domain ID used to fetch organizations related to a specific domain.     |
| selected            | any \| undefined         | The currently selected organization.                                        |
| organizationToDeleteId | number \| undefined   | The ID of the organization that is marked for deletion.                     |

## Methods

| Name                      | Parameters                          | Return Type | Description                                                                 |
|---------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | None                                | Promise<void> | Lifecycle method called when the element is added to the document. It initializes the component by calling `refresh()`. |
| refresh                   | None                                | Promise<void> | Fetches the list of organizations for the specified domain and updates the `organizations` property. |
| render                    | None                                | TemplateResult | Renders the HTML template for the component.                                |
| _deleteOrganization       | organization: YpOrganizationData    | void        | Initiates the deletion process for the specified organization.              |
| _reallyDeleteOrganization | None                                | Promise<void> | Confirms and performs the deletion of the organization marked for deletion. |
| _afterEdit                | None                                | void        | Callback function executed after an organization is edited. Refreshes the grid. |
| _createOrganization       | None                                | void        | Opens the dialog to create a new organization.                              |
| _editOrganization         | organization: any                   | void        | Opens the dialog to edit the specified organization.                        |
| _organizationImageUrl     | organization: any                   | string \| null | Returns the URL of the organization's logo image, or null if not available. |

## Examples

```typescript
// Example usage of the YpOrganizationGrid component
import './yp-organization-grid.js';

const organizationGrid = document.createElement('yp-organization-grid');
organizationGrid.domainId = 'exampleDomainId';
document.body.appendChild(organizationGrid);
```