# YpServerApiAdmin

This class extends `YpServerApiBase` and provides methods for administrative actions such as managing users, organizations, translations, and analytics data.

## Properties

No public properties are documented for this class.

## Methods

| Name                      | Parameters                                             | Return Type | Description                                                                                     |
|---------------------------|--------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------|
| adminMethod               | url: string, method: string, body: Record<string, unknown> \| undefined | Promise     | Performs administrative actions on the server with the specified URL and method.               |
| removeUserFromOrganization| organizationId: number, userId: number                 | Promise     | Removes a user from an organization.                                                            |
| removeAdmin               | collection: string, collectionId: number, userId: number| Promise     | Removes an admin from a collection.                                                             |
| addAdmin                  | collection: string, collectionId: number, adminEmail: string| Promise     | Adds an admin to a collection.                                                                  |
| inviteUser                | collection: string, collectionId: number, inviteEmail: string, inviteType: string| Promise     | Invites a user to a collection and optionally adds them directly.                               |
| addUserToOrganization     | organizationId: number, userId: number                 | Promise     | Adds a user to an organization.                                                                 |
| addCollectionItem         | collectionId: number, collectionItemType: string, body: Record<string, unknown>| Promise     | Adds an item to a collection.                                                                   |
| updateTranslation         | collectionType: string, collectionId: number, body: YpTranslationTextData| Promise     | Updates the translation for a collection item.                                                  |
| getTextForTranslations    | collectionType: string, collectionId: number, targetLocale: string| Promise     | Retrieves text for translations for a collection item in a target locale.                       |
| addVideoToCollection      | collectionId: number, body: Record<string, unknown>, type: string| Promise     | Adds a video to a collection.                                                                   |
| getCommunityFolders       | domainId: number                                      | Promise     | Retrieves available community folders for a domain.                                             |
| getAnalyticsData          | communityId: number, type: string, params: string      | Promise     | Retrieves analytics data for a community.                                                       |
| getSsnListCount           | communityId: number, ssnLoginListDataId: number        | Promise     | Retrieves the count of SSN login list for a community.                                          |
| deleteSsnLoginList        | communityId: number, ssnLoginListDataId: number        | Promise     | Deletes an SSN login list for a community.                                                      |

## Examples

```typescript
// Example usage of the YpServerApiAdmin class
const apiAdmin = new YpServerApiAdmin();

// Remove a user from an organization
apiAdmin.removeUserFromOrganization(1, 2).then(response => {
  // Handle response
});

// Add an admin to a collection
apiAdmin.addAdmin('projects', 3, 'admin@example.com').then(response => {
  // Handle response
});

// Invite a user to a community
apiAdmin.inviteUser('communities', 4, 'user@example.com', 'addUserDirectly').then(response => {
  // Handle response
});

// Add a user to an organization
apiAdmin.addUserToOrganization(5, 6).then(response => {
  // Handle response
});

// Add a collection item
apiAdmin.addCollectionItem(7, 'event', { title: 'New Event' }).then(response => {
  // Handle response
});

// Update a translation
apiAdmin.updateTranslation('projects', 8, { text: 'Updated text', locale: 'en' }).then(response => {
  // Handle response
});

// Get text for translations
apiAdmin.getTextForTranslations('projects', 9, 'es').then(response => {
  // Handle response
});

// Add a video to a collection
apiAdmin.addVideoToCollection(10, { videoUrl: 'http://example.com/video.mp4' }, 'tutorial').then(response => {
  // Handle response
});

// Get community folders
apiAdmin.getCommunityFolders(11).then(response => {
  // Handle response
});

// Get analytics data
apiAdmin.getAnalyticsData(12, 'visitors', 'startDate=2021-01-01&endDate=2021-01-31').then(response => {
  // Handle response
});

// Get SSN list count
apiAdmin.getSsnListCount(13, 14).then(response => {
  // Handle response
});

// Delete an SSN login list
apiAdmin.deleteSsnLoginList(15, 16).then(response => {
  // Handle response
});
```