# YpNewCampaign

`YpNewCampaign` is a custom web component that extends `YpBaseElementWithLogin` to provide a user interface for creating new advertising campaigns. It allows users to specify campaign details such as the name, description, target audience, and mediums for the promotion. It also includes a preview feature and the ability to upload an image for the campaign.

## Properties

| Name               | Type                        | Description                                                                 |
|--------------------|-----------------------------|-----------------------------------------------------------------------------|
| collectionType     | String                      | The type of collection associated with the campaign.                        |
| collectionId       | Number \| String            | The identifier for the collection associated with the campaign.             |
| collection         | YpCollectionData \| undefined | The collection data object associated with the campaign.                    |
| campaign           | YpCampaignData \| undefined  | The campaign data object.                                                   |
| previewEnabled     | Boolean                     | Indicates whether the preview feature is enabled.                           |
| uploadedImageUrl   | String \| undefined         | The URL of the uploaded image for the campaign.                             |
| targetAudience     | String \| undefined         | The target audience for the campaign.                                       |
| campaignName       | String \| undefined         | The name of the campaign.                                                   |
| promotionText      | String \| undefined         | The promotional text for the campaign.                                      |

## Methods

| Name              | Parameters | Return Type | Description                                                                 |
|-------------------|------------|-------------|-----------------------------------------------------------------------------|
| open              |            | void        | Opens the campaign creation dialog.                                         |
| getMediums        |            | string[]    | Retrieves the list of selected advertising mediums.                         |
| inputsChanged     |            | Promise<void> | Handles changes in input fields and updates the preview and button states. |
| save              |            | void        | Saves the campaign data and closes the dialog.                              |
| discard           |            | void        | Discards the campaign creation process and closes the dialog.              |
| close             |            | void        | Closes the campaign creation dialog.                                        |
| cancel            |            | void        | Handles the cancel action, possibly showing a confirmation dialog.         |
| renderAdMediums   |            | TemplateResult | Renders the advertising mediums selection interface.                       |
| renderTextInputs  |            | TemplateResult | Renders the text input fields for campaign name and description.           |
| imageUploadCompleted | event: CustomEvent | void | Handles the completion of an image upload.                                 |
| collectionImageUrl |            | string      | Getter for the collection image URL, using the uploaded image if available. |
| renderPreview     |            | TemplateResult | Renders a preview of the campaign.                                         |
| renderConfirmationDialog |     | TemplateResult | Renders a confirmation dialog for discarding changes.                      |

## Events

- **save**: Emitted when the save button is clicked with the campaign data payload.
- **discard**: Emitted when the discard action is confirmed.

## Examples

```typescript
// Example usage of the YpNewCampaign component
const newCampaignElement = document.createElement('yp-new-campaign');
newCampaignElement.collectionType = 'group';
newCampaignElement.collectionId = 123;
// Append newCampaignElement to the DOM where it should be displayed
document.body.appendChild(newCampaignElement);

// To open the campaign creation dialog
newCampaignElement.open();

// Listen for the save event to handle the campaign data
newCampaignElement.addEventListener('save', (event) => {
  const campaignData = event.detail;
  console.log('Campaign saved:', campaignData);
});
```

Note: The actual implementation of `YpCollectionData`, `YpCampaignData`, `YpBaseElementWithLogin`, `YpCollectionHelpers`, and `YpFormattingHelpers` is not provided in this documentation. This documentation assumes these are existing classes or interfaces with their own properties and methods.