# YpServerApiAdmin

The `YpServerApiAdmin` class extends the `YpServerApiBase` class and provides various administrative methods for managing users, collections, translations, and media within an organization or community.

## Methods

| Name                        | Parameters                                                                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| adminMethod                 | url: string, method: string, body: Record<string, unknown> \| undefined = undefined             | any         | Executes an HTTP request with the specified method and body.                |
| removeUserFromOrganization  | organizationId: number, userId: number                                                         | any         | Removes a user from a specified organization.                               |
| removeAdmin                 | collection: string, collectionId: number, userId: number                                       | any         | Removes an admin from a specified collection.                               |
| addAdmin                    | collection: string, collectionId: number, adminEmail: string                                   | any         | Adds an admin to a specified collection.                                    |
| inviteUser                  | collection: string, collectionId: number, inviteEmail: string, inviteType: string              | any         | Invites a user to a specified collection with an optional invite type.      |
| addUserToOrganization       | organizationId: number, userId: number                                                         | any         | Adds a user to a specified organization.                                    |
| addCollectionItem           | collectionId: number, collectionItemType: string, body: Record<string, unknown>                | any         | Adds an item to a specified collection.                                     |
| updateTranslation           | collectionType: string, collectionId: number, body: YpTranslationTextData                      | any         | Updates the translation for a specified collection.                         |
| getTextForTranslations      | collectionType: string, collectionId: number, targetLocale: string                             | any         | Retrieves translation texts for a specified collection and target locale.   |
| addVideoToCollection        | collectionId: number, body: Record<string, unknown>, type: string                              | any         | Adds a video to a specified collection based on the type.                   |
| deleteImage                 | imageId: number, collectionType: string, collectionId: number, deleteByUserOnly?: boolean, htmlImage?: boolean | Promise<any> | Deletes an image from a specified collection with optional parameters.      |
| deleteVideo                 | videoId: number, collectionType: string, collectionId: number, deleteByUserOnly?: boolean, htmlVideo?: boolean | Promise<any> | Deletes a video from a specified collection with optional parameters.       |
| getCommunityFolders         | domainId: number                                                                               | any         | Retrieves available community folders for a specified domain.               |
| getAnalyticsData            | communityId: number, type: string, params: string                                              | any         | Retrieves analytics data for a specified community and type.                |
| getSsnListCount             | communityId: number, ssnLoginListDataId: number                                                | any         | Retrieves the count of SSN login list data for a specified community.       |
| deleteSsnLoginList          | communityId: number, ssnLoginListDataId: number                                                | any         | Deletes the SSN login list data for a specified community.                  |

## Examples

```typescript
const apiAdmin = new YpServerApiAdmin();

// Example: Remove a user from an organization
apiAdmin.removeUserFromOrganization(123, 456);

// Example: Add an admin to a collection
apiAdmin.addAdmin("projects", 789, "admin@example.com");

// Example: Invite a user to a community
apiAdmin.inviteUser("communities", 101, "user@example.com", "addUserDirectly");
```