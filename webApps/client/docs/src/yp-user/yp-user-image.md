# YpUserImage

`YpUserImage` is a custom web component that extends `YpBaseElement` to display a user's profile image with various size and styling options.

## Properties

| Name            | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| veryLarge       | Boolean   | Determines if the image should be displayed in a very large size.           |
| large           | Boolean   | Determines if the image should be displayed in a large size.                |
| medium          | Boolean   | Determines if the image should be displayed in a medium size.               |
| titleFromUser   | String    | Optional title to be used for the image, defaults to the user's name if not provided. |
| user            | YpUserData| The user data object containing information about the user.                 |
| noDefault       | Boolean   | If true, no default image will be used when no profile image is available.  |
| noProfileImage  | Boolean   | Indicates if there is no profile image available for the user.              |
| useImageBorder  | Boolean   | If true, a border will be applied to the image.                             |

## Methods

| Name              | Parameters | Return Type | Description                                                                 |
|-------------------|------------|-------------|-----------------------------------------------------------------------------|
| userTitle         | None       | String      | Computes and returns the title for the image based on user data or provided title. |
| profileImageUrl   | None       | String \| null | Computes and returns the URL of the user's profile image, or null if not available. |
| computeClass      | None       | String      | Computes and returns the CSS class for the image based on size properties.  |
| computeFacebookSrc| None       | String \| undefined | Computes and returns the Facebook profile image URL if available.          |

## Examples

```typescript
// Example usage of the yp-user-image component
import './path/to/yp-user-image.js';

const userImageElement = document.createElement('yp-user-image');
userImageElement.user = {
  name: 'John Doe',
  facebook_id: '123456789',
  UserProfileImages: [{ /* image data */ }]
};
userImageElement.large = true;
document.body.appendChild(userImageElement);
```

This component uses the `yp-image` element to render the image and applies different styles based on the properties set. It also handles cases where a Facebook ID is available to fetch the profile picture from Facebook.