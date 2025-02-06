# YpNavHelpers

Utility class for handling navigation and URL manipulation within the application.

## Methods

| Name            | Parameters                                                                                          | Return Type | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| withForAgentBundle | path: string                                                                                     | string      | Appends `?forAgentBundle=...` to the path if present in `originalQueryParameters`. |
| redirectTo      | path: string                                                                                        | void        | Redirects to the specified path, appending `forAgentBundle` if necessary, and dispatches relevant events. |
| goToPost        | postId: number, pointId?: number, cachedActivityItem?: AcActivityData, cachedPostItem?: YpPostData, skipKeepOpen?: boolean | void        | Navigates to a specific post, optionally caching activity and post data, and handling open state. |

## Examples

```typescript
// Example usage of the YpNavHelpers class

// Redirect to a path with forAgentBundle if applicable
YpNavHelpers.redirectTo('/some/path');

// Navigate to a post with specific IDs and optional caching
YpNavHelpers.goToPost(123, 456, someActivityData, somePostData, false);
```