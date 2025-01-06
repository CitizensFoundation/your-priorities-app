# YpAdminHtmlEditor

The `YpAdminHtmlEditor` is a custom web component that extends `YpBaseElement` and provides an interface for editing HTML content with media management capabilities. It allows users to upload images and videos, generate AI images, and manage media content within a group or collection context.

## Properties

| Name                        | Type                                      | Description                                                                 |
|-----------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `content`                   | `string`                                  | The HTML content being edited.                                              |
| `media`                     | `Array<YpSimpleGroupMediaData>`           | An array of media data associated with the editor.                          |
| `selectedTab`               | `number`                                  | The index of the currently selected tab.                                    |
| `mediaLoaded`               | `{ [key: number]: boolean }`              | A map indicating whether each media item has been loaded.                   |
| `generatingAiImageInBackground` | `boolean`                             | Indicates if AI image generation is happening in the background.            |
| `group`                     | `YpGroupData`                             | The group data associated with the editor.                                  |
| `parentCollectionId`        | `number | undefined`                      | The ID of the parent collection, if applicable.                             |
| `mediaIdToDelete`           | `number | undefined`                      | The ID of the media item to be deleted.                                     |
| `collectionId`              | `number | string | undefined`             | The ID of the collection associated with the editor.                        |
| `hasVideoUpload`            | `boolean`                                 | Indicates if video upload functionality is available.                       |
| `browserPreviewType`        | `"desktop" | "mobile"`                    | The type of browser preview (desktop or mobile).                            |
| `imageIdsUploadedByUser`    | `number[]`                                | An array of image IDs uploaded by the user.                                 |
| `videoIdsUploadedByUser`    | `number[]`                                | An array of video IDs uploaded by the user.                                 |

## Methods

| Name                          | Parameters                      | Return Type | Description                                                                 |
|-------------------------------|---------------------------------|-------------|-----------------------------------------------------------------------------|
| `_selectTab`                  | `event: CustomEvent`            | `void`      | Handles tab selection changes.                                              |
| `getConfiguration`            |                                 | `object`    | Returns the current configuration of content and media.                     |
| `connectedCallback`           |                                 | `void`      | Lifecycle method called when the element is added to the document.          |
| `disconnectedCallback`        |                                 | `void`      | Lifecycle method called when the element is removed from the document.      |
| `styles`                      |                                 | `CSSResult` | Returns the styles for the component.                                       |
| `_generateLogo`               | `event: CustomEvent`            | `void`      | Initiates the AI image generation process.                                  |
| `firstUpdated`                | `_changedProperties: PropertyValues` | `void`  | Lifecycle method called after the first update of the component.            |
| `renderAiImageGenerator`      |                                 | `TemplateResult` | Renders the AI image generator component.                                   |
| `_setMediaLoaded`             | `id: number, loaded: boolean`   | `void`      | Sets the loaded state of a media item.                                      |
| `_logoImageUploaded`          | `event: CustomEvent`            | `void`      | Handles the event when a logo image is uploaded.                            |
| `_gotAiImage`                 | `event: CustomEvent`            | `void`      | Handles the event when an AI image is generated.                            |
| `_removeHtmlTag`              | `url: string, type: string`     | `void`      | Removes HTML tags for a given media URL and type.                           |
| `_videoUploaded`              | `event: CustomEvent`            | `void`      | Handles the event when a video is uploaded.                                 |
| `reallyDeleteCurrentLogoImage`|                                 | `Promise<void>` | Deletes the current logo image after confirmation.                          |
| `reallyDeleteCurrentVideo`    |                                 | `Promise<void>` | Deletes the current video after confirmation.                               |
| `deleteCurrentLogoImage`      |                                 | `void`      | Opens a confirmation dialog to delete the current logo image.               |
| `deleteCurrentVideo`          |                                 | `void`      | Opens a confirmation dialog to delete the current video.                    |
| `_removeMedia`                | `media: YpSimpleGroupMediaData` | `void`      | Initiates the removal of a media item.                                      |
| `renderMedia`                 |                                 | `TemplateResult` | Renders the media items associated with the editor.                         |
| `_insertMediaIntoHtml`        | `media: YpSimpleGroupMediaData` | `void`      | Inserts a media item into the HTML content.                                 |
| `contentChanged`              |                                 | `void`      | Handles changes to the content and triggers a configuration change event.   |
| `renderImageUploadOptions`    |                                 | `TemplateResult` | Renders the image upload options.                                           |
| `render`                      |                                 | `TemplateResult` | Renders the component's template.                                           |
| `changed`                     | `event: CustomEvent`            | `void`      | Handles changes to the content from the editor.                             |
| `debouncedSave`               |                                 | `void`      | Debounces the save operation to prevent frequent saves.                     |

## Events

- **configuration-changed**: Emitted when the configuration of the editor changes, such as when content or media is updated.

## Examples

```typescript
// Example usage of the YpAdminHtmlEditor component
import './yp-admin-html-editor.js';

const editor = document.createElement('yp-admin-html-editor');
document.body.appendChild(editor);

editor.addEventListener('configuration-changed', () => {
  console.log('Configuration has changed');
});
```