# YpNavHelpers

A utility class providing navigation helper methods for web applications.

## Methods

| Name         | Parameters                                                                 | Return Type | Description                                                                 |
|--------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| redirectTo   | path: string                                                               | void        | Redirects to the given path and emits a 'location-changed' event.           |
| goToPost     | postId: number, pointId: number \| undefined, cachedActivityItem: AcActivityData \| undefined, cachedPostItem: YpPostData \| undefined, skipKeepOpen: boolean | void        | Navigates to a post by its ID, with optional parameters for additional navigation behavior. |

## Examples

```typescript
// Example usage of redirectTo method
YpNavHelpers.redirectTo('/home');

// Example usage of goToPost method
YpNavHelpers.goToPost(123, undefined, someActivityData, somePostData, false);
```

**Note:** The `AcActivityData` and `YpPostData` types are not defined in the provided code snippet. They should be defined elsewhere in the application codebase.