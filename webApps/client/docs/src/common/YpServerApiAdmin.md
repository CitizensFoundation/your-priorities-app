# YpServerApiAdmin

Extends `YpServerApiBase` to provide administrative API methods for managing users, organizations, collections, translations, media, analytics, and templates.

## Properties

| Name         | Type                | Description                        |
|--------------|---------------------|------------------------------------|
| baseUrlPath  | string              | Inherited from `YpServerApiBase`. The base URL path for API requests. |

## Methods

| Name                        | Parameters                                                                                                                                         | Return Type         | Description                                                                                                   |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------|
| adminMethod                 | url: string, method: string, body?: Record<string, unknown>                                                                                        | unknown             | Makes an admin API call with the specified HTTP method and body.                                               |
| removeUserFromOrganization  | organizationId: number, userId: number                                                                                                             | unknown             | Removes a user from an organization.                                                                          |
| removeAdmin                 | collection: string, collectionId: number, userId: number                                                                                           | unknown             | Removes an admin from a collection (community, group, etc.).                                                  |
| addAdmin                    | collection: string, collectionId: number, adminEmail: string                                                                                       | unknown             | Adds an admin to a collection by email.                                                                       |
| inviteUser                  | collection: string, collectionId: number, inviteEmail: string, inviteType: string                                                                  | unknown             | Invites a user to a collection, with optional direct add based on inviteType.                                 |
| addUserToOrganization       | organizationId: number, userId: number                                                                                                             | unknown             | Adds a user to an organization.                                                                               |
| addCollectionItem           | collectionId: number, collectionItemType: string, body: Record<string, unknown>                                                                    | unknown             | Adds an item to a collection, with the type transformed for the API.                                          |
| updateTranslation           | collectionType: string, collectionId: number, body: YpTranslationTextData                                                                          | unknown             | Updates translation text for a collection item.                                                               |
| getTextForTranslations      | collectionType: string, collectionId: number, targetLocale: string                                                                                 | unknown             | Retrieves translation texts for a collection item for a specific locale.                                      |
| addVideoToCollection        | collectionId: number, body: Record<string, unknown>, type: string                                                                                  | unknown             | Adds a video to a collection, with the type determining the API endpoint.                                     |
| deleteImage                 | imageId: number, collectionType: string, collectionId: number, deleteByUserOnly?: boolean, htmlImage?: boolean                                     | Promise<unknown>    | Deletes an image from a collection, with options for user-only and HTML image deletion.                       |
| deleteVideo                 | videoId: number, collectionType: string, collectionId: number, deleteByUserOnly?: boolean, htmlVideo?: boolean                                     | Promise<unknown>    | Deletes a video from a collection, with options for user-only and HTML video deletion.                        |
| getCommunityFolders         | domainId: number                                                                                                                                   | unknown             | Retrieves available community folders for a domain.                                                           |
| getCommunityTemplates       | domainId: number                                                                                                                                   | unknown             | Retrieves community templates for a domain.                                                                   |
| getGroupTemplates           | domainId: number                                                                                                                                   | unknown             | Retrieves group templates for a domain.                                                                       |
| getAnalyticsData            | communityId: number, type: string, params: string                                                                                                  | unknown             | Retrieves analytics data for a community, with a specified type and query parameters.                         |
| getSsnListCount             | communityId: number, ssnLoginListDataId: number                                                                                                    | unknown             | Retrieves the count of SSN login list entries for a community.                                                |
| deleteSsnLoginList          | communityId: number, ssnLoginListDataId: number                                                                                                    | unknown             | Deletes an SSN login list for a community.                                                                    |

## Examples

```typescript
const apiAdmin = new YpServerApiAdmin();

// Remove a user from an organization
apiAdmin.removeUserFromOrganization(123, 456);

// Add an admin to a group
apiAdmin.addAdmin('groups', 789, 'admin@example.com');

// Invite a user directly to a community
apiAdmin.inviteUser('communities', 101, 'user@example.com', 'addUserDirectly');

// Add a collection item
apiAdmin.addCollectionItem(202, 'group', { name: 'New Item' });

// Update translation for a collection
apiAdmin.updateTranslation('community', 303, { text: 'Translated text', locale: 'es' });

// Delete an image from a group
apiAdmin.deleteImage(404, 'group', 505, true, false);

// Get analytics data
apiAdmin.getAnalyticsData(606, 'visits', 'from=2023-01-01&to=2023-01-31');
```
