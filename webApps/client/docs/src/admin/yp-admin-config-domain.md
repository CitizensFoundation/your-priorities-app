# YpAdminConfigDomain

The `YpAdminConfigDomain` class extends `YpAdminConfigBase` and is responsible for rendering and managing the configuration of a domain within an admin panel. It allows administrators to set various domain-related settings such as default locale, theme, media uploads, and API keys for social authentication.

## Properties

| Name                      | Type                | Description                                                                 |
|---------------------------|---------------------|-----------------------------------------------------------------------------|
| appHomeScreenIconImageId  | number \| undefined | The ID of the image used for the app's home screen icon.                    |

## Methods

| Name                           | Parameters                                  | Return Type | Description                                                                                   |
|--------------------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| renderHeader                   | none                                        | TemplateResult \| typeof nothing | Renders the header section of the domain configuration page.                                  |
| renderHiddenInputs             | none                                        | TemplateResult \| typeof nothing | Renders hidden input elements for the domain configuration form.                              |
| _clear                         | none                                        | void        | Clears the configuration settings.                                                            |
| updated                        | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when properties of the component change.                           |
| _setupTranslations             | none                                        | void        | Sets up the translations for the admin configuration page based on the domain's status.       |
| _formResponse                  | event: CustomEvent                          | Promise<void> | Handles the form response after submitting the domain configuration.                          |
| _finishRedirect                | domain: YpDomainData                        | void        | Redirects to the domain page after completing the configuration update.                       |
| setupConfigTabs                | none                                        | Array<YpConfigTabData> | Sets up the configuration tabs for the domain configuration page.                             |
| _appHomeScreenIconImageUploaded| event: CustomEvent                          | void        | Handles the event when an app home screen icon image is successfully uploaded.                 |

## Events (if any)

- **changed**: Emitted when a configuration setting is changed.
- **success**: Emitted when an image upload is successful.

## Examples

```typescript
// Example usage of YpAdminConfigDomain to set an app home screen icon image ID
const ypAdminConfigDomain = new YpAdminConfigDomain();
ypAdminConfigDomain.appHomeScreenIconImageId = 12345;
```

```typescript
// Example usage of YpAdminConfigDomain to handle a successful image upload
document.addEventListener('success', (event) => {
  ypAdminConfigDomain._appHomeScreenIconImageUploaded(event);
});
```

Please note that the above examples are for illustrative purposes and may require additional context to work within a full application.