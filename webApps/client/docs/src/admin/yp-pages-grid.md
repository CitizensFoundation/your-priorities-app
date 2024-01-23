# YpPagesGrid

The `YpPagesGrid` class is a custom web component that extends `YpBaseElement` to manage and display a grid of pages. It allows for CRUD operations on pages, including adding, editing, publishing, unpublishing, and deleting pages. It also supports localization by allowing the addition and editing of page content in different locales.

## Properties

| Name                   | Type                          | Description                                                                 |
|------------------------|-------------------------------|-----------------------------------------------------------------------------|
| pages                  | Array<YpHelpPageData> \| undefined | An array of page data objects.                                              |
| headerText             | string \| undefined            | The header text displayed above the pages grid.                             |
| domainId               | number \| undefined            | The ID of the domain to which the pages belong.                             |
| communityId            | number \| undefined            | The ID of the community to which the pages belong.                          |
| groupId                | number \| undefined            | The ID of the group to which the pages belong.                              |
| currentlyEditingPage   | YpHelpPageData \| undefined    | The page data object that is currently being edited.                        |
| modelType              | string \| undefined            | The type of model the pages are associated with (e.g., 'groups').           |
| currentlyEditingLocale | string \| undefined            | The locale of the page content that is currently being edited.              |
| currentlyEditingTitle  | string \| undefined            | The title of the page that is currently being edited.                       |
| currentlyEditingContent| string \| undefined            | The content of the page that is currently being edited.                     |

## Methods

| Name                        | Parameters                  | Return Type | Description                                                                 |
|-----------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties change, used to update the collection. |
| titleChanged                |                             | void        | Handler for when the title input field changes.                             |
| contentChanged              |                             | void        | Handler for when the content input field changes.                           |
| render                      |                             | TemplateResult \| typeof nothing | Renders the component's HTML template.                                      |
| _toLocaleArray              | obj: Record<string, string> | Array<YpHelpPageData> | Converts an object with locale keys to an array of page data objects.       |
| _editPageLocale             | event: Event                | Promise<void> | Opens the dialog to edit the locale of a page.                              |
| _closePageLocale            |                             | void        | Closes the edit locale dialog and clears editing state.                     |
| _dispatchAdminServerApiRequest | pageId: number \| undefined, path: string, method: string, body?: any | Promise<any> | Dispatches an API request to the admin server.                              |
| _updatePageLocale           |                             | Promise<void> | Updates the locale of the currently editing page.                           |
| _publishPage                | event: Event                | Promise<void> | Publishes a page.                                                           |
| _publishPageResponse        |                             | Promise<void> | Handles the response after publishing a page.                               |
| _unPublishPage              | event: Event                | Promise<void> | Unpublishes a page.                                                         |
| _unPublishPageResponse      |                             | Promise<void> | Handles the response after unpublishing a page.                             |
| _refreshPages               |                             | Promise<void> | Refreshes the list of pages.                                                |
| _deletePage                 | event: Event                | Promise<void> | Deletes a page.                                                             |
| _deletePageResponse         |                             | Promise<void> | Handles the response after deleting a page.                                 |
| _addLocale                  | event: Event                | Promise<void> | Adds a new locale to a page.                                                |
| _addPage                    |                             | Promise<void> | Adds a new page.                                                            |
| _newPageResponse            |                             | Promise<void> | Handles the response after adding a new page.                               |
| _updatePageResponse         |                             | Promise<void> | Handles the response after updating a page.                                 |
| _updateCollection           |                             | void        | Updates the collection of pages based on the current model type and ID.     |
| _generateRequest            | id: number \| undefined = undefined | Promise<void> | Generates a request to fetch pages for admin.                               |
| _pagesResponse              | event: CustomEvent          | void        | Handles the response after fetching pages.                                  |
| setup                       | groupId: number, communityId: number, domainId: number, adminUsers: boolean | void        | Sets up the component with the provided IDs and admin user status.          |
| open                        |                             | void        | Opens the dialog component.                                                 |
| _setupHeaderText            |                             | void        | Sets up the header text based on the model type and ID.                     |

## Events (if any)

- **None specified**

## Examples

```typescript
// Example usage of the YpPagesGrid component
<yp-pages-grid
  .pages="${this.pages}"
  .headerText="${this.headerText}"
  .domainId="${this.domainId}"
  .communityId="${this.communityId}"
  .groupId="${this.groupId}"
></yp-pages-grid>
```

Note: The `YpHelpPageData` type and other related types or interfaces are not defined in the provided code and should be defined elsewhere in the codebase.