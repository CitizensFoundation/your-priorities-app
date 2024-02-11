# YpAdminPage

`YpAdminPage` is an abstract class that extends `YpBaseElementWithLogin` and is used for admin pages that require a collection type and ID.

## Properties

| Name           | Type                  | Description                                      |
|----------------|-----------------------|--------------------------------------------------|
| collectionType | `string`              | The type of collection this admin page is for.   |
| collectionId   | `number` \| `string`  | The identifier for the collection.               |
| collection     | `YpCollectionData` \| `undefined` | The collection data associated with this admin page. |

## Methods

This class does not define any methods.

## Events

This class does not define any events.

## Examples

```typescript
// Since YpAdminPage is an abstract class, it cannot be directly instantiated.
// You would typically extend this class to create a specific admin page component.
@customElement('my-admin-page')
class MyAdminPage extends YpAdminPage {
  // Implementation of your admin page component
}
```

Note: The `YpCollectionData` type is referenced in the `collection` property but is not defined in the provided code snippet. You should ensure that `YpCollectionData` is defined elsewhere in your codebase.