# YpUserImage

The `YpUserImage` class is a web component that extends `YpBaseElement` to display user images. It supports various sizes and can source images from a user's profile or Facebook account.

## Properties

| Name            | Type                  | Description                                                                 |
|-----------------|-----------------------|-----------------------------------------------------------------------------|
| veryLarge       | Boolean               | If true, displays the image in a very large size.                           |
| large           | Boolean               | If true, displays the image in a large size.                                |
| titleFromUser   | string \| undefined   | Optional title from the user, used as alt text and tooltip for the image.   |
| user            | YpUserData            | The user data object containing information about the user.                 |
| noDefault       | Boolean               | If true, does not display a default image when no profile image is present. |
| noProfileImage  | Boolean               | Indicates whether a profile image is present or not.                        |

## Methods

| Name            | Parameters | Return Type | Description                                                                                   |
|-----------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| userTitle       |            | string      | Returns the title for the user, which is either `titleFromUser` or the user's name.          |
| profileImageUrl |            | string \| null | Returns the URL of the user's profile image or null if no image is available.                |
| computeClass    |            | string      | Computes the CSS class for the image based on the `large` and `veryLarge` property values.   |
| computeFacebookSrc |        | string \| undefined | Returns the Facebook profile image URL or undefined if not available.                        |

## Examples

```typescript
// Example usage of the YpUserImage web component
<yp-user-image
  .user="${yourUserData}"
  .titleFromUser="${'User Title'}"
  large
></yp-user-image>
```

Replace `yourUserData` with an instance of `YpUserData` containing the user's information.