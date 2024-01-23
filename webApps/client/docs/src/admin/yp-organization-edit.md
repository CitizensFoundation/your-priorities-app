# YpOrganizationEdit

`YpOrganizationEdit` is a custom web component that extends `YpEditBase` for editing organization details. It allows users to input an organization's name, description, website, and upload a logo image.

## Properties

| Name                   | Type                        | Description                                                                 |
|------------------------|-----------------------------|-----------------------------------------------------------------------------|
| organization           | YpOrganizationData\|undefined | The organization data to be edited.                                         |
| organizationAccess     | string                      | The access level of the organization, defaulting to "public".                |
| domainId               | number\|undefined           | The domain ID associated with the organization.                              |
| action                 | string                      | The API endpoint action for the organization form submission.                |
| uploadedLogoImageId    | number\|undefined           | The ID of the uploaded logo image for the organization.                      |

## Methods

| Name       | Parameters                                  | Return Type | Description                                                                 |
|------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| clear      | none                                        | void        | Clears the organization form and resets the uploaded logo image.            |
| setup      | organization: YpOrganizationData\|undefined, newNotEdit: boolean, refreshFunction: Function | void        | Sets up the component with the provided organization data and state.        |
| setupTranslation | none                                        | void        | Sets up the translation for the edit header text, snackbar text, and save button text based on whether it's a new organization or an edit. |

## Events

- **success**: Emitted when the logo image is successfully uploaded.

## Examples

```typescript
// Example usage of the YpOrganizationEdit component
const organizationEditElement = document.createElement('yp-organization-edit');
organizationEditElement.organization = {
  id: 1,
  name: 'Example Organization',
  description: 'An example organization for demonstration purposes.',
  website: 'https://example.org'
};
organizationEditElement.domainId = 123;
document.body.appendChild(organizationEditElement);

// To clear the form
organizationEditElement.clear();

// To set up the component for a new organization
organizationEditElement.setup(undefined, true, () => console.log('Refresh function called'));

// To set up the component for editing an existing organization
const existingOrganizationData = {
  id: 2,
  name: 'Existing Organization',
  description: 'A pre-existing organization.',
  website: 'https://existing.org'
};
organizationEditElement.setup(existingOrganizationData, false, () => console.log('Refresh function called'));
```