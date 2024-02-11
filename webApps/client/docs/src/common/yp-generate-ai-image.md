# YpGenerateAiImage

A custom web component that provides a user interface for generating AI images, including a dialog with input fields for image style and description, and buttons to submit or cancel the operation.

## Properties

| Name            | Type                      | Description                                                                 |
|-----------------|---------------------------|-----------------------------------------------------------------------------|
| submitting      | Boolean                   | Indicates if the image generation is in progress.                           |
| currentError    | String \| undefined       | Holds the error message if an error occurs during image generation.         |
| name            | String                    | The name associated with the image to be generated.                         |
| description     | String                    | The description associated with the image to be generated.                  |
| collectionId    | Number                    | The ID of the collection to which the generated image will belong.          |
| collectionType  | String                    | The type of the collection to which the generated image will belong.        |
| imageType       | YpAiGenerateImageTypes    | The type of image to be generated (e.g., "logo").                           |
| jobId           | Number \| undefined       | The job ID associated with the image generation process.                    |
| styleText       | HTMLInputElement          | A reference to the input element for the image style text.                   |
| timeout         | Number \| undefined       | A reference to the timeout for polling the image generation status.         |

## Methods

| Name               | Parameters                | Return Type | Description                                                                 |
|--------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback  | None                      | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback | None                      | void        | Lifecycle method called when the component is removed from the DOM.         |
| finalPrompt        | None                      | String      | Composes the final prompt string for the AI image generation.               |
| pollForImage       | None                      | Promise<void> | Starts polling the server for the status of the image generation.          |
| submit             | None                      | Promise<void> | Submits the request to generate an AI image and starts polling.            |
| scrollUp           | None                      | void        | Scrolls the dialog content to the top.                                      |
| open               | name?: String, description?: String | void | Opens the dialog with optional name and description.                      |
| cancel             | None                      | void        | Cancels the image generation process and closes the dialog.                 |
| textAreaKeyDown    | e: KeyboardEvent          | Boolean \| undefined | Handles key down events in the text area to prevent form submission on Enter. |

## Events (if any)

- **got-image**: Emitted when an image is successfully generated with the image ID and URL.
- **image-generation-error**: Emitted when an error occurs during image generation with the error details.

## Examples

```typescript
// Example usage of the YpGenerateAiImage web component
const ypGenerateAiImage = document.createElement('yp-generate-ai-image');
ypGenerateAiImage.name = 'Example Image';
ypGenerateAiImage.description = 'An example description for AI image generation.';
ypGenerateAiImage.collectionId = 123;
ypGenerateAiImage.collectionType = 'exampleCollectionType';
ypGenerateAiImage.imageType = 'logo';
document.body.appendChild(ypGenerateAiImage);

// To open the dialog
ypGenerateAiImage.open();

// To submit the image generation request
ypGenerateAiImage.submit();

// To cancel the image generation process
ypGenerateAiImage.cancel();
```

Note: The `YpAiGenerateImageTypes` and `YpGenerateAiImageResponse` types are not defined in the provided code snippet and should be documented separately if they are part of the public API.