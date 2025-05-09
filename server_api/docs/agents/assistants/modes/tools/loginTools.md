# Service Module: LoginAssistantTools

The `LoginAssistantTools` class provides a set of assistant tools for handling user authentication UI actions, such as showing the login widget, clicking login buttons, and logging out. It extends the `BaseAssistantTools` class and is designed to be used with a [YpAgentAssistant](../../agentAssistant.js) instance. Each tool is exposed as a function definition with a handler for execution, suitable for integration with agent-based or LLM-driven UI automation.

---

## Class: LoginAssistantTools

Extends: `BaseAssistantTools`

### Constructor

#### `constructor(assistant: YpAgentAssistant)`

Initializes the `LoginAssistantTools` with a reference to a `YpAgentAssistant` instance.

| Name      | Type              | Description                                 |
|-----------|-------------------|---------------------------------------------|
| assistant | YpAgentAssistant  | The assistant instance to bind the tools to. |

---

## Methods & Tool Definitions

### showLogin(description: string)

Returns a tool definition for showing the login widget.

| Name        | Type     | Description                        |
|-------------|----------|------------------------------------|
| description | string   | Description of the login widget.   |

**Returns:**  
A tool definition object with the following properties:
- `name`: `"show_login_widget"`
- `description`: Provided description
- `type`: `"function"`
- `parameters`: Empty object schema
- `handler`: Bound to `showLoginHandler`

#### Handler: showLoginHandler

`public async showLoginHandler(params: {}): Promise<ToolExecutionResult>`

Handles the logic for displaying the login widget.

| Name   | Type | Description                |
|--------|------|----------------------------|
| params | `{}` | No parameters required.    |

**Returns:**  
- On success:
    ```json
    {
      "success": true,
      "html": "<yp-login-widget ...></yp-login-widget>",
      "uniqueToken": "loginWidget",
      "data": { "message": "Login widget shown successfully" },
      "metadata": { "timestamp": "ISODateString" }
    }
    ```
- On error:
    ```json
    {
      "success": false,
      "error": "Failed to login"
    }
    ```

---

### clickMainLoginButton

Returns a tool definition for simulating a click on the main login button.

**Returns:**  
A tool definition object with:
- `name`: `"click_main_login_button"`
- `description`: `"Send an event to click the main login button to the web app"`
- `type`: `"function"`
- `parameters`: Empty object schema
- `handler`: Bound to `clickMainLoginButtonHandler`

#### Handler: clickMainLoginButtonHandler

`public async clickMainLoginButtonHandler(params: {}): Promise<ToolExecutionResult>`

Simulates a UI event for clicking the main login button.

| Name   | Type | Description                |
|--------|------|----------------------------|
| params | `{}` | No parameters required.    |

**Returns:**  
- On success:
    ```json
    {
      "success": true,
      "data": { "message": "Main login button clicked successfully" },
      "clientEvents": [{ "name": "ui_click", "details": "login-button-main" }],
      "metadata": { "timestamp": "ISODateString" }
    }
    ```

---

### clickGoogleLoginButton

Returns a tool definition for simulating a click on the Google login button.

**Returns:**  
A tool definition object with:
- `name`: `"click_google_login_button"`
- `description`: `"Submit an event to click the Google login button to the web app"`
- `type`: `"function"`
- `parameters`: Empty object schema
- `handler`: Bound to `clickGoogleLoginButtonHandler`

#### Handler: clickGoogleLoginButtonHandler

`public async clickGoogleLoginButtonHandler(params: {}): Promise<ToolExecutionResult>`

Simulates a UI event for clicking the Google login button.

| Name   | Type | Description                |
|--------|------|----------------------------|
| params | `{}` | No parameters required.    |

**Returns:**  
- On success:
    ```json
    {
      "success": true,
      "data": { "message": "Google login button clicked successfully" },
      "clientEvents": [{ "name": "ui_click", "details": "login-button-google" }],
      "metadata": { "timestamp": "ISODateString" }
    }
    ```

---

### logout

Returns a tool definition for logging out the user, requiring confirmation.

**Returns:**  
A tool definition object with:
- `name`: `"logout"`
- `description`: `"Log out from the system with confirmation if the user asks for it. If this tools is showing it means that the user is already logged in."`
- `type`: `"function"`
- `parameters`: Object schema with:
    - `confirmLogout`: `boolean` (required)
- `handler`: Bound to `logoutHandler`

#### Handler: logoutHandler

`public async logoutHandler(params: YpAssistantLogoutParams): Promise<ToolExecutionResult>`

Handles the logout process, requiring confirmation.

| Name   | Type                    | Description                        |
|--------|-------------------------|------------------------------------|
| params | YpAssistantLogoutParams | `{ confirmLogout: boolean }`       |

**Returns:**  
- On missing confirmation:
    ```json
    {
      "success": false,
      "error": "Please confirm that you want to log out"
    }
    ```
- On success:
    ```json
    {
      "success": true,
      "data": { "message": "UI Event for logout sent successfully" },
      "clientEvents": [{ "name": "ui_click", "details": { "element": "logout" } }],
      "metadata": { "timestamp": "ISODateString" }
    }
    ```
- On error:
    ```json
    {
      "success": false,
      "error": "Failed to logout"
    }
    ```

---

## Types & Interfaces Used

> **Note:** The following types are referenced but not defined in this file. They are expected to be imported or globally available in the codebase.

- `YpAgentAssistant`: The assistant class instance (see [agentAssistant.js](../../agentAssistant.js)).
- `BaseAssistantTools`: Base class for assistant tools (see [baseTools.js](./baseTools.md)).
- `ToolExecutionResult`: The standard result object for tool handlers.
- `ToolClientEventUiClick`: UI click event structure.
- `ToolClientEvent`: General client event structure.
- `YpAgentEmptyProperties`: Empty object type for tool parameters.
- `YpAssistantLogoutProperties`: Properties for logout tool parameters.
- `YpAssistantLogoutParams`: `{ confirmLogout: boolean }`

---

## Example Usage

```typescript
import { LoginAssistantTools } from './commonTools';
import { YpAgentAssistant } from '../../agentAssistant';

const assistant = new YpAgentAssistant(/* ... */);
const loginTools = new LoginAssistantTools(assistant);

// Register tools with your agent or expose them to your UI/LLM
const showLoginTool = loginTools.showLogin("Show the login widget to the user");
const clickMainLoginTool = loginTools.clickMainLoginButton;
const clickGoogleLoginTool = loginTools.clickGoogleLoginButton;
const logoutTool = loginTools.logout;
```

---

## See Also

- [YpAgentAssistant](../../agentAssistant.js)
- [BaseAssistantTools](./baseTools.md)
