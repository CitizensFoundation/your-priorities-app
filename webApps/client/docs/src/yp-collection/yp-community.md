# YpCommunity

YpCommunity is a custom web component that extends the functionality of YpCollection to handle community-specific logic and UI interactions.

## Properties

| Name          | Type               | Description               |
|---------------|--------------------|---------------------------|
| collection    | YpCommunityData    | The community data object.|

## Methods

| Name                          | Parameters        | Return Type | Description                 |
|-------------------------------|-------------------|-------------|-----------------------------|
| constructor                   |                   |             | Initializes the component with specific parameters for 'community'. |
| override refresh              |                   | void        | Refreshes the community data and UI elements. |
| _setupCommunitySaml           | community: YpCommunityData | void | Configures SAML settings for the community. |
| scrollToGroupItem             |                   | void        | Scrolls to a specific group item based on the selected tab and cached data. |
| _setupCommunityBackPath       | community: YpCommunityData | void | Sets up the back path and header details for the community. |
| scrollToCollectionItemSubClass|                   | void        | Scrolls to a collection item subclass. |
| _openHelpPageIfNeededOnce     |                   | void        | Opens the help page for the community if it hasn't been opened in the session. |
| _hideMapIfNotUsedByGroups     |                   | void        | Hides the map if it's not used by any groups within the community. |

## Events

- **yp-change-header**: Emitted when the header needs to be changed based on the community's configuration.

## Examples

```typescript
// Example usage of the YpCommunity component
<yp-community></yp-community>
```

Please note that the actual implementation of the YpCommunity class may involve more methods, properties, and events than listed here. This documentation provides an overview of the most relevant parts of the YpCommunity class for understanding its role and usage within a web application.