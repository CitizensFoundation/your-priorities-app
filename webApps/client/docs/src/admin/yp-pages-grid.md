# YpPagesGrid

The `YpPagesGrid` class is a custom web component that extends `YpBaseElement`. It provides a grid interface for managing pages, allowing users to add, edit, publish, unpublish, and delete pages. The component is designed to work with different model types such as groups, communities, and domains.

## Properties

| Name                    | Type                          | Description                                                                 |
|-------------------------|-------------------------------|-----------------------------------------------------------------------------|
| `pages`                 | `Array<YpHelpPageData> \| undefined` | The list of pages to be displayed in the grid.                               |
| `headerText`            | `string \| undefined`         | The header text displayed above the grid.                                    |
| `domainId`              | `number \| undefined`         | The ID of the domain associated with the pages.                              |
| `communityId`           | `number \| undefined`         | The ID of the community associated with the pages.                           |
| `groupId`               | `number \| undefined`         | The ID of the group associated with the pages.                               |
| `currentlyEditingPage`  | `YpHelpPageData \| undefined` | The page currently being edited.                                             |
| `modelType`             | `string \| undefined`         | The type of model (e.g., groups, communities, domains) being managed.        |
| `newLocaleInput`        | `HTMLInputElement`            | The input element for adding a new locale.                                   |
| `currentlyEditingLocale`| `string \| undefined`         | The locale currently being edited.                                           |
| `currentlyEditingTitle` | `string \| undefined`         | The title of the page currently being edited.                                |
| `currentlyEditingContent`| `string \| undefined`        | The content of the page currently being edited.                              |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                   | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Called when the component is updated. Triggers collection update if certain properties change. |
| `titleChanged`              | `()`                                                                       | `void`      | Updates the `currentlyEditingTitle` property when the title input changes.  |
| `contentChanged`            | `()`                                                                       | `void`      | Updates the `currentlyEditingContent` property when the content input changes. |
| `render`                    | `()`                                                                       | `TemplateResult` | Renders the component's HTML template.                                      |
| `_toLocaleArray`            | `obj: Record<string, string>`                                              | `Array<YpHelpPageData>` | Converts an object of locales to an array, sorted by locale value.          |
| `_editPageLocale`           | `event: Event`                                                             | `Promise<void>` | Opens the dialog for editing a page's locale.                               |
| `_closePageLocale`          | `()`                                                                       | `void`      | Closes the page locale editing dialog and resets editing properties.        |
| `_dispatchAdminServerApiRequest` | `pageId: number \| undefined, path: string, method: string, body = {}` | `Promise<any>` | Dispatches an API request to the admin server.                              |
| `_updatePageLocale`         | `()`                                                                       | `Promise<void>` | Updates the locale of the currently editing page.                           |
| `_publishPage`              | `event: Event`                                                             | `Promise<void>` | Publishes a page.                                                           |
| `_publishPageResponse`      | `()`                                                                       | `Promise<void>` | Handles the response after publishing a page.                               |
| `_unPublishPage`            | `event: Event`                                                             | `Promise<void>` | Unpublishes a page.                                                         |
| `_unPublishPageResponse`    | `()`                                                                       | `Promise<void>` | Handles the response after unpublishing a page.                             |
| `_refreshPages`             | `()`                                                                       | `Promise<void>` | Refreshes the list of pages.                                                |
| `_deletePage`               | `event: Event`                                                             | `Promise<void>` | Deletes a page.                                                             |
| `_deletePageResponse`       | `()`                                                                       | `Promise<void>` | Handles the response after deleting a page.                                 |
| `_addLocale`                | `event: Event`                                                             | `Promise<void>` | Adds a new locale to a page.                                                |
| `_addPage`                  | `()`                                                                       | `Promise<void>` | Adds a new page.                                                            |
| `_newPageResponse`          | `()`                                                                       | `Promise<void>` | Handles the response after creating a new page.                             |
| `_updatePageResponse`       | `()`                                                                       | `Promise<void>` | Handles the response after updating a page.                                 |
| `_updateCollection`         | `()`                                                                       | `void`      | Updates the collection of pages based on the current model type and IDs.    |
| `_generateRequest`          | `id: number \| undefined = undefined`                                      | `Promise<void>` | Generates a request to fetch pages for the admin.                           |
| `_pagesResponse`            | `event: CustomEvent`                                                       | `void`      | Handles the response event for pages.                                       |
| `setup`                     | `groupId: number, communityId: number, domainId: number, adminUsers: boolean` | `void`      | Sets up the component with the given IDs and admin user status.             |
| `open`                      | `()`                                                                       | `void`      | Opens the main dialog of the component.                                     |
| `_setupHeaderText`          | `()`                                                                       | `void`      | Sets up the header text based on the current model type and IDs.            |

## Examples

```typescript
// Example usage of the YpPagesGrid component
import './yp-pages-grid.js';

const pagesGrid = document.createElement('yp-pages-grid');
document.body.appendChild(pagesGrid);

pagesGrid.setup(1, 2, 3, true);
pagesGrid.open();
```