# YpGroupHeader

`YpGroupHeader` is a custom web component that extends `YpCollectionHeader`. It is designed to display a header for a group, including a special footer that can contain a link to a review URL if provided in the group's configuration.

## Properties

| Name        | Type             | Description                                                                 |
|-------------|------------------|-----------------------------------------------------------------------------|
| collection  | YpGroupData \| undefined | The group data object that contains configuration and other properties for the group header. This property overrides the `collection` property from the `YpCollectionHeader` class. |

## Methods

| Name            | Parameters | Return Type | Description                                                                                   |
|-----------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| renderFooter    |            | TemplateResult \| typeof nothing | Overrides the `renderFooter` method from `YpCollectionHeader` to render the group-specific footer, which may include a button linking to a review URL. |

## Events

- No custom events are defined in `YpGroupHeader`.

## Examples

```typescript
// Example usage of YpGroupHeader
import { YpGroupData } from 'path-to-yp-group-data-definition';

const groupData: YpGroupData = {
  // ... group data properties including configuration with urlToReview
};

html`
  <yp-group-header .collection="${groupData}"></yp-group-header>
`;
```

Note: The example assumes that `YpGroupData` is defined elsewhere and that you have the necessary imports and context to use the `html` template tag from `lit`.