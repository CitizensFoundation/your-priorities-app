# YpFileUploadIcon

The `YpFileUploadIcon` class is a custom web component that extends the `YpFileUpload` component. It provides a file upload interface with an icon button, allowing users to upload files through a simple or outlined icon button.

## Properties

| Name       | Type    | Description                                                                 |
|------------|---------|-----------------------------------------------------------------------------|
| buttonIcon | String  | The icon to be displayed on the button. Defaults to "file_upload".          |
| simple     | Boolean | Determines if the button is a simple icon button or an outlined icon button. |

## Methods

| Name       | Parameters | Return Type | Description                                                                 |
|------------|------------|-------------|-----------------------------------------------------------------------------|
| render     | None       | TemplateResult | Renders the HTML template for the component, choosing between a simple or outlined icon button based on the `simple` property. |

## Examples

```typescript
// Example usage of the yp-file-upload-icon component
import './path/to/yp-file-upload-icon.js';

const fileUploadIcon = document.createElement('yp-file-upload-icon');
fileUploadIcon.buttonIcon = 'cloud_upload';
fileUploadIcon.simple = true;
document.body.appendChild(fileUploadIcon);
```

This component uses the `@material/web/iconbutton` package to render the icon buttons and provides a file input element that is hidden by default. The file input is triggered by clicking the icon button, and it supports multiple file uploads and file type restrictions through inherited properties from `YpFileUpload`.