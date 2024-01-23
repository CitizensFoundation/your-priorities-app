# YpPostUserImageCard

A custom element that represents a user image card within a post, including the image, description, photographer name, and associated comments.

## Properties

| Name   | Type         | Description                                      |
|--------|--------------|--------------------------------------------------|
| image  | YpImageData  | The image data associated with the user image.   |
| post   | YpPostData   | The post data associated with the user image.    |

## Methods

| Name        | Parameters | Return Type | Description                                                                 |
|-------------|------------|-------------|-----------------------------------------------------------------------------|
| _openEdit   |            | void        | Opens the edit dialog for the user image.                                   |
| _openDelete |            | void        | Opens the delete confirmation dialog for the user image.                    |
| _refresh    |            | void        | Emits a 'refresh' event to refresh the display.                             |
| imageUrl    |            | string      | Computes and returns the URL for the image based on the provided image data.|

## Events

- **refresh**: Description of when and why the event is emitted.

## Examples

```typescript
// Example usage of the YpPostUserImageCard
<yp-post-user-image-card .image="{...}" .post="{...}"></yp-post-user-image-card>
```

Please note that the actual usage may vary depending on the context within the application, and the example provided here is for illustrative purposes only.