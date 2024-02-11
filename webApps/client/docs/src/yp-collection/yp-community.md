# YpCommunity

YpCommunity is a custom web component that extends YpCollection, specifically tailored for community-related functionalities. It manages community data, access, and navigation, and interacts with various helpers and global application states.

## Properties

| Name             | Type                | Description                                                                 |
|------------------|---------------------|-----------------------------------------------------------------------------|
| collection       | YpCommunityData     | Holds the community data.                                                   |
| collectionItems  | Array<YpGroupData>  | Stores the groups associated with the community.                            |
| selectedTab      | CollectionTabTypes  | Indicates the currently selected tab in the collection.                     |
| locationHidden   | boolean             | Determines whether the location is hidden based on group configurations.    |

## Methods

| Name                        | Parameters | Return Type | Description                                                                                   |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| constructor                 |            |             | Initializes the component with specific parameters for community.                             |
| refresh                     |            | void        | Refreshes the community data and applies various configurations and checks.                   |
| _setupCommunitySaml         | community: YpCommunityData | void | Configures SAML related settings for the community. |
| scrollToGroupItem           |            | void        | Scrolls to a specific group item based on the selected tab and cached activity or group item. |
| _setupCommunityBackPath     | community: YpCommunityData | void | Sets up the back path and header details for the community.                                  |
| scrollToCollectionItemSubClass |            | void        | Scrolls to a collection item in a subclass context.                                           |
| _openHelpPageIfNeededOnce   |            | void        | Opens the help page for the community if it hasn't been opened in the session.                |
| _hideMapIfNotUsedByGroups   |            | void        | Hides the map if the location is not used by any groups in the community.                     |

## Events

- **yp-change-header**: Emitted to change the header details based on the community's configuration.

## Examples

```typescript
// Example usage of the YpCommunity component
const ypCommunity = document.createElement('yp-community');
document.body.appendChild(ypCommunity);

// Refresh the community data
ypCommunity.refresh();

// Scroll to a specific group item
ypCommunity.scrollToGroupItem();

// Setup SAML configurations for the community
ypCommunity._setupCommunitySaml(communityData);

// Setup back path and header for the community
ypCommunity._setupCommunityBackPath(communityData);

// Scroll to a collection item in a subclass context
ypCommunity.scrollToCollectionItemSubClass();

// Open the help page for the community if needed
ypCommunity._openHelpPageIfNeededOnce();

// Hide the map if not used by any groups in the community
ypCommunity._hideMapIfNotUsedByGroups();
```

Please note that some methods and properties are intended for internal use and are prefixed with an underscore.