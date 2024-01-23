# YpShareDialog

`YpShareDialog` is a custom web component that extends `YpBaseElement` to provide a share dialog functionality. It uses a `share-menu` component to allow users to share content via various platforms such as clipboard, Facebook, Twitter, WhatsApp, email, and LinkedIn.

## Properties

| Name          | Type             | Description                                       |
|---------------|------------------|---------------------------------------------------|
| sharedContent | Function         | A function to be called when the share event occurs. |
| url           | string           | The URL to be shared.                             |
| label         | string           | A label for the share dialog.                     |

## Methods

| Name   | Parameters                                | Return Type | Description                                             |
|--------|-------------------------------------------|-------------|---------------------------------------------------------|
| open   | url: string, label: string, sharedContent: Function | Promise<void> | Opens the share dialog with the provided URL, label, and sharedContent function. |

## Events

- **share**: Emitted when the share action is triggered.

## Examples

```typescript
// Example usage of the YpShareDialog web component
const shareDialog = document.createElement('yp-share-dialog');
document.body.appendChild(shareDialog);

const urlToShare = 'https://example.com';
const shareLabel = 'Check this out!';
const shareFunction = () => {
  console.log('Content shared!');
};

shareDialog.open(urlToShare, shareLabel, shareFunction);
```

Please note that the actual implementation of the `share-menu` component is not provided in the given code snippet, and the `any/*ShareMenu*/` type cast is used as a placeholder for the actual `ShareMenu` type.