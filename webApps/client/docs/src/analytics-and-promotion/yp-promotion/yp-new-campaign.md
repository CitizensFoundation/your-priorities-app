# YpNewCampaign

`YpNewCampaign` is a custom web component that extends `YpBaseElementWithLogin` and is used to create a new campaign for a collection. It allows users to specify the campaign name, description, target audience, and the mediums through which the campaign will be promoted. It also provides a preview of the campaign and the ability to upload an image for the campaign.

## Properties

| Name              | Type                      | Description                                                                 |
|-------------------|---------------------------|-----------------------------------------------------------------------------|
| collectionType    | String                    | The type of collection for which the campaign is being created.             |
| collectionId      | Number \| String          | The identifier of the collection for which the campaign is being created.   |
| collection        | YpCollectionData \| undefined | The collection data object.                                                |
| campaign          | YpCampaignData \| undefined   | The campaign data object.                                                  |
| previewEnabled    | Boolean                   | Indicates whether the preview of the campaign is enabled.                   |
| uploadedImageUrl  | String \| undefined       | The URL of the uploaded image for the campaign.                             |
| targetAudience    | String \| undefined       | The target audience for the campaign.                                       |
| campaignName      | String \| undefined       | The name of the campaign.                                                   |
| promotionText     | String \| undefined       | The text describing the promotion of the campaign.                          |

## Methods

| Name            | Parameters | Return Type | Description                                                                 |
|-----------------|------------|-------------|-----------------------------------------------------------------------------|
| open            |            | void        | Opens the campaign creation dialog.                                         |
| getMediums      |            | string[]    | Retrieves the list of selected mediums for the campaign.                    |
| inputsChanged   |            | Promise<void> | Handles changes in input fields and updates the state of the component.    |
| save            |            | void        | Saves the campaign data and closes the dialog.                              |
| discard         |            | void        | Discards the campaign creation and closes the dialog.                       |
| close           |            | void        | Closes the campaign creation dialog.                                        |
| cancel          |            | void        | Cancels the campaign creation process and may show a confirmation dialog.   |
| imageUploadCompleted | event: CustomEvent | void | Handles the completion of the image upload process.                        |
| collectionImageUrl |            | string      | Computed property that returns the URL of the collection image.             |

## Events

- **save**: Emitted when the campaign is saved with the campaign data.
- **cancel**: Emitted when the campaign creation is canceled.

## Examples

```typescript
// Example usage of the YpNewCampaign component
const newCampaignElement = document.createElement('yp-new-campaign');
newCampaignElement.collectionType = 'group';
newCampaignElement.collectionId = 123;
document.body.appendChild(newCampaignElement);

// To open the campaign creation dialog
newCampaignElement.open();

// To listen for the save event
newCampaignElement.addEventListener('save', (event) => {
  console.log('Campaign saved:', event.detail);
});
```

Note: The actual rendering and functionality of the component depend on the implementation of the `YpBaseElementWithLogin` class and other internal methods and properties that are not fully detailed here.