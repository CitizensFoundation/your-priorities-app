# YpPostUserImages

A custom web component that manages and displays user images associated with a post.

## Properties

| Name   | Type                     | Description                                      |
|--------|--------------------------|--------------------------------------------------|
| images | Array<YpImageData>       | An array of user images data.                    |
| post   | YpPostData               | The post data associated with the user images.   |

## Methods

| Name          | Parameters                                | Return Type | Description                                                                 |
|---------------|-------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated       | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that is called after the component’s properties have changed. |
| render        |                                           | TemplateResult | Returns a template result to render the component.                         |
| _refresh      |                                           | Promise<void> | Refreshes the images by fetching them from the server API.                 |
| _postChanged  |                                           | void        | Called when the associated post has changed.                               |
| _newImage     |                                           | void        | Opens a dialog to create a new user image.                                 |

## Events

- **yp-post-image-count**: Emitted with the number of images after refreshing the images list.

## Examples

```typescript
// Example usage of the YpPostUserImages component
<yp-post-user-images .images=${this.images} .post=${this.post}></yp-post-user-images>
```

Note: The `YpImageData` and `YpPostData` types are not defined in the provided code snippet. They should be defined elsewhere in the codebase.