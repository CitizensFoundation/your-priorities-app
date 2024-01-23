# YpCampaignManager

The `YpCampaignManager` class is a web component that manages campaigns for a collection. It allows users to create new campaigns, update campaign configurations, delete campaigns, and retrieve a list of campaigns. It extends `YpBaseElementWithLogin`, which likely provides authentication and user session management.

## Properties

| Name             | Type                      | Description                                                                 |
|------------------|---------------------------|-----------------------------------------------------------------------------|
| collectionType   | string                    | The type of the collection for which the campaigns are being managed.       |
| collectionId     | number                    | The identifier of the collection for which the campaigns are being managed. |
| collection       | YpCollectionData\|undefined | The collection data object, if available.                                   |
| campaigns        | YpCampaignData[]\|undefined  | An array of campaign data objects, if available.                            |
| newCampaignElement | YpNewCampaign             | A reference to the `yp-new-campaign` element.                               |
| campaignApi      | YpCampaignApi             | An instance of `YpCampaignApi` used for making API calls related to campaigns. |
| campaignToDelete | number\|undefined         | The identifier of the campaign that is marked for deletion.                 |

## Methods

| Name                         | Parameters            | Return Type | Description                                                                                   |
|------------------------------|-----------------------|-------------|-----------------------------------------------------------------------------------------------|
| firstUpdated                 | -                     | void        | Lifecycle method that runs after the component's first render, used to fetch initial campaigns. |
| newCampaign                  | -                     | void        | Opens the dialog to create a new campaign.                                                    |
| getTrackingUrl               | campaign: YpCampaignData, medium: string | string      | Generates a tracking URL for a given campaign and medium.                                     |
| createCampaign               | event: CustomEvent    | Promise<void> | Handles the creation of a new campaign based on event details.                                |
| campaignConfigurationUpdated | event: CustomEvent    | Promise<void> | Updates the configuration of a campaign based on event details.                               |
| getCampaigns                 | -                     | Promise<void> | Fetches the list of campaigns for the current collection.                                     |
| reallyDeleteCampaign         | -                     | Promise<void> | Deletes the campaign marked for deletion.                                                     |
| deleteCampaign               | event: CustomEvent    | void        | Marks a campaign for deletion and shows the delete confirmation dialog.                       |
| cancelDeleteCampaign         | -                     | void        | Cancels the deletion of a campaign.                                                           |

## Events (if any)

- **configurationUpdated**: Emitted when a campaign's configuration is updated.
- **deleteCampaign**: Emitted when a campaign is marked for deletion.
- **save**: Emitted when a new campaign is created.

## Examples

```typescript
// Example usage of the YpCampaignManager component
<yp-campaign-manager
  collectionType="someType"
  collectionId={123}
></yp-campaign-manager>
```

Please note that the actual usage may vary depending on the context and the framework or library you are using. The example above assumes you are using a framework that supports web components and property bindings.