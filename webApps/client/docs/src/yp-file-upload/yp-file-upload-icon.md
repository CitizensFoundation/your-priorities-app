# YpFileUploadIcon

`YpFileUploadIcon` is a custom web component that extends `YpFileUpload`, providing a file upload button with an icon. It uses Material Design components to render an outlined icon button that users can interact with to upload files.

## Properties

| Name        | Type   | Description                                       |
|-------------|--------|---------------------------------------------------|
| buttonIcon  | String | The name of the icon to be displayed on the button. Overrides the default icon from `YpFileUpload`. |

## Methods

| Name         | Parameters | Return Type | Description |
|--------------|------------|-------------|-------------|
| render       | -          | TemplateResult | Generates a template for the component's HTML structure. |
| _fileClick   | -          | void        | Handles the click event on the button, triggering the file input click. |
| _fileChange  | -          | void        | Handles the change event on the file input, processing the selected files. |

## Events

- **None specific to `YpFileUploadIcon`**: Inherits events from `YpFileUpload`.

## Examples

```typescript
// Example usage of the YpFileUploadIcon component
<yp-file-upload-icon
  .buttonIcon="file_upload"
  .buttonText="Upload File"
  .accept="image/*"
  .multi=${true}
  @file-upload-change=${this.handleFileChange}
></yp-file-upload-icon>
```

Note: The `@file-upload-change` event listener should be implemented to handle the file change event, which is not detailed here as it is part of the inherited `YpFileUpload` component.