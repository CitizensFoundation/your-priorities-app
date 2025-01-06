# YpCommunity

The `YpCommunity` class extends the `YpCollection` class and represents a community within the application. It provides methods to manage and interact with community-specific data, such as themes, access permissions, and navigation.

## Properties

| Name               | Type                      | Description                                                                 |
|--------------------|---------------------------|-----------------------------------------------------------------------------|
| collectionItems    | Array<YpGroupData>        | List of groups within the community.                                        |
| headerImageUrl     | string                    | URL of the community header image.                                          |
| locationHidden     | boolean                   | Indicates if the location is hidden for all groups in the community.        |

## Methods

| Name                           | Parameters                          | Return Type | Description                                                                 |
|--------------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                    |                                     | void        | Initializes a new instance of the `YpCommunity` class.                      |
| setupTheme                     |                                     | void        | Configures the theme for the community based on its configuration.          |
| refresh                        |                                     | void        | Refreshes the community data and updates the UI accordingly.                |
| _setupCommunitySaml            | community: YpCommunityData          | void        | Configures SAML settings for the community based on its configuration.      |
| scrollToGroupItem              |                                     | void        | Scrolls to a specific group item based on the selected tab.                 |
| _setupCommunityBackPath        | community: YpCommunityData          | void        | Sets up the back navigation path for the community.                         |
| scrollToCollectionItemSubClass |                                     | void        | Scrolls to a specific collection item within the subclass.                  |
| getCollection                  |                                     | Promise<void> | Retrieves the community collection data and sets the current domain.       |
| _openHelpPageIfNeededOnce      |                                     | void        | Opens the help page for the community if it hasn't been opened before.      |
| _hideMapIfNotUsedByGroups      |                                     | void        | Hides the map if it is not used by any groups in the community.             |

## Examples

```typescript
// Example usage of the YpCommunity component
const communityElement = document.createElement('yp-community');
document.body.appendChild(communityElement);

// Refresh the community data
communityElement.refresh();
```