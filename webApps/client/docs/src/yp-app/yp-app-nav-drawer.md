# YpAppNavDrawer

`YpAppNavDrawer` is a custom element that provides a navigation drawer for an application. It extends `YpBaseElement` and includes properties for user data, admin rights, group and community memberships, and UI state such as whether the drawer is open or a spinner is displayed. It also handles theme toggling for dark mode and high contrast.

## Properties

| Name                 | Type                     | Description                                                                 |
|----------------------|--------------------------|-----------------------------------------------------------------------------|
| homeLink             | YpHomeLinkData\|undefined | Data for the home link displayed at the top of the drawer.                  |
| user                 | YpUserData\|undefined     | Data for the current user.                                                  |
| opened               | Boolean                  | Indicates if the navigation drawer is open.                                 |
| spinner              | Boolean                  | Indicates if a spinner should be shown (e.g., during data loading).         |
| themeHighContrast    | Boolean                  | Indicates if the high contrast theme is enabled.                            |
| route                | String\|undefined         | The current route of the application.                                       |
| myAdminGroups        | YpGroupData[]\|undefined  | Array of groups where the user has admin rights.                            |
| myAdminCommunities   | YpCommunityData[]\|undefined | Array of communities where the user has admin rights.                      |
| myGroups             | YpGroupData[]\|undefined  | Array of groups the user is a member of.                                    |
| myCommunities        | YpCommunityData[]\|undefined | Array of communities the user is a member of.                              |
| myDomains            | YpDomainData[]\|undefined | Array of domains the user is a member of.                                   |
| adminRights          | YpAdminRights\|undefined  | Admin rights of the user across different entities.                         |
| memberships          | YpMemberships\|undefined  | Memberships of the user across different entities.                          |

## Methods

| Name                | Parameters                        | Return Type | Description                                                                 |
|---------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map            | void        | Lifecycle method called when properties change. Handles user and open state. |
| connectedCallback   |                                   | void        | Lifecycle method called when the element is added to the document's DOM.     |
| updateFromTheme     |                                   | void        | Updates the theme-related properties from the global theme settings.         |
| _openChanged        |                                   | Promise<void> | Handles the change of the `opened` property.                               |
| _selectedLocale     |                                   | String      | Returns the selected language locale.                                       |
| _goBack             |                                   | void        | Navigates back to the home link.                                            |
| _goToGroup          | event: CustomEvent                | void        | Navigates to a specific group based on the event data.                       |
| _goToCommunity      | event: CustomEvent                | void        | Navigates to a specific community based on the event data.                   |
| _goToDomain         | event: CustomEvent                | void        | Navigates to a specific domain based on the event data.                      |
| _userChanged        |                                   | void        | Handles changes to the `user` property.                                     |
| _reset              |                                   | void        | Resets the groups, communities, and domains based on memberships.            |
| renderThemeToggle   |                                   | TemplateResult | Renders the theme toggle buttons for dark mode and high contrast.         |
| render              |                                   | TemplateResult | Renders the navigation drawer content.                                      |

## Events (if any)

- **yp-toggle-nav-drawer**: Emitted when the navigation drawer needs to be toggled.
- **yp-toggle-dark-mode**: Emitted when the dark mode needs to be toggled.
- **yp-toggle-high-contrast-mode**: Emitted when the high contrast mode needs to be toggled.

## Examples

```typescript
// Example usage of the YpAppNavDrawer
const navDrawer = document.createElement('yp-app-nav-drawer');
navDrawer.user = { /* user data */ };
navDrawer.opened = true;
document.body.appendChild(navDrawer);
```

Please note that the actual usage would typically involve more complex interactions and data binding, as this component is designed to be part of a larger application with routing and state management.