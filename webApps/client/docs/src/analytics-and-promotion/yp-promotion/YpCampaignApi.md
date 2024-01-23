# YpCampaignApi

The `YpCampaignApi` class extends the `YpServerApiBase` class and provides methods to create, update, delete, and retrieve campaigns associated with a specific collection.

## Methods

| Name            | Parameters                                      | Return Type | Description                                                                 |
|-----------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| createCampaign  | collectionType: string, collectionId: number, body: YpCampaignData | Promise     | Creates a new campaign for the specified collection.                        |
| updateCampaign  | collectionType: string, collectionId: number, campaignId: number, body: YpCampaignData | Promise     | Updates an existing campaign for the specified collection.                  |
| deleteCampaign  | collectionType: string, collectionId: number, campaignId: number | Promise     | Deletes an existing campaign from the specified collection.                 |
| getCampaigns    | collectionType: string, collectionId: number | Promise     | Retrieves all campaigns associated with the specified collection.           |

## Examples

```typescript
// Example usage of creating a campaign
const campaignApi = new YpCampaignApi();
campaignApi.createCampaign('collectionType', 123, { /* YpCampaignData properties */ });

// Example usage of updating a campaign
campaignApi.updateCampaign('collectionType', 123, 456, { /* YpCampaignData properties */ });

// Example usage of deleting a campaign
campaignApi.deleteCampaign('collectionType', 123, 456);

// Example usage of getting campaigns
campaignApi.getCampaigns('collectionType', 123);
```