# YpUserWithOrganization

A web component that displays user information along with their organization details, including an optional image.

## Properties

| Name          | Type      | Description                                                                 |
|---------------|-----------|-----------------------------------------------------------------------------|
| user          | YpUserData | The user data object containing user information.                           |
| titleDate     | Date \| undefined | The date used to generate a title for the user.                          |
| hideImage     | boolean   | Determines whether the user image should be hidden.                         |
| mediumImage   | boolean   | Determines whether the user image should be displayed in medium size.       |
| inverted      | boolean   | Determines whether the text should be displayed in an inverted style.       |

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| userTitle             | None       | string      | Computes the title for the user based on the user's name and titleDate.     |
| organizationName      | None       | string \| null | Retrieves the name of the organization associated with the user.             |
| organizationImageUrl  | None       | string \| undefined | Retrieves the URL of the organization's image associated with the user.       |

## Examples

```typescript
// Example usage of the yp-user-with-organization component
import './yp-user-with-organization.js';

const userElement = document.createElement('yp-user-with-organization');
userElement.user = {
  name: 'John Doe',
  OrganizationUsers: [
    {
      name: 'Acme Corp',
      OrgLogoImgs: [
        {
          formats: {
            thumbnail: { url: 'https://example.com/logo-thumbnail.png' },
            medium: { url: 'https://example.com/logo-medium.png' }
          }
        }
      ]
    }
  ]
};
userElement.titleDate = new Date();
userElement.hideImage = false;
userElement.mediumImage = true;
userElement.inverted = false;

document.body.appendChild(userElement);
```

This component extends `YpBaseElement` and uses `yp-user-image` to display user images. It also utilizes `YpMediaHelpers` to fetch image URLs. The component is styled using CSS and supports responsive design for different screen sizes.