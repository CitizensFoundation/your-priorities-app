# YpGenerateAiImage

The `YpGenerateAiImage` class is a custom web component that extends `YpBaseElement`. It provides functionality to generate AI images based on user input and handles the process of submitting requests, polling for results, and managing UI interactions.

## Properties

| Name                        | Type                              | Description                                                                 |
|-----------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `submitting`                | `boolean`                         | Indicates if the image generation process is currently submitting.          |
| `currentError`              | `string \| undefined`             | Stores the current error message, if any.                                   |
| `name`                      | `string \| undefined`             | The name associated with the image generation request.                      |
| `description`               | `string \| undefined`             | The description associated with the image generation request.               |
| `disableBackgroundGeneration` | `boolean`                       | Determines if background generation is disabled.                            |
| `collectionId`              | `number`                          | The ID of the collection for which the image is being generated.            |
| `collectionType`            | `string`                          | The type of the collection for which the image is being generated.          |
| `imageType`                 | `YpAiGenerateImageTypes`          | The type of image to generate, default is "logo".                           |
| `jobId`                     | `number \| undefined`             | The job ID associated with the image generation request.                    |
| `styleText`                 | `HTMLInputElement`                | A reference to the input element for the image style text.                  |
| `timeout`                   | `number \| undefined`             | Stores the timeout ID for polling operations.                               |
| `dialog`                    | `MdDialog`                        | A reference to the dialog element used in the component.                    |

## Methods

| Name               | Parameters                                                                 | Return Type | Description                                                                 |
|--------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `resetGenerator`   | None                                                                       | `void`      | Resets the generator state, clearing errors and input values.               |
| `connectedCallback`| None                                                                       | `Promise<void>` | Lifecycle method called when the component is added to the document.        |
| `disconnectedCallback` | None                                                                   | `void`      | Lifecycle method called when the component is removed from the document.    |
| `finalPrompt`      | None                                                                       | `string`    | Constructs the final prompt string for image generation.                    |
| `pollForImage`     | None                                                                       | `Promise<void>` | Initiates polling for the generated image and handles the response.         |
| `submit`           | None                                                                       | `Promise<void>` | Submits the image generation request and starts polling for the result.     |
| `scrollUp`         | None                                                                       | `void`      | Scrolls the dialog content to the top.                                      |
| `open`             | `name: string \| undefined`, `description: string \| undefined`            | `void`      | Opens the dialog with optional name and description.                        |
| `cancel`           | None                                                                       | `void`      | Cancels the image generation process and closes the dialog.                 |
| `moveToBackground` | None                                                                       | `void`      | Moves the image generation process to the background and closes the dialog. |
| `textAreaKeyDown`  | `e: KeyboardEvent`                                                         | `boolean \| undefined` | Handles keydown events in the text area to prevent new lines on Enter key.  |
| `renderContent`    | None                                                                       | `TemplateResult` | Renders the content of the dialog.                                          |
| `renderFooter`     | None                                                                       | `TemplateResult` | Renders the footer of the dialog.                                           |
| `render`           | None                                                                       | `TemplateResult` | Renders the entire component.                                               |

## Events

- **got-image**: Emitted when the image generation is successfully completed with the image ID and URL.
- **image-generation-error**: Emitted when an error occurs during image generation with the error details.
- **yp-generate-ai-image-background**: Emitted when the image generation is moved to the background with relevant details.

## Examples

```typescript
// Example usage of the YpGenerateAiImage component
const aiImageGenerator = document.createElement('yp-generate-ai-image');
document.body.appendChild(aiImageGenerator);

aiImageGenerator.open('Sample Name', 'Sample Description');
aiImageGenerator.addEventListener('got-image', (event) => {
  console.log('Image generated:', event.detail);
});
```