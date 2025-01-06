# YpGroupHeader

The `YpGroupHeader` class is a custom web component that extends the `YpCollectionHeader` class. It is used to render a header for a group collection, providing additional styling and functionality specific to group collections.

## Properties

| Name       | Type                | Description                                                                 |
|------------|---------------------|-----------------------------------------------------------------------------|
| collection | YpGroupData \| undefined | The collection data associated with the group header. Overrides the base class property. |

## Methods

| Name            | Parameters | Return Type | Description                                                                 |
|-----------------|------------|-------------|-----------------------------------------------------------------------------|
| groupTypeName   | None       | string      | Returns the translated name for the group type, defaulting to "ideas".      |
| isGroupFolder   | None       | boolean     | Determines if the group is a folder based on its configuration or property. |
| render          | None       | TemplateResult | Renders the HTML template for the group header component.                   |

## Examples

```typescript
// Example usage of the yp-group-header web component
import './yp-group-header.js';

const groupHeader = document.createElement('yp-group-header');
groupHeader.collection = {
  configuration: { groupType: YpGroupType.Folder },
  is_group_folder: true,
  // other properties...
};
document.body.appendChild(groupHeader);
```

This component uses the Lit library for rendering and styling, and it leverages decorators for property management. It provides a responsive design with specific styles for different screen sizes. The component checks if the group is a folder and adjusts its display accordingly.