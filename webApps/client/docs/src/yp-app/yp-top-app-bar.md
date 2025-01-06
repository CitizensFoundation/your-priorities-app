# YpTopAppBar

The `YpTopAppBar` is a custom web component that extends `YpBaseElement` and provides a top application bar with navigation and domain management features. It includes breadcrumb navigation, domain selection, and responsive design for different screen sizes.

## Properties

| Name                        | Type                                      | Description                                                                 |
|-----------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `hideBreadcrumbs`           | `boolean`                                 | Determines if breadcrumbs should be hidden.                                 |
| `hideTitle`                 | `boolean`                                 | Determines if the title should be hidden.                                   |
| `restrictWidth`             | `boolean`                                 | Restricts the width of the app bar.                                         |
| `disableArrowBasedNavigation` | `boolean`                               | Disables navigation using arrow keys.                                       |
| `breadcrumbs`               | `Array<{ name: string; url: string }>`    | List of breadcrumb items with name and URL.                                 |
| `fixed`                     | `boolean`                                 | Fixes the app bar position on the screen.                                   |
| `useLowestContainerColor`   | `boolean`                                 | Uses the lowest container color for the app bar background.                 |
| `backUrl`                   | `string | undefined`                      | URL to navigate back to.                                                    |
| `titleString`               | `string`                                  | The title string displayed in the app bar.                                  |
| `myDomains`                 | `Array<YpShortDomainList> | undefined`  | List of domains available for selection.                                    |

## Methods

| Name                      | Parameters                | Return Type | Description                                                                 |
|---------------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| `computedBreadcrumbs`     |                           | `Array<{ name: string; url: string }>` | Computes the breadcrumbs including the current domain.                      |
| `renderBreadcrumbsDropdown` |                         | `TemplateResult` | Renders the breadcrumbs dropdown menu.                                      |
| `redirectTo`              | `url: string`             | `void`      | Redirects to the specified URL and closes the menu.                         |
| `renderMyDomainsDropdown` |                           | `TemplateResult` | Renders the domains dropdown menu.                                          |
| `_toggleMenu`             | `e: Event`                | `void`      | Toggles the menu open/close state.                                          |
| `_onMenuClosed`           |                           | `void`      | Handles the menu closed event.                                              |
| `handleScroll`            |                           | `void`      | Handles the scroll event to hide/show the app bar based on scroll position. |
| `render`                  |                           | `TemplateResult` | Renders the app bar with navigation and action slots.                       |

## Events

- **yp-close-all-drawers**: Emitted when the app bar requests to close all drawers.
- **yp-domain-changed**: Listens for domain change events to update the current domain.
- **yp-my-domains-loaded**: Listens for domain load events to update the list of domains.

## Examples

```typescript
// Example usage of the YpTopAppBar component
import './yp-top-app-bar.js';

const appBar = document.createElement('yp-top-app-bar');
appBar.titleString = "Dashboard";
appBar.breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Dashboard", url: "/dashboard" }
];
document.body.appendChild(appBar);
```