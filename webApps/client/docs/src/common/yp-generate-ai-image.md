# YpGenerateAiImage

YpGenerateAiImage is a custom web component that provides a user interface for generating images using an AI service. It extends from `YpBaseElement` and includes properties for managing the state of the image generation process, such as submission status, error handling, and input fields for user prompts.

## Properties

| Name            | Type                  | Description                                           |
|-----------------|-----------------------|-------------------------------------------------------|
| submitting      | Boolean               | Indicates if the image generation process is ongoing. |
| currentError    | String \| undefined   | Holds the current error message, if any.              |
| name            | String                | The name associated with the image to be generated.   |
| description     | String                | The description for the image to be generated.        |
| collectionId    | Number                | The ID of the collection to which the image belongs.  |
| collectionType  | String                | The type of the collection.                           |
| jobId           | Number \| undefined   | The job ID for the image generation process.          |
| styleText       | HTMLInputElement      | Input element for the style of the image.             |
| timeout         | Number \| undefined   | Timeout ID for the polling process.                   |
| dialog          | MdDialog              | The dialog element used for the UI.                   |

## Methods

| Name               | Parameters            | Return Type | Description                                                                                   |
|--------------------|-----------------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback  | -                     | void        | Lifecycle method that runs when the component is added to the DOM.                            |
| disconnectedCallback | -                     | void        | Lifecycle method that runs when the component is removed from the DOM.                         |
| finalPrompt        | -                     | String      | Composes the final prompt string based on the component's properties.                         |
| pollForImage       | -                     | Promise<void> | Polls the server for the status of the image generation process.                              |
| submit             | -                     | Promise<void> | Initiates the image generation process and starts polling for the result.                     |
| scrollUp           | -                     | void        | Scrolls the dialog content to the top.                                                        |
| open               | name?: String, description?: String | void | Opens the dialog with optional name and description.                                          |
| cancel             | -                     | void        | Cancels the image generation process and closes the dialog.                                   |
| textAreaKeyDown    | e: KeyboardEvent      | Boolean \| undefined | Handles key down events in the text area to prevent form submission on Enter key press. |

## Events

- **got-image**: Emitted when the image is successfully generated with the image ID and URL.
- **activity**: Emitted to log various activities such as submit, error, open, cancel, etc.

## Examples

```typescript
// Example usage of the YpGenerateAiImage component
const generateAiImageComponent = document.createElement('yp-generate-ai-image');
generateAiImageComponent.name = 'Sunset';
generateAiImageComponent.description = 'A beautiful sunset over the mountains';
document.body.appendChild(generateAiImageComponent);

// To open the dialog with pre-filled values
generateAiImageComponent.open('Sunset', 'A beautiful sunset over the mountains');

// To submit the image generation request
generateAiImageComponent.submit();

// To cancel the image generation process
generateAiImageComponent.cancel();
```

Note: The `YpGenerateAiImageResponse` and `YpGenerateAiImageStartResponse` types used in the component are not defined in the provided code snippet and should be documented separately if they are part of the public API.