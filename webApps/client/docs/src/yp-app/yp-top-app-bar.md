# YpTopAppBar

A Material Design top app bar web component for navigation, domain selection, and breadcrumb display. Extends `YpBaseElement` and is built with LitElement. Supports responsive layouts, domain dropdowns, breadcrumbs, and customizable actions.

## Properties

| Name                      | Type                                         | Description                                                                                  |
|---------------------------|----------------------------------------------|----------------------------------------------------------------------------------------------|
| hideBreadcrumbs           | boolean                                      | If true, hides the breadcrumbs navigation.                                                   |
| hideTitle                 | boolean                                      | If true, hides the title section.                                                            |
| restrictWidth             | boolean                                      | If true, restricts the width of the app bar.                                                 |
| disableDomainDropdown     | boolean                                      | If true, disables the domain dropdown menu. Defaults to true.                                |
| disableArrowBasedNavigation | boolean                                    | If true, disables arrow-based navigation in breadcrumbs.                                     |
| breadcrumbs               | Array<{ name: string; url: string }>         | List of breadcrumb items to display.                                                         |
| fixed                     | boolean                                      | If true, the app bar is fixed and does not hide on scroll.                                   |
| useLowestContainerColor   | boolean                                      | If true, uses the lowest container color for the app bar background.                         |
| backUrl                   | string \| undefined                          | Optional URL for a back navigation action.                                                   |
| titleString               | string                                       | The title string to display in the app bar.                                                  |
| myDomains                 | Array<YpShortDomainList> \| undefined        | List of domains available for the user, used in the domain dropdown.                         |

## State (Private/Internal)

| Name          | Type                        | Description                                               |
|---------------|-----------------------------|-----------------------------------------------------------|
| isTitleLong   | boolean                     | True if the title is considered long (over 16 chars).     |
| isMenuOpen    | boolean                     | True if a dropdown menu is currently open.                |
| domain        | YpDomainData \| undefined   | The current domain object, if any.                        |

## Methods

| Name                    | Parameters                                   | Return Type   | Description                                                                                      |
|-------------------------|----------------------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| get computedBreadcrumbs | —                                            | Array<{ name: string; url: string }> | Returns the computed breadcrumbs, prepending the current domain if available.                     |
| renderBreadcrumbsDropdown | —                                          | TemplateResult | Renders the breadcrumbs dropdown menu if applicable.                                             |
| redirectTo              | url: string                                  | void          | Redirects to the given URL and closes all drawers.                                               |
| renderMyDomainsDropdown | —                                            | TemplateResult | Renders the domain selection dropdown if enabled and multiple domains are available.             |
| private _toggleMenu     | e: Event                                     | void          | Toggles the open/close state of the dropdown menu.                                               |
| private _onMenuClosed   | —                                            | void          | Closes the dropdown menu.                                                                        |
| static get styles       | —                                            | CSSResult[]   | Returns the CSS styles for the component.                                                        |
| updated                 | changedProperties: PropertyValues            | void          | Lit lifecycle method, updates `isTitleLong` when `titleString` changes.                          |
| connectedCallback       | —                                            | void          | Lit lifecycle method, adds scroll and global event listeners.                                    |
| disconnectedCallback    | —                                            | void          | Lit lifecycle method, removes scroll and global event listeners.                                 |
| private _onDomainChanged| event: CustomEvent                           | void          | Handles the `yp-domain-changed` global event to update the current domain.                       |
| private _onMyDomainsLoaded | event: CustomEvent                        | void          | Handles the `yp-my-domains-loaded` global event to update the list of domains.                   |
| handleScroll            | —                                            | void          | Handles scroll events to hide/show the app bar if not fixed.                                     |
| render                  | —                                            | TemplateResult | Renders the app bar, including navigation, title, breadcrumbs, and action slots.                 |

## Events

- **yp-close-all-drawers**: Fired globally when a navigation or domain change occurs, to close all open drawers.

## Examples

```typescript
import './yp-top-app-bar.js';

html`
  <yp-top-app-bar
    .breadcrumbs=${[
      { name: 'Home', url: '/' },
      { name: 'Section', url: '/section' }
    ]}
    .titleString=${'Current Page'}
    .myDomains=${[
      { id: 1, name: 'Domain 1' },
      { id: 2, name: 'Domain 2' }
    ]}
    .hideBreadcrumbs=${false}
    .hideTitle=${false}
    .restrictWidth=${true}
    .disableDomainDropdown=${false}
    .fixed=${true}
    .useLowestContainerColor=${false}
  >
    <div slot="navigation">
      <!-- Custom navigation button -->
    </div>
    <div slot="action">
      <!-- Custom action button(s) -->
    </div>
  </yp-top-app-bar>
`
```
