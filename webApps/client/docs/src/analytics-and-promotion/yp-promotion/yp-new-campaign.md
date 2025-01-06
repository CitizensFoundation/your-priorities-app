# YpNewCampaign

The `YpNewCampaign` class is a web component that extends `YpBaseElementWithLogin`. It provides functionality for creating and managing new marketing campaigns, including setting campaign details, selecting advertising mediums, and previewing the campaign.

## Properties

| Name              | Type                          | Description                                                                 |
|-------------------|-------------------------------|-----------------------------------------------------------------------------|
| collectionType    | `string`                      | The type of collection associated with the campaign.                        |
| collectionId      | `number \| string`            | The ID of the collection associated with the campaign.                      |
| collection        | `YpCollectionData \| undefined` | The collection data associated with the campaign.                           |
| campaign          | `YpCampaignData \| undefined` | The campaign data.                                                          |
| previewEnabled    | `boolean`                     | Indicates whether the campaign preview is enabled.                          |
| uploadedImageUrl  | `string \| undefined`         | The URL of the uploaded image for the campaign.                             |
| targetAudience    | `string \| undefined`         | The target audience for the campaign.                                       |
| campaignName      | `string \| undefined`         | The name of the campaign.                                                   |
| promotionText     | `string \| undefined`         | The promotional text for the campaign.                                      |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| open                | None       | `void`      | Opens the new campaign dialog.                                              |
| getMediums          | None       | `string[]`  | Retrieves the list of selected advertising mediums.                         |
| inputsChanged       | None       | `Promise<void>` | Handles changes to input fields and updates the campaign state accordingly. |
| save                | None       | `void`      | Saves the campaign and emits a "save" event with campaign details.          |
| discard             | None       | `void`      | Discards the current campaign changes and closes the dialog.                |
| close               | None       | `void`      | Closes the new campaign dialog.                                             |
| cancel              | None       | `void`      | Cancels the campaign creation process, showing a confirmation dialog if needed. |
| renderAdMediums     | None       | `TemplateResult` | Renders the list of advertising mediums as checkboxes.                      |
| renderTextInputs    | None       | `TemplateResult` | Renders the text input fields for campaign name and description.            |
| imageUploadCompleted | `event: CustomEvent` | `void` | Handles the completion of an image upload and updates the image URL.        |
| collectionImageUrl  | None       | `string`    | Retrieves the URL of the collection image, using the uploaded image if available. |
| renderPreview       | None       | `TemplateResult` | Renders the campaign preview section.                                       |
| renderConfirmationDialog | None  | `TemplateResult` | Renders the confirmation dialog for discarding changes.                     |
| render              | None       | `TemplateResult` | Renders the entire component, including dialogs and input fields.           |

## Examples

```typescript
// Example usage of the YpNewCampaign component
import './path/to/yp-new-campaign.js';

const campaignElement = document.createElement('yp-new-campaign');
document.body.appendChild(campaignElement);

campaignElement.addEventListener('save', (event) => {
  console.log('Campaign saved:', event.detail);
});

campaignElement.open();
```