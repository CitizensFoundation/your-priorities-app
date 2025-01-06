# YpSetVideoCover

The `YpSetVideoCover` class is a custom web component that allows users to set a cover image for a video from a list of available images or use the main photo as the cover. It extends the `YpBaseElement` class.

## Properties

| Name                     | Type                     | Description                                                                 |
|--------------------------|--------------------------|-----------------------------------------------------------------------------|
| `videoId`                | `number`                 | The ID of the video for which the cover is being set.                       |
| `previewVideoUrl`        | `string \| undefined`    | The URL of the preview video.                                               |
| `videoImages`            | `Array<string> \| undefined` | An array of image URLs available for selection as video covers.             |
| `selectedVideoCoverIndex`| `number`                 | The index of the currently selected video cover image. Defaults to `0`.     |
| `useMainPhotoForVideoCover` | `boolean`             | Indicates whether the main photo is used as the video cover. Defaults to `false`. |
| `noDefaultCoverImage`    | `boolean`                | Indicates whether there is no default cover image available. Defaults to `false`. |

## Methods

| Name                        | Parameters                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `render`                    | None                                            | `TemplateResult` | Renders the component's HTML template.                                      |
| `_classFromImageIndex`      | `index: number`                                 | `string`    | Returns the CSS class for an image based on its index and selection state.  |
| `updated`                   | `changedProperties: Map<string \| number \| symbol, unknown>` | `void`      | Lifecycle method called when properties change. Fetches video metadata if `videoId` changes. |
| `_getVideoMeta`             | None                                            | `Promise<void>` | Asynchronously fetches video metadata including preview URL and images.     |
| `_selectVideoCover`         | `event: CustomEvent`                            | `void`      | Handles the selection of a video cover image and updates the server.        |
| `_selectVideoCoverMainPhoto`| None                                            | `void`      | Handles the selection of the main photo as the video cover and updates the server. |

## Events

- **set-cover**: Emitted when a video cover is selected, with the selected frame index.
- **set-default-cover**: Emitted when the default cover is set or unset, with a boolean indicating the state.

## Examples

```typescript
// Example usage of the YpSetVideoCover component
import './path/to/yp-set-video-cover.js';

const videoCoverElement = document.createElement('yp-set-video-cover');
videoCoverElement.videoId = 123;
document.body.appendChild(videoCoverElement);

videoCoverElement.addEventListener('set-cover', (event) => {
  console.log('Cover set to frame index:', event.detail);
});

videoCoverElement.addEventListener('set-default-cover', (event) => {
  console.log('Default cover set:', event.detail);
});
```