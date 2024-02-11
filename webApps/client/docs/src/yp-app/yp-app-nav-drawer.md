# YpAppNavDrawer

`YpAppNavDrawer` is a custom element that provides a navigation drawer for an application. It extends `YpBaseElement` and includes properties for user data, admin rights, memberships, and UI state such as whether the drawer is open or a spinner is shown. It also provides methods for navigation and UI updates.

## Properties

| Name                | Type                | Description                                                                 |
|---------------------|---------------------|-----------------------------------------------------------------------------|
| homeLink            | YpHomeLinkData      | Data for the home link, including type and ID.                              |
| user                | YpUserData          | Data for the current user.                                                  |
| opened              | Boolean             | Indicates if the navigation drawer is open.                                 |
| spinner             | Boolean             | Indicates if a spinner should be shown (loading state).                     |
| route               | String              | The current route of the application.                                       |
| myAdminGroups       | YpGroupData[]       | Array of groups where the user has admin rights.                            |
| myAdminCommunities  | YpCommunityData[]   | Array of communities where the user has admin rights.                       |
| myGroups            | YpGroupData[]       | Array of groups the user is a member of.                                    |
| myCommunities       | YpCommunityData[]   | Array of communities the user is a member of.                               |
| myDomains           | YpDomainData[]      | Array of domains the user is a member of.                                   |
| adminRights         | YpAdminRights       | Admin rights of the user, including community and group admin rights.       |
| memberships         | YpMemberships       | Memberships of the user, including groups, communities, and domains.        |

## Methods

| Name            | Parameters                        | Return Type | Description                                                                 |
|-----------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| updated         | changedProperties: Map            | void        | Lifecycle method called when properties change.                             |
| connectedCallback | none                            | void        | Lifecycle method called when the element is added to the document's DOM.    |
| _openChanged    | none                              | Promise<void> | Called when the `opened` property changes. Fetches admin rights and memberships. |
| _selectedLocale | none                              | String      | Returns the selected language locale.                                       |
| _goBack         | none                              | void        | Navigates back to the home link.                                            |
| _goToGroup      | event: CustomEvent                | void        | Navigates to a specific group based on the event's target data-args.        |
| _goToCommunity  | event: CustomEvent                | void        | Navigates to a specific community based on the event's target data-args.    |
| _goToDomain     | event: CustomEvent                | void        | Navigates to a specific domain based on the event's target data-args.       |
| _userChanged    | none                              | void        | Called when the `user` property changes. Resets the UI.                     |
| _reset          | none                              | void        | Resets the UI based on memberships and admin rights.                        |

## Events (if any)

- **yp-toggle-nav-drawer**: Emitted when the navigation drawer needs to be toggled.

## Examples

```typescript
// Example usage of the YpAppNavDrawer
const navDrawer = document.createElement('yp-app-nav-drawer');
navDrawer.homeLink = { type: 'dashboard', id: '1', name: 'Home' };
navDrawer.user = { id: '123', name: 'John Doe' };
navDrawer.opened = true;
document.body.appendChild(navDrawer);
```

Please note that the actual rendering and event handling logic is encapsulated within the `render` method and private methods, which are not detailed in this documentation. The example provided is a basic illustration of how to create and use the `YpAppNavDrawer` element.