# YpShareDialog

A web component for displaying a share dialog with multiple sharing targets (email, Facebook, Twitter, WhatsApp, LinkedIn). Extends `YpBaseElement` and uses the `share-menu` web component for sharing functionality.

## Properties

| Name                     | Type                | Description                                                                 |
|--------------------------|---------------------|-----------------------------------------------------------------------------|
| haveSharedContentCallback| Function \| undefined | Callback function invoked when the share dialog is closed.                   |
| url                      | string \| undefined | The URL to be shared.                                                        |
| image                    | string \| undefined | The image URL to be shared.                                                  |
| label                    | string \| undefined | The label or title for the shared content.                                   |

## Methods

| Name   | Parameters                                                                                                  | Return Type | Description                                                                                      |
|--------|-------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| open   | url: string, label: string, image: string, haveSharedContentCallback: Function                              | Promise<void> | Opens the share dialog with the specified URL, label, image, and callback for share completion.   |

## Examples

```typescript
import './yp-share-dialog.js';

const shareDialog = document.createElement('yp-share-dialog') as any;

document.body.appendChild(shareDialog);

function onShareClosed() {
  console.log('Share dialog closed or content shared.');
}

shareDialog.open(
  'https://example.com',
  'Check out this link!',
  'https://example.com/image.png',
  onShareClosed
);
```
