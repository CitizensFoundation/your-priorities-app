# YpSetVideoCover

`YpSetVideoCover` is a custom web component that allows users to select a cover image for a video from a set of generated video images or to use the main photo as the video cover.

## Properties

| Name                     | Type                  | Description                                           |
|--------------------------|-----------------------|-------------------------------------------------------|
| videoId                  | number                | The unique identifier for the video.                  |
| previewVideoUrl          | string \| undefined   | The URL for the preview video.                        |
| videoImages              | Array<string> \| undefined | An array of URLs for the images generated from the video. |
| selectedVideoCoverIndex  | number                | The index of the currently selected video cover image.|
| useMainPhotoForVideoCover| boolean               | A flag indicating if the main photo should be used as the video cover. |
| noDefaultCoverImage      | boolean               | A flag indicating if there is no default cover image. |

## Methods

| Name                  | Parameters            | Return Type | Description                                      |
|-----------------------|-----------------------|-------------|--------------------------------------------------|
| _classFromImageIndex  | index: number         | string      | Returns the appropriate CSS class based on the index of the image. |
| _getVideoMeta         | -                     | Promise<void> | Fetches video metadata including preview URL and image URLs. |
| _selectVideoCover     | event: CustomEvent    | void        | Handles the selection of a video cover image.    |
| _selectVideoCoverMainPhoto | -               | void        | Handles the selection of the main photo as the video cover. |

## Events

- **set-cover**: Emitted when a video cover is selected.
- **set-default-cover**: Emitted when the main photo is selected or deselected as the video cover.

## Examples

```typescript
// Example usage of the YpSetVideoCover component
<yp-set-video-cover
  .videoId=${123}
  .previewVideoUrl=${'http://example.com/preview.mp4'}
  .videoImages=${['http://example.com/image1.jpg', 'http://example.com/image2.jpg']}
  .selectedVideoCoverIndex=${0}
  .useMainPhotoForVideoCover=${false}
  .noDefaultCoverImage=${false}
></yp-set-video-cover>
```

Note: The actual usage of the component would depend on the context within a larger application, including how the properties are set and how the events are handled.