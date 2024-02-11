# AoiAppUser

AoiAppUser extends the functionality of YpAppUser to provide user-related operations in the context of an Aoi application.

## Properties

Inherits all properties from `YpAppUser`.

## Methods

| Name       | Parameters                        | Return Type | Description                 |
|------------|-----------------------------------|-------------|-----------------------------|
| constructor | serverApi: YpServerApi, skipRegularInit: boolean = false | void        | Initializes a new instance of AoiAppUser with the given server API and an option to skip regular initialization. |

## Examples

```typescript
import { YpServerApi } from "../common/YpServerApi.js";
import { AoiAppUser } from "./AoiAppUser.js";

// Initialize the server API
const serverApi = new YpServerApi();

// Create a new AoiAppUser instance
const aoiUser = new AoiAppUser(serverApi);
```