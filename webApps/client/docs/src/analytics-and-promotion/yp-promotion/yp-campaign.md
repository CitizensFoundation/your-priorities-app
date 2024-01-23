# YpCampaign

YpCampaign is a custom web component that extends YpBaseElementWithLogin. It is used to manage and display campaign information, including the ability to activate different mediums for a campaign, copy promotion texts and links, and delete campaigns.

## Properties

| Name               | Type                        | Description                                                                 |
|--------------------|-----------------------------|-----------------------------------------------------------------------------|
| collectionType     | string                      | The type of collection associated with the campaign.                        |
| collectionId       | number                      | The ID of the collection associated with the campaign.                      |
| collection         | YpCollectionData \| undefined | The collection data associated with the campaign.                           |
| campaign           | YpCampaignData              | The campaign data.                                                          |
| campaignApi        | YpCampaignApi               | The API for interacting with campaign data.                                 |
| mediumToActivate   | YpCampaignMediumData \| undefined | The medium data that is to be activated.                                    |
| mediumToShow       | YpCampaignMediumData \| undefined | The medium data that is currently being shown.                              |
| confirmedActive    | boolean                     | Indicates whether the activation of a medium has been confirmed.            |
| haveCopied         | boolean                     | Indicates whether the promotion text and link have been copied to clipboard.|

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| deleteCampaign         |                             | void        | Deletes the campaign.                                                       |
| get configuration      |                             | Object      | Retrieves the configuration of the campaign.                                |
| getMediumImageUrl      | medium: string              | string      | Returns the URL of the image associated with the specified medium.          |
| activate               | medium: YpCampaignMediumData | Promise<void> | Activates the specified medium for the campaign.                            |
| showMedium             | medium: YpCampaignMediumData | Promise<void> | Shows the details of the specified medium.                                  |
| cancelActivation       |                             | void        | Cancels the activation of a medium.                                         |
| reallyActivate         |                             | void        | Confirms the activation of a medium and updates the configuration.          |
| activeCheckboxChanged  | event: CustomEvent          | void        | Handles the change event for the active confirmation checkbox.              |
| copyCurrentTextWithLink| medium: YpCampaignMediumData | void        | Copies the promotion text and link for the specified medium to clipboard.   |
| copyCurrentText        | medium: YpCampaignMediumData | void        | Copies the promotion text for the specified medium to clipboard.            |
| copyCurrentLink        | medium: YpCampaignMediumData | void        | Copies the promotion link for the specified medium to clipboard.            |
| closeShowMedium        |                             | void        | Closes the dialog showing medium details.                                   |
| renderTextWithLink     | medium: YpCampaignMediumData | TemplateResult | Renders the promotion text with link for the specified medium.             |
| renderActivateDialog   |                             | TemplateResult | Renders the dialog for activating a medium.                                |
| renderShowDialog       |                             | TemplateResult | Renders the dialog showing details of a medium.                            |
| renderMedium           | medium: YpCampaignMediumData | TemplateResult | Renders the card for a specific medium.                                    |
| render                 |                             | TemplateResult | Renders the main content of the YpCampaign component.                      |

## Events

- **deleteCampaign**: Emitted when the campaign is to be deleted.
- **configurationUpdated**: Emitted when the campaign configuration is updated.
- **display-snackbar**: Emitted to display a snackbar with a message.

## Examples

```typescript
// Example usage of the YpCampaign component
<yp-campaign
  collectionType="someType"
  collectionId={123}
  campaign={campaignData}
  campaignApi={campaignApiInstance}
></yp-campaign>
```

Note: The actual usage of the component would depend on the context in which it is placed, including the data passed to its properties.