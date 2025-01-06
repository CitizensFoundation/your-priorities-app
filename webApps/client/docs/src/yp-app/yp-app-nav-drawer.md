# YpAppNavDrawer

The `YpAppNavDrawer` is a custom web component that extends `YpBaseElement`. It provides a navigation drawer for an application, allowing users to navigate between different communities and groups. The drawer can be opened or closed, and it displays a list of communities and groups the user is part of or administers.

## Properties

| Name            | Type                     | Description                                                                 |
|-----------------|--------------------------|-----------------------------------------------------------------------------|
| homeLink        | YpHomeLinkData \| undefined | The home link data object, which includes the type and id for redirection.  |
| user            | YpUserData \| undefined  | The user data object representing the current user.                         |
| opened          | boolean                  | Indicates whether the navigation drawer is open.                            |
| spinner         | boolean                  | Indicates whether a loading spinner should be displayed.                    |
| route           | string \| undefined      | The current route string.                                                   |
| myGroups        | YpGroupData[] \| undefined | An array of group data objects the user is part of or administers.          |
| myCommunities   | YpCommunityData[] \| undefined | An array of community data objects the user is part of or administers.      |
| myDomains       | YpDomainData[] \| undefined | An array of domain data objects the user is part of.                        |
| adminRights     | YpAdminRights \| undefined | The admin rights data object for the user.                                  |
| memberships     | YpMemberships \| undefined | The memberships data object for the user.                                   |
| communitiesCount| number                   | The count of communities the user is part of or administers.                |
| groupsCount     | number                   | The count of groups the user is part of or administers.                     |

## Methods

| Name              | Parameters                                      | Return Type | Description                                                                 |
|-------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated           | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the element's properties change. Handles user and opened changes. |
| connectedCallback | none                                            | void        | Called when the element is added to the document. Adds a global event listener. |
| disconnectedCallback | none                                         | void        | Called when the element is removed from the document. Removes the global event listener. |
| _closeAllDrawers  | none                                            | void        | Closes the navigation drawer.                                               |
| getGroupTypeName  | group: YpGroupData                              | string      | Returns the display name for a group's type based on its configuration.     |
| _openChanged      | none                                            | Promise<void> | Handles changes when the drawer is opened, fetching admin rights and memberships. |
| _selectedLocale   | none                                            | string      | Returns the currently selected language.                                    |
| _goBack           | none                                            | void        | Navigates back to the home link and closes the drawer.                      |
| _goToGroup        | event: CustomEvent                              | void        | Navigates to a specific group based on the event's data-args attribute.     |
| _goToCommunity    | event: CustomEvent                              | void        | Navigates to a specific community based on the event's data-args attribute. |
| _goToDomain       | event: CustomEvent                              | void        | Navigates to a specific domain based on the event's data-args attribute.    |
| _userChanged      | none                                            | void        | Resets the component when the user data changes.                            |
| _deduplicateById  | array: any[]                                    | any[]       | Deduplicates an array of objects by their id property.                      |
| _reset            | none                                            | void        | Resets the component's state, updating groups and communities lists.        |

## Examples

```typescript
// Example usage of the YpAppNavDrawer component
import './path/to/yp-app-nav-drawer.js';

const navDrawer = document.createElement('yp-app-nav-drawer');
document.body.appendChild(navDrawer);

// Open the navigation drawer
navDrawer.opened = true;

// Set user data
navDrawer.user = { /* user data */ };

// Set home link
navDrawer.homeLink = { type: 'home', id: '123', name: 'Home' };
```