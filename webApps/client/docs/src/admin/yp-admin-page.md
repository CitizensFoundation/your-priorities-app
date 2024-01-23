# YpAdminPage

Abstract class that extends `YpBaseElementWithLogin` and is used for admin pages.

## Properties

| Name           | Type                  | Description                                      |
|----------------|-----------------------|--------------------------------------------------|
| collectionType | string                | The type of the collection.                      |
| collectionId   | number \| string      | The identifier for the collection, can be number or string. |
| collection     | YpCollectionData \| undefined | An object representing the collection data, or undefined if not set. |

## Methods

This class does not define any methods of its own.

## Events

This class does not define any events of its own.

## Examples

```typescript
// Since YpAdminPage is an abstract class, it cannot be directly instantiated.
// You would typically extend this class to create a specific admin page component.
@customElement('my-admin-page')
class MyAdminPage extends YpAdminPage {
  // Custom implementation for a specific admin page
}
```

Please note that the `YpCollectionData` type is referenced in the properties but not defined in the provided code snippet. You would need to define this type elsewhere in your codebase.