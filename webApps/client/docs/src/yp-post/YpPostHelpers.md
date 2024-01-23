# YpPostHelpers

This class provides helper methods for dealing with post-related functionalities.

## Methods

| Name            | Parameters                        | Return Type | Description                                                                 |
|-----------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| fullPostUrl     | post: YpPostData                  | string      | Generates a full URL for a given post, or returns an empty string on error. |
| uniqueInDomain  | array: Array<YpGroupData>, domainId: number | Array<YpGroupData> | Filters an array of groups to those unique and relevant to a given domain.  |

## Examples

```typescript
// Example usage of fullPostUrl method
const postUrl = YpPostHelpers.fullPostUrl(somePostData);

// Example usage of uniqueInDomain method
const uniqueGroups = YpPostHelpers.uniqueInDomain(groupsArray, domainId);
```