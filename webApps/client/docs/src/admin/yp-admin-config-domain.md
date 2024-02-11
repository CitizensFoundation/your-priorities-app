# YpAdminConfigDomain

YpAdminConfigDomain is a custom element that extends YpAdminConfigBase, providing administrative configuration functionalities for a domain within a web application. It allows administrators to manage domain settings such as logo images, default locale, theme, community creation permissions, and API keys for third-party authentication services.

## Properties

| Name                      | Type                | Description                                                                 |
|---------------------------|---------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId  | number \| undefined | The ID of the image used for the app's home screen icon.                    |

## Methods

| Name                             | Parameters                                      | Return Type | Description                                                                                   |
|----------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| renderHeader                     | -                                               | nothing     | Renders the header section of the domain configuration page.                                  |
| renderHiddenInputs               | -                                               | nothing     | Renders hidden input elements for the domain configuration form.                              |
| _clear                           | -                                               | void        | Clears the configuration form and resets properties to their default state.                   |
| updated                          | changedProperties: Map<string \| number \| symbol, unknown> | void        | Updates the element's properties and state when a property changes.                           |
| _setupTranslations               | -                                               | void        | Sets up the translations for the domain configuration page based on the current collection ID.|
| _formResponse                    | event: CustomEvent                              | Promise<void> | Handles the form response event after submitting the domain configuration form.               |
| _finishRedirect                  | domain: YpDomainData                            | void        | Redirects the user after successfully updating the domain configuration.                      |
| setupConfigTabs                  | -                                               | Array<YpConfigTabData> | Sets up the configuration tabs for the domain configuration page.                             |
| _appHomeScreenIconImageUploaded  | event: CustomEvent                              | void        | Handles the event when an app home screen icon image is successfully uploaded.                |

## Events (if any)

- **changed**: Emitted when a configuration change occurs.
- **config-updated**: Emitted when the theme configuration is updated.
- **yp-theme-configuration-changed**: Emitted when the theme configuration changes.
- **success**: Emitted when a file upload is successful.

## Examples

```typescript
// Example usage of YpAdminConfigDomain in an HTML template
<yp-admin-config-domain></yp-admin-config-domain>
```

Please note that this documentation is a high-level overview and does not include all properties, methods, events, or internal logic details. For a complete understanding, refer to the source code of the `YpAdminConfigDomain` class.