# YpAdminConfigDomain

The `YpAdminConfigDomain` class is a custom web component that extends `YpAdminConfigBase`. It is used to manage the configuration of a domain within an admin interface, providing functionalities such as rendering headers, handling form responses, and setting up configuration tabs.

## Properties

| Name                        | Type   | Description                                                                 |
|-----------------------------|--------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId    | number | The ID of the image used as the app home screen icon.                       |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | -                                                                          | void        | Initializes the component and sets the default action URL.                  |
| static get styles             | -                                                                          | CSSResult[] | Returns the styles for the component.                                       |
| renderHeader                  | -                                                                          | TemplateResult | Renders the header section of the component.                                |
| renderHiddenInputs            | -                                                                          | TemplateResult | Renders hidden input fields for configuration data.                         |
| _clear                        | -                                                                          | void        | Clears the component's state, resetting properties to their default values. |
| updated                       | changedProperties: Map<string | number | symbol, unknown>                  | void        | Handles updates to the component's properties.                              |
| _collectionIdChanged          | -                                                                          | void        | Handles changes to the collection ID, updating the action URL accordingly.  |
| _setupTranslations            | -                                                                          | void        | Sets up translation strings based on the current URL and collection ID.     |
| _formResponse                 | event: CustomEvent                                                         | Promise<void> | Handles form responses, performing actions based on the response data.      |
| _finishRedirect               | domain: YpDomainData                                                       | void        | Redirects to the domain page after a successful form submission.            |
| setupConfigTabs               | -                                                                          | Array<YpConfigTabData> | Sets up configuration tabs for the component.                               |
| _appHomeScreenIconImageUploaded | event: CustomEvent                                                       | void        | Handles the event when an app home screen icon image is uploaded.           |

## Examples

```typescript
// Example usage of the YpAdminConfigDomain component
import './yp-admin-config-domain.js';

const adminConfigDomain = document.createElement('yp-admin-config-domain');
document.body.appendChild(adminConfigDomain);
```