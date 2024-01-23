# YpPostUserImageEdit

`YpPostUserImageEdit` is a custom element that provides a user interface for editing or uploading images related to a post. It extends `YpEditBase` and uses various elements such as `yp-file-upload` and `md-outlined-text-field` to allow users to upload new images, and input metadata such as the photographer's name and a description of the image.

## Properties

| Name                        | Type                  | Description                                                                 |
|-----------------------------|-----------------------|-----------------------------------------------------------------------------|
| image                       | YpImageData \| undefined | The image data object that is being edited.                                 |
| post                        | YpPostData \| undefined   | The post data object associated with the image.                             |
| new                         | Boolean               | A flag indicating whether the image is a new upload or an existing one.     |
| action                      | String                | The API endpoint action URL for the image upload.                           |
| uploadedPostUserImageId     | Number \| undefined   | The ID of the uploaded image.                                               |
| oldUploadedPostUserImageId  | Number \| undefined   | The ID of the previously uploaded image, if any.                            |

## Methods

| Name             | Parameters | Return Type | Description                                                                 |
|------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated          | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the element’s properties have changed.        |
| render           | -          | TemplateResult | Renders the element's HTML template.                                        |
| _postChanged     | -          | void        | Called when the `post` property changes. Sets the upload target URL.        |
| connectedCallback| -          | void        | Lifecycle method called when the element is added to the document’s DOM.    |
| disconnectedCallback | -      | void        | Lifecycle method called when the element is removed from the document’s DOM.|
| _imageChanged    | -          | void        | Called when the `image` property changes. Updates the old image ID.         |
| _formInvalid     | -          | void        | Called when the form is invalid. Currently, it contains commented code.     |
| _imageUploaded   | event: CustomEvent | void | Called when an image is successfully uploaded. Updates the image ID.       |
| clear            | -          | void        | Clears the uploaded image ID and resets the file upload element.            |
| setup            | post: YpPostData, image: YpImageData \| undefined, newNotEdit: boolean, refreshFunction: Function | void | Sets up the element with the provided post, image, and flags. Initializes translations. |

## Events (if any)

- **yp-form-invalid**: Emitted when the form is invalid.

## Examples

```typescript
// Example usage of YpPostUserImageEdit
const postUserImageEdit = document.createElement('yp-post-user-image-edit');
postUserImageEdit.post = somePostData;
postUserImageEdit.image = someImageData;
postUserImageEdit.new = true; // Set to false if editing an existing image
document.body.appendChild(postUserImageEdit);
```

Note: Replace `somePostData` and `someImageData` with actual data objects conforming to `YpPostData` and `YpImageData` types.