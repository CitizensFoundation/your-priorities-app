# YpUserWithOrganization

A custom element that displays a user with their associated organization information, including the user's image, name, and organization name and logo.

## Properties

| Name          | Type                | Description                                       |
|---------------|---------------------|---------------------------------------------------|
| user          | YpUserData          | The user data to display.                         |
| titleDate     | Date \| undefined   | The date to use in the user title.                |
| hideImage     | boolean             | Whether to hide the user and organization images. |
| inverted      | boolean             | Whether to invert the styles for the name and organization name. |

## Methods

| Name              | Parameters | Return Type | Description |
|-------------------|------------|-------------|-------------|
| userTitle         |            | string      | Computes a title for the user based on their name and the title date. |
| organizationName  |            | string \| null | Retrieves the name of the user's organization if available. |
| organizationImageUrl |        | string \| undefined | Retrieves the URL of the organization's logo image if available. |

## Events

- No custom events are emitted by this component.

## Examples

```typescript
// Example usage of the YpUserWithOrganization component
import { YpUserWithOrganization } from './yp-user-with-organization.js';

// Assuming you have a user object with the necessary structure
const user: YpUserData = {
  name: 'Jane Doe',
  OrganizationUsers: [
    {
      name: 'Organization Name',
      OrganizationLogoImages: [
        {
          formats: [
            // Image formats here
          ]
        }
      ]
    }
  ]
};

// Create an instance of the component
const userWithOrgElement = document.createElement('yp-user-with-organization') as YpUserWithOrganization;
userWithOrgElement.user = user;
userWithOrgElement.titleDate = new Date();
userWithOrgElement.hideImage = false;
userWithOrgElement.inverted = false;

// Append the component to the DOM
document.body.appendChild(userWithOrgElement);
```

Please note that the `YpUserData` type and the structure of the user object should be defined elsewhere in your codebase to match the expected format used by the `YpUserWithOrganization` component.