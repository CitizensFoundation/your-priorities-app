# YpPostTags

`YpPostTags` is a custom web component that displays tags associated with a post. It supports automatic translation of tags and displays them in a formatted manner.

## Properties

| Name            | Type                  | Description                                           |
|-----------------|-----------------------|-------------------------------------------------------|
| post            | YpPostData            | The post data object containing tags and other info.  |
| translatedTags  | string \| undefined   | The translated tags as a string, if available.        |
| autoTranslate   | boolean               | Flag to indicate if tags should be auto-translated.   |

## Methods

| Name               | Parameters            | Return Type | Description                                             |
|--------------------|-----------------------|-------------|---------------------------------------------------------|
| _trimmedItem       | item: string          | string      | Trims the provided tag item and returns it.             |
| _autoTranslateEvent| event: CustomEvent    | void        | Handles the auto-translate toggle event.                |
| computeSpanHidden  | items: Array<string>, index: number | boolean | Determines if the separator should be hidden based on index. |
| _newTranslation    | -                     | void        | Handles the new translation event for tags.             |
| postTags           | -                     | Array<string> | Computes and returns the list of tags to be displayed. |

## Events

- **new-translation**: Emitted when a new translation for tags is available.

## Examples

```typescript
// Example usage of the YpPostTags component
<yp-post-tags .post="${postObject}" .autoTranslate="${true}"></yp-post-tags>
```

Please note that the `YpPostData` type is assumed to be defined elsewhere in the codebase and is not provided in the given code snippet. The `YpMagicText` component is also used within this component, which should be defined and imported in the actual implementation.