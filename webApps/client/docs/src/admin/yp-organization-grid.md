# YpOrganizationGrid

`YpOrganizationGrid` is a custom web component that extends `YpBaseElement` to manage and display a grid of organizations. It allows users to create, update, and delete organizations within a specified domain.

## Properties

| Name                   | Type                | Description                                      |
|------------------------|---------------------|--------------------------------------------------|
| organizations          | Array<any> \| undefined | An array of organization objects to be displayed in the grid. |
| headerText             | string \| undefined | The text to be displayed in the header of the grid. |
| domainId               | string \| undefined | The ID of the domain to which the organizations belong. |
| selected               | any \| undefined    | The currently selected organization object.      |
| organizationToDeleteId | number \| undefined | The ID of the organization that is marked for deletion. |

## Methods

| Name                      | Parameters            | Return Type | Description                                                                 |
|---------------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | -                     | Promise<void> | Lifecycle method that refreshes the grid when the component is connected to the DOM. |
| refresh                   | -                     | Promise<void> | Refreshes the list of organizations by fetching updated data from the server. |
| render                    | -                     | unknown     | Renders the HTML template for the grid, including organization items and action buttons. |
| _deleteOrganization       | organization: YpOrganizationData | void        | Initiates the deletion process for a given organization.                     |
| _reallyDeleteOrganization | -                     | Promise<void> | Performs the actual deletion of the organization marked for deletion.        |
| _afterEdit                | -                     | void        | Refreshes the grid after an organization has been edited.                    |
| _createOrganization       | -                     | void        | Opens the dialog to create a new organization.                               |
| _editOrganization         | organization: any     | void        | Opens the dialog to edit an existing organization.                           |
| _organizationImageUrl     | organization: any     | string \| null | Returns the URL of the organization's logo image or null if not available.   |

## Events

- **None specified**

## Examples

```typescript
// Example usage of the YpOrganizationGrid component
<yp-organization-grid
  .organizations="${this.organizations}"
  .headerText="${'Organizations'}"
  .domainId="${this.domainId}"
></yp-organization-grid>
```

Please note that the actual usage may vary depending on the context within which the component is used, and the example provided is for illustration purposes only.